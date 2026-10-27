import assert from "node:assert/strict";
import {readFileSync,writeFileSync} from "node:fs";
import {resolve} from "node:path";
import {pathToFileURL} from "node:url";
import {array} from "../apps/model.mjs";
import {randomSource} from "./support.mjs";

assert.equal(process.argv.length,6);
const P=(await import(pathToFileURL(resolve(process.argv[2])))).default,E=(await import(pathToFileURL(resolve(process.argv[3])))).default,F=(await import(pathToFileURL(resolve(process.argv[4])))).default,manifest=JSON.parse(readFileSync("bench/piece-cells.manifest.json","utf8")),random=randomSource("rubend-packed-fields-v1"),randomWord=()=>random(65536)*65536+random(65536),tuples=[Array(5).fill(0),Array(5).fill(4294967295)];
for(let field=0;field<5;field++)for(let bit=0;bit<32;bit++){const tuple=Array(5).fill(0);tuple[field]=2**bit;tuples.push(tuple);}
for(let i=0;i<1000;i++)tuples.push(Array.from({length:5},randomWord));
let vectors=0,wordMutation=null,flipMutation=null;
for(const tuple of tuples)for(let move=0;move<18;move++){
  const [cp,co,ep,eh,eo]=tuple,cornerMap=manifest.kinds[0].maps[move],edgeMap=manifest.kinds[1].maps[move];let corner=0,low=0,high=0,orientation=0;
  for(let i=0;i<8;i++)corner=(corner|(((cp>>>(4*cornerMap[i].source))&15)<<(4*i)))>>>0;
  for(let i=0;i<12;i++){const {source,rotations}=edgeMap[i],piece=((source<8?ep:eh)>>>(4*(source%8)))&15;if(i<8)low=(low|(piece<<(4*i)))>>>0;else high=(high|(piece<<(4*(i-8))))>>>0;orientation=(orientation|((((eo>>>source)&1)^rotations)<<i))>>>0;}
  const expected=[corner,low,high,orientation],actual=array(P.test_fields(move,...tuple));assert.deepEqual(actual,expected);assert.equal(actual[2]>>>16,0);assert.equal(actual[3]>>>12,0);vectors++;
  if(!wordMutation){const observed=array(E.test_fields(move,...tuple));if(JSON.stringify(observed)!==JSON.stringify(expected))wordMutation={move,tuple,expected,observed};}
  if(!flipMutation){const observed=array(F.test_fields(move,...tuple));if(JSON.stringify(observed)!==JSON.stringify(expected))flipMutation={move,tuple,expected,observed};}
}
assert.ok(wordMutation&&flipMutation,"Both actual packed-field mutants must disagree");
writeFileSync(resolve(process.argv[5]),JSON.stringify({passed:true,seed:"rubend-packed-fields-v1",tuples:tuples.length,vectors,fieldComparisons:vectors*4,wordMutation,flipMutation,reservedHighBitsChecked:true,sampleEvidenceOnly:true,cornerOrientationProved:false,fullPackedRefinementProved:false,packedInverseProved:false,independentReview:false})+"\n",{flag:"wx"});console.log(JSON.stringify({passed:true,tuples:tuples.length,vectors,fieldComparisons:vectors*4,actualMutantsRejected:2}));
