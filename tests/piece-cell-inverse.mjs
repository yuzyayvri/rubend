import assert from "node:assert/strict";
import {writeFileSync} from "node:fs";
import {resolve} from "node:path";
import {pathToFileURL} from "node:url";
import {list,array,apply,inverse,solved} from "../apps/model.mjs";
import {randomSource} from "./support.mjs";

assert.equal(process.argv.length,5);
const I=(await import(pathToFileURL(resolve(process.argv[2])))).default,W=(await import(pathToFileURL(resolve(process.argv[3])))).default,random=randomSource("rubend-piece-cell-inverse-v1");
let totalMoves=0;
for(let i=0;i<1000;i++){
  const word=Array.from({length:random(100)},()=>random(18)),actual=array(I.test_inverse(list(word))),expected=[...word].reverse().map(inverse);assert.deepEqual(actual,expected);assert.equal(apply(solved,[...word,...actual]),solved);totalMoves+=word.length;
}
const word=[0,3],expected=array(I.test_inverse(list(word))),observed=array(W.test_inverse(list(word)));assert.notDeepEqual(observed,expected);assert.notEqual(apply(solved,[...word,...observed]),solved);
writeFileSync(resolve(process.argv[4]),JSON.stringify({passed:true,seed:"rubend-piece-cell-inverse-v1",words:1000,totalMoves,mutation:{word,expected,observed,observedFacelets:apply(solved,[...word,...observed])},sampleEvidenceOnly:true,packedInverseProved:false,stateInverseBridgeProved:false,independentReview:false})+"\n",{flag:"wx"});
console.log(JSON.stringify({passed:true,words:1000,totalMoves,wrongOrderCounterexample:true}));
