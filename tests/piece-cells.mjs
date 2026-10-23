import assert from "node:assert/strict";
import {readFileSync,writeFileSync} from "node:fs";
import {pathToFileURL} from "node:url";
import {resolve} from "node:path";
import {encode,apply,array} from "../apps/model.mjs";
import {randomCube,randomSource,nib,faceletsOf} from "./support.mjs";

assert.equal(process.argv.length,5);
const P=(await import(pathToFileURL(resolve(process.argv[2])))).default,W=(await import(pathToFileURL(resolve(process.argv[3])))).default,random=randomSource("rubend-piece-cells-v1"),packedIndices=c=>[...Array.from({length:8},(_,i)=>3*nib(c.cp,i)+((c.co>>>(2*i))&3)),...Array.from({length:12},(_,i)=>2*nib(i<8?c.ep:c.eh,i%8)+((c.eo>>>i)&1))];
const manifest=JSON.parse(readFileSync("bench/piece-cells.manifest.json","utf8"));assert.equal(manifest.kinds.length,2);
const samples=[...Array.from({length:1000},()=>({indices:Array.from({length:20},()=>random(24)),legal:false})),...Array.from({length:1000},()=>{const c=randomCube(random);return{indices:packedIndices(c),legal:true,expected:faceletsOf(c)};})];
let comparisons=0,legalViews=0,mutation=null;
for(const sample of samples){
  assert.ok(sample.indices.every(i=>Number.isInteger(i)&&i>=0&&i<24));
  const facelets=encode(P.test_facelets(...sample.indices));if(sample.legal){assert.equal(facelets,sample.expected);legalViews++;}
  for(let move=0;move<18;move++){
    const expected=apply(facelets,[move]),actual=encode(P.test_turn(move,...sample.indices));assert.equal(actual,expected);comparisons++;
    const next=array(P.test_indices(move,...sample.indices));assert.equal(next.length,20);assert.ok(next.every(i=>Number.isInteger(i)&&i>=0&&i<24));assert.equal(encode(P.test_facelets(...next)),expected);
    if(!mutation){const wrong=encode(W.test_turn(move,...sample.indices));if(wrong!==expected)mutation={indices:sample.indices,move,expected,observed:wrong};}
  }
}
assert.ok(mutation,"The actual wrong-rotation module must disagree with the reference");
writeFileSync(resolve(process.argv[4]),JSON.stringify({passed:true,seed:"rubend-piece-cells-v1",typedSamples:2000,legalViews,moveComparisons:comparisons,indexRoundtrips:comparisons,mutation,wholeStateRefinementProved:false,packedRefinementProved:false,inverseReconstructionProved:false,independentReview:false})+"\n",{flag:"wx"});
console.log(JSON.stringify({passed:true,typedSamples:2000,legalViews,moveComparisons:comparisons,actualWrongRotationCounterexample:true}));
