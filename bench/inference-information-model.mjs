import assert from "node:assert/strict";

const subgroupMasks=[77463,239058,95418],allMoves=262143;
function vector(values){assert.equal(values.length,3);for(const v of values)assert.ok(Number.isInteger(v)&&v>=0&&v<=15);}
function exclusions(radius,values){return radius>0&&values.every(v=>v<15)?values.reduce((mask,v,i)=>mask|(v>=radius?subgroupMasks[i]:0),0):0;}
function population(bits){let count=0;for(let m=0;m<18;m++)count+=(bits>>>m)&1;return count;}
export function inferenceInformation({goal,radius,previous,forward,inverse}){
  assert.equal(goal,"FullCube");assert.ok(Number.isInteger(radius)&&radius>=0&&radius<=30);assert.ok(Number.isInteger(previous)&&previous>=0&&previous<6);vector(forward);vector(inverse);
  const finalMask=exclusions(radius,forward),firstMask=exclusions(radius,inverse),maximum=forward.every(v=>v<15)?Math.max(...forward):0,forwardLower=maximum+(exclusions(maximum,forward)===allMoves?1:0);
  let permittedMask=0;for(let m=0;m<18;m++){const face=Math.floor(m/3);if(face!==previous&&((face+3)%6!==previous||previous<face))permittedMask|=1<<m;}
  return{finalMask,firstMask,permittedMask,permittedMoves:population(permittedMask),hypotheticalFirstExclusions:population(permittedMask&firstMask),forwardLower,hypotheticalWholeEntryCut:finalMask===allMoves,inverseWholeEntryCut:firstMask===allMoves};
}

export function summarizeInference(rows,expectedByRoot,workLimits){
  const byRoot=Object.fromEntries(Object.keys(expectedByRoot).map(id=>[id,{entries:0,forwardCuts:0,inverseCuts:0,entriesWithFirstExclusions:0,permittedMoves:0,firstExclusions:0}])),byRadius={},seen=new Set(),intervals=Object.fromEntries(Object.keys(byRoot).map(id=>[id,[]]));let completedCuts=0,censoredCuts=0;
  for(const row of rows){
    assert.ok(Object.hasOwn(byRoot,row.id));assert.ok(Number.isInteger(row.nodes)&&row.nodes>=0&&row.nodes<workLimits[row.id]);assert.ok(Number.isInteger(row.length)&&row.length>0);assert.ok(row.radius>0);assert.equal(row.radius+row.length,row.contour);const key=row.id+"/"+row.nodes;assert.equal(seen.has(key),false);seen.add(key);assert.ok([...row.forward,...row.inverse].every(v=>v<=row.radius&&v<15));const value=inferenceInformation(row);assert.deepEqual(row.information,value);
    const r=byRoot[row.id],s=byRadius[row.radius]??={entries:0,forwardCuts:0,inverseCuts:0,entriesWithFirstExclusions:0,permittedMoves:0,firstExclusions:0};for(const entry of[r,s]){entry.entries++;entry.forwardCuts+=Number(value.hypotheticalWholeEntryCut);entry.inverseCuts+=Number(value.inverseWholeEntryCut);entry.entriesWithFirstExclusions+=Number(value.hypotheticalFirstExclusions>0);entry.permittedMoves+=value.permittedMoves;entry.firstExclusions+=value.hypotheticalFirstExclusions;}
    assert.ok(row.span&&typeof row.span.censored==="boolean");assert.ok(Number.isInteger(row.span.end)&&row.span.end>row.nodes&&row.span.end<=workLimits[row.id]);if(row.span.censored)assert.equal(row.span.end,workLimits[row.id]);if(value.hypotheticalWholeEntryCut||value.inverseWholeEntryCut){intervals[row.id].push([row.nodes,row.span.end]);if(row.span.censored)censoredCuts++;else completedCuts++;}
  }
  assert.deepEqual(Object.fromEntries(Object.entries(byRoot).map(([id,r])=>[id,r.entries])),expectedByRoot);
  const unionByRoot=Object.fromEntries(Object.entries(intervals).map(([id,spans])=>{spans.sort((a,b)=>a[0]-b[0]);let total=0,start=0,end=0;for(const[a,b]of spans){if(a>end){total+=end-start;start=a;end=b;}else end=Math.max(end,b);}return[id,total+end-start];})),total=Object.values(byRoot).reduce((sum,r)=>{for(const[k,v]of Object.entries(r))sum[k]=(sum[k]??0)+v;return sum;},{});
  return{...total,byRoot,byRadius,wholeEntryCutIntervals:{completedCuts,censoredCuts,observedUnionStepsByRoot:unionByRoot,observedUnionSteps:Object.values(unionByRoot).reduce((a,b)=>a+b,0)},firstExclusionsAreChildMoveOpportunitiesOnly:true,staticIntervalsNotSavedWork:true,solverCpuSavingsMeasured:false,performanceAcceptance:false};
}
