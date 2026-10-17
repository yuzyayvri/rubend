import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {gunzipSync} from "node:zlib";
import {createHash} from "node:crypto";

assert.equal(process.argv.length,3,"Expected fixed-time details");
const path=process.argv[2],bytes=readFileSync(path),data=JSON.parse((path.endsWith(".gz")?gunzipSync(bytes):bytes).toString("utf8"));
assert.equal(data.format,"rubend-fixed-time-comparison-v1");
assert.equal(data.passed,true);assert.deepEqual(data.errors,[]);assert.equal(data.rounds.length,5);
const ids=data.config.profiles.map(p=>p.id);assert.equal(ids.length,2);assert.notEqual(ids[0],ids[1]);
assert.equal(data.planned.warmupJobs,1630);assert.equal(data.planned.measurementJobs,110);
const summary={format:"rubend-fixed-time-adjudication-v1",inputSha256:createHash("sha256").update(bytes).digest("hex"),groups:{},overheadLimit:1.05,allWithinObservedOverheadLimit:true};
for(const group of ["fast","exact"]){
  const expected=group==="fast"?8:3,blocks=[],ratios=[];
  for(const round of data.rounds){
    assert.equal(round.status,"ok");assert.equal(round.workers.length,2);
    assert.ok(round.workers.every(w=>w.shutdown?.ipcRemoved&&!w.shutdown.forced));
    const before=round.jobs.filter(j=>j.group===group&&j.profile===ids[0]),after=round.jobs.filter(j=>j.group===group&&j.profile===ids[1]);
    assert.equal(before.length,expected);assert.equal(after.length,expected);
    const byId=new Map(after.map(j=>[j.id,j]));assert.equal(byId.size,expected);
    const logs=before.map(a=>{
      const b=byId.get(a.id);assert.ok(b);assert.deepEqual(b.semantic,a.semantic);
      assert.ok(a.cpuTicks>=10&&b.cpuTicks>=10&&a.cpuMs>0&&b.cpuMs>0);
      for(const j of [a,b])assert.ok(j.nativeMs>=.8*j.cpuMs-25,"Native timer misses substantial CPU work");
      const ratio=b.cpuMs/a.cpuMs;ratios.push(ratio);return Math.log(ratio);
    });
    blocks.push(logs.reduce((a,b)=>a+b,0)/logs.length);
  }
  const bootstrap=[];
  for(let code=0;code<3125;code++){
    let selected=code,sum=0;
    for(let i=0;i<5;i++){sum+=blocks[selected%5];selected=Math.floor(selected/5);}
    bootstrap.push(Math.exp(sum/5));
  }
  bootstrap.sort((a,b)=>a-b);ratios.sort((a,b)=>a-b);
  const interval=[bootstrap[Math.floor(.025*bootstrap.length)],bootstrap[Math.ceil(.975*bootstrap.length)-1]];
  const within=interval[1]<summary.overheadLimit;summary.allWithinObservedOverheadLimit&&=within;
  const middle=Math.floor(ratios.length/2),median=ratios.length%2?ratios[middle]:(ratios[middle-1]+ratios[middle])/2;
  summary.groups[group]={pairs:ratios.length,medianCpuRatio:median,geometricCpuRatio:Math.exp(blocks.reduce((a,b)=>a+b,0)/5),minimumCpuRatio:ratios[0],maximumCpuRatio:ratios.at(-1),cohortCpuRatios:blocks.map(Math.exp),fiveCohortBootstrap95:interval,withinObservedOverheadLimit:within};
}
summary.claim="Finite equal-work overhead check only. Five cohorts, process-tick resolution, background load, and the selected cases limit inference. This is not a universal bound or a speedup.";
console.log(JSON.stringify(summary,null,2));
