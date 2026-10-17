import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {createHash} from "node:crypto";
import {generateCorpora,loadCorpus} from "../bench/corpus.mjs";
import {validate} from "../apps/model.mjs";
import {randomSource,randomCube,faceletsOf,nib} from "./support.mjs";

const generated=generateCorpora(),all=new Set();
assert.equal(generated.corpora.reduce((n,c)=>n+c.count,0),11128);
const parity=xs=>xs.reduce((p,x,i)=>p^xs.slice(i+1).reduce((v,y)=>v^(x>y?1:0),0),0);
let legal=0;
for(const spec of generated.corpora){
  const cases=loadCorpus(spec.name);
  assert.equal(cases.length,spec.count);
  assert.equal(createHash("sha256").update(readFileSync(new URL("../bench/corpora/"+spec.file,import.meta.url))).digest("hex"),spec.sha256);
  for(const item of cases){assert.ok(!all.has(item.facelets));all.add(item.facelets);}
  if(spec.name==="release")continue;
  const random=randomSource(spec.seed);
  for(const item of cases){
    const cube=randomCube(random);
    assert.equal(faceletsOf(cube),item.facelets);
    assert.deepEqual(validate(item.facelets),cube);
    const cp=Array.from({length:8},(_,i)=>nib(cube.cp,i)),ep=Array.from({length:12},(_,i)=>nib(i<8?cube.ep:cube.eh,i%8));
    assert.deepEqual([...cp].sort((a,b)=>a-b),[0,1,2,3,4,5,6,7]);
    assert.deepEqual([...ep].sort((a,b)=>a-b),[0,1,2,3,4,5,6,7,8,9,10,11]);
    assert.equal(parity(cp),parity(ep));
    assert.equal(Array.from({length:8},(_,i)=>(cube.co>>>(i*2))&3).reduce((a,b)=>a+b,0)%3,0);
    assert.equal(Array.from({length:12},(_,i)=>(cube.eo>>>i)&1).reduce((a,b)=>a^b,0),0);
    legal++;
  }
}
assert.throws(()=>loadCorpus("unknown"));
console.log(JSON.stringify({passed:true,totalFrozen:all.size,developmentLegalStates:legal,releaseUsage:"Identity/count/disjointness checks only. No solver or strength evaluation."}));
