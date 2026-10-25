import assert from "node:assert/strict";

export const scalingOrder=cohort=>cohort%2?["double","single","single","double"]:["single","double","double","single"];
const median=xs=>{const sorted=[...xs].sort((a,b)=>a-b),n=sorted.length;return n%2?sorted[(n-1)/2]:(sorted[n/2-1]+sorted[n/2])/2;};
const spread=xs=>({count:xs.length,median:median(xs),minimum:Math.min(...xs),maximum:Math.max(...xs)});

export function summarizePartitionScaling(rows){
  assert.equal(rows.length,20);const seen=new Set(),noise=[],cohorts=[];
  for(let cohort=0;cohort<5;cohort++){
    const parts=rows.filter(r=>r.cohort===cohort).sort((a,b)=>a.position-b.position);assert.equal(parts.length,4);assert.deepEqual(parts.map(r=>r.mode),scalingOrder(cohort));
    for(const row of parts){assert.ok(row.mode==="single"||row.mode==="double");assert.equal(row.position,parts.indexOf(row));const key=row.cohort+"/"+row.position;assert.equal(seen.has(key),false);seen.add(key);assert.equal(row.jobs,1124);assert.equal(row.replays,5);assert.equal(row.semanticMatch,true);assert.equal(row.allWorkersGone,true);assert.equal(row.error,null);assert.equal(row.owners,row.mode==="single"?1:2);for(const k of ["nativeMakespanMs","wholeCommandWallMs","wholeCommandCpuMs","maximumChildRssKiB"])assert.ok(Number.isFinite(row[k])&&row[k]>=0);assert.ok(row.nativeMakespanMs>=100);assert.ok(row.wholeCommandWallMs+20>=row.nativeMakespanMs);assert.ok(row.wholeCommandCpuMs<=2*row.wholeCommandWallMs+50,"CPU exceeds the admitted two-lane wall envelope");}
    const values=Object.fromEntries(["single","double"].map(mode=>[mode,parts.filter(r=>r.mode===mode).map(r=>r.nativeMakespanMs)]));
    for(const mode of ["single","double"]){const [a,b]=values[mode],relative=Math.abs(a-b)/Math.min(a,b);noise.push({cohort,mode,relative});}
    cohorts.push({cohort,singleMs:median(values.single),doubleMs:median(values.double),singleOverDouble:median(values.single)/median(values.double)});
  }
  const sides=Object.fromEntries(["single","double"].map(mode=>{const values=rows.filter(r=>r.mode===mode);return[mode,{nativeMakespanMs:spread(values.map(r=>r.nativeMakespanMs)),wholeCommandCpuMs:spread(values.map(r=>r.wholeCommandCpuMs)),wholeCommandWallMs:spread(values.map(r=>r.wholeCommandWallMs)),maximumChildRssKiB:spread(values.map(r=>r.maximumChildRssKiB))}];})),stable=noise.every(r=>r.relative<=0.05),ratio=sides.single.nativeMakespanMs.median/sides.double.nativeMakespanMs.median,ratios=spread(cohorts.map(c=>c.singleOverDouble)),benefit=stable&&ratio>=1.10&&cohorts.every(c=>c.singleOverDouble>1),verdict=!stable?"inconclusive-duplicate-control-noise":benefit?"repeatable-process-cold-bounded-batch-benefit":"no-accepted-process-cold-bounded-batch-benefit";
  return{passed:true,cohorts,sides,duplicateControls:noise,duplicateControlsWithinFivePercent:stable,singleOverDoubleMedianRatio:ratio,cohortRatio:ratios,verdict,boundedBatchBenefitAccepted:benefit,wholeSolverSpeedupClaim:false,kernelSpeedupClaim:false,productionPromotion:false,cpuScope:"Whole coordinator command plus waited native owners and verification, not the makespan interval alone",memoryScope:"Maximum child RSS from GNU Time, not aggregate; diagnostic sampled aggregate owned RSS is separate",initializationIncluded:true,partialProbeRowsRetained:true};
}
