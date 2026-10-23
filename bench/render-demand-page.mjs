import * as THREE from "three";
import {CubeScene as ControlScene} from "rubend:control-scene";
import {CubeScene,faceColors} from "../apps/web/scene.mjs";
import {apply,solved,faces} from "../apps/model.mjs";
import spec from "./render-demand-spec.json";

const button=document.getElementById("run"),status=document.getElementById("status"),output=document.getElementById("result"),host=document.getElementById("scene"),errors=[],wait=ms=>new Promise(done=>setTimeout(done,ms));
let scene,current=null,facelets=solved,submissions=0,finished=false,sampleLabel="";const paints=new Set();
window.addEventListener("error",e=>errors.push(String(e.error?.stack??e.message)));window.addEventListener("unhandledrejection",e=>errors.push(String(e.reason)));
function snapshot(){const objects=[];scene.cube.traverse(o=>objects.push(o));return{meshes:objects.filter(o=>o.isMesh),groups:objects.filter(o=>o.isGroup&&o!==scene.cube)};}
function colors(){return scene.stickers.length===54&&scene.stickers.every((sticker,i)=>"#"+sticker.material.color.getHexString()===faceColors[faces.indexOf(facelets[i])]);}
function state(){const s=snapshot();return{meshes:s.meshes.length,groups:s.groups.length,canonicalColors:colors()};}
async function phase(name,work){status.textContent=sampleLabel+" · "+name;const started=performance.now(),row={name,wallStartedAt:Date.now(),visibilityStart:document.visibilityState,visibilityEnd:null,visibilityTransitions:[],submissions:0,hiddenSubmissions:0,intervalsMs:[],renderCallMs:[],elapsedMs:0};current={row,last:null};await work();row.elapsedMs=performance.now()-started;row.wallEndedAt=Date.now();row.visibilityEnd=document.visibilityState;current=null;return row;}
document.addEventListener("visibilitychange",()=>{if(current)current.row.visibilityTransitions.push(document.visibilityState);});
async function paint(change,accept=()=>true){
  const started=performance.now();let listener,timer;
  const ready=new Promise((yes,no)=>{listener=()=>{if(accept()){clearTimeout(timer);paints.delete(listener);yes({ms:performance.now()-started,canonicalColors:colors()});}};paints.add(listener);timer=setTimeout(()=>{paints.delete(listener);no(Error("Mutation was not rendered within one second"));},1000);});
  try{await change();return await ready;}catch(error){clearTimeout(timer);paints.delete(listener);throw error;}
}
function event(name,action){return new Promise((yes,no)=>{const canvas=scene.renderer.domElement,timer=setTimeout(()=>{canvas.removeEventListener(name,done);no(Error("Missing "+name));},3000),done=()=>{clearTimeout(timer);yes();};canvas.addEventListener(name,done,{once:true});action();});}
function dispose(){
  if(!scene)return;if(scene.dispose){scene.dispose();return;}
  scene.renderer.setAnimationLoop(null);scene.controls.dispose();scene.resize.disconnect();const geometries=new Set(),materials=new Set();scene.scene.traverse(o=>{if(o.geometry)geometries.add(o.geometry);if(o.material)for(const m of(Array.isArray(o.material)?o.material:[o.material]))materials.add(m);});for(const g of geometries)g.dispose();for(const m of materials)m.dispose();scene.renderer.dispose();
}
async function sample(arm,cohort){
  host.replaceChildren();host.style.width=spec.hostWidth+"px";facelets=solved;submissions=0;scene=new(arm==="demand"?CubeScene:ControlScene)(host,()=>{});scene.set(facelets);
  const row={arm,cohort,initial:state(),phases:[],turns:[],sets:[],paints:[]},render=scene.renderer.render.bind(scene.renderer);
  scene.renderer.render=(...args)=>{const started=performance.now();render(...args);const ended=performance.now();submissions++;if(current){const{row,last}=current;row.submissions++;row.hiddenSubmissions+=Number(document.hidden);if(last!==null)row.intervalsMs.push(started-last);row.renderCallMs.push(ended-started);current.last=started;}for(const listener of paints)listener();};
  scene.home();await wait(spec.settleMs);
  row.phases.push(await phase("idle",()=>wait(spec.idleMs)));
  row.phases.push(await phase("orbit",()=>new Promise(done=>{const started=performance.now(),axis=new THREE.Vector3(0,1,0);let last=started;function tick(now){scene.camera.position.applyAxisAngle(axis,(now-last)*.0002);scene.controls.update();last=now;if(now-started<spec.orbitMs)requestAnimationFrame(tick);else done();}requestAnimationFrame(tick);})));
  row.phases.push(await phase("playback",async()=>{for(const move of spec.turns){facelets=apply(facelets,[move]);await scene.turn(move,facelets,spec.turnMs);row.turns.push({move,canonicalColors:colors(),animating:scene.animating});}}));
  row.phases.push(await phase("resize",async()=>{for(const width of[640,spec.hostWidth]){row.paints.push(await paint(()=>{host.style.width=width+"px";},()=>scene.renderer.getSize(new THREE.Vector2()).x===width));await wait(100);}}));
  row.phases.push(await phase("set",async()=>{for(let i=0;i<spec.setUpdates;i++){const before=snapshot(),ids=new Set(before.meshes.map(m=>m.uuid)),groups=new Set(before.groups.map(g=>g.uuid));facelets=apply(facelets,[i%18]);let elapsedMs;row.paints.push(await paint(()=>{const started=performance.now();scene.set(facelets);elapsedMs=performance.now()-started;}));const after=snapshot();row.sets.push({...state(),elapsedMs,newMeshes:after.meshes.filter(m=>!ids.has(m.uuid)).length,newGroups:after.groups.filter(g=>!groups.has(g.uuid)).length});await wait(20);}}));
  row.paints.push(await paint(()=>scene.home()));
  facelets=apply(facelets,[12]);row.paints.push(await paint(()=>scene.turn(12,facelets,0)));row.reducedMotion={canonicalColors:colors(),animating:scene.animating};
  const extension=scene.renderer.getContext().getExtension("WEBGL_lose_context");if(!extension)throw Error("WebGL context-loss control unavailable");
  await event("webglcontextlost",()=>extension.loseContext());const lostObserved=scene.lost===true,atLoss=submissions;facelets=apply(facelets,[15]);scene.set(facelets);await wait(100);const lostSubmissions=submissions-atLoss;
  const restoredPaint=paint(()=>event("webglcontextrestored",()=>extension.restoreContext()));row.paints.push({...await restoredPaint,kind:"restore"});row.recovery={lostObserved,lostSubmissions,restoredObserved:scene.lost===false,canonicalColors:colors()};
  dispose();const atDispose=submissions;await wait(100);row.afterDisposeSubmissions=submissions-atDispose;scene=null;return row;
}
async function run(){
  button.disabled=true;const result={format:"rubend-render-demand-comparison-v1",spec,previewHidden:true,productChanged:true,browserResourceLimitsEnforced:false,errors,samples:[],cleanedUp:false,documentVisibilityAtStart:document.visibilityState};
  try{if(document.hidden){result.skippedHiddenDocument=true;return;}for(let cohort=0;cohort<spec.cohorts;cohort++)for(const arm of(cohort%2?["demand","aa","control"]:spec.arms)){sampleLabel="Cohort "+(cohort+1)+" / "+spec.cohorts+" · "+arm;const item=await sample(arm,cohort);result.samples.push(item);document.getElementById("progress").textContent=result.samples.length+" / 15 complete";const response=await fetch("/progress",{method:"POST",headers:{"Content-Type":"application/json","X-Rubend-Run":document.querySelector('meta[name="rubend-run"]').content},body:JSON.stringify({format:"rubend-render-progress-v1",index:result.samples.length,wallAt:Date.now(),sample:item})});if(!response.ok)throw Error("Progress save failed "+response.status);}}
  catch(error){errors.push(String(error.stack??error));}
  finally{dispose();result.cleanedUp=true;finished=true;output.textContent=JSON.stringify(result);status.textContent=errors.length?"Comparison failed":"Comparison collected";try{const response=await fetch("/result",{method:"POST",headers:{"Content-Type":"application/json","X-Rubend-Run":document.querySelector('meta[name="rubend-run"]').content},body:JSON.stringify(result)});if(!response.ok)throw Error("Evidence save failed "+response.status);status.textContent+=" and saved";}catch(error){errors.push(String(error));output.textContent=JSON.stringify(result);status.textContent="Evidence save failed";}}
}
button.addEventListener("click",()=>{if(!finished&&!button.disabled)run();});
