import assert from "node:assert/strict";
import {spawn} from "node:child_process";
import {readFileSync,existsSync} from "node:fs";
import {randomBytes} from "node:crypto";
import {resolve} from "node:path";
import {nativeIdentity} from "../bench/startup-measure.mjs";
import {deliveryPin} from "../bench/delivery-pins.mjs";

assert.ok(process.argv.length===2||([3,4].includes(process.argv.length)&&process.argv[2]==="--delivered"));
const deliveryRunId=process.argv[3]??"u01-delivery-v1";assert.match(deliveryRunId,/^u01-delivery-[a-z0-9-]+$/);
const pinned=process.argv[2]==="--delivered"?deliveryPin(JSON.parse(readFileSync(resolve("build/experiments",deliveryRunId,"delivery.json"),"utf8")).pinName):null;
const modes=process.argv[2]==="--delivered"?Array(3).fill("delivered"):["delayed","model-failure","rewind-failure","bad-protocol","acceptance","fallback","policy-only"];
for(const mode of modes){
  const id="u01-live-fixture-"+randomBytes(8).toString("hex"),directory=resolve("build/evidence/next-plan/U01",id),child=spawn(process.execPath,["tests/ui-fixture-server.mjs",mode,id,...mode==="delivered"?[deliveryRunId]:[]],{stdio:["ignore","pipe","pipe"]});
  let stderr="";child.stderr.on("data",d=>stderr+=d);const stopped=new Promise(done=>child.once("close",(code,signal)=>done({code,signal})));
  try{
    const origin=await new Promise((done,reject)=>{const timer=setTimeout(()=>reject(Error("Fixture startup timed out: "+stderr)),5000);let stdout="";child.stdout.on("data",d=>{stdout+=d;const match=stdout.match(/http:\/\/127\.0\.0\.1:\d+/);if(match){clearTimeout(timer);done(match[0]);}});child.once("error",e=>{clearTimeout(timer);reject(e);});child.once("exit",()=>{clearTimeout(timer);reject(Error("Fixture exited: "+stderr));});});
    const html=await(await fetch(origin)).text();assert.ok(html.includes('/__test/diagnostics.mjs'));const bridge=await fetch(origin+"/__test/diagnostics.mjs");assert.equal(bridge.status,200);assert.match(await bridge.text(),/rubend-dom-diagnostics-v1/);assert.equal((await fetch(origin,{headers:{Origin:"http://example.invalid"}})).status,403);
    if(["model-failure","rewind-failure"].includes(mode)){const worker=await(await fetch(origin+"/worker.js")).text();assert.match(worker,/Deliberate cube-worker fixture failure/);assert.ok(worker.includes("++rubendFixtureApplies==="+String(mode==="rewind-failure"?2:1)));}
    if(["acceptance","fallback"].includes(mode)){assert.equal((await fetch(origin)).headers.get("permissions-policy"),"clipboard-write=()");assert.ok(html.indexOf('/__test/setup.js')<html.indexOf('type="module"'));const setup=await(await fetch(origin+"/__test/setup.js")).text();assert.ok(setup.startsWith("const rubendTestFallback="+String(mode==="fallback")+";"));assert.match(setup,/WEBGL_lose_context/);}
    if(mode==="policy-only"){assert.equal((await fetch(origin)).headers.get("permissions-policy"),"clipboard-write=()");assert.ok(html.includes('/__test/clipboard-policy.js'));assert.equal(html.includes('/__test/setup.js'),false);const setup=await(await fetch(origin+"/__test/clipboard-policy.js")).text();assert.ok(setup.includes("clipboardWriteUnchanged"));assert.equal(setup.includes("Object.defineProperty"),false);}
    if(["delayed","bad-protocol"].includes(mode)){
      let session;const deadline=performance.now()+3000;
      do{session=await(await fetch(origin+"/api/session")).json();if(mode==="delayed"||session.error)break;await new Promise(done=>setTimeout(done,20));}while(performance.now()<deadline);
      assert.equal(session.ready,false);if(mode==="bad-protocol")assert.match(session.error,/Unsupported engine protocol/);
    }
  }finally{
    child.kill("SIGTERM");await new Promise(done=>setTimeout(done,1));child.kill("SIGTERM");const timer=setTimeout(()=>child.kill("SIGKILL"),5000);const result=await stopped;clearTimeout(timer);assert.equal(result.code,0,stderr);assert.equal(result.signal,null);
  }
  const state=JSON.parse(readFileSync(resolve(directory,"session.json"),"utf8"));assert.equal(state.state,"stopped-cleanly");assert.equal(state.forcedStop,false);assert.equal(state.applicationGone,true);assert.notEqual(nativeIdentity(state.wrapper.pid)?.startTicks,state.wrapper.startTicks);assert.notEqual(nativeIdentity(state.server.pid)?.startTicks,state.server.startTicks);assert.ok(state.native.length>0,"The fixture must record its native owner before testing cleanup");for(const n of state.native){assert.notEqual(nativeIdentity(n.pid)?.startTicks,n.startTicks);assert.equal(existsSync(n.ipcDirectory),false);}if(mode==="delivered"){assert.ok(state.application);assert.notEqual(nativeIdentity(state.application.pid)?.startTicks,state.application.startTicks);assert.equal(state.delivery.artifactId,pinned.artifactId);assert.equal(state.delivery.hostStoreMounted,false);assert.equal(state.delivery.repositoryMounted,false);assert.ok(state.native.every(n=>n.isolated));}
}
console.log(JSON.stringify({passed:true,modes:modes.length,delivered:process.argv[2]==="--delivered",repeatedTerminationRequested:true,diagnosticBridge:true,originGuard:true,startupAbortCleanup:modes.includes("delayed"),browserClaim:false}));
