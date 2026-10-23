import assert from "node:assert/strict";
import {writeFileSync} from "node:fs";
import {resolve} from "node:path";
import {pathToFileURL} from "node:url";
import Cubie from "../build/cubie.mjs";
import {randomSource,randomCube,nib} from "./support.mjs";

assert.equal(process.argv.length,7);
const [P,C,D,A]=await Promise.all(process.argv.slice(2,6).map(async p=>(await import(pathToFileURL(resolve(p)))).default)),random=randomSource("rubend-corner-orientation-v1"),samples=Array.from({length:1000},()=>({indices:Array.from({length:20},()=>random(24))}));
for(let i=0;i<1000;i++){const cube=randomCube(random);samples.push({cube,indices:[...Array.from({length:8},(_,j)=>3*nib(cube.cp,j)+((cube.co>>>(2*j))&3)),...Array.from({length:12},(_,j)=>2*nib(j<8?cube.ep:cube.eh,j%8)+((cube.eo>>>j)&1))]});}
let moveChecks=0,legacyChecks=0,deltaChecks=0,assemblyChecks=0;const mutations={move:null,delta:null,assembly:null};
for(const sample of samples)for(let move=0;move<18;move++){
  const expected=P.test_reference(move,...sample.indices),actual=P.test_actual(move,...sample.indices);assert.equal(actual,expected);assert.equal(actual>>>16,0);moveChecks++;
  if(sample.cube){assert.equal(actual,Cubie.turn(move,sample.cube).co);legacyChecks++;}
  if(!mutations.move){const observed=C.test_actual(move,...sample.indices);if(observed!==expected)mutations.move={move,indices:sample.indices,expected,observed};}
}
for(let state=0;state<24;state++)for(let delta=0;delta<3;delta++){
  const expected=(state%3+delta)%3;assert.equal(P.test_delta(delta,state),expected);deltaChecks++;
  if(!mutations.delta){const observed=D.test_delta(delta,state);if(observed!==expected)mutations.delta={state,delta,expected,observed};}
}
const small=[Array(8).fill(0),Array(8).fill(3)];for(let i=0;i<16;i++){const values=Array(8).fill(0);values[Math.floor(i/2)]=2**(i%2);small.push(values);}for(let i=0;i<1000;i++)small.push(Array.from({length:8},()=>random(4)));
for(const values of small){const expected=values.reduce((word,value,i)=>(word|(value<<(2*i)))>>>0,0);assert.equal(P.test_assemble(...values),expected);assemblyChecks++;if(!mutations.assembly){const observed=A.test_assemble(...values);if(observed!==expected)mutations.assembly={values,expected,observed};}}
assert.ok(Object.values(mutations).every(Boolean),"All actual orientation mutants must disagree");
writeFileSync(resolve(process.argv[6]),JSON.stringify({passed:true,seed:"rubend-corner-orientation-v1",states:samples.length,moveChecks,legacyChecks,deltaChecks,assemblyChecks,mutations,sampleEvidenceOnly:true,fullPackedMoveRefinementProved:false,packedInverseProved:false,independentReview:false})+"\n",{flag:"wx"});console.log(JSON.stringify({passed:true,moveChecks,legacyChecks,deltaChecks,assemblyChecks,actualMutantsRejected:3}));
