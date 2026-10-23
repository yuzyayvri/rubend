import assert from "node:assert/strict";
import {writeFileSync} from "node:fs";
import {resolve} from "node:path";
import {pathToFileURL} from "node:url";
import {array,encode} from "../apps/model.mjs";
import {randomSource,randomCube,nib,faceletsOf} from "./support.mjs";

assert.equal(process.argv.length,7);
const modules=await Promise.all(process.argv.slice(2,6).map(async p=>(await import(pathToFileURL(resolve(p)))).default)),[P,...bad]=modules,random=randomSource("rubend-typed-packing-v1"),samples=Array.from({length:1000},()=>({indices:Array.from({length:20},()=>random(24))}));
for(let i=0;i<1000;i++){const c=randomCube(random);samples.push({indices:[...Array.from({length:8},(_,j)=>3*nib(c.cp,j)+((c.co>>>(2*j))&3)),...Array.from({length:12},(_,j)=>2*nib(j<8?c.ep:c.eh,j%8)+((c.eo>>>j)&1))],legalView:faceletsOf(c)});}
const mutations=[null,null,null];let legalViews=0,componentChecks=0;
for(const sample of samples){
  const indices=sample.indices;assert.ok(indices.every(n=>Number.isInteger(n)&&n>=0&&n<24));const expected=[0,0,0,0,0];
  for(let i=0;i<8;i++){expected[0]=(expected[0]|(Math.floor(indices[i]/3)<<(4*i)))>>>0;expected[1]=(expected[1]|((indices[i]%3)<<(2*i)))>>>0;}
  for(let i=0;i<12;i++){const word=i<8?2:3;expected[word]=(expected[word]|(Math.floor(indices[i+8]/2)<<(4*(i%8))))>>>0;expected[4]=(expected[4]|((indices[i+8]%2)<<i))>>>0;}
  const actual=array(P.test_pack(...indices)),view=encode(P.test_view(...indices)),reference=encode(P.test_reference_view(...indices));assert.deepEqual(actual,expected);assert.equal(view,reference);assert.equal(actual[1]>>>16,0);assert.equal(actual[3]>>>16,0);assert.equal(actual[4]>>>12,0);
  for(let i=0;i<8;i++){assert.equal((actual[0]>>>(4*i))&15,Math.floor(indices[i]/3));assert.equal((actual[1]>>>(2*i))&3,indices[i]%3);componentChecks+=2;}
  for(let i=0;i<12;i++){assert.equal((actual[i<8?2:3]>>>(4*(i%8)))&15,Math.floor(indices[i+8]/2));assert.equal((actual[4]>>>i)&1,indices[i+8]%2);componentChecks+=2;}
  if(sample.legalView){assert.equal(view,sample.legalView);legalViews++;}
  for(let i=0;i<bad.length;i++)if(!mutations[i]){const words=array(bad[i].test_pack(...indices)),observed=encode(bad[i].test_view(...indices));if(JSON.stringify(words)!==JSON.stringify(expected)||observed!==reference)mutations[i]={indices,expectedWords:expected,observedWords:words,expectedView:reference,observedView:observed};}
}
assert.ok(mutations.every(Boolean),"All actual packing/view mutants must disagree");
writeFileSync(resolve(process.argv[6]),JSON.stringify({passed:true,seed:"rubend-typed-packing-v1",states:samples.length,componentChecks,legalViews,mutations,sampleEvidenceOnly:true,packedMoveRefinementProved:false,packedInverseProved:false,independentReview:false})+"\n",{flag:"wx"});console.log(JSON.stringify({passed:true,states:samples.length,componentChecks,legalViews,actualMutantsRejected:3}));
