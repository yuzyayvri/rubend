import assert from "node:assert/strict";
import {writeFileSync} from "node:fs";
import {resolve} from "node:path";
import {pathToFileURL} from "node:url";
import {array,list} from "../apps/model.mjs";
import Cubie from "../build/cubie.mjs";
import {randomSource} from "./support.mjs";

assert.equal(process.argv.length,9);const [P,S,...bad]=await Promise.all(process.argv.slice(2,8).map(async p=>(await import(pathToFileURL(resolve(p)))).default)),random=randomSource("rubend-packed-inverse-v1"),words=c=>[c.cp,c.co,c.ep,c.eh,c.eo],mutations=bad.map(()=>null);let roots=0,wordChecks=0,rawChecks=0;
for(let i=0;i<1024;i++){
  const word=Array.from({length:i%97},()=>random(18));let cube=Cubie.solved();for(const move of word)cube=Cubie.turn(move,cube);const expected=words(Cubie.inverse(cube)),actual=array(P.test_actual(list(word))),reference=array(P.test_expected(list(word)));assert.deepEqual(actual,reference);assert.deepEqual(actual,expected);assert.deepEqual(array(S.test_raw(...words(cube))),expected);roots++;wordChecks+=5;
  for(let j=0;j<bad.length;j++)if(!mutations[j]){const observed=array(j<3?bad[j].test_raw(...words(cube)):bad[j].test_expected(list(word)));if(JSON.stringify(observed)!==JSON.stringify(expected))mutations[j]={word,input:words(cube),expected,observed};}
}
for(let i=0;i<256;i++){const values=Array.from({length:5},()=>random(0x100000000)),cube={$:"Cubie",cp:values[0],co:values[1],ep:values[2],eh:values[3],eo:values[4]};assert.deepEqual(array(S.test_raw(...values)),words(Cubie.inverse(cube)));rawChecks+=5;}
assert.ok(mutations.every(Boolean),"All three actual inverse corruptions and the wrong-root claim must disagree");writeFileSync(resolve(process.argv[8]),JSON.stringify({passed:true,seed:"rubend-packed-inverse-v1",roots,wordChecks,rawVectors:256,rawChecks,mutations,sampleEvidenceOnly:true,validatedInputReachabilityProved:false,loadedAdmissibilityProved:false,independentReview:false})+"\n",{flag:"wx"});console.log(JSON.stringify({passed:true,roots,wordChecks,rawChecks,actualMutantsRejected:mutations.length}));
