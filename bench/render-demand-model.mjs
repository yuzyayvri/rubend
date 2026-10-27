import assert from "node:assert/strict";
import {checkRenderSamples} from "./render-baseline-model.mjs";

const p95=a=>[...a].sort((x,y)=>x-y)[Math.ceil(a.length*.95)-1];
export function checkRenderDemand(record,spec){
  assert.equal(record.format,"rubend-render-demand-comparison-v1");assert.deepEqual(record.spec,spec);assert.deepEqual(record.errors,[]);assert.equal(record.cleanedUp,true);assert.equal(record.previewHidden,true);
  if(record.skippedHiddenDocument){assert.equal(record.documentVisibilityAtStart,"hidden");assert.deepEqual(record.samples,[]);return{passed:true,disposition:"inconclusive-document-hidden",performanceAcceptance:false,fullApplicationVerified:false};}
  assert.equal(record.samples.length,3*spec.cohorts);const arms={};
  for(const arm of spec.arms){const samples=record.samples.filter(s=>s.arm===arm).sort((a,b)=>a.cohort-b.cohort);assert.equal(samples.length,spec.cohorts);arms[arm]=checkRenderSamples({initial:samples[0].initial,cohorts:samples},spec);}
  const pairs=[];let paints=0,recoveries=0;
  for(const sample of record.samples){
    assert.equal(sample.initial.canonicalColors,true);assert.equal(sample.afterDisposeSubmissions,0);assert.ok(sample.paints.length>=spec.setUpdates+4);for(const paint of sample.paints){assert.ok(Number.isFinite(paint.ms)&&paint.ms>=0);assert.equal(paint.canonicalColors,true);paints++;}
    assert.equal(sample.recovery.lostObserved,true);assert.equal(sample.recovery.lostSubmissions,0);assert.equal(sample.recovery.restoredObserved,true);assert.equal(sample.recovery.canonicalColors,true);assert.equal(sample.reducedMotion.canonicalColors,true);assert.equal(sample.reducedMotion.animating,false);recoveries++;
    for(const set of sample.sets){assert.equal(set.newMeshes,80);assert.equal(set.newGroups,26);}
    if(sample.arm!=="control")continue;
    for(const arm of["aa","demand"]){const other=record.samples.find(s=>s.arm===arm&&s.cohort===sample.cohort);assert.ok(other);const a=sample.phases[0],b=other.phases[0],idleReduction=1-(b.submissions/b.elapsedMs)/(a.submissions/a.elapsedMs),active=["orbit","playback"].map(name=>{const x=sample.phases.find(p=>p.name===name),y=other.phases.find(p=>p.name===name);assert.ok(x.intervalsMs.length>5&&y.intervalsMs.length>5);return{name,p95Ratio:p95(y.intervalsMs)/p95(x.intervalsMs),rateRatio:(y.submissions/y.elapsedMs)/(x.submissions/x.elapsedMs)};});pairs.push({cohort:sample.cohort,arm,idleReduction,controlIdle:a.submissions,otherIdle:b.submissions,active});}
  }
  const visible=Object.values(arms).every(a=>a.allVisible),aaStable=pairs.filter(p=>p.arm==="aa").every(p=>p.active.every(a=>Math.max(a.p95Ratio,1/a.p95Ratio)<=spec.maximumActiveP95Ratio)),demand=pairs.filter(p=>p.arm==="demand"),idleFloor=demand.every(p=>p.idleReduction>=spec.minimumIdleReduction),activeFloor=demand.every(p=>p.active.every(a=>a.p95Ratio<=spec.maximumActiveP95Ratio&&a.rateRatio>=spec.minimumActiveRateRatio)),paintFloor=record.samples.filter(s=>s.arm==="demand").every(s=>s.paints.filter(p=>p.kind!=="restore").every(p=>p.ms<=spec.maximumPaintMs));
  return{passed:true,arms,pairs,paints,recoveries,visible,aaStable,idleFloor,activeFloor,paintFloor,disposition:!visible?"inconclusive-document-hidden":!idleFloor?"rejected-idle-floor":!aaStable?"inconclusive-active-control":!activeFloor?"rejected-active-cadence":!paintFloor?"rejected-repaint-latency":"confirmed-scene-idle-submissions-only",performanceAcceptance:false,fullApplicationVerified:false,cpuSpeedupMeasured:false,gpuCompletionMeasured:false,independentReview:false};
}
