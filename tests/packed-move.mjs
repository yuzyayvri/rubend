import assert from "node:assert/strict";
import {writeFileSync} from "node:fs";
import {resolve} from "node:path";
import {pathToFileURL} from "node:url";
import {array,encode,list} from "../apps/model.mjs";
import Cubie from "../build/cubie.mjs";
import {randomSource,randomCube,nib,faceletsOf} from "./support.mjs";

assert.equal(process.argv.length,7);
const [P,...bad]=await Promise.all(process.argv.slice(2,6).map(async p=>(await import(pathToFileURL(resolve(p)))).default)),random=randomSource("rubend-packed-move-v1"),indices=c=>[...Array.from({length:8},(_,j)=>3*nib(c.cp,j)+((c.co>>>(2*j))&3)),...Array.from({length:12},(_,j)=>2*nib(j<8?c.ep:c.eh,j%8)+((c.eo>>>j)&1))],samples=Array.from({length:1000},()=>({indices:Array.from({length:20},()=>random(24))}));
for(let i=0;i<1000;i++){const cube=randomCube(random);samples.push({cube,indices:indices(cube)});}
let moveChecks=0,legacyChecks=0,viewChecks=0,replayChecks=0,legacyReplayChecks=0;const mutations=bad.map(()=>null),words=c=>[c.cp,c.co,c.ep,c.eh,c.eo];
for(const sample of samples)for(let move=0;move<18;move++){
  const actual=array(P.test_actual(move,...sample.indices)),expected=array(P.test_reference(move,...sample.indices));assert.deepEqual(actual,expected);moveChecks++;assert.equal(actual[1]>>>16,0);assert.equal(actual[3]>>>16,0);assert.equal(actual[4]>>>12,0);
  if(sample.cube){const legacy=Cubie.turn(move,sample.cube);assert.deepEqual(actual,words(legacy));legacyChecks++;if(move%3===0){assert.equal(encode(P.test_view(move,...sample.indices)),faceletsOf(legacy));assert.equal(encode(P.test_view(move,...sample.indices)),encode(P.test_reference_view(move,...sample.indices)));viewChecks++;}}
  for(let i=0;i<bad.length;i++)if(!mutations[i]){const observed=array(bad[i].test_actual(move,...sample.indices));if(JSON.stringify(observed)!==JSON.stringify(expected))mutations[i]={move,indices:sample.indices,expected,observed};}
}
for(let i=0;i<256;i++){
  const sample=samples[i%2?1000+i:i],word=Array.from({length:i%65},()=>random(18)),actual=array(P.test_replay(list(word),...sample.indices)),expected=array(P.test_reference_replay(list(word),...sample.indices));assert.deepEqual(actual,expected);replayChecks++;
  if(sample.cube){let cube=sample.cube;for(const move of word)cube=Cubie.turn(move,cube);assert.deepEqual(actual,words(cube));legacyReplayChecks++;}
}
assert.ok(mutations.every(Boolean),"Every actual packed-move mutant must disagree");
writeFileSync(resolve(process.argv[6]),JSON.stringify({passed:true,seed:"rubend-packed-move-v1",states:samples.length,moveChecks,legacyChecks,viewChecks,replayChecks,legacyReplayChecks,mutations,sampleEvidenceOnly:true,packedInverseProved:false,validatedInputReachabilityProved:false,loadedAdmissibilityProved:false,independentReview:false})+"\n",{flag:"wx"});
console.log(JSON.stringify({passed:true,moveChecks,legacyChecks,viewChecks,replayChecks,actualMutantsRejected:mutations.length}));
