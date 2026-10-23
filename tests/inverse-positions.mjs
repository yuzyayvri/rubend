import assert from "node:assert/strict";
import {writeFileSync} from "node:fs";
import {resolve} from "node:path";
import {pathToFileURL} from "node:url";
import {array,list} from "../apps/model.mjs";
import Cubie from "../build/cubie.mjs";
import {randomSource,nib} from "./support.mjs";

assert.equal(process.argv.length,6);const [P,...bad]=await Promise.all(process.argv.slice(2,5).map(async p=>(await import(pathToFileURL(resolve(p)))).default)),random=randomSource("rubend-inverse-positions-v1"),mutations=bad.map(()=>null);let roots=0,lookups=0,rawLookups=0;
for(let i=0;i<1024;i++){
  const word=Array.from({length:i%97},()=>random(18));let cube=Cubie.solved();for(const move of word)cube=Cubie.turn(move,cube);const inv=Cubie.inverse(cube),expected=[...Array.from({length:8},(_,q)=>nib(inv.cp,q)),...Array.from({length:12},(_,q)=>nib(q<8?inv.ep:inv.eh,q%8))],actual=array(P.test_actual(list(word)));assert.deepEqual(actual,array(P.test_expected(list(word))));assert.deepEqual(actual,expected);roots++;lookups+=20;
  for(let j=0;j<bad.length;j++)if(!mutations[j]){const observed=array(bad[j].test_actual(list(word)));if(JSON.stringify(observed)!==JSON.stringify(expected))mutations[j]={word,expected,observed};}
}
const vectors=[[0,0,0],[0xffffffff,0xffffffff,0xffffffff],[0x76543210,0x76543210,0xba98]];for(let i=0;i<1000;i++)vectors.push(Array.from({length:3},()=>random(0x100000000)));
for(const [cp,ep,eh]of vectors){const expected=[];for(const [count,words]of [[8,[cp]],[12,[ep,eh]]])for(let q=0;q<count;q++){let sum=0;for(let r=0;r<count;r++)if(nib(words[Math.floor(r/8)],r%8)===q)sum+=r;expected.push(sum);}assert.deepEqual(array(P.test_raw(cp,ep,eh)),expected);rawLookups+=20;}
assert.ok(mutations.every(Boolean),"Both actual position-sum corruptions must have counterexamples");writeFileSync(resolve(process.argv[5]),JSON.stringify({passed:true,seed:"rubend-inverse-positions-v1",roots,lookups,rawVectors:vectors.length,rawLookups,mutations,sampleEvidenceOnly:true,fullPackedInverseProved:false,validatedInputReachabilityProved:false,loadedAdmissibilityProved:false,independentReview:false})+"\n",{flag:"wx"});console.log(JSON.stringify({passed:true,roots,lookups,rawLookups,actualMutantsRejected:mutations.length}));
