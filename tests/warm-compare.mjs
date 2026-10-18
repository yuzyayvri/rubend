import assert from "node:assert/strict";
import {mkdtempSync,mkdirSync,writeFileSync,readFileSync,copyFileSync,chmodSync,existsSync,rmSync} from "node:fs";
import {tmpdir} from "node:os";
import {resolve} from "node:path";
import {createHash} from "node:crypto";
import {pathToFileURL} from "node:url";
import {compareWarm} from "../bench/warm-compare.mjs";
import {solved,apply} from "../apps/model.mjs";
import {nativeIdentity} from "../bench/startup-measure.mjs";

const directory=mkdtempSync(resolve(tmpdir(),"rubend-warm-fixture-")),digest=path=>createHash("sha256").update(readFileSync(path)).digest("hex");
const cache=resolve(directory,"cache"),binary=resolve(directory,"native"),metadata=resolve(directory,"native.json");
copyFileSync(new URL("./fixtures/warm-native.mjs",import.meta.url),binary);chmodSync(binary,0o700);writeFileSync(cache,"tiny-cache");writeFileSync(metadata,JSON.stringify({binarySha256:digest(binary),sourceHashes:{historical:"not-current"}}));
const corpora={};
for(const group of ["warmup","fast","exact"]){const path=resolve(directory,`${group}.json`);writeFileSync(path,JSON.stringify({records:[{id:group,facelets:solved,depth:0}]}));corpora[group]={path,count:1,budgetMs:50};}
const base={iterations:5,readyTimeoutMs:1000,rssSampleMs:10,shutdownTimeoutMs:500,corpora,profiles:["baseline","candidate"].map(id=>({id,binary,buildMetadata:metadata,cache,cacheBytes:10,cacheSha256:digest(cache),env:{RUBEND_JOINT_CACHE:cache}}))};
const results=[];
async function run(mode="ok",mutatePath=null,measure=compareWarm,sourcePath=null){
  const config=structuredClone(base);
  const ledger=resolve(directory,`liveness-${results.length}.jsonl`);
  for(const p of config.profiles){p.env.WARM_FIXTURE_MODE=mode;p.env.WARM_LIVENESS_LEDGER=ledger;if(mutatePath)p.env.WARM_MUTATE_PATH=mutatePath;}
  if(sourcePath)writeFileSync(sourcePath,JSON.stringify(config));
  const result=await measure(config,sourcePath);
  const starts=existsSync(ledger)?readFileSync(ledger,"utf8").trim().split("\n").map(x=>JSON.parse(x)).filter(x=>x.type==="start"):[];
  assert.ok(starts.every(x=>x.live<=2),"At most two original workers are live");
  for(const start of starts)assert.notDeepEqual(nativeIdentity(start.pid),{pid:start.pid,startTicks:start.startTicks},"Every spawned worker exited");
  if(["fallback","fallback-forced"].includes(mode)){assert.equal(starts.length,2,"Stalled job never spawns a replacement");assert.ok(result.rounds[0].jobs.some(j=>j.watchdogExpired));}
  if(mode==="fallback-forced")assert.ok(result.rounds[0].workers.some(w=>w.shutdown.forced),"Ignored SIGTERM requires bounded forced shutdown");
  if(mode==="native-time-limit")assert.ok(result.rounds[0].jobs.some(j=>j.error?.includes("Host emergency deadline is not native completion")&&!j.watchdogExpired));
  results.push({mode,passed:result.passed,counts:result.counts,errors:result.errors,liveness:{spawns:starts.length,maximumLive:Math.max(0,...starts.map(x=>x.live)),allStopped:true}});
  for(const worker of result.rounds.flatMap(r=>r.workers))assert.ok(!existsSync(worker.ipcDirectory),"IPC cleanup awaited");
  return result;
}
try{
  const ok=await run();assert.equal(ok.passed,true,JSON.stringify(ok.errors));assert.equal(ok.counts.successfulJobs,40);assert.equal(ok.rounds.length,5);
  const generated=structuredClone(base);
  for(const p of generated.profiles){p.tableSource="generated";delete p.cache;delete p.cacheBytes;delete p.cacheSha256;p.env={};}
  const generatedResult=await compareWarm(generated);assert.equal(generatedResult.passed,true,JSON.stringify(generatedResult.errors));assert.equal(generatedResult.counts.successfulJobs,40);
  const extra=resolve(directory,"extra"),additional=structuredClone(base);writeFileSync(extra,"extra-cache");
  additional.profiles[1].additionalCaches=[{path:extra,bytes:11,sha256:digest(extra),env:"RUBEND_CORNER_CACHE"}];additional.profiles[1].env.RUBEND_CORNER_CACHE=extra;
  const extraResult=await compareWarm(additional);assert.equal(extraResult.passed,true,JSON.stringify(extraResult.errors));assert.ok(extraResult.seals[extra]);assert.deepEqual(extraResult.afterSeals[extra],extraResult.seals[extra]);
  for(const change of [c=>c.profiles[1].additionalCaches[0].sha256="0".repeat(64),c=>c.profiles[1].additionalCaches[0].bytes=12,c=>c.profiles[1].additionalCaches[0].path="relative",c=>delete c.profiles[1].additionalCaches,c=>c.profiles[1].additionalCaches.push(c.profiles[1].additionalCaches[0]),c=>c.profiles[1].additionalCaches[0].env="RUBEND_JOINT_CACHE"]){
    const bad=structuredClone(additional);change(bad);const r=await compareWarm(bad);assert.equal(r.passed,false);assert.equal(r.counts.workers,0);
  }
  const mutation=structuredClone(additional);for(const p of mutation.profiles){p.env.WARM_FIXTURE_MODE="mutate";p.env.WARM_MUTATE_PATH=extra;}
  const changedExtra=await compareWarm(mutation);assert.equal(changedExtra.passed,false);assert.ok(changedExtra.errors.some(e=>e.path===extra));
  for(const change of [c=>c.profiles[0].cache=cache,c=>c.profiles[0].env.RUBEND_JOINT_CACHE=cache,c=>c.profiles[0]=structuredClone(base.profiles[0])]){
    const bad=structuredClone(generated);change(bad);const r=await compareWarm(bad);assert.equal(r.passed,false);assert.equal(r.counts.workers,0);
  }
  const sf=ok.rounds[0].jobs.find(j=>j.group==="superflip");assert.equal(apply(sf.facelets,sf.terminalBest.moves),solved);
  const late=await run("late");assert.equal(late.passed,true);assert.equal(late.summary.fast.paired.noAnswer,5);assert.equal(late.summary.fast.profiles.candidate.meanDeadlineLength,null);assert.equal(late.summary.fast.profiles.candidate.meanTerminalLength,0);
  for(const mode of ["wrong","unknown","missing","falseoptimal","fallback","fallback-forced","native-time-limit","exit","forced"]){const bad=await run(mode);assert.equal(bad.passed,false,mode);assert.ok(bad.counts.failedJobs>0||bad.rounds.some(r=>r.status==="error"),mode);}
  const badHash=structuredClone(base);badHash.profiles.forEach(p=>p.cacheSha256="0".repeat(64));const rejected=await compareWarm(badHash);assert.equal(rejected.passed,false);assert.equal(rejected.counts.workers,0);
  const changedBinary=await run("mutate",binary);assert.equal(changedBinary.passed,false);assert.ok(changedBinary.errors.some(e=>e.stage==="postflight"));
  copyFileSync(new URL("./fixtures/warm-native.mjs",import.meta.url),binary);chmodSync(binary,0o700);
  const changedSource=await run("mutate",corpora.fast.path);assert.equal(changedSource.passed,false);assert.ok(changedSource.errors.some(e=>e.stage==="postflight"));
  const clone=resolve(directory,"measurement-copy");
  for(const folder of ["bench","apps","build"])mkdirSync(resolve(clone,folder),{recursive:true});
  for(const path of ["bench/warm-compare.mjs","bench/startup-measure.mjs","apps/engine.mjs","apps/model.mjs","build/model.mjs","build/cubie.mjs","build/notation.mjs"])copyFileSync(new URL(`../${path}`,import.meta.url),resolve(clone,path));
  const copied=await import(pathToFileURL(resolve(clone,"bench/warm-compare.mjs")));
  const changedMeasurement=await run("mutate",resolve(clone,"bench/startup-measure.mjs"),copied.compareWarm);assert.equal(changedMeasurement.passed,false);assert.ok(changedMeasurement.errors.some(e=>e.stage==="postflight"&&e.path.endsWith("startup-measure.mjs")));
  const configPath=resolve(directory,"input.json");
  const changedConfig=await run("mutate",configPath,compareWarm,configPath);assert.equal(changedConfig.passed,false);assert.ok(changedConfig.errors.some(e=>e.stage==="postflight"&&e.path===configPath));assert.equal(changedConfig.counts.successfulJobs,0);
  const mismatch=await compareWarm(base,configPath);assert.equal(mismatch.passed,false);assert.equal(mismatch.counts.workers,0);assert.ok(mismatch.errors.some(e=>e.message.includes("differs from input")));
  console.log(JSON.stringify({passed:true,additionalCacheSealed:true,additionalCacheRejects:6,additionalCacheMutationRejected:true,results},null,2));
}finally{rmSync(directory,{recursive:true,force:true});}
