import assert from "node:assert/strict";
import {mkdtempSync,rmSync,existsSync} from "node:fs";
import {resolve} from "node:path";
import {tmpdir} from "node:os";
import {parseStat,parseSchedstat,counterDelta,sampleOwner,LatencyProbeEngine,summarizeLatencyTrace} from "../bench/latency-probe.mjs";
import {solved} from "../apps/model.mjs";

const fields=Array(22).fill("0");fields[0]="S";fields[7]="12";fields[9]="1";fields[19]="42";
assert.deepEqual(parseStat("7 (nested (name)) "+fields.join(" "),7),{pid:7,startTicks:"42",minorFaults:"12",majorFaults:"1"});
assert.deepEqual(parseSchedstat("1000000 200000 3\n"),{cpuNs:"1000000",waitNs:"200000",slices:"3"});
for(const text of["","1 2","1 2 3 4","-1 2 3","x 2 3"])assert.throws(()=>parseSchedstat(text));
const before={available:true,pid:7,startTicks:"42",minorFaults:"12",majorFaults:"1",threads:[{pid:7,startTicks:"42",cpuNs:"1000000",waitNs:"200000",slices:"3",voluntary:"1",involuntary:"2"}]};
const after=structuredClone(before);Object.assign(after,{minorFaults:"13"});Object.assign(after.threads[0],{cpuNs:"3000000",waitNs:"400000",slices:"5",voluntary:"2",involuntary:"3"});
assert.equal(counterDelta(before,after,true).cpuUntilObservationMs,2);assert.equal(counterDelta(before,after,true).runqueueWaitMs,.2);assert.equal(counterDelta(before,after,false).runqueueWaitMs,null);
for(const mutate of[r=>r.available=false,r=>r.startTicks="different",r=>r.threads=[],r=>r.threads[0].cpuNs="0"]){const changed=structuredClone(after);mutate(changed);assert.equal(counterDelta(before,changed,true).available,false);}
assert.equal(sampleOwner(process.pid).available,true);
const trace=["fast","exact","superflip"].flatMap(group=>["a","b"].map(profile=>({group,profile,id:group,facelets:solved,first:{arrivalMs:100.25,roundedMs:100,moves:[],length:0,nodes:1,counters:{available:false}}})));
const original={rounds:[{jobs:trace.map(r=>({...r,first:{moves:[],length:0,nodes:1}}))}]};
assert.equal(summarizeLatencyTrace(trace,original).firstPrefixesMatchingOriginal,true);assert.equal(summarizeLatencyTrace(trace,original).counterUnavailable,6);
const different=structuredClone(trace);different[0].first.nodes=2;assert.equal(summarizeLatencyTrace(different,original).prefixMismatches,1);
for(const change of[r=>r.pop(),r=>r[0].first=null,r=>r[0].facelets="different",r=>r[0].profile="b"]){const changed=structuredClone(trace);change(changed);assert.throws(()=>summarizeLatencyTrace(changed,original));}
const temporary=mkdtempSync(resolve(tmpdir(),"rubend-latency-probe-")),old=Object.fromEntries(["RUBEND_LIFECYCLE_MODE","RUBEND_LIFECYCLE_LOG"].map(k=>[k,process.env[k]]));
process.env.RUBEND_LIFECYCLE_MODE="cooperative";process.env.RUBEND_LIFECYCLE_LOG=resolve(temporary,"native.jsonl");
const rows=[],engine=new LatencyProbeEngine({binary:resolve("tests/fixtures/lifecycle-worker.mjs")},{profile:"fixture",round:0},rows),events=[];
try{
  await engine.ready();await new Promise((done,reject)=>{engine.solve({id:"solved",group:"fast",facelets:solved,mode:"fast",budgetMs:1000},event=>{events.push(event);if(event.type==="done")done();if(event.type==="error")reject(Error(event.message));}).catch(reject);});
  assert.deepEqual(events.map(e=>e.type),["candidate","done"]);assert.equal(events[1].optimal,1);assert.equal(rows.length,1);assert.ok(rows[0].first.arrivalMs>=0);assert.equal(rows[0].first.roundedMs,events[0].elapsedMs);assert.equal(Number.isInteger(events[0].elapsedMs),true);assert.equal(rows[0].first.counters.available,true);assert.equal(events[0].arrivalMs,undefined);
}finally{await engine.close();for(const [k,v]of Object.entries(old))if(v===undefined)delete process.env[k];else process.env[k]=v;rmSync(temporary,{recursive:true,force:true});}
assert.equal(existsSync(engine.directory),false);console.log(JSON.stringify({passed:true,procParsing:true,counterIdentityAndRegressionGuards:true,disabledWaitIsUnknown:true,realEngineFixture:true,publicEventsUnchanged:true,allIpcRemoved:true,notProductTiming:true}));
