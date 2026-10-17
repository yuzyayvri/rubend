import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {apply,solved,validateRecords} from "../bench/fixed-work-model.mjs";

for(let face=0;face<6;face++){
  assert.equal(apply(solved,[face*3,face*3,face*3,face*3]),solved);
  assert.equal(apply(solved,[face*3,face*3+2]),solved);
  assert.equal(apply(solved,[face*3,face*3]),apply(solved,[face*3+1]));
}
assert.equal(apply(solved,[3]),"UUFUUFUUFRRRRRRRRRFFDFFDFFDDDBDDBDDBLLLLLLLLLUBBUBBUBB");
const corpus=JSON.parse(readFileSync(new URL("../bench/fixed-work-cases.json",import.meta.url),"utf8"));
assert.equal(corpus.cases.length,7);
assert.equal(corpus.cases.at(-1).facelets,"UBULURUFURURFRBRDRFUFLFRFDFDFDLDRDBDLULBLFLDLBUBRBLBDB");
const entry={id:"unit",facelets:apply(solved,[3]),request:2,depth:1};
const initial={type:"snapshot",id:"unit",request:2,slice:0,nodes:0,moves:[],length:31,lower:0,status:0,state:[[1,2,3,4,5],2,[]]};
const candidate={type:"candidate",moves:[5],length:1,lower:1,nodes:42,optimal:1};
const final={...initial,slice:1,nodes:42,moves:[5],length:1,lower:1,status:1};
const records=[initial,candidate,final];
assert.deepEqual(validateRecords(records,[entry],1).counts,{snapshots:2,candidates:1,nodes:42});
const reject=change=>{const changed=structuredClone(records);change(changed);assert.throws(()=>validateRecords(changed,[entry],1));};
reject(xs=>{xs[1].moves=[3];xs[2].moves=[3];});
reject(xs=>{xs[2].nodes=60001;});
reject(xs=>{xs[2].id="other";});
reject(xs=>{xs[2].slice=2;});
reject(xs=>{xs[2].request=0;});
reject(xs=>{xs[2].status=4;});
reject(xs=>{xs[2].lower=2;});
reject(xs=>{xs.pop();});
reject(xs=>{xs.push(final);});
reject(xs=>{xs.splice(1,1);});
reject(xs=>{xs[2].state=[];});
reject(xs=>{xs[1].optimal=0;});
reject(xs=>{xs[1].length=2;});
reject(xs=>{xs[2].length=2;xs[1].length=2;});
reject(xs=>{xs[2].nodes=-1;});
assert.throws(()=>apply(solved,[18]));
assert.throws(()=>apply("invalid",[]));
console.log("Fixed-work model and transcript validation passed, including 17 rejected corruptions.");
