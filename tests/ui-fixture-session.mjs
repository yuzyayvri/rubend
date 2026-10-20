import assert from "node:assert/strict";
import {spawn} from "node:child_process";
import {readFileSync,existsSync} from "node:fs";
import {randomBytes} from "node:crypto";
import {resolve} from "node:path";
import {nativeIdentity} from "../bench/startup-measure.mjs";

for(const mode of["delayed","model-failure","bad-protocol"]){
  const id="u01-live-fixture-"+randomBytes(8).toString("hex"),directory=resolve("build/evidence/next-plan/U01",id),child=spawn(process.execPath,["tests/ui-fixture-server.mjs",mode,id],{stdio:["ignore","pipe","pipe"]});
  let stderr="";child.stderr.on("data",d=>stderr+=d);const stopped=new Promise(done=>child.once("close",(code,signal)=>done({code,signal})));
  try{
    const origin=await new Promise((done,reject)=>{const timer=setTimeout(()=>reject(Error("Fixture startup timed out: "+stderr)),5000);let stdout="";child.stdout.on("data",d=>{stdout+=d;const match=stdout.match(/http:\/\/127\.0\.0\.1:\d+/);if(match){clearTimeout(timer);done(match[0]);}});child.once("error",e=>{clearTimeout(timer);reject(e);});child.once("exit",()=>{clearTimeout(timer);reject(Error("Fixture exited: "+stderr));});});
    const html=await(await fetch(origin)).text();assert.ok(html.includes('/__test/diagnostics.mjs'));const bridge=await fetch(origin+"/__test/diagnostics.mjs");assert.equal(bridge.status,200);assert.match(await bridge.text(),/rubend-dom-diagnostics-v1/);assert.equal((await fetch(origin,{headers:{Origin:"http://example.invalid"}})).status,403);
    if(mode==="model-failure")assert.match(await(await fetch(origin+"/worker.js")).text(),/Deliberate cube-worker fixture failure/);
    else{
      let session;const deadline=performance.now()+3000;
      do{session=await(await fetch(origin+"/api/session")).json();if(mode==="delayed"||session.error)break;await new Promise(done=>setTimeout(done,20));}while(performance.now()<deadline);
      assert.equal(session.ready,false);if(mode==="bad-protocol")assert.match(session.error,/Unsupported engine protocol/);
    }
  }finally{
    child.kill("SIGTERM");const timer=setTimeout(()=>child.kill("SIGKILL"),5000);const result=await stopped;clearTimeout(timer);assert.equal(result.code,0,stderr);assert.equal(result.signal,null);
  }
  const state=JSON.parse(readFileSync(resolve(directory,"session.json"),"utf8"));assert.equal(state.state,"stopped-cleanly");assert.notEqual(nativeIdentity(state.wrapper.pid)?.startTicks,state.wrapper.startTicks);assert.notEqual(nativeIdentity(state.server.pid)?.startTicks,state.server.startTicks);assert.ok(state.native.length>0,"The fixture must record its native owner before testing cleanup");for(const n of state.native){assert.notEqual(nativeIdentity(n.pid)?.startTicks,n.startTicks);assert.equal(existsSync(n.ipcDirectory),false);}
}
console.log(JSON.stringify({passed:true,modes:3,diagnosticBridge:true,originGuard:true,startupAbortCleanup:true,browserClaim:false}));
