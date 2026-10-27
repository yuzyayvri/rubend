import assert from "node:assert/strict";
import {writeFileSync} from "node:fs";
import {resolve} from "node:path";
import {pathToFileURL} from "node:url";

assert.equal(process.argv.length,4);
const M=(await import(pathToFileURL(resolve(process.argv[2])))).default,output=resolve(process.argv[3]),factorial=[1,1,2,6,24,120,720,5040,40320],words=[],classes=[];
for(let rank=0;rank<40320;rank++){
  let remainder=rank,parity=0,combination=0,selected=0,word=0;const available=[0,1,2,3,4,5,6,7],permutation=[];
  for(let position=0;position<8;position++){const digit=Math.floor(remainder/factorial[7-position]);remainder%=factorial[7-position];permutation.push(available.splice(digit,1)[0]);}
  for(let i=0;i<8;i++){word=(word|(permutation[i]<<(i*4)))>>>0;for(let j=i+1;j<8;j++)parity^=Number(permutation[i]>permutation[j]);if(permutation[i]<4){selected++;combination+=selected>i?0:factorial[i]/factorial[selected]/factorial[i-selected];}}
  words.push(word);classes.push(combination*2+parity);
}
function check(state){assert.equal(state.$,"Maps");assert.equal(state.words.length,65536);assert.equal(state.classes.length,65536);let sum=0;for(let i=0;i<40320;i++){assert.equal(state.words[i],words[i],"Packed fixture permutation mismatch");assert.equal(state.classes[i],classes[i],"Mapper class mismatch");sum=(Math.imul(sum,33)+classes[i])>>>0;}assert.equal(state.checksum,sum);return sum;}
const state=M.build(),initialChecksum=check(state),counterexamples=[];
for(const kind of["missing-parity","swapped-entries"]){const corrupt={...state,words:[...state.words],classes:[...state.classes]};if(kind==="missing-parity")corrupt.classes=corrupt.classes.map(x=>x&~1);else[corrupt.classes[0],corrupt.classes[1]]=[corrupt.classes[1],corrupt.classes[0]];assert.throws(()=>check(corrupt),/Mapper class mismatch/);const seed=kind==="missing-parity"?1:0,sample=M.test_mapped(1,corrupt.classes,seed),expected=(Math.imul(seed,1664525)+classes[seed])>>>0;assert.notEqual(sample.checksum,expected);counterexamples.push({kind,seed,steps:1,expected,observed:sample.checksum});}
function expected(steps,seed){let rank=seed%40320,sum=seed;for(let i=0;i<steps;i++){sum=(Math.imul(sum,1664525)+classes[rank])>>>0;rank=((Math.imul(rank,1664525)+sum+1013904223)>>>0)%40320;}return sum;}
let workChecks=0;
for(const seed of[0,1,7,40319,4294967295])for(const steps of[0,1,257])for(const mode of["direct","mapped"]){const sample=M["test_"+mode](steps,[...(mode==="direct"?state.words:state.classes)],seed);assert.equal(sample.steps,steps);assert.equal(sample.checksum,expected(steps,seed));workChecks++;}
const runtimeSeed=20261024,nativeExpectations=Array.from({length:5},(_,cohort)=>{const seed=(runtimeSeed+cohort*97)>>>0;return{cohort,seed,steps:1000000,checksum:expected(1000000,seed)};});
writeFileSync(output,JSON.stringify({passed:true,format:"rubend-phase2-mapper-oracle-v1",entries:40320,capacity:65536,initialChecksum,workChecks,counterexamples,runtimeSeed,nativeExpectations,oracle:"Independent available-list permutation decode, colex rank and inversion parity",distanceTableGenerated:false,productionIntegrated:false,newDomainLaw:false,performanceAcceptance:false,independentReview:false},null,2)+"\n",{flag:"wx"});console.log(JSON.stringify({passed:true,entries:40320,workChecks,counterexamples:counterexamples.length}));
