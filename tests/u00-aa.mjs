import assert from "node:assert/strict";
import {analyzeAa} from "../bench/u00-aa.mjs";
import {solved} from "../apps/model.mjs";

const profile={binary:"/same-native",buildMetadata:"/same-metadata",tableSource:"generated",env:{}};
const make=()=>({format:"rubend-warm-comparison-v1",passed:true,errors:[],counts:{successfulJobs:40,errors:0},config:{iterations:5,profiles:[{id:"a",...profile},{id:"b",...profile}],corpora:{warmup:{count:1},fast:{count:1},exact:{count:1}}},rounds:Array.from({length:5},()=>({status:"ok",jobs:["warmup","fast","exact","superflip"].flatMap(group=>["a","b"].map(id=>({id:group,profile:id,group,facelets:solved,mode:group==="fast"?"fast":"exact",status:"ok",budgetMs:1000,events:[{type:"candidate",elapsedMs:100,length:0,lower:0,moves:[],optimal:1},{type:"done",elapsedMs:101,length:0,lower:0,optimal:1}],nativeDone:{lower:0,length:0,optimal:1}})))}))});
assert.equal(analyzeAa(make()).verdict,"stable-on-this-sample");
{
  const r=make();for(const round of r.rounds)for(const j of round.jobs)if(j.profile==="b"){j.events[0].elapsedMs=110;j.events[1].elapsedMs=111;}
  assert.equal(analyzeAa(r).groups.fast.latencyWithinFloor,false);assert.equal(analyzeAa(r).verdict,"inconclusive");
}
{
  const r=make();for(const round of r.rounds)for(const j of round.jobs){j.events[0].elapsedMs=12;j.events[1].elapsedMs=13;}
  assert.equal(analyzeAa(r).groups.fast.resolutionLimited,true);assert.equal(analyzeAa(r).verdict,"inconclusive");
}
{
  const r=make(),j=r.rounds[0].jobs.find(j=>j.group==="exact"&&j.profile==="b");
  j.events=[{type:"candidate",elapsedMs:100,length:2,lower:0,moves:[0,2],optimal:0},{type:"done",elapsedMs:101,length:2,lower:0,optimal:0}];j.nativeDone={lower:0,length:2,optimal:0};
  const result=analyzeAa(r);assert.equal(result.groups.exact.deadlineTied,false);assert.equal(result.groups.exact.nativeDifferences,1);assert.equal(result.verdict,"inconclusive");
}
let rejected=0;
for(const change of[r=>r.passed=false,r=>r.errors.push("error"),r=>r.counts.successfulJobs--,r=>r.rounds[0].jobs.pop(),r=>r.config.profiles[1].binary="/different",r=>r.rounds[0].jobs[0].status="error",r=>r.rounds[0].jobs.find(j=>j.group==="fast").events[0].moves=[0]]){
  const r=make();change(r);assert.throws(()=>analyzeAa(r));rejected++;
}
console.log(JSON.stringify({passed:true,stableFixture:true,latencyAndClockAndQualityStayInconclusive:true,rejectedFixtures:rejected,notProductPerformance:true}));
