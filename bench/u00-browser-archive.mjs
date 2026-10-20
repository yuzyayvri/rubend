import assert from "node:assert/strict";
import {readFileSync,writeFileSync,mkdirSync,readdirSync,copyFileSync,constants,createReadStream} from "node:fs";
import {resolve} from "node:path";
import {execFileSync} from "node:child_process";
import {createHash} from "node:crypto";
import {nativeIdentity} from "./startup-measure.mjs";
import {apply,solved} from "../apps/model.mjs";

assert.equal(process.argv.length,2);
const read=p=>JSON.parse(readFileSync(p,"utf8")),hash=p=>createHash("sha256").update(readFileSync(p)).digest("hex"),base=resolve("build/evidence/next-plan"),profiles=read("build/experiments/u00-profiles-v1/profiles.json");
const spec=read("build/evidence/next-plan/U00/u00-profiles-v1-spec.json"),names=[..."URFDLB"].flatMap(f=>[f,f+"2",f+"'"]),paths=[],sessions=[];
for(const [path,expected]of Object.entries(profiles.caches)){const h=createHash("sha256");for await(const chunk of createReadStream(path))h.update(chunk);assert.equal(h.digest("hex"),expected);}
for(const profile of spec.profiles){
  const id="u00-live-"+profile.id+"-v1",directory=resolve(base,"U00",id),state=read(resolve(directory,"session.json"));assert.equal(state.state,"stopped-cleanly");assert.deepEqual(state.profile,profile);assert.equal(state.binarySha256,hash(profile.binary));
  for(const [path,expected]of Object.entries(state.sourceHashes))assert.equal(hash(path),expected);
  assert.notEqual(nativeIdentity(state.wrapper.pid)?.startTicks,state.wrapper.startTicks);
  for(const server of state.servers){assert.notEqual(nativeIdentity(server.server.pid)?.startTicks,server.server.startTicks);assert.equal(server.exitCode,0);for(const c of server.cleanup){assert.equal(c.ownerGone,true);assert.equal(c.ipcRemoved,true);}}
  const d=read(resolve(directory,profile.id+"-shallow.json")).diagnostics,record=read(resolve(directory,profile.id+"-export.json"));assert.equal(d.solution.moves.length,4);assert.equal(d.solution.lower,4);assert.equal(d.solution.optimal,true);assert.equal(d.pendingModelRequests,0);assert.equal(apply(d.solution.origin,d.solution.moves),solved);assert.equal(record.htm,4);assert.equal(record.lowerBound,4);assert.equal(record.searchOptimal,true);assert.equal(record.replayCertified,true);assert.equal(apply(record.facelets,record.moves.map(m=>names.indexOf(m))),solved);
  paths.push(...readdirSync(directory).filter(p=>p.endsWith(".json")).map(p=>resolve(directory,p)),resolve("build/evidence",id+"-resource.json"));sessions.push({id,profile:profile.id,passed:true,binarySha256:state.binarySha256});
}
for(const [unit,id]of[["U00","u00-live-bad-protocol-v1"],["U01","u01-live-model-failure-v1"]]){
  const directory=resolve(base,unit,id),s=read(resolve(directory,"session.json"));assert.equal(s.state,"stopped-cleanly");assert.notEqual(nativeIdentity(s.wrapper.pid)?.startTicks,s.wrapper.startTicks);assert.notEqual(nativeIdentity(s.server.pid)?.startTicks,s.server.startTicks);for(const n of s.native)assert.notEqual(nativeIdentity(n.pid)?.startTicks,n.startTicks);for(const c of s.cleanup){assert.equal(c.ownerGone,true);assert.equal(c.ipcRemoved,true);}for(const [path,expected]of Object.entries(s.sourceHashes))assert.equal(hash(path),expected);
  if(unit==="U00"){const d=read(resolve(directory,"capability-mismatch.json")).diagnostics;assert.equal(d.searching,false);assert.equal(d.solution,null);const log=readFileSync(resolve(directory,"native.jsonl"),"utf8").trim().split("\n").map(JSON.parse);assert.ok(log.some(r=>r.type==="ready"));assert.equal(log.some(r=>r.type==="job"),false);}
  else{const {before,after,spaceKeyPresses}=read(resolve(directory,"worker-failure-responsive.json"));assert.equal(spaceKeyPresses,20);assert.ok(after.ticks>before.ticks);assert.equal(after.diagnostics.modelState,"failed");assert.equal(after.diagnostics.playing,false);assert.equal(after.diagnostics.pendingModelRequests,0);assert.deepEqual(after.diagnostics.solution,before.diagnostics.solution);const r=read(resolve(directory,"worker-failure-export.json"));assert.equal(r.htm,4);assert.equal(r.replayCertified,true);assert.equal(apply(r.facelets,r.moves.map(m=>names.indexOf(m))),solved);}
  paths.push(...readdirSync(directory).filter(p=>p.endsWith(".json")).map(p=>resolve(directory,p)),resolve("build/evidence",id+"-resource.json"));sessions.push({id,passed:true,mode:s.mode});
}
for(const path of paths.filter(p=>p.endsWith("-resource.json"))){const r=read(path);assert.equal(r.exitCode,0);assert.equal(r.stoppedFor,null);}
const destination=resolve("docs/verification/next-plan/U00/u00-browser-profiles-v1");mkdirSync(destination);
const archives=paths.map((p,index)=>JSON.parse(execFileSync(process.execPath,["bench/archive-evidence.mjs",p,resolve(destination,index+"-"+p.split("/").slice(-2).join("-")+".gz")],{encoding:"utf8"})));
const images=[resolve(base,"U00/u00-live-h0-v1/h0-shallow.jpg"),resolve(base,"U00/u00-live-bad-protocol-v1/capability-mismatch.jpg"),resolve(base,"U01/u01-live-model-failure-v1/worker-failure-responsive.jpg")].map(p=>{const target=resolve(destination,p.split("/").at(-1));copyFileSync(p,target,constants.COPYFILE_EXCL);assert.equal(hash(p),hash(target));return{path:target,sha256:hash(target)};});
const producerHashes=Object.fromEntries(["bench/u00-live.mjs","tests/u00-browser-driver.mjs","tests/ui-fixture-server.mjs","tests/fixtures/ui-diagnostics.mjs","tests/fixtures/lifecycle-worker.mjs"].map(p=>[p,hash(p)]));
const summary={format:"rubend-u00-browser-profile-archive-v1",passed:true,sessions,cacheIdentitiesUnchanged:true,u00LiveLanesAdded:[5,10],u01WorkerFailureLanePassed:true,u00Accepted:false,releaseTimingVerdict:"inconclusive",newProductionBehavior:false,performanceClaim:false,independentReview:false};
writeFileSync(resolve(destination,"index.json"),JSON.stringify({summary,producerHashes,cacheHashes:profiles.caches,archives,images},null,2)+"\n",{flag:"wx"});console.log(JSON.stringify(summary));
