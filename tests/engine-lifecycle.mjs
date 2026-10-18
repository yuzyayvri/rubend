import assert from "node:assert/strict";
import {chmodSync,existsSync,mkdtempSync,readFileSync,rmSync,writeFileSync} from "node:fs";
import {tmpdir} from "node:os";
import {resolve} from "node:path";
import {execFileSync} from "node:child_process";
import {pathToFileURL} from "node:url";
import {apply,solved} from "../apps/model.mjs";

const directory=mkdtempSync(resolve(tmpdir(),"rubend-lifecycle-test-")),log=resolve(directory,"workers.jsonl");
const fixture=resolve("tests/fixtures/lifecycle-worker.mjs");chmodSync(fixture,0o755);
let enginePath=resolve("apps/engine.mjs");
if(process.argv[2]==="--baseline"){
  enginePath=resolve(directory,"engine-baseline.mjs");
  const source=execFileSync("git",["show","62de4d8:apps/engine.mjs"],{encoding:"utf8"}).replace('"./model.mjs"',JSON.stringify(pathToFileURL(resolve("apps/model.mjs")).href));
  writeFileSync(enginePath,source);
}
const {Engine}=await import(pathToFileURL(enginePath));
const originalMode=process.env.RUBEND_LIFECYCLE_MODE,originalLog=process.env.RUBEND_LIFECYCLE_LOG;
process.env.RUBEND_LIFECYCLE_LOG=log;
const rows=()=>existsSync(log)?readFileSync(log,"utf8").trim().split("\n").filter(Boolean).map(JSON.parse):[];
const wait=ms=>new Promise(done=>setTimeout(done,ms));
const until=async(test)=>{const deadline=performance.now()+2000;while(!test()){assert.ok(performance.now()<deadline,"Lifecycle fixture did not reach expected state");await wait(5);}};
const hard=apply(solved,[0,3,6,9,12,15,1,4,7,10,13,16]),input={facelets:hard,mode:"exact",budgetMs:10000};
const engines=[],ipc=[],checks=[];
function make(mode,options={}){process.env.RUBEND_LIFECYCLE_MODE=mode;const engine=new Engine({binary:fixture,cancelTimeoutMs:60,stopTimeoutMs:60,...options});engines.push(engine);ipc.push(engine.directory);return engine;}
async function close(engine){await engine.close();assert.equal(existsSync(engine.directory),false);}
async function solvedJob(engine){const events=[];await new Promise((done,reject)=>{engine.solve({facelets:solved,mode:"exact",budgetMs:500},event=>{events.push(event);if(event.type==="error")reject(Error(event.message));if(event.type==="done")done();}).catch(reject);});assert.equal(events.at(-1).optimal,1);return events;}
try{
  {
    const engine=make("delayed"),controller=new AbortController(),pid=engine.child.pid;
    const rejected=assert.rejects(engine.solve(input,()=>{}, {signal:controller.signal}),{name:"AbortError"});
    controller.abort();await rejected;await engine.ready();
    assert.equal(rows().filter(r=>r.type==="job"&&r.pid===pid).length,0,"Aborted startup request must never enter native search");
    assert.equal(engine.listenerCount("ready"),0);assert.equal(engine.listenerCount("unavailable"),0);await close(engine);checks.push("startup abort does not enqueue");
  }
  {
    const engine=make("delayed"),ready=assert.rejects(engine.ready(),/closed|stopped/);await close(engine);await ready;checks.push("close rejects readiness waiters");
  }
  for(const mode of["cooperative","late","done-race"]){
    const engine=make(mode);await engine.ready();const pid=engine.child.pid,generation=engine.generation;let oldEvents=0;
    await engine.solve(input,()=>oldEvents++);await until(()=>rows().some(r=>r.type==="job"&&r.pid===pid));
    const cancel=engine.cancel();assert.equal(engine.cancel(),cancel);await cancel;
    assert.equal(engine.state,"ready");assert.equal(engine.child.pid,pid);assert.equal(engine.generation,generation);
    await solvedJob(engine);await wait(30);assert.equal(oldEvents,0);assert.equal(engine.failure,null);
    await engine.cancel();assert.equal(engine.child.pid,pid);await close(engine);checks.push(mode+" cancellation and late isolation");
  }
  for(const mode of["legacy","ignore-cancel","ignore-term"]){
    const engine=make(mode);await engine.ready();const pid=engine.child.pid,oldDirectory=engine.directory;
    await engine.solve(input,()=>{});await until(()=>rows().some(r=>r.type==="job"&&r.pid===pid));
    await engine.cancel();ipc.push(engine.directory);assert.notEqual(engine.child.pid,pid);assert.equal(existsSync(oldDirectory),false);
    assert.equal(existsSync(`/proc/${pid}`),false,"Old worker must be gone before the replacement is usable");
    const before=rows().filter(r=>r.pid===pid&&r.type==="exit").at(-1),after=rows().find(r=>r.pid===engine.child.pid&&r.type==="start");
    if(before)assert.ok(before.at<=after.at,"Table owners cannot overlap");
    await solvedJob(engine);await close(engine);checks.push(mode+" serialized restart");
  }
  for(const mode of["bad-id","malformed","bad-replay","bad-terminal"]){
    const engine=make(mode);await engine.ready();
    const event=await new Promise((done,reject)=>{engine.solve(input,done).catch(reject);});
    assert.equal(event.type,"error");assert.equal(engine.state,"failed");await assert.rejects(engine.ready());await close(engine);checks.push(mode+" fails closed");
  }
  {
    const engine=make("bad-protocol");await assert.rejects(engine.ready(),/protocol/);await close(engine);checks.push("capability negotiation rejects unknown protocol");
  }
  for(const eventProtocol of["solver","fixed-work"]){
    const engine=make("fixed-events",{eventProtocol});await engine.ready();const types=[];
    await new Promise((done,reject)=>{engine.solve({facelets:solved,mode:"exact",budgetMs:500},event=>{types.push(event.type);if(["error","done"].includes(event.type))done();}).catch(reject);});
    assert.deepEqual(types,eventProtocol==="solver"?["error"]:["snapshot","measurement","candidate","done"]);await close(engine);checks.push(eventProtocol+" event boundary");
  }
  {
    const engine=make("cooperative");await engine.ready();await engine.solve(input,()=>{});
    await assert.rejects(engine.solve(input,()=>{}),/already working/);const cancelled=engine.cancel();const closed=engine.close();assert.equal(engine.close(),closed);await Promise.all([cancelled,closed]);checks.push("close during cancellation");
  }
  for(const path of ipc)assert.equal(existsSync(path),false,"No recorded IPC directory may survive");
  for(const row of rows().filter(r=>r.type==="start"))assert.deepEqual(row.livePreviousPids,[],"Replacement must start only after every earlier fixture owner stopped");
  console.log(JSON.stringify({passed:true,checks,workers:rows().filter(r=>r.type==="start").length,allIpcRemoved:true}));
}finally{
  await Promise.all(engines.map(engine=>engine.close()));
  for(const [key,value]of[["RUBEND_LIFECYCLE_MODE",originalMode],["RUBEND_LIFECYCLE_LOG",originalLog]]){if(value===undefined)delete process.env[key];else process.env[key]=value;}
  rmSync(directory,{recursive:true,force:true});
}
