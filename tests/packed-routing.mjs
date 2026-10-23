import assert from "node:assert/strict";
import {readFileSync,writeFileSync} from "node:fs";
import {resolve} from "node:path";
import {pathToFileURL} from "node:url";
import {randomSource} from "./support.mjs";

assert.equal(process.argv.length,5);
const P=(await import(pathToFileURL(resolve(process.argv[2])))).default,W=(await import(pathToFileURL(resolve(process.argv[3])))).default,manifest=JSON.parse(readFileSync("bench/piece-cells.manifest.json","utf8")),random=randomSource("rubend-packed-corner-routing-v1"),words=[0,4294967295,...Array.from({length:32},(_,i)=>(2**i)>>>0),...Array.from({length:1000},()=>random(65536)*65536+random(65536))];
let checks=0,mutation=null;
for(const cp of words)for(let move=0;move<18;move++){
  const map=manifest.kinds[0].maps[move];let expected=0;for(let i=0;i<8;i++)expected=(expected|(((cp>>>(4*map[i].source))&15)<<(4*i)))>>>0;
  assert.equal(P.test_corner(move,cp),expected);checks++;
  if(!mutation){const observed=W.test_corner(move,cp);if(observed!==expected)mutation={move,cp,expected,observed};}
}
assert.ok(mutation,"The actual wrong packed nibble route must disagree");
writeFileSync(resolve(process.argv[4]),JSON.stringify({passed:true,seed:"rubend-packed-corner-routing-v1",words:words.length,moves:18,checks,mutation,sampleEvidenceOnly:true,cornerOrientationProved:false,otherPackedFieldsProved:false,packedInverseProved:false,independentReview:false})+"\n",{flag:"wx"});console.log(JSON.stringify({passed:true,words:words.length,checks,actualPackedMutationRejected:true}));
