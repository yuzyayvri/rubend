import assert from "node:assert/strict";
import {writeFileSync} from "node:fs";
import {resolve} from "node:path";
import {pathToFileURL} from "node:url";
import {array,list,inverse} from "../apps/model.mjs";
import Cubie from "../build/cubie.mjs";
import {randomSource} from "./support.mjs";

assert.equal(process.argv.length,6);
const [P,...bad]=await Promise.all(process.argv.slice(2,5).map(async p=>(await import(pathToFileURL(resolve(p)))).default)),random=randomSource("rubend-packed-replay-v1"),words=c=>[c.cp,c.co,c.ep,c.eh,c.eo],mutations=bad.map(()=>null),solved=words(Cubie.solved());let roots=0,cancellations=0,invertedSolutions=0;
for(let i=0;i<1024;i++){
  const scramble=Array.from({length:i%81},()=>random(18));let cube=Cubie.solved();for(const move of scramble)cube=Cubie.turn(move,cube);const expected=words(cube),inverseExpected=words(Cubie.inverse(cube));assert.deepEqual(array(P.test_root(list(scramble))),expected);assert.deepEqual(array(P.test_inverse_root(list(scramble))),inverseExpected);roots++;
  const word=Array.from({length:i%33},()=>random(18));assert.deepEqual(array(P.test_cancel(list(scramble),list(word))),expected);cancellations++;
  const solution=scramble.toReversed().map(inverse);for(let j=0;j<i%5;j++){const move=random(18);solution.push(move,inverse(move));}assert.deepEqual(array(P.test_inverted_solution(list(scramble),list(solution))),solved);invertedSolutions++;
  for(let j=0;j<bad.length;j++)if(!mutations[j]){const observedInverse=array(bad[j].test_inverse_root(list(scramble))),observedCancellation=array(bad[j].test_cancel(list(scramble),list(word)));if(JSON.stringify(observedInverse)!==JSON.stringify(inverseExpected)||JSON.stringify(observedCancellation)!==JSON.stringify(expected))mutations[j]={scramble,word,inverseExpected,observedInverse,expected,observedCancellation};}
}
assert.ok(mutations.every(Boolean),"Both inverse-word/root corruptions must have actual counterexamples");writeFileSync(resolve(process.argv[5]),JSON.stringify({passed:true,seed:"rubend-packed-replay-v1",roots,cancellations,invertedSolutions,mutations,sampleEvidenceOnly:true,packedInverseFunctionProved:false,validatedInputReachabilityProved:false,loadedAdmissibilityProved:false,independentReview:false})+"\n",{flag:"wx"});console.log(JSON.stringify({passed:true,roots,cancellations,invertedSolutions,actualMutantsRejected:mutations.length}));
