import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import vm from "node:vm";
import {build} from "esbuild";

const source=readFileSync("apps/web/main.mjs","utf8");
const bundled=await build({stdin:{contents:source,resolveDir:process.cwd()+"/apps/web",sourcefile:"main.mjs"},bundle:true,write:false,format:"esm",define:{"import.meta.url":JSON.stringify("file:///apps/web/main.mjs")},plugins:[{name:"scene-fixture",setup(api){api.onResolve({filter:/^\.\/scene\.mjs$/},()=>({path:"scene",namespace:"fixture"}));api.onLoad({filter:/.*/,namespace:"fixture"},()=>({contents:'export const faceColors=[];export class CubeScene{set(){} async turn(){} stats(){return null}}'}));}}]});
const program=new vm.Script(`(async()=>{${bundled.outputFiles[0].text}\n})()`);
const solved="UUUUUUUUURRRRRRRRRFFFFFFFFFDDDDDDDDDLLLLLLLLLBBBBBBBBB";
let checks=0;
for(const scenario of["healthy","healthy-replay","failed-before-space","failed-at-end","failed-during-rewind","request-error","busy-space"]){
  const elements=new Map(),keys=new Map(),workers=[];
  function element(){return {style:{},dataset:{},children:[],value:"0",checked:true,open:false,tagName:"BUTTON",classList:{add(){},remove(){},toggle(){}},setAttribute(){},addEventListener(){},append(...items){this.children.push(...items);},replaceChildren(...items){this.children=items;},querySelectorAll(){return this.children.filter(x=>x.tagName==="BUTTON");},showModal(){this.open=true;},close(){this.open=false;}};}
  const get=id=>{if(!elements.has(id))elements.set(id,element());return elements.get(id);};
  let rejectNext=false,failNext=false,holdNext=false,release;
  class Worker extends EventTarget {
    constructor(){super();workers.push(this);}
    terminate(){}
    fail(){const event=new Event("error",{cancelable:true});event.message="fixture crash";this.dispatchEvent(event);}
    postMessage(data){
      if(failNext){failNext=false;queueMicrotask(()=>this.fail());return;}
      const respond=()=>{const event=new Event("message");event.data=rejectNext?{id:data.id,error:"fixture apply rejected"}:{id:data.id,facelets:solved,moves:data.moves??[],solved:true};rejectNext=false;this.dispatchEvent(event);};
      if(holdNext){holdNext=false;release=respond;}else queueMicrotask(respond);
    }
  }
  const context=vm.createContext({URL,Worker,Event,EventTarget,Map,Promise,AbortController,TextDecoder,performance,queueMicrotask,console,document:{getElementById:get,createElement:element,createTextNode:text=>({text}),documentElement:element(),addEventListener:(name,fn)=>keys.set(name,fn)},window:{addEventListener(){}},localStorage:{getItem(){return null;},setItem(){}},matchMedia:()=>({matches:true}),setTimeout:()=>1,clearTimeout(){},setInterval(){},navigator:{},fetch:async()=>({ok:true,json:async()=>({token:"fixture",ready:true}),body:{getReader(){let sent=false;return {async read(){if(sent)return {done:true};sent=true;return {done:false,value:new TextEncoder().encode('data: '+JSON.stringify({type:"candidate",moves:[0,2],length:2,lower:0,optimal:0})+'\n\n')};}};}}})});
  await program.runInContext(context,{timeout:1000});
  await get("solve-button").onclick();
  const diagnostics=()=>context.window.rubendDiagnostics();
  assert.equal(diagnostics().solution.moves.length,2);
  if(["healthy-replay","failed-at-end","failed-during-rewind"].includes(scenario)){
    await get("next-button").onclick();await get("next-button").onclick();
  }
  if(scenario.startsWith("failed-")&&scenario!=="failed-during-rewind")workers[0].fail();
  if(scenario==="failed-during-rewind")failNext=true;
  if(scenario==="request-error")rejectNext=true;
  if(scenario==="busy-space"){holdNext=true;get("next-button").onclick();}
  context.keyboard=keys.get("keydown");
  context.key={key:" ",code:"Space",target:{tagName:"BODY"},preventDefault(){}};
  vm.runInContext("keyboard(key)",context,{timeout:1000,microtaskMode:"afterEvaluate"});
  for(let i=0;i<30;i++)await Promise.resolve();
  if(release){release();for(let i=0;i<30;i++)await Promise.resolve();}
  assert.equal(diagnostics().playing,false,scenario+" must settle playback");
  assert.equal(diagnostics().pendingModelRequests,0);
  assert.equal(diagnostics().solution.moves.length,2,"Retain the verified solution");
  if(scenario.startsWith("healthy"))assert.equal(diagnostics().step,2);
  if(scenario.startsWith("failed-")){assert.equal(diagnostics().modelState,"failed");assert.equal(get("play-button").disabled,true);assert.equal(get("export-button").disabled,false);}
  console.log(JSON.stringify({passed:true,scenario,step:diagnostics().step,playing:diagnostics().playing}));checks++;
}
console.log(JSON.stringify({passed:true,checks,actualMainModule:true,domAndSceneFixtures:true}));
