import assert from "node:assert/strict";
import {readFileSync} from "node:fs";

assert.equal(process.argv.length,3,"Expected bounded comparison record path");
const resource=JSON.parse(readFileSync(process.argv[2],"utf8")),data=JSON.parse(resource.stdout);
assert.equal(resource.exitCode,0);assert.equal(resource.stoppedFor,null);assert.equal(data.passed,true);
assert.equal(data.counts.errors,0);assert.equal(data.counts.failedJobs,0);assert.equal(data.rounds.length,5);
assert.equal(data.counts.noAnswerByDeadline,0,"Deadline misses require a separate scoring policy");
assert.equal(data.counts.workers,10);assert.equal(data.counts.successfulJobs,1990);
const ids=data.config.profiles.map(p=>p.id);
function distribution(values){
  assert.ok(values.length);const a=[...values].sort((x,y)=>x-y),m=Math.floor(a.length/2);
  return {median:a.length%2?a[m]:(a[m-1]+a[m])/2,minimum:a[0],maximum:a.at(-1)};
}
const report={format:"rubend-warm-adjudication-v1",counts:data.counts,resource:{elapsedMs:resource.elapsedMs,peakTreeRssKiB:resource.peakTreeRssKiB,limits:resource.limits},qualityFloorPassed:true,groups:{}};
for(const group of ["fast","exact","superflip"]){
  const selected=data.rounds.flatMap(r=>r.jobs.filter(j=>j.group===group)),summary=data.summary[group],profiles={};
  for(const id of ids){
    const jobs=selected.filter(j=>j.profile===id),rates=data.rounds.map(r=>{const a=r.jobs.filter(j=>j.group===group&&j.profile===id);return a.reduce((s,j)=>s+j.workSteps,0)/(a.reduce((s,j)=>s+j.hostCompletionMs,0)/1000);});
    const first=jobs.map(j=>j.first.elapsedMs).sort((a,b)=>a-b);
    profiles[id]={...summary.profiles[id],rateWorkStepsPerSecond:distribution(rates),firstP95Ms:first[Math.ceil(first.length*.95)-1],meanFirstLength:jobs.reduce((s,j)=>s+j.first.length,0)/jobs.length};
  }
  const cases=[];
  for(const id of new Set(selected.map(j=>j.id))){
    const pair=ids.map(profile=>{const a=selected.filter(j=>j.profile===profile&&j.id===id);assert.equal(a.length,5);return {profile,noAnswer:a.filter(j=>!j.bestAtDeadline).length,deadlineUpper:distribution(a.map(j=>j.bestAtDeadline?.length??31)).median,terminalLower:distribution(a.map(j=>j.nativeDone.lower)).median,terminalUpper:distribution(a.map(j=>j.terminalBest.length)).median};});
    const [a,b]=pair,passed=b.noAnswer<=a.noAnswer&&b.deadlineUpper<=a.deadlineUpper&&(group==="fast"||(b.terminalLower>=a.terminalLower&&b.terminalUpper<=a.terminalUpper));
    report.qualityFloorPassed&&=passed;cases.push({id,passed,pair});
  }
  const [baseline,candidate]=ids.map(id=>profiles[id]),a=baseline.rateWorkStepsPerSecond,b=candidate.rateWorkStepsPerSecond;
  report.qualityFloorPassed&&=candidate.meanDeadlineLength<=baseline.meanDeadlineLength&&candidate.noAnswerByDeadline<=baseline.noAnswerByDeadline;
  report.groups[group]={paired:summary.paired,profiles,cases,medianRateDeltaPercent:100*(b.median/a.median-1),rateRangesOverlap:b.minimum<=a.maximum&&a.minimum<=b.maximum};
}
report.qualityVerdict=report.qualityFloorPassed?"No measured quality loss on this frozen corpus and budgets":"Predeclared quality floor failed";
report.rateVerdict=Object.values(report.groups).every(g=>g.rateRangesOverlap)?"No measurable warm rate improvement; all five-round ranges overlap":"Requires independent interpretation";
console.log(JSON.stringify(report,null,2));
