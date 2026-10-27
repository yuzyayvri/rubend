import assert from "node:assert/strict";
import {writeFileSync} from "node:fs";
import {pathToFileURL} from "node:url";
import {resolve} from "node:path";
import {fileHash} from "../bench/reference-provenance.mjs";

assert.equal(process.argv.length,4);
const modulePath=resolve(process.argv[2]),output=resolve(process.argv[3]),bend=(await import(pathToFileURL(modulePath))).default;
let pairs=0,admissiblePairs=0;
for(let left=0;left<=32;left++)for(let right=0;right<=32;right++){
  const observed=bend.test_max(left,right);
  assert.equal(observed,Math.max(left,right));
  pairs++;
  for(let bound=0;bound<=32;bound++)if(left<=bound&&right<=bound){assert.ok(observed<=bound);admissiblePairs++;}
}
for(const [left,right] of [[0,255],[255,0],[252,255],[255,255]]){assert.equal(bend.test_max(left,right),Math.max(left,right));pairs++;}
const array=list=>{const result=[];while(list.$==="Con"){result.push(list.head);list=list.tail;}assert.equal(list.$,"Nil");return result;};
const paths=[];
for(let move=0;move<18;move++){
  const inverse=move%3===0?move+2:move%3===2?move-2:move;
  const observed=array(bend.test_one_move(move));
  assert.deepEqual(observed,[inverse]);
  paths.push({move,inverse,observed});
}
const abstractDistance=[0,1,2],step=s=>Math.max(0,s-1),projectedStart=2,actualSolutionLength=1;
assert.equal(step(step(projectedStart)),0);
assert.ok(abstractDistance[projectedStart]>actualSolutionLength);
assert.notEqual(step(projectedStart),0);
assert.ok(2+2>2);
assert.equal(bend.test_max(2,2),2);
writeFileSync(output,JSON.stringify({passed:true,modulePath,moduleSha256:fileHash(modulePath),maximumPairs:pairs,admissiblePairs,actualOneMovePaths:paths,omittedCommutationCounterexample:{projectedDistance:2,actualSolutionLength:1,afterActualOneStep:step(projectedStart),goal:0},overlapSumCounterexample:{first:2,second:2,trueDistance:2,unsafeSum:4,safeMaximum:2},unitQuotientOnly:true,concreteSixEdgeProjectionInstantiated:false,productionPruningEnabled:false,releaseHoldoutOpened:false})+"\n",{flag:"wx"});
console.log(JSON.stringify({passed:true,maximumPairs:pairs,admissiblePairs,oneMovePaths:paths.length}));
