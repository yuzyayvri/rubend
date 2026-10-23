import assert from "node:assert/strict";

const finite=value=>assert.ok(Number.isFinite(value)&&value>=0);
const count=value=>assert.ok(Number.isSafeInteger(value)&&value>=0);
function distribution(values){const a=[...values].sort((a,b)=>a-b);return{count:a.length,minimum:a[0]??null,median:a.length?a[Math.floor(a.length/2)]:null,p95:a.length?a[Math.ceil(a.length*.95)-1]:null,maximum:a.at(-1)??null};}

export function checkRenderSamples(record,spec){
  assert.equal(record.cohorts.length,spec.cohorts);let canonicalChecks=0;
  for(let i=0;i<spec.cohorts;i++){
    const row=record.cohorts[i];assert.equal(row.cohort,i);assert.deepEqual(row.phases.map(p=>p.name),["idle","orbit","playback","resize","set"]);
    for(const phase of row.phases){finite(phase.elapsedMs);count(phase.submissions);count(phase.hiddenSubmissions);assert.ok(phase.hiddenSubmissions<=phase.submissions);assert.ok(["visible","hidden"].includes(phase.visibilityStart));assert.ok(["visible","hidden"].includes(phase.visibilityEnd));assert.equal(phase.intervalsMs.length,Math.max(0,phase.submissions-1));phase.intervalsMs.forEach(finite);assert.equal(phase.renderCallMs.length,phase.submissions);phase.renderCallMs.forEach(finite);assert.ok(phase.visibilityTransitions.every(v=>["visible","hidden"].includes(v)));}
    assert.ok(row.phases[0].elapsedMs>=spec.idleMs-5);assert.ok(row.phases[1].elapsedMs>=spec.orbitMs-5);
    assert.equal(row.turns.length,spec.turns.length);for(let k=0;k<row.turns.length;k++){assert.equal(row.turns[k].move,spec.turns[k]);assert.equal(row.turns[k].canonicalColors,true);assert.equal(row.turns[k].animating,false);canonicalChecks++;}
    assert.equal(row.sets.length,spec.setUpdates);for(const update of row.sets){for(const key of["newMeshes","newGroups"])count(update[key]);assert.ok(update.newMeshes<=80);assert.ok(update.newGroups<=26);assert.equal(update.meshes,80);assert.equal(update.groups,26);assert.equal(update.canonicalColors,true);finite(update.elapsedMs);canonicalChecks++;}
  }
  assert.equal(record.initial.canonicalColors,true);assert.equal(record.initial.meshes,80);assert.equal(record.initial.groups,26);
  const phases=record.cohorts.flatMap(c=>c.phases),allVisible=phases.every(p=>p.visibilityStart==="visible"&&p.visibilityEnd==="visible"&&p.visibilityTransitions.every(v=>v==="visible")&&p.hiddenSubmissions===0),idle=record.cohorts.map(c=>c.phases[0]),idleActive=idle.every(p=>p.submissions>0),sets=record.cohorts.flatMap(c=>c.sets),summary={idleSubmissions:distribution(idle.map(p=>p.submissions)),idleElapsedMs:distribution(idle.map(p=>p.elapsedMs)),newMeshesPerSet:distribution(sets.map(s=>s.newMeshes)),newGroupsPerSet:distribution(sets.map(s=>s.newGroups)),setWallMs:distribution(sets.map(s=>s.elapsedMs)),activeSubmissionIntervalsMs:distribution(record.cohorts.flatMap(c=>c.phases.filter(p=>p.name!=="idle").flatMap(p=>p.intervalsMs))),renderCallWallMs:distribution(phases.flatMap(p=>p.renderCallMs))};
  return{allVisible,idleActive,canonicalChecks:canonicalChecks+1,summary};
}

export function checkRenderBaseline(record,spec){
  assert.equal(record.format,"rubend-render-baseline-v1");assert.deepEqual(record.spec,spec);assert.ok(Array.isArray(record.errors));assert.equal(record.errors.length,0,record.errors.join("\n"));
  assert.equal(record.previewHidden,true);assert.equal(record.productChanged,false);assert.equal(record.browserResourceLimitsEnforced,false);assert.equal(record.cleanedUp,true);
  const samples=record.skippedHiddenDocument?{allVisible:false,idleActive:false,canonicalChecks:0,summary:null}:checkRenderSamples(record,spec);
  if(record.skippedHiddenDocument){assert.equal(record.documentVisibilityAtStart,"hidden");assert.deepEqual(record.cohorts,[]);assert.equal(record.initial,null);}
  return{passed:true,...samples,disposition:!samples.allVisible?"inconclusive-document-hidden":!samples.idleActive?"no-continuous-idle-submissions-observed":"idle-render-opportunity-observed",baselineOnly:true,fullApplicationVerified:false,cpuSpeedupMeasured:false,gpuCompletionMeasured:false,performanceAcceptance:false,independentReview:false};
}
