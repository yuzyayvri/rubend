import assert from "node:assert/strict";
import {readFileSync,writeFileSync} from "node:fs";
import {createHash} from "node:crypto";
import {apply,solved} from "../apps/model.mjs";

assert.ok(process.argv.length===2||(process.argv.length===3&&process.argv[2]==="--check"));
const seed=69127,count=16,length=24,seen=new Set(),cases=[];
let state=seed;
function random(){state^=state<<13;state^=state>>>17;state^=state<<5;return state>>>0;}
while(cases.length<count){
  const moves=[];let previous=6;
  while(moves.length<length){const face=random()%6;if(face===previous)continue;moves.push(face*3+1);previous=face;}
  const facelets=apply(solved,moves);if(facelets===solved||seen.has(facelets))continue;seen.add(facelets);
  cases.push({id:"half-turn-"+cases.length,facelets,moves});
}
const hash=p=>createHash("sha256").update(readFileSync(p)).digest("hex");
const report={format:"rubend-half-turn-stratum-v1",seed,count,length,sourceHashes:Object.fromEntries(["bench/corner-stratum.mjs","apps/model.mjs","build/model.mjs","build/cubie.mjs","build/notation.mjs"].map(p=>[p,hash(p)])),conditions:"A separately declared diagnostic subgroup, not a uniform strength corpus or known-optimum set. Fixed half-turn sequences, duplicate states excluded. No solver-selected cases.",cases};
const path="bench/corpora/half-turn-v1.json",text=JSON.stringify(report,null,2)+"\n";
if(process.argv[2]==="--check")assert.equal(readFileSync(path,"utf8"),text);else writeFileSync(path,text);
console.log(JSON.stringify({passed:true,halfTurnCases:count,check:process.argv[2]==="--check"}));
