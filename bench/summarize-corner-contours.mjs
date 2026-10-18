import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {gunzipSync} from "node:zlib";
import {createHash} from "node:crypto";

assert.equal(process.argv.length,3,"Expected four-policy contour report");
const path=process.argv[2],bytes=readFileSync(path),data=JSON.parse((path.endsWith(".gz")?gunzipSync(bytes):bytes).toString("utf8"));
assert.equal(data.format,"rubend-contour-comparison-v1");assert.equal(data.passed,true);assert.deepEqual(data.errors,[]);assert.equal(data.rounds.length,5);assert.ok(data.config.cornerCache);
const profiles=["forward","inverse-three","corner","combined"],series=Object.fromEntries(profiles.map(p=>[p,[]]));
const summary={format:"rubend-corner-contour-adjudication-v1",inputSha256:createHash("sha256").update(bytes).digest("hex"),target:data.config.target,count:data.config.count,split:data.config.split??"pilot",stratum:data.config.stratum??"uniform",completed:{},comparisons:{}};
const dist=xs=>{const a=[...xs].sort((a,b)=>a-b),m=Math.floor(a.length/2);return {count:a.length,median:a.length%2?a[m]:(a[m-1]+a[m])/2,minimum:a[0],maximum:a.at(-1)};};
for(const round of data.rounds){
  assert.equal(round.status,"ok");assert.equal(round.workers.length,4);assert.equal(round.jobs.length,4*data.config.count);
  assert.deepEqual([...new Set(round.workers.map(w=>w.profile))].sort(),[...profiles].sort());
  for(const w of round.workers){assert.equal(w.shallowPassed,163);assert.equal(w.shutdown?.ipcRemoved,true);assert.equal(w.shutdown.forced,false);}
  for(const profile of profiles){
    const jobs=round.jobs.filter(j=>j.profile===profile);assert.equal(jobs.length,data.config.count);assert.equal(new Set(jobs.map(j=>j.id)).size,jobs.length);
    for(const j of jobs){assert.equal(j.target,data.config.target);assert.equal(j.complete,j.lower>=j.target||j.optimal===1);assert.ok(Number.isSafeInteger(j.cpuTicks)&&j.cpuTicks>=0);assert.ok(Number.isSafeInteger(j.nodes)&&j.nodes>0&&j.nodes<=20000000);}
    series[profile].push(jobs);
  }
}
for(const p of profiles){const jobs=series[p].flat();summary.completed[p]={planned:jobs.length,completed:jobs.filter(j=>j.complete).length,censored:jobs.filter(j=>!j.complete).length,cpuMs:dist(jobs.map(j=>j.cpuMs)),nativeWallMs:dist(jobs.map(j=>j.nativeMs)),workSteps:dist(jobs.map(j=>j.nodes))};}
for(const [control,candidate] of [["forward","corner"],["inverse-three","combined"],["forward","combined"],["forward","inverse-three"]]){
  const blocks=[],workBlocks=[],wallBlocks=[];let completePairs=0,comparable=true;
  for(let round=0;round<5;round++){
    const before=series[control][round],after=new Map(series[candidate][round].map(j=>[j.id,j]));
    for(const j of before){const next=after.get(j.id);assert.ok(next);assert.equal(next.facelets,j.facelets);if(!j.complete||!next.complete)comparable=false;else completePairs++;}
    const sum=(xs,key)=>xs.reduce((a,j)=>a+j[key],0),next=before.map(j=>after.get(j.id));
    const cpuBefore=sum(before,"cpuMs"),cpuAfter=sum(next,"cpuMs"),wallBefore=sum(before,"nativeMs"),wallAfter=sum(next,"nativeMs");
    assert.ok(cpuBefore>=100&&cpuAfter>=100,"Insufficient aggregate CPU tick resolution");
    blocks.push(cpuAfter/cpuBefore);workBlocks.push(sum(next,"nodes")/sum(before,"nodes"));wallBlocks.push(wallAfter/wallBefore);
    for(const xs of [before,next])assert.ok(sum(xs,"nativeMs")>=.8*sum(xs,"cpuMs")-25,"Native timer misses CPU work");
  }
  const result={control,candidate,allTargetsComparable:comparable,plannedPairs:5*data.config.count,completePairs,cohortCpuRatios:blocks,cohortWorkRatios:workBlocks,cohortNativeWallRatios:wallBlocks,ratioMethod:"Ratio of cohort totals on all declared cases. No selection of completed-only cases. CPU ticks can be zero for an individual very short solve; each cohort must total at least 100 ms per policy."};
  if(comparable){
    const logs=blocks.map(Math.log),bootstrap=[];
    for(let code=0;code<3125;code++){let selection=code,sum=0;for(let i=0;i<5;i++){sum+=logs[selection%5];selection=Math.floor(selection/5);}bootstrap.push(Math.exp(sum/5));}
    bootstrap.sort((a,b)=>a-b);result.geometricCpuRatio=Math.exp(logs.reduce((a,b)=>a+b,0)/5);
    result.fiveCohortBootstrap95=[bootstrap[Math.floor(.025*bootstrap.length)],bootstrap[Math.ceil(.975*bootstrap.length)-1]];
    result.observedTenPercentContourGate=result.fiveCohortBootstrap95[1]<.9;
  }
  summary.comparisons[control+"/"+candidate]=result;
}
summary.claim="Finite direct-contour ablation, not application quality or general strength. Each policy's censored cases remain visible and disable the completed-all-case ratio claim. Same-binary controls include the same loaded corner data. Five cohorts do not establish universal admissibility, completeness, or world-class performance.";
console.log(JSON.stringify(summary,null,2));
