import assert from "node:assert/strict";
import {readFileSync,writeFileSync,mkdirSync,createReadStream} from "node:fs";
import {createHash} from "node:crypto";
import {resolve} from "node:path";
import {Engine} from "../apps/engine.mjs";
import {apply,solved} from "../apps/model.mjs";
import Cubie from "../build/cubie.mjs";
import {faceletsOf} from "../tests/support.mjs";

const cache=resolve(".cache/joint/phase1-v1.raw"),binary=resolve("build/rubend-advanced"),build=JSON.parse(readFileSync(`${binary}.json`,"utf8"));
assert.equal(createHash("sha256").update(readFileSync(binary)).digest("hex"),build.binarySha256);
const hash=createHash("sha256");for await(const chunk of createReadStream(cache))hash.update(chunk);
assert.equal(hash.digest("hex"),"2ccfd40fdc0cf4769c58d9646f6b0ea787571ce5200b5d124c8f17dcc70f73b5");
process.env.RUBEND_JOINT_CACHE=cache;
const started=performance.now(),engine=new Engine({binary}),records=[],result={format:"rubend-advanced-profile-v1",build,cacheSha256:"2ccfd40fdc0cf4769c58d9646f6b0ea787571ce5200b5d124c8f17dcc70f73b5",passed:false,records};
async function solve(id,facelets,mode,budgetMs,expected=null){
  const events=[];
  await new Promise(async(resolveJob,reject)=>{try{await engine.solve({facelets,mode,budgetMs},event=>{events.push(event);if(event.type==="error")reject(Error(event.message));if(event.type==="done")resolveJob();});}catch(e){reject(e);}});
  const answers=events.filter(e=>e.type==="candidate"),best=answers.at(-1),done=events.at(-1);
  assert.ok(best,`${id}: no answer`);assert.equal(apply(facelets,best.moves),solved);
  if(expected!==null){assert.equal(best.length,expected,id);assert.equal(done.optimal,1,id);assert.equal(done.lower,expected,id);}
  const record={id,facelets,mode,budgetMs,firstMs:answers[0].elapsedMs,firstLength:answers[0].length,length:best.length,lower:done.lower,optimal:Boolean(done.optimal),nodes:done.nodes,moves:best.moves};
  records.push(record);if(expected===null)console.log(JSON.stringify(record));
}
try{
  await engine.ready(120000);result.initializationMs=Math.round(performance.now()-started);
  const exact=JSON.parse(readFileSync("docs/verification/portfolio-v1/exact.json","utf8"));
  for(const [index,item] of exact.records.entries())await solve(`shallow-${index}`,item.facelets,"exact",1000,item.depth);
  console.log(JSON.stringify({shallowOptima:exact.records.length,initializationMs:result.initializationMs}));
  const corpus=JSON.parse(readFileSync("docs/verification/portfolio-v1/comparison.json","utf8"));
  for(const item of corpus.records)await solve(`release-${item.id}`,item.facelets,"fast",1000);
  const diagnostic=JSON.parse(readFileSync("docs/verification/portfolio-v1/exact-profile.json","utf8"));
  for(const item of diagnostic.records)await solve(`exact-${item.id}`,item.facelets,"exact",2000);
  await solve("superflip",faceletsOf({...Cubie.solved(),eo:4095}),"exact",5000);
  const fast=records.filter(r=>r.mode==="fast"),times=fast.map(r=>r.firstMs).sort((a,b)=>a-b);
  result.summary={fastCases:fast.length,meanFirstLength:fast.reduce((s,r)=>s+r.firstLength,0)/fast.length,meanBestLength:fast.reduce((s,r)=>s+r.length,0)/fast.length,p95FirstMs:times[Math.ceil(times.length*.95)-1]};
  result.passed=true;console.log(JSON.stringify(result.summary));
}finally{await engine.close();mkdirSync("build/evidence",{recursive:true});writeFileSync("build/evidence/advanced-profile.json",JSON.stringify(result,null,2)+"\n");}
