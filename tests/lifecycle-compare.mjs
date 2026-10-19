import assert from "node:assert/strict";
import {createHash} from "node:crypto";
import {chmodSync,mkdtempSync,readFileSync,rmSync,writeFileSync} from "node:fs";
import {tmpdir} from "node:os";
import {resolve} from "node:path";
import {compareLifecycle} from "../bench/lifecycle-compare.mjs";
import {apply,solved} from "../apps/model.mjs";

const directory=mkdtempSync(resolve(tmpdir(),"rubend-lifecycle-benchmark-")),hash=bytes=>createHash("sha256").update(bytes).digest("hex");
const cache=resolve(directory,"cache.raw"),bytes=Buffer.alloc(4096,1),configPath=resolve(directory,"config.json");writeFileSync(cache,bytes);
const source=readFileSync(new URL("./fixtures/lifecycle-benchmark-worker.mjs",import.meta.url));
const profiles=[false,true].map(cooperative=>{
  const id=cooperative?"cooperative":"legacy",binary=resolve(directory,id+".mjs"),buildMetadata=binary+".json";
  writeFileSync(binary,source);chmodSync(binary,0o755);writeFileSync(buildMetadata,JSON.stringify({binarySha256:hash(source)}));
  return {id,binary,buildMetadata,cache,cacheSha256:hash(bytes),cacheBytes:bytes.length,cooperative,env:{RUBEND_JOINT_CACHE:cache}};
});
const config={iterations:5,profiles,cases:[0,3,6].map((m,id)=>({id:"case-"+id,facelets:apply(solved,[m])}))};
try{
  writeFileSync(configPath,JSON.stringify(config));const result=await compareLifecycle(config,configPath);
  assert.equal(result.passed,true,JSON.stringify(result.errors));assert.equal(result.rounds.length,10);
  for(const row of result.rounds){assert.equal(row.status,"ok");assert.equal(row.cycles.length,3);assert.equal(row.shutdown.ipcRemoved,true);assert.equal(row.shutdown.identityRemoved,true);assert.ok(row.cycles.every(c=>c.events.some(e=>e.type==="progress"&&e.nodes>=100000)));}
  assert.equal(result.summary.legacy.initializations,20);assert.equal(result.summary.cooperative.initializations,5);
  assert.ok(result.summary.legacy.cancelToUsableMs.median-result.summary.cooperative.cancelToUsableMs.median>60,"Known100ms replacement delay must separate from retained fixture worker");
  let negatives=0;
  for(const mutate of[c=>c.iterations=4,c=>c.cases[1].id=c.cases[0].id,c=>c.profiles[1].cacheSha256="0".repeat(64),c=>c.profiles[1].env.EXTRA="bad",c=>c.profiles[1].cooperative="yes"]){
    const invalid=structuredClone(config);mutate(invalid);writeFileSync(configPath,JSON.stringify(invalid));
    const rejected=await compareLifecycle(invalid,configPath);assert.equal(rejected.passed,false);assert.equal(rejected.rounds.length,0);assert.equal(rejected.errors.length,1);negatives++;
  }
  console.log(JSON.stringify({passed:true,workers:25,cycles:30,negativeConfigurations:negatives,fixtureDelaySensitive:true,allIpcRemoved:true,claim:"Fixture scheduling and measurement checks only, not product latency"}));
}finally{rmSync(directory,{recursive:true,force:true});}
