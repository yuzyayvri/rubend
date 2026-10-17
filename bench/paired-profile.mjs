import assert from "node:assert/strict";
import {readFileSync,writeFileSync,mkdirSync,createReadStream} from "node:fs";
import {createHash} from "node:crypto";
import {resolve} from "node:path";
import {Engine} from "../apps/engine.mjs";
import {apply,solved} from "../apps/model.mjs";
import {inputs,digest} from "../scripts/manifest.mjs";

const build=JSON.parse(readFileSync("build/manifest.json","utf8")),advancedBuild=JSON.parse(readFileSync("build/rubend-advanced.json","utf8"));
assert.deepEqual(inputs(),build.sourceHashes);assert.equal(digest("build/rubend"),build.nativeSha256);assert.equal(digest("build/rubend-advanced"),advancedBuild.binarySha256);
const cache=resolve(".cache/joint/phase1-v1.raw"),hash=createHash("sha256");for await(const chunk of createReadStream(cache))hash.update(chunk);
const cacheSha256=hash.digest("hex");assert.equal(cacheSha256,"2ccfd40fdc0cf4769c58d9646f6b0ea787571ce5200b5d124c8f17dcc70f73b5");
process.env.RUBEND_JOINT_CACHE=cache;
const engines={},records=[],result={format:"rubend-paired-profile-v1",build,advancedBuild,cacheSha256,conditions:"Same one-core affinity and priority; same cases and 1-second budgets; alternating AB/BA case order; both receive the same 163 shallow warmup jobs. Initialization measured separately. Other desktop activity is uncontrolled. Not a world-class or independent optimality comparison.",initializationMs:{},records,passed:false};
async function job(engine,facelets,mode,budgetMs,expected){
  const events=[];await new Promise(async(resolveJob,reject)=>{try{await engine.solve({facelets,mode,budgetMs},e=>{events.push(e);if(e.type==="error")reject(Error(e.message));if(e.type==="done")resolveJob();});}catch(e){reject(e);}});
  const candidates=events.filter(e=>e.type==="candidate"),best=candidates.at(-1),done=events.at(-1);assert.ok(best);assert.equal(apply(facelets,best.moves),solved);
  if(expected!==undefined){assert.equal(best.length,expected);assert.equal(done.lower,expected);assert.equal(done.optimal,1);}
  return {firstMs:candidates[0].elapsedMs,firstLength:candidates[0].length,length:best.length,moves:best.moves,lower:done.lower,optimal:Boolean(done.optimal),nodes:done.nodes};
}
try{
  for(const profile of ["light","joint"]){const start=performance.now();engines[profile]=new Engine({binary:resolve(profile==="light"?"build/rubend":"build/rubend-advanced")});await engines[profile].ready(120000);result.initializationMs[profile]=Math.round(performance.now()-start);}
  const shallow=JSON.parse(readFileSync("docs/verification/portfolio-v1/exact.json","utf8"));
  for(const item of shallow.records)for(const profile of ["light","joint"])await job(engines[profile],item.facelets,"exact",1000,item.depth);
  const corpus=JSON.parse(readFileSync("docs/verification/portfolio-v1/comparison.json","utf8"));
  for(const [index,item] of corpus.records.entries()){
    const record={id:item.id,facelets:item.facelets,budgetMs:1000,order:index%2?["joint","light"]:["light","joint"]};
    for(const profile of record.order)record[profile]=await job(engines[profile],item.facelets,"fast",1000);
    records.push(record);console.log(JSON.stringify({id:item.id,light:record.light.length,joint:record.joint.length,lightFirstMs:record.light.firstMs,jointFirstMs:record.joint.firstMs}));
  }
  result.summary=Object.fromEntries(["light","joint"].map(profile=>{const times=records.map(r=>r[profile].firstMs).sort((a,b)=>a-b);return [profile,{cases:records.length,meanFirstLength:records.reduce((s,r)=>s+r[profile].firstLength,0)/records.length,meanBestLength:records.reduce((s,r)=>s+r[profile].length,0)/records.length,p95FirstMs:times[Math.ceil(.95*times.length)-1]}];}));
  result.paired={jointShorter:records.filter(r=>r.joint.length<r.light.length).length,tied:records.filter(r=>r.joint.length===r.light.length).length,lightShorter:records.filter(r=>r.light.length<r.joint.length).length};
  assert.deepEqual(inputs(),build.sourceHashes);assert.equal(digest("build/rubend-advanced"),advancedBuild.binarySha256);
  result.passed=true;console.log(JSON.stringify({summary:result.summary,paired:result.paired,initializationMs:result.initializationMs}));
}finally{for(const engine of Object.values(engines))await engine.close();mkdirSync("build/evidence",{recursive:true});writeFileSync("build/evidence/paired-profile.json",JSON.stringify(result,null,2)+"\n");}
