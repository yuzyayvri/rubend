import assert from "node:assert/strict";
import {readFileSync,writeFileSync,mkdirSync} from "node:fs";
import {resolve} from "node:path";
import {pathToFileURL} from "node:url";
import {array,decode,moveNames} from "../apps/model.mjs";
import {solveRecord} from "../apps/export.mjs";
import {refineSolution} from "../apps/solve-state.mjs";
import {apply,solved} from "../bench/fixed-work-model.mjs";

assert.equal(process.argv.length,5);
const [referencePath,directory,output]=process.argv.slice(2).map(p=>resolve(p));
const R=(await import(pathToFileURL(referencePath))).default,rows=[];
const fields=["format","facelets","moves","htm","lowerBound","searchOptimal","replayCertified","mode","budgetMs","optimalityNote"].sort();
const note="Search-established status recorded by this run; this JSON is not a formal optimality proof.";
function checkRecord(record,solution){
  assert.equal(record.searchOptimal,solution.optimal,"A bounded answer was upgraded to search optimal");
  assert.equal(record.replayCertified,true);
  assert.deepEqual(Object.keys(record).sort(),fields,"Export acquired an unsupported proof field");
  assert.equal(record.optimalityNote,note,"Export lost its formal-proof limitation");
  assert.equal(apply(record.facelets,record.moves.map(m=>moveNames.indexOf(m))),solved);
  assert.equal(record.htm,solution.moves.length);
  assert.equal(record.lowerBound,solution.lower);
}
let queries=0,packetReplays=0;
for(let move=0;move<18;move++){
  const root=apply(solved,[move]);
  assert.notEqual(root,solved);
  for(let radius=0;radius<=2;radius++){
    const packet=array(R.test_search(radius,decode(root)));queries++;
    if(radius===0){assert.deepEqual(packet,[0]);continue;}
    assert.equal(packet[0],1);const moves=packet.slice(1);
    assert.ok(moves.length>=1&&moves.length<=radius);assert.equal(apply(root,moves),solved);packetReplays++;
    if(radius===1)assert.equal(moves.length,1);
    const solution={origin:root,moves,lower:1,optimal:moves.length===1},record=solveRecord(solution,{mode:"exact",budgetMs:1000});
    checkRecord(record,solution);rows.push({move,radius,knownOptimum:1,packet,record});
  }
}
const witness=rows.find(r=>r.move===0&&r.radius===2);
assert.deepEqual(witness.packet,[1,0,1]);assert.equal(witness.record.htm,2);assert.equal(witness.record.searchOptimal,false);
const supplied={origin:witness.record.facelets,moves:witness.packet.slice(1),lower:1,optimal:false};
const incomplete=refineSolution(supplied,{type:"done",lower:1,optimal:0});
checkRecord(solveRecord(incomplete),incomplete);
assert.throws(()=>refineSolution(supplied,{type:"done",lower:1,optimal:1}),/Optimality progress bound mismatch/);
assert.throws(()=>solveRecord({...supplied,optimal:true}),/Optimality bound mismatch/);
const unsolicited={...supplied,formallyCertifiedOptimal:true,formalOptimality:true,proof:{referencePassed:true}};
checkRecord(solveRecord(unsolicited,{formallyCertifiedOptimal:true}),supplied);
const source=readFileSync("apps/export.mjs","utf8").replace('from "./model.mjs"','from '+JSON.stringify(pathToFileURL(resolve("apps/model.mjs")).href));
const variants=[
  {name:"false-search-optimal",before:"searchOptimal:Boolean(solution.optimal)",after:"searchOptimal:true",diagnostic:/upgraded to search optimal/},
  {name:"unsupported-formal-field",before:"replayCertified:true",after:"replayCertified:true,formallyCertifiedOptimal:true",diagnostic:/unsupported proof field/},
  {name:"missing-proof-limitation",before:note,after:"Formal optimality certified.",diagnostic:/lost its formal-proof limitation/}
];
mkdirSync(directory,{recursive:true});const mutations=[];
for(const v of variants){
  assert.equal(source.split(v.before).length,2);const path=resolve(directory,v.name+".mjs");
  writeFileSync(path,source.replace(v.before,v.after),{flag:"wx"});
  const mutant=await import(pathToFileURL(path));let failure;
  try{checkRecord(mutant.solveRecord(supplied),supplied);}catch(error){failure=error;}
  assert.ok(failure instanceof assert.AssertionError,v.name);assert.match(failure.message,v.diagnostic);
  mutations.push({name:v.name,source:path,diagnostic:failure.message});
}
const result={passed:true,format:"rubend-reference-label-boundary-v1",queries,packetReplays,oneMoveRoots:18,rows,nonShortestWitness:witness,mutations,unsolicitedFormalFlagsNotSerialized:true,incompleteBoundMismatchRejected:true,sourceFaults:mutations.length,scope:"Actual generated reference packets and JavaScript export boundary only, not native traversal or universal application correctness",optimizedTraversalRefinementProved:false,formalApplicationLabelEnabled:false,productionChanged:false,performanceAcceptance:false,releaseHoldoutOpened:false,independentReview:false};
writeFileSync(output,JSON.stringify(result,null,2)+"\n",{flag:"wx"});
console.log(JSON.stringify({passed:true,queries,packetReplays,oneMoveRoots:18,sourceFaults:mutations.length,nonShortestWitness:witness.packet,productionChanged:false}));
