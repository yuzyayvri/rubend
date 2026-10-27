import assert from "node:assert/strict";
import {scalingOrder,summarizePartitionScaling} from "../bench/partition-scaling-model.mjs";

const rows=Array.from({length:5},(_,cohort)=>scalingOrder(cohort).map((mode,position)=>({cohort,position,mode,jobs:1124,replays:5,semanticMatch:true,allWorkersGone:true,error:null,owners:mode==="single"?1:2,nativeMakespanMs:(mode==="single"?2200:1800)+position,wholeCommandWallMs:2500,wholeCommandCpuMs:mode==="single"?2300:4300,maximumChildRssKiB:2100000}))).flat(),good=summarizePartitionScaling(rows);
assert.equal(good.boundedBatchBenefitAccepted,true);assert.equal(good.sides.single.nativeMakespanMs.count,10);assert.equal(good.verdict,"repeatable-process-cold-bounded-batch-benefit");
const noisy=structuredClone(rows);noisy[3].nativeMakespanMs=2600;noisy[3].wholeCommandWallMs=2800;assert.equal(summarizePartitionScaling(noisy).verdict,"inconclusive-duplicate-control-noise");
const tied=rows.map(r=>({...r,nativeMakespanMs:2000+r.position}));assert.equal(summarizePartitionScaling(tied).boundedBatchBenefitAccepted,false);
const faults=[r=>r.pop(),r=>r[0].semanticMatch=false,r=>r[0].allWorkersGone=false,r=>r[0].jobs=1123,r=>r[0].replays=4,r=>r[0].owners=2,r=>r[0].wholeCommandCpuMs=9000,r=>r[0].error="timeout",r=>r[0].nativeMakespanMs=2,r=>r[0].mode="double"];
for(const edit of faults){const bad=structuredClone(rows);edit(bad);assert.throws(()=>summarizePartitionScaling(bad),assert.AssertionError);}
console.log(JSON.stringify({passed:true,recordControls:faults.length,noiseGate:true,tieGate:true,twentyFixedRuns:true,notWholeSolver:true}));
