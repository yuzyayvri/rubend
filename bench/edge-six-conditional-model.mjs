import assert from "node:assert/strict";

function unionLength(intervals){
  intervals.sort((a,b)=>a[0]-b[0]||a[1]-b[1]);
  let total=0,start=0,end=0;
  for(const [a,b]of intervals){if(a>end){total+=end-start;start=a;end=b;}else end=Math.max(end,b);}
  return total+end-start;
}

export function summarizeSixConditional(rows,expectedByRoot,workLimits=null){
  const counts=Object.fromEntries(Object.keys(expectedByRoot).map(id=>[id,0])),seen=new Set(),names=["three-max","four-max","six-p0","six-p1","six-max","four-plus-p0","four-plus-p1"],policies=Object.fromEntries(names.map(name=>[name,{visits:0,hypotheticalCuts:0,byRadius:{},byRoot:Object.fromEntries(Object.keys(counts).map(id=>[id,0])),completedCutEntries:0,censoredCutEntries:0,spanUnavailableCutEntries:0,intervals:Object.fromEntries(Object.keys(counts).map(id=>[id,[]])),witnesses:[]}]));
  let rangeEligibleVisits=0;
  for(const row of rows){
    assert.ok(Object.hasOwn(counts,row.id));assert.equal(row.goal,"FullCube");
    for(const value of [row.nodes,row.left,row.length,row.contour])assert.ok(Number.isSafeInteger(value)&&value>=0);
    assert.ok(row.left>0&&row.length>0);assert.equal(row.left+row.length,row.contour);
    const key=row.id+"/"+row.nodes;assert.equal(seen.has(key),false);seen.add(key);counts[row.id]++;
    for(const name of ["exact3","exact4","exact6"])assert.equal(row[name].length,2);
    for(let p=0;p<2;p++){
      for(const [name,limit]of [["exact3",6],["exact4",8],["exact6",10]])assert.ok(Number.isInteger(row[name][p])&&row[name][p]>=0&&row[name][p]<=limit);
      assert.ok(row.exact3[p]<=row.exact4[p]&&row.exact4[p]<=row.exact6[p]);
    }
    if(row.span!==null){assert.ok(workLimits&&Object.hasOwn(workLimits,row.id));assert.ok(Number.isSafeInteger(row.span.end)&&row.span.end>row.nodes&&row.span.end<=workLimits[row.id]);assert.equal(typeof row.span.censored,"boolean");if(row.span.censored)assert.equal(row.span.end,workLimits[row.id]);}
    if(row.left<10)rangeEligibleVisits++;
    const old=Math.max(...row.exact4),estimates={"three-max":Math.max(...row.exact3),"four-max":old,"six-p0":row.exact6[0],"six-p1":row.exact6[1],"six-max":Math.max(...row.exact6),"four-plus-p0":Math.max(old,row.exact6[0]),"four-plus-p1":Math.max(old,row.exact6[1])};
    for(const [name,estimate]of Object.entries(estimates)){
      const p=policies[name],r=p.byRadius[row.left]??={visits:0,hypotheticalCuts:0};p.visits++;r.visits++;
      if(estimate<=row.left)continue;
      p.hypotheticalCuts++;r.hypotheticalCuts++;p.byRoot[row.id]++;
      if(row.span===null)p.spanUnavailableCutEntries++;
      else{p[row.span.censored?"censoredCutEntries":"completedCutEntries"]++;p.intervals[row.id].push([row.nodes,row.span.end]);}
      if(p.witnesses.length<8)p.witnesses.push({id:row.id,nodes:row.nodes,left:row.left,length:row.length,contour:row.contour,estimate,span:row.span});
    }
  }
  assert.deepEqual(counts,expectedByRoot);
  for(const p of Object.values(policies)){p.observedSpanUnionByRoot=Object.fromEntries(Object.entries(p.intervals).map(([id,intervals])=>[id,unionLength(intervals)]));p.observedSpanUnionSteps=Object.values(p.observedSpanUnionByRoot).reduce((a,b)=>a+b,0);delete p.intervals;assert.equal(p.hypotheticalCuts,p.completedCutEntries+p.censoredCutEntries+p.spanUnavailableCutEntries);}
  const marginalHypotheticalCuts=policies["six-max"].hypotheticalCuts-policies["four-max"].hypotheticalCuts;
  assert.ok(marginalHypotheticalCuts>=0);
  for(const name of ["four-plus-p0","four-plus-p1"])assert.ok(policies[name].hypotheticalCuts>=policies["four-max"].hypotheticalCuts&&policies[name].hypotheticalCuts<=policies["six-max"].hypotheticalCuts);
  return{visits:seen.size,byRoot:counts,policies,marginalHypotheticalCuts,rangeEligibleVisits,informationVerdict:rangeEligibleVisits?(marginalHypotheticalCuts?"additional-entry-information":"no-additional-entry-information-on-these-contexts"):"inconclusive-range-mismatch",combination:"maximum, never sum",observedSpanDefinition:"Union of recorded [entry step, exhaustion step + 1) intervals, clipped to work-limit for censored entries; not measured saved work or CPU",solverCpuSavingsMeasured:false,performanceAcceptance:false};
}
