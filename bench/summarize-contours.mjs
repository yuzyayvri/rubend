import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {gunzipSync} from "node:zlib";
import {createHash} from "node:crypto";

assert.equal(process.argv.length,3,"Expected contour report");
const path=process.argv[2],bytes=readFileSync(path),data=JSON.parse((path.endsWith(".gz")?gunzipSync(bytes):bytes).toString("utf8"));
assert.equal(data.format,"rubend-contour-comparison-v1");assert.equal(data.passed,true);assert.deepEqual(data.errors,[]);assert.equal(data.rounds.length,5);
const profiles=["forward","inverse-one","inverse-three"],series=Object.fromEntries(profiles.map(p=>[p,[]]));
const summary={format:"rubend-contour-adjudication-v1",inputSha256:createHash("sha256").update(bytes).digest("hex"),target:data.config.target,count:data.config.count,completed:{},comparisons:{}};
const dist=xs=>{const a=[...xs].sort((a,b)=>a-b),m=Math.floor(a.length/2);return {count:a.length,median:a.length%2?a[m]:(a[m-1]+a[m])/2,minimum:a[0],maximum:a.at(-1)};};
for(const round of data.rounds){
  assert.equal(round.status,"ok");assert.equal(round.workers.length,3);assert.equal(round.jobs.length,3*data.config.count);
  assert.deepEqual([...new Set(round.workers.map(w=>w.profile))].sort(),[...profiles].sort());
  for(const w of round.workers){assert.equal(w.shallowPassed,163);assert.equal(w.shutdown?.ipcRemoved,true);assert.equal(w.shutdown.forced,false);}
  for(const profile of profiles){
    const jobs=round.jobs.filter(j=>j.profile===profile);assert.equal(jobs.length,data.config.count);assert.equal(new Set(jobs.map(j=>j.id)).size,jobs.length);
    for(const j of jobs){
      assert.equal(j.target,data.config.target);assert.equal(j.complete,j.lower>=j.target||j.optimal===1);
      assert.ok(Number.isSafeInteger(j.cpuTicks)&&j.cpuTicks>=0);assert.ok(Number.isSafeInteger(j.nodes)&&j.nodes>0&&j.nodes<=20000000);
    }
    series[profile].push(jobs);
  }
}
for(const p of profiles){const jobs=series[p].flat();summary.completed[p]={planned:jobs.length,completed:jobs.filter(j=>j.complete).length,censored:jobs.filter(j=>!j.complete).length,cpuMs:dist(jobs.map(j=>j.cpuMs)),nativeWallMs:dist(jobs.map(j=>j.nativeMs)),workSteps:dist(jobs.map(j=>j.nodes))};}
for(const candidate of profiles.slice(1)){
  const ratios=[],workRatios=[],blocks=[],nativePerCpu=[];
  let comparable=true;
  for(let round=0;round<5;round++){
    const after=new Map(series[candidate][round].map(j=>[j.id,j])),logs=[];
    for(const before of series.forward[round]){
      const next=after.get(before.id);assert.ok(next);assert.equal(next.facelets,before.facelets);
      if(!before.complete||!next.complete){comparable=false;continue;}
      assert.ok(before.cpuTicks>=10&&next.cpuTicks>=10,"Insufficient CPU tick resolution");
      const ratio=next.cpuMs/before.cpuMs;ratios.push(ratio);workRatios.push(next.nodes/before.nodes);logs.push(Math.log(ratio));
      for(const j of [before,next]){assert.ok(j.nativeMs>=.8*j.cpuMs-25,"Native timer misses CPU work");nativePerCpu.push(j.nativeMs/j.cpuMs);}
    }
    blocks.push(logs.length?logs.reduce((a,b)=>a+b,0)/logs.length:null);
  }
  const result={allTargetsComparable:comparable,plannedPairs:5*data.config.count,completePairs:ratios.length,pairedCpuRatio:dist(ratios),pairedWorkRatio:dist(workRatios),nativeWallPerCpu:dist(nativePerCpu)};
  if(comparable){
    const bootstrap=[];
    for(let code=0;code<3125;code++){let selection=code,sum=0;for(let i=0;i<5;i++){sum+=blocks[selection%5];selection=Math.floor(selection/5);}bootstrap.push(Math.exp(sum/5));}
    bootstrap.sort((a,b)=>a-b);
    result.geometricCpuRatio=Math.exp(blocks.reduce((a,b)=>a+b,0)/5);result.cohortCpuRatios=blocks.map(Math.exp);
    result.fiveCohortBootstrap95=[bootstrap[Math.floor(.025*bootstrap.length)],bootstrap[Math.ceil(.975*bootstrap.length)-1]];
    result.observedTenPercentContourGate=result.fiveCohortBootstrap95[1]<.9;
  }
  summary.comparisons[candidate]=result;
}
summary.claim="Finite direct-contour comparison only. CPU is process time, not work-step rate. Censored cases remain visible and disable the all-case ratio claim. Five cohorts on these positions do not establish general exact strength, application deadline quality, formal admissibility, or world-class performance.";
console.log(JSON.stringify(summary,null,2));
