import { CubeScene, faceColors } from "./scene.mjs";
import {solveRecord} from "../export.mjs";
import {refineSolution} from "../solve-state.mjs";
import {ModelClient} from "./model-client.mjs";

const $=id=>document.getElementById(id),faces="URFDLB",moveNames=[...faces].flatMap(f=>[f,`${f}2`,`${f}'`]),solved=[...faces].map(f=>f.repeat(9)).join("");
const worker=new Worker(new URL("./worker.js",import.meta.url),{type:"module"});
const modelClient=new ModelClient(worker,{onFailure:e=>{playing=false;pendingSeek=null;message(e.message,true);sync();}});
const model=(type,data)=>modelClient.request(type,data);
let facelets=solved,revision=0,solution=null,step=0,playing=false,busy=false,searching=false,searchController=null,mode="fast",token=null,ready=false,draft=solved,paint="U",queue=Promise.resolve(),lastRun=null,pendingSeek=null,exportText="";
const budgets=[250,1000,2000,5000,15000];
let scene;
try{scene=new CubeScene($("canvas-host"),move=>manual(move));scene.set(facelets);}catch{$("fallback").hidden=false;}
function message(text,error=false){$("search-status").textContent=text;$("search-status").style.color=error?"var(--danger)":"";}
function error(text){$("input-error").textContent=text;$("input-error").hidden=!text;}
function duration(){return $("reduced-motion").checked?0:Number($("speed").value);}
function sync(){
  const modelUnavailable=modelClient.state!=="active";
  $("cube-state").textContent=facelets===solved?"Solved position":"Scrambled position";
  $("solve-button").disabled=!ready||searching||busy;
  $("solve-button").hidden=searching;$("cancel-button").hidden=!searching;
  const has=Boolean(solution);
  for(const id of ["first-button","back-button","play-button","next-button","copy-button","export-button","timeline"])$(id).disabled=!has||busy||searching;
  $("play-button").disabled=modelUnavailable||!has||searching||(busy&&!playing);
  $("timeline").disabled=modelUnavailable||!has||searching;
  $("first-button").disabled=modelUnavailable||!has||busy||searching||step===0;$("back-button").disabled=modelUnavailable||!has||busy||searching||step===0;$("next-button").disabled=modelUnavailable||!has||busy||searching||step>=solution.moves.length;
  $("timeline").max=has?solution.moves.length:0;$("timeline").value=step;
  $("step-count").textContent=`${step} / ${has?solution.moves.length:0}`;
  $("play-button").textContent=playing?"Ⅱ":"▶";$("play-button").setAttribute("aria-label",playing?"Pause solution":"Play solution");
  $("turn-buttons").querySelectorAll("button").forEach(b=>b.disabled=busy||modelUnavailable);
  for(const id of ["reset-button","apply-button","scramble-button","edit-button"])$(id).disabled=busy;
  for(const id of ["apply-button","scramble-button","edit-button","save-edit"])$(id).disabled=busy||modelUnavailable;
  $("moves").querySelectorAll("button").forEach((b,i)=>{b.disabled=modelUnavailable||busy||searching;b.classList.toggle("past",i<step);b.classList.toggle("current",i===step);b.setAttribute("aria-current",i===step?"step":"false");});
}
function save(){try{localStorage.setItem("rubend-cube",facelets);}catch{}}
function stop(keep=true){playing=false;if(searchController){searchController.abort();searchController=null;}searching=false;$("search-progress").style.width="0%";if(keep&&solution)message("Search stopped. Keeping your verified solution.");sync();}
function clearSolution(){solution=null;pendingSeek=null;lastRun=null;step=0;$("node-count").textContent="No positions searched yet.";$("moves").replaceChildren(Object.assign(document.createElement("p"),{className:"empty-moves",textContent:"A scrambled cube, a little thinking, and a clear sequence of turns."}));$("solution-heading").textContent="Your solution will appear here.";$("solution-badge").hidden=true;for(const id of ["best-length","lower-bound","search-time"])$(id).textContent="—";}
async function setCube(text){stop(false);revision++;facelets=text;scene?.set(facelets);clearSolution();save();error("");message("Ready when you are.");sync();}
function manual(move){if(busy)return Promise.resolve();queue=queue.then(async()=>{if($("edit-dialog").open||busy)return;stop(false);revision++;clearSolution();busy=true;sync();try{const result=await model("apply",{facelets,moves:[move]});await scene?.turn(move,result.facelets,duration());facelets=result.facelets;save();error("");message("One turn closer. Or a little further.");}catch(e){error(e.message);}finally{busy=false;sync();}});return queue;}
for(let f=0;f<6;f++){const b=document.createElement("button");b.type="button";b.setAttribute("aria-label",`Turn ${faces[f]} face`);const i=document.createElement("i");i.style.background=faceColors[f];b.append(i,faces[f]);b.onclick=e=>manual(f*3+(e.altKey?1:e.shiftKey?2:0));$("turn-buttons").append(b);}
async function input(){if(busy)return;try{const result=await model("input",{text:$("cube-input").value});await setCube(result.facelets);message(result.moves.length?`Applied ${result.moves.length} moves from solved.`:"Cube checked and ready.");}catch(e){error(e.message);}}
$("apply-button").onclick=input;
$("cube-input").addEventListener("keydown",e=>{if((e.ctrlKey||e.metaKey)&&e.key==="Enter")input();});
$("scramble-button").onclick=async()=>{try{const r=await model("scramble");await setCube(r.facelets);$("cube-input").value=r.moves.map(m=>moveNames[m]).join(" ");message("A fresh 25-move scramble. Make yourself at home.");}catch(e){error(e.message);}};
$("reset-button").onclick=()=>{setCube(solved);$("cube-input").value="";};
$("camera-button").onclick=()=>scene?.home();
function chooseMode(value){mode=value;for(const [id,m]of[["fast-mode","fast"],["exact-mode","exact"]]){$(id).classList.toggle("selected",m===mode);$(id).setAttribute("aria-pressed",String(m===mode));}$("mode-description").textContent=mode==="fast"?"A quick answer, then fewer moves as time allows.":"Try to prove the shortest length. Hard cubes can take longer.";}
$("fast-mode").onclick=()=>chooseMode("fast");$("exact-mode").onclick=()=>chooseMode("exact");
$("budget").oninput=()=>{$("budget-value").textContent=`${budgets[Number($("budget").value)]/1000} seconds`;};
function showSolution(event,origin){
  solution={moves:event.moves,origin,optimal:Boolean(event.optimal),lower:event.lower,elapsedMs:event.elapsedMs};step=0;facelets=origin;scene?.set(facelets);
  $("moves").replaceChildren();for(let i=0;i<event.moves.length;i++){const b=document.createElement("button");b.className="move-chip";b.textContent=moveNames[event.moves[i]];b.setAttribute("aria-label",`Move ${i+1}: ${b.textContent}`);b.onclick=()=>jump(i+1);$("moves").append(b);}
  if(event.moves.length===0)$("moves").append(Object.assign(document.createElement("p"),{className:"empty-moves",textContent:"Already home. No turns needed."}));
  $("solution-heading").textContent=event.optimal?`${event.length} moves. Shortest by search.`:`${event.length} moves. Every turn checked.`;
  $("solution-badge").textContent=event.optimal?"Shortest · replay certified":"Replay certified";$("solution-badge").hidden=false;
  $("best-length").replaceChildren(document.createTextNode(String(event.length)),Object.assign(document.createElement("small"),{textContent:"HTM"}));sync();
}
async function solve(){
  if(searching||busy||!ready)return;error("");playing=false;const origin=facelets,rev=revision,controller=new AbortController();searchController=controller;searching=true;clearSolution();sync();message("Looking for the way back…");const budgetMs=budgets[Number($("budget").value)],started=performance.now();lastRun={origin,mode,budgetMs,events:[]};
  try{
    const response=await fetch("/api/solve",{method:"POST",headers:{"Content-Type":"application/json","X-Rubend-Token":token},body:JSON.stringify({facelets:origin,mode,budgetMs,id:rev}),signal:controller.signal});
    if(!response.ok){const data=await response.json();throw Error(data.error);}
    const reader=response.body.getReader(),decoder=new TextDecoder();let buffer="";
    for(;;){const {done,value}=await reader.read();if(done)break;buffer+=decoder.decode(value,{stream:true});let cut;while((cut=buffer.indexOf("\n\n"))>=0){const packet=buffer.slice(0,cut);buffer=buffer.slice(cut+2);if(!packet.startsWith("data: "))continue;const event=JSON.parse(packet.slice(6));if(revision!==rev||searchController!==controller)continue;lastRun.events.push(event);
      if(event.type==="error"||event.type==="invalid")throw Error(event.message??"The engine rejected this position.");
      if(event.type==="candidate")showSolution(event,origin);
      solution=refineSolution(solution,event);
      if(event.lower!==undefined)$("lower-bound").textContent=String(event.lower);
      if(event.nodes!==undefined)$("node-count").textContent=`${event.nodes.toLocaleString()} search steps. One native CPU worker.`;
      const elapsed=performance.now()-started;$("search-time").textContent=`${(elapsed/1000).toFixed(2)}s`;$("search-progress").style.width=`${Math.min(99,elapsed/budgetMs*100)}%`;
      if(event.type==="candidate")message(event.optimal?"Shortest length established by complete search.":"Verified answer found. Looking for fewer turns…");
      if(event.type==="done"){if(solution){message(event.optimal?"Shortest length established by complete search.":"Time well spent. Your best verified answer is ready.");}else message("No answer within this budget. Try more thinking time.");}
    }}
  }catch(e){if(e.name!=="AbortError")message(e.message,true);}finally{if(searchController===controller){searchController=null;searching=false;$("search-progress").style.width=solution?"100%":"0%";sync();}}
}
$("solve-button").onclick=solve;$("cancel-button").onclick=()=>stop();
async function jump(target,animate=false){
  if(!solution||modelClient.state!=="active"){playing=false;sync();return;}if(!animate)playing=false;if(busy){if(!animate)pendingSeek={target,solution};return;}playing=playing&&animate;const s=solution,n=Math.max(0,Math.min(s.moves.length,target));busy=true;sync();
  try{const r=await model("apply",{facelets:s.origin,moves:s.moves.slice(0,n)});if(solution!==s)return;if(animate&&n===step+1)await scene?.turn(s.moves[step],r.facelets,duration());else scene?.set(r.facelets);facelets=r.facelets;step=n;save();}catch(e){playing=false;pendingSeek=null;message(e.message,true);}finally{busy=false;sync();const seek=pendingSeek;pendingSeek=null;if(seek&&seek.solution===solution)await jump(seek.target);}
}
async function play(){if(playing){playing=false;sync();return;}if(!solution||busy||searching||modelClient.state!=="active")return;playing=true;if(step>=solution.moves.length)await jump(0,true);sync();while(playing&&solution&&step<solution.moves.length){await jump(step+1,true);}playing=false;sync();}
$("first-button").onclick=()=>jump(0);$("back-button").onclick=()=>jump(step-1);$("next-button").onclick=()=>jump(step+1,true);$("play-button").onclick=play;$("timeline").oninput=()=>jump(Number($("timeline").value));
$("copy-button").onclick=async()=>{if(!solution)return;try{await navigator.clipboard.writeText(solution.moves.map(m=>moveNames[m]).join(" "));message("Moves copied.");}catch{message("Clipboard unavailable. Use Export to save the moves.");}};
$("export-button").onclick=()=>{if(!solution)return;try{exportText=JSON.stringify(solveRecord(solution,lastRun??{}),null,2);$("export-record").value=exportText;$("export-dialog").showModal();}catch(e){message(e.message,true);}};
$("download-record").onclick=()=>{const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([exportText],{type:"application/json"}));a.download="rubend-solve.json";a.hidden=true;document.body.append(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove();},1000);};
$("select-record").onclick=()=>{$("export-record").focus();$("export-record").select();};
$("close-export").onclick=()=>$("export-dialog").close();
function paintNet(){for(let f=0;f<6;f++)for(let s=0;s<9;s++){const b=$(`sticker-${f*9+s}`);b.style.background=faceColors[faces.indexOf(draft[f*9+s])];b.textContent=s===4?faces[f]:"";b.setAttribute("aria-label",`${faces[f]} sticker ${s+1}: ${draft[f*9+s]}${s===4?", fixed center":""}`);}$("palette").querySelectorAll("button").forEach((b,i)=>{b.classList.toggle("selected",faces[i]===paint);b.setAttribute("aria-pressed",String(faces[i]===paint));});}
for(let f=0;f<6;f++){const p=document.createElement("button");p.style.background=faceColors[f];p.textContent=faces[f];p.setAttribute("aria-label",`Paint ${faces[f]} color`);p.onclick=()=>{paint=faces[f];paintNet();};$("palette").append(p);const group=document.createElement("div");group.className="net-face";group.dataset.face=faces[f];const label=document.createElement("span");label.textContent=faces[f];group.append(label);for(let s=0;s<9;s++){const i=f*9+s,b=document.createElement("button");b.id=`sticker-${i}`;b.disabled=s===4;b.onclick=()=>{draft=draft.slice(0,i)+paint+draft.slice(i+1);paintNet();};group.append(b);}$("cube-net").append(group);}
function openEditor(){stop(false);draft=facelets;$("edit-error").hidden=true;paintNet();$("edit-dialog").showModal();}
$("edit-button").onclick=openEditor;$("fallback-edit").onclick=openEditor;$("close-edit").onclick=()=>$("edit-dialog").close();$("cancel-edit").onclick=()=>$("edit-dialog").close();$("save-edit").onclick=async()=>{try{const r=await model("validate",{facelets:draft});await setCube(r.facelets);$("edit-dialog").close();message("Cube checked. Ready to solve.");}catch(e){$("edit-error").textContent=e.message;$("edit-error").hidden=false;}};
$("guide-button").onclick=()=>$("guide-dialog").showModal();$("close-guide").onclick=()=>$("guide-dialog").close();$("reduced-motion").checked=matchMedia("(prefers-reduced-motion: reduce)").matches;
function theme(value){document.documentElement.dataset.theme=value;$("theme-button").setAttribute("aria-label",`Switch to ${value==="dark"?"light":"dark"} appearance`);try{localStorage.setItem("rubend-theme",value);}catch{}}
try{theme(localStorage.getItem("rubend-theme")??"dark");}catch{theme("dark");}$("theme-button").onclick=()=>theme(document.documentElement.dataset.theme==="dark"?"light":"dark");
document.addEventListener("keydown",e=>{if(/INPUT|TEXTAREA|SELECT/.test(e.target.tagName)||e.ctrlKey||e.metaKey||$("edit-dialog").open||$("guide-dialog").open||$("export-dialog").open)return;const f=faces.indexOf(e.key.toUpperCase());if(f>=0){e.preventDefault();manual(f*3+(e.altKey?1:e.shiftKey?2:0));}else if(e.code==="Space"){e.preventDefault();play();}else if(e.key==="ArrowRight"){e.preventDefault();jump(step+1,true);}else if(e.key==="ArrowLeft"){e.preventDefault();jump(step-1);}});
try{const saved=localStorage.getItem("rubend-cube");if(saved){const r=await model("validate",{facelets:saved});facelets=r.facelets;scene?.set(facelets);}}catch{}
let sessionTimer,sessionClosed=false;
async function session(){
  try{
    const response=await fetch("/api/session");if(!response.ok)throw Error("Local engine unavailable");const data=await response.json();
    if(sessionClosed)return;token=data.token;ready=data.ready===true;$("engine-state").classList.toggle("ready",ready);
    $("engine-state").replaceChildren(document.createElement("i"),document.createTextNode(ready?"Bend 2 · Local":data.error?"Engine offline":"Engine warming up"));
    if(data.error)message(data.error,true);
  }catch(e){if(!sessionClosed){ready=false;$("engine-state").classList.remove("ready");$("engine-state").textContent="Engine offline";message(e.message,true);}}
  finally{if(!sessionClosed){sync();sessionTimer=setTimeout(session,ready?1000:250);}}
}
await session();
window.rubendDiagnostics=()=>({facelets,revision,solution:solution?{...solution}:null,step,searching,playing,renderer:scene?.stats()??null,model:"Bend 2",modelState:modelClient.state,pendingModelRequests:modelClient.pending.size,lastRun});
window.addEventListener("pagehide",()=>{sessionClosed=true;clearTimeout(sessionTimer);modelClient.close();searchController?.abort();},{once:true});
window.addEventListener("pageshow",event=>{if(event.persisted)location.reload();});
setInterval(()=>{const stats=scene?.stats();if(stats?.averageFrameMs){$("render-stat").textContent=`Rendering: ${(1000/stats.averageFrameMs).toFixed(0)} fps · p95 ${stats.p95FrameMs.toFixed(1)} ms · ${stats.frames} recent frames.`;}else $("render-stat").textContent="2D controls remain available without a 3D renderer.";},1000);
sync();
