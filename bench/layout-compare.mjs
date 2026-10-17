import assert from "node:assert/strict";
import {readFileSync,writeFileSync,mkdirSync,createReadStream} from "node:fs";
import {createHash} from "node:crypto";
import {resolve} from "node:path";
import {Engine} from "../apps/engine.mjs";
import {apply,solved} from "../apps/model.mjs";

const configs={raw:{binary:"build/rubend-raw-baseline",cache:".cache/joint/phase1-v1.raw",sha256:"2ccfd40fdc0cf4769c58d9646f6b0ea787571ce5200b5d124c8f17dcc70f73b5"},block:{binary:"build/rubend-block",cache:".cache/joint/block64-v1.raw",sha256:"ed938e76a8d21ba7d6bb95cee1b3eb26fbaa48897c86d986bb044fb01bb7fc3e"}};
const builds={},engines={},records=[],initializationMs={};
const digest=path=>createHash("sha256").update(readFileSync(path)).digest("hex");
for(const [profile,config] of Object.entries(configs)){
  builds[profile]=JSON.parse(readFileSync(`${config.binary}.json`,"utf8"));assert.equal(digest(config.binary),builds[profile].binarySha256);
  const hash=createHash("sha256");for await(const chunk of createReadStream(config.cache))hash.update(chunk);assert.equal(hash.digest("hex"),config.sha256);
}
for(const [path,hash] of Object.entries(builds.block.sourceHashes))assert.equal(digest(path),hash);
process.env.RUBEND_JOINT_CACHE=resolve(configs.raw.cache);process.env.RUBEND_BLOCK_CACHE=resolve(configs.block.cache);
const result={format:"rubend-layout-comparison-v1",builds,cacheIdentities:configs,conditions:"One pinned low-priority CPU; same cases and budgets; alternating order; identical 163-case shallow warmup; initialization separate. Baseline binary frozen before lookup changes. Desktop load uncontrolled.",initializationMs,nativePeakRssKiB:{raw:0,block:0},records,passed:false};
const sampler=setInterval(()=>{for(const [profile,engine] of Object.entries(engines))try{const status=readFileSync(`/proc/${engine.child.pid}/status`,"utf8");result.nativePeakRssKiB[profile]=Math.max(result.nativePeakRssKiB[profile],Number(status.match(/^VmRSS:\s+(\d+)/m)?.[1]??0));}catch{}},100);
async function job(profile,facelets,mode,budgetMs,expected){
  const events=[];await new Promise(async(resolveJob,reject)=>{try{await engines[profile].solve({facelets,mode,budgetMs},e=>{events.push(e);if(e.type==="error")reject(Error(e.message));if(e.type==="done")resolveJob();});}catch(e){reject(e);}});
  const answers=events.filter(e=>e.type==="candidate"),best=answers.at(-1),done=events.at(-1);assert.ok(best);assert.equal(apply(facelets,best.moves),solved);
  if(expected!==undefined){assert.equal(best.length,expected);assert.equal(done.optimal,1);assert.equal(done.lower,expected);}
  return {firstMs:answers[0].elapsedMs,firstLength:answers[0].length,length:best.length,lower:done.lower,optimal:Boolean(done.optimal),nodes:done.nodes,moves:best.moves};
}
try{
  for(const [profile,config] of Object.entries(configs)){const start=performance.now();engines[profile]=new Engine({binary:resolve(config.binary)});await engines[profile].ready(120000);initializationMs[profile]=Math.round(performance.now()-start);}
  for(const item of JSON.parse(readFileSync("docs/verification/portfolio-v1/exact.json","utf8")).records)for(const profile of ["raw","block"])await job(profile,item.facelets,"exact",1000,item.depth);
  const corpus=JSON.parse(readFileSync("docs/verification/portfolio-v1/comparison.json","utf8"));
  for(const [index,item] of corpus.records.entries()){
    const record={id:item.id,facelets:item.facelets,mode:"fast",budgetMs:1000,order:index%2?["block","raw"]:["raw","block"]};
    for(const profile of record.order)record[profile]=await job(profile,item.facelets,"fast",1000);
    records.push(record);console.log(JSON.stringify({id:item.id,raw:record.raw.length,block:record.block.length,rawSteps:record.raw.nodes,blockSteps:record.block.nodes}));
  }
  for(const [index,item] of JSON.parse(readFileSync("docs/verification/portfolio-v1/exact-profile.json","utf8")).records.entries()){
    const record={id:`exact-${item.id}`,facelets:item.facelets,mode:"exact",budgetMs:2000,order:index%2?["block","raw"]:["raw","block"]};
    for(const profile of record.order)record[profile]=await job(profile,item.facelets,"exact",2000);records.push(record);
  }
  const fast=records.filter(r=>r.mode==="fast");result.summary=Object.fromEntries(["raw","block"].map(profile=>{const times=fast.map(r=>r[profile].firstMs).sort((a,b)=>a-b);return [profile,{cases:fast.length,meanBestLength:fast.reduce((sum,r)=>sum+r[profile].length,0)/fast.length,p95FirstMs:times[Math.ceil(times.length*.95)-1],totalWorkSteps:fast.reduce((sum,r)=>sum+r[profile].nodes,0)}];}));
  for(const [profile,config] of Object.entries(configs))assert.equal(digest(config.binary),builds[profile].binarySha256);for(const [path,hash] of Object.entries(builds.block.sourceHashes))assert.equal(digest(path),hash);
  result.passed=true;console.log(JSON.stringify({summary:result.summary,initializationMs,nativePeakRssKiB:result.nativePeakRssKiB,exact:records.filter(r=>r.mode==="exact")}));
}finally{clearInterval(sampler);for(const engine of Object.values(engines))await engine.close();mkdirSync("build/evidence",{recursive:true});writeFileSync("build/evidence/layout-compare.json",JSON.stringify(result,null,2)+"\n");}
