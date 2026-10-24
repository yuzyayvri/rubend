import assert from "node:assert/strict";

export function summarizeFourConditional(rows,expectedByRoot,diameters){
  assert.deepEqual(diameters,[8,8]);const counts=Object.fromEntries(Object.keys(expectedByRoot).map(id=>[id,0])),seen=new Set(),policies=Object.fromEntries(["three-max","four-p0","four-p1","four-max"].map(name=>[name,{visits:0,hypotheticalCuts:0,byRadius:{},witnesses:[]}]));let eligible=0;
  for(const row of rows){
    assert.ok(Object.hasOwn(counts,row.id),"Unknown conditional root");assert.equal(row.goal,"FullCube");for(const value of[row.nodes,row.left,row.length,row.contour])assert.ok(Number.isSafeInteger(value)&&value>=0);assert.ok(row.left>0&&row.length>0);assert.equal(row.left+row.length,row.contour,"Conditional remaining-radius mismatch");
    const key=row.id+"/"+row.nodes;assert.equal(seen.has(key),false,"Duplicate conditional entry");seen.add(key);counts[row.id]++;assert.equal(row.exact3.length,2);assert.equal(row.exact4.length,2);
    for(let p=0;p<2;p++){assert.ok(Number.isInteger(row.exact3[p])&&row.exact3[p]>=0&&row.exact3[p]<=6);assert.ok(Number.isInteger(row.exact4[p])&&row.exact4[p]>=row.exact3[p]&&row.exact4[p]<=diameters[p],"Invalid nested four-edge estimate");}
    if(row.left<Math.max(...diameters))eligible++;
    const estimates={"three-max":Math.max(...row.exact3),"four-p0":row.exact4[0],"four-p1":row.exact4[1],"four-max":Math.max(...row.exact4)};
    for(const[name,estimate]of Object.entries(estimates)){const total=policies[name],radius=total.byRadius[row.left]??={visits:0,hypotheticalCuts:0};total.visits++;radius.visits++;if(estimate>row.left){total.hypotheticalCuts++;radius.hypotheticalCuts++;if(total.witnesses.length<8)total.witnesses.push({id:row.id,nodes:row.nodes,left:row.left,length:row.length,contour:row.contour,estimate});}}
  }
  assert.deepEqual(counts,expectedByRoot,"Conditional entry accounting mismatch");const radii=Object.keys(policies["four-max"].byRadius).map(Number);assert.ok(policies["four-max"].hypotheticalCuts>=policies["three-max"].hypotheticalCuts);
  return{visits:seen.size,byRoot:counts,policies,marginalHypotheticalCuts:policies["four-max"].hypotheticalCuts-policies["three-max"].hypotheticalCuts,rangeEligibleVisits:eligible,remainingRadiusRange:radii.length?{minimum:Math.min(...radii),maximum:Math.max(...radii)}:null,informationVerdict:eligible?"exploratory-range-supported":"inconclusive-range-mismatch",combination:"maximum, never sum",hypotheticalOnly:true,savedSubtreeWorkMeasured:false,nativeProbeCostMeasured:false,cpuSavingsMeasured:false,performanceAcceptance:false};
}
