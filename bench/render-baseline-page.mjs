import * as THREE from "three";
import {CubeScene,faceColors} from "../apps/web/scene.mjs";
import {apply,solved,faces} from "../apps/model.mjs";
import spec from "./render-baseline-spec.json";

const button=document.getElementById("run"),status=document.getElementById("status"),output=document.getElementById("result"),host=document.getElementById("scene"),errors=[];
window.addEventListener("error",e=>errors.push(String(e.error?.stack??e.message)));window.addEventListener("unhandledrejection",e=>errors.push(String(e.reason)));
const wait=ms=>new Promise(done=>setTimeout(done,ms));
let scene,current=null,facelets=solved,finished=false;
function snapshot(){const objects=[];scene.cube.traverse(o=>objects.push(o));return{meshes:objects.filter(o=>o.isMesh),groups:objects.filter(o=>o.isGroup&&o!==scene.cube)};}
function colors(){return scene.stickers.length===54&&scene.stickers.every((sticker,i)=>"#"+sticker.material.color.getHexString()===faceColors[faces.indexOf(facelets[i])]);}
function state(){const s=snapshot();return{meshes:s.meshes.length,groups:s.groups.length,canonicalColors:colors()};}
async function phase(name,work){
  const started=performance.now(),row={name,visibilityStart:document.visibilityState,visibilityEnd:null,visibilityTransitions:[],submissions:0,hiddenSubmissions:0,intervalsMs:[],renderCallMs:[],elapsedMs:0};current={row,last:null};
  await work();row.elapsedMs=performance.now()-started;row.visibilityEnd=document.visibilityState;current=null;return row;
}
document.addEventListener("visibilitychange",()=>{if(current)current.row.visibilityTransitions.push(document.visibilityState);});
function dispose(){
  if(!scene)return;scene.renderer.setAnimationLoop(null);scene.controls.dispose();scene.resize.disconnect();
  const geometries=new Set(),materials=new Set();scene.scene.traverse(o=>{if(o.geometry)geometries.add(o.geometry);if(o.material)for(const m of(Array.isArray(o.material)?o.material:[o.material]))materials.add(m);});
  for(const g of geometries)g.dispose();for(const m of materials)m.dispose();scene.renderer.dispose();
}
async function run(){
  button.disabled=true;status.textContent="Running fixed baseline";
  const result={format:"rubend-render-baseline-v1",spec,previewHidden:true,productChanged:false,browserResourceLimitsEnforced:false,errors,cohorts:[],initial:null,cleanedUp:false,documentVisibilityAtStart:document.visibilityState};
  try{
    if(document.hidden){result.skippedHiddenDocument=true;return;}
    scene=new CubeScene(host,()=>{});scene.set(facelets);result.initial=state();
    const render=scene.renderer.render.bind(scene.renderer);
    scene.renderer.render=(...args)=>{const started=performance.now();render(...args);const ended=performance.now();if(current){const {row,last}=current;row.submissions++;row.hiddenSubmissions+=Number(document.hidden);if(last!==null)row.intervalsMs.push(started-last);row.renderCallMs.push(ended-started);current.last=started;}};
    for(let cohort=0;cohort<spec.cohorts;cohort++){
      status.textContent="Baseline cohort "+(cohort+1)+" / "+spec.cohorts;scene.home();await wait(spec.settleMs);
      const row={cohort,phases:[],turns:[],sets:[]};result.cohorts.push(row);
      row.phases.push(await phase("idle",()=>wait(spec.idleMs)));
      row.phases.push(await phase("orbit",()=>new Promise(done=>{const started=performance.now(),axis=new THREE.Vector3(0,1,0);let last=started;function tick(now){scene.camera.position.applyAxisAngle(axis,(now-last)*.0002);scene.controls.update();last=now;if(now-started<spec.orbitMs)requestAnimationFrame(tick);else done();}requestAnimationFrame(tick);})));
      row.phases.push(await phase("playback",async()=>{for(const move of spec.turns){facelets=apply(facelets,[move]);await scene.turn(move,facelets,spec.turnMs);row.turns.push({move,canonicalColors:colors(),animating:scene.animating});}}));
      row.phases.push(await phase("resize",async()=>{host.style.width="640px";await wait(200);host.style.width=spec.hostWidth+"px";await wait(200);}));
      row.phases.push(await phase("set",async()=>{for(let i=0;i<spec.setUpdates;i++){const before=snapshot(),ids=new Set(before.meshes.map(m=>m.uuid)),groups=new Set(before.groups.map(g=>g.uuid));facelets=apply(facelets,[i%18]);const started=performance.now();scene.set(facelets);const elapsedMs=performance.now()-started,after=snapshot();row.sets.push({...state(),elapsedMs,newMeshes:after.meshes.filter(m=>!ids.has(m.uuid)).length,newGroups:after.groups.filter(g=>!groups.has(g.uuid)).length});await wait(20);}}));
    }
  }catch(error){errors.push(String(error.stack??error));}
  finally{dispose();result.cleanedUp=true;finished=true;output.textContent=JSON.stringify(result);status.textContent=errors.length?"Baseline failed":"Baseline collected";
    try{const response=await fetch("/result",{method:"POST",headers:{"Content-Type":"application/json","X-Rubend-Run":document.querySelector('meta[name="rubend-run"]').content},body:JSON.stringify(result)});if(!response.ok)throw Error("Evidence save failed "+response.status);status.textContent+=" and saved";}catch(error){errors.push(String(error));output.textContent=JSON.stringify(result);status.textContent="Evidence save failed";}
  }
}
button.addEventListener("click",()=>{if(!finished&&!button.disabled)run();});
