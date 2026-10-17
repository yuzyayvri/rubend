import assert from "node:assert/strict";
import {createHash} from "node:crypto";
import {chmodSync,copyFileSync,existsSync,mkdirSync,mkdtempSync,readFileSync,rmSync,writeFileSync} from "node:fs";
import {tmpdir} from "node:os";
import {dirname,resolve} from "node:path";
import {fileURLToPath,pathToFileURL} from "node:url";
import {spawnSync} from "node:child_process";
import {measureStartup,nativeIdentity,sampleNativeRss} from "../bench/startup-measure.mjs";

const directory=mkdtempSync(resolve(tmpdir(),"rubend-startup-test-"));
const worker=fileURLToPath(new URL("./fixtures/startup-worker.mjs",import.meta.url));
chmodSync(worker,0o755);
const cache=resolve(directory,"tiny.raw"),log=resolve(directory,"workers.jsonl"),bytes=Buffer.alloc(4096,1);
writeFileSync(cache,bytes);
const sha256=createHash("sha256").update(bytes).digest("hex");
const profile=(id,mode="ok",delay=0)=>({id,binary:worker,cache,cacheBytes:bytes.length,cacheWords:bytes.length/4,cacheSha256:sha256,env:{RUBEND_STARTUP_FIXTURE_CACHE:cache,RUBEND_STARTUP_FIXTURE_LOG:log,RUBEND_STARTUP_FIXTURE_MODE:mode,RUBEND_STARTUP_FIXTURE_DELAY_MS:String(delay)}});
const config=profiles=>({profiles,iterations:5,readyTimeoutMs:250,solveTimeoutMs:250,rssSampleMs:5});
let cases=0,checkedWorkers=0;
const rawResults=[];
async function measure(config){const result=await measureStartup(config);rawResults.push(result);return result;}
function workers(){return existsSync(log)?readFileSync(log,"utf8").trim().split("\n").filter(Boolean).map(JSON.parse):[];}
function fixtureAlive(row){const current=nativeIdentity(row.pid);return current!==null&&current.startTicks===row.startTicks;}
function cleanup(result){
  for(const row of workers()){
    assert.equal(fixtureAlive(row),false,"The original fixture process no longer exists");
    assert.equal(existsSync(dirname(row.fifo)),false,"No worker FIFO directory survives");
    assert.equal(row.bytes,bytes.length,"Fixture read the complete small input");
  }
  checkedWorkers=workers().length;
  for(const row of result.runs)if(row.pid){assert.equal(row.shutdown.awaited,true);assert.equal(row.shutdown.ipcRemoved,true);}
}
try{
  const self=nativeIdentity(process.pid),reused={...self,startTicks:String(BigInt(self.startTicks)+1n)};
  assert.equal(fixtureAlive(self),true);assert.equal(fixtureAlive(reused),false);
  const rejectedSample=sampleNativeRss(reused,"identity-test",performance.now());
  assert.equal(rejectedSample.identityMatched,false);assert.equal(rejectedSample.rssKiB,null);assert.equal(rejectedSample.hwmKiB,null);
  assert.equal(sampleNativeRss(self,"identity-test",performance.now()).identityMatched,true);cases++;
  const result=await measure(config([profile("fast"),profile("delayed","ok",100)]));cases++;
  assert.equal(result.passed,true,JSON.stringify(result.errors));
  assert.deepEqual(result.runs.map(r=>r.profile),["fast","delayed","delayed","fast","fast","delayed","delayed","fast","fast","delayed"]);
  assert.deepEqual(result.counts,{plannedRuns:10,attemptedRuns:10,launchedWorkers:10,readyEvents:10,checkedSolvedReplays:10,successfulRuns:10,runErrors:0,batchErrors:0,hostHashBytes:57344});
  assert.equal(new Set(result.runs.map(r=>r.pid)).size,10,"Every observation uses a fresh worker");
  assert.ok(result.summary.delayed.workerToReadyMs.median-result.summary.fast.workerToReadyMs.median>60,"Known 100 ms ready delay separates from easier startup");
  for(const row of result.runs){
    assert.ok(row.workerToReadyMs>0);
    assert.equal(row.includingHostValidationMs,row.workerToReadyMs+row.hostValidation.elapsedMs);
    assert.equal(row.hostValidation.bytes,4096);
    assert.ok(row.nativeRss.samples.find(s=>s.kind==="ready").rssKiB>0);
    assert.equal(row.nativeRss.samples.find(s=>s.kind==="ready").identityMatched,true);
    assert.equal(row.processIdentity.startTicks,workers().find(worker=>worker.pid===row.pid).startTicks);
  }
  assert.equal(result.identities.fast.after.cache.bytes,4096);
  assert.equal(Object.keys(result.source.afterFiles).length,6);
  for(const [path,before] of Object.entries(result.source.files)){assert.deepEqual(result.source.afterFiles[path].identity,before.identity);assert.equal(result.source.afterFiles[path].sha256,before.sha256);}
  cleanup(result);
  const before=workers().length,bad=profile("bad-hash");bad.cacheSha256="0".repeat(64);
  const wrongHash=await measure(config([profile("valid"),bad]));cases++;
  assert.equal(wrongHash.passed,false);assert.equal(wrongHash.counts.launchedWorkers,0);assert.equal(wrongHash.counts.batchErrors,1);assert.match(wrongHash.errors[0].message,/SHA256/);assert.equal(workers().length,before);cleanup(wrongHash);
  for(const mode of ["exit","missing","wrong-solution","wrong-bound","no-done","ignore-term"]){
    const failed=await measure(config([profile(mode,mode)]));cases++;
    assert.equal(failed.passed,false,mode);assert.equal(failed.counts.runErrors,5,mode);assert.equal(failed.counts.successfulRuns,0,mode);assert.equal(failed.counts.checkedSolvedReplays,0,mode);
    assert.equal(failed.summary[mode].workerToReadyMs,null,"Failed observations never become fast samples");
    cleanup(failed);
  }
  const changed=await measure(config([profile("mutate","mutate")]));cases++;
  assert.equal(changed.passed,false);assert.ok(changed.counts.batchErrors>0);assert.equal(changed.counts.successfulRuns,0);cleanup(changed);
  writeFileSync(cache,bytes);
  const metadata=resolve(directory,"frozen-build.json");writeFileSync(metadata,JSON.stringify({sourceHashes:{historical:"intentionally-old"},binarySha256:createHash("sha256").update(readFileSync(worker)).digest("hex")}));
  const frozen=profile("frozen");frozen.buildMetadata=metadata;
  const frozenResult=await measure(config([frozen]));cases++;
  assert.equal(frozenResult.passed,true);assert.equal(frozenResult.identities.frozen.buildMetadata.content.sourceHashes.historical,"intentionally-old");cleanup(frozenResult);
  const binaryCopy=resolve(directory,"mutable-worker.mjs");copyFileSync(worker,binaryCopy);chmodSync(binaryCopy,0o755);
  const changingBinary=profile("mutating-binary","mutate-binary");changingBinary.binary=binaryCopy;
  const binaryChanged=await measure(config([changingBinary]));cases++;
  assert.equal(binaryChanged.passed,false);assert.equal(binaryChanged.counts.successfulRuns,0);assert.ok(binaryChanged.errors.some(e=>/identity changed/.test(e.message)));cleanup(binaryChanged);
  const absent=profile("missing-binary");absent.binary=resolve(directory,"does-not-exist");
  const missingBinary=await measure(config([absent]));cases++;
  assert.equal(missingBinary.passed,false);assert.equal(missingBinary.counts.launchedWorkers,0);
  const notFile=profile("not-file");notFile.cache=directory;notFile.env.RUBEND_STARTUP_FIXTURE_CACHE=directory;
  const directoryCache=await measure(config([notFile]));cases++;
  assert.equal(directoryCache.passed,false);assert.match(directoryCache.errors[0].message,/regular file/);assert.equal(directoryCache.counts.launchedWorkers,0);
  const completedThenFailed=await measure(config([profile("exit-after-done","exit-after-done")]));cases++;
  assert.equal(completedThenFailed.passed,false);assert.equal(completedThenFailed.counts.runErrors,5);assert.equal(completedThenFailed.summary["exit-after-done"].workerToReadyMs,null);cleanup(completedThenFailed);
  const forcedShutdown=await measure(config([profile("solved-ignore-term","solved-ignore-term")]));cases++;
  assert.equal(forcedShutdown.passed,false);assert.equal(forcedShutdown.counts.checkedSolvedReplays,5);assert.equal(forcedShutdown.counts.runErrors,5);assert.equal(forcedShutdown.counts.successfulRuns,0);assert.equal(forcedShutdown.summary["solved-ignore-term"].workerToReadyMs,null);
  for(const row of forcedShutdown.runs){assert.equal(row.shutdown.forced,true);assert.equal(row.shutdown.signal,"SIGKILL");assert.match(row.error,/forced SIGKILL/);}cleanup(forcedShutdown);
  const unexpectedSignal=await measure(config([profile("unexpected-signal","unexpected-signal")]));cases++;
  assert.equal(unexpectedSignal.passed,false);assert.equal(unexpectedSignal.counts.runErrors,5);assert.equal(unexpectedSignal.summary["unexpected-signal"].workerToReadyMs,null);
  for(const row of unexpectedSignal.runs){assert.equal(row.shutdown.signal,"SIGUSR2");assert.match(row.error,/SIGUSR2/);}cleanup(unexpectedSignal);
  const preReadySignal=await measure(config([profile("pre-ready-signal","pre-ready-signal")]));cases++;
  assert.equal(preReadySignal.passed,false);assert.equal(preReadySignal.counts.readyEvents,0);assert.equal(preReadySignal.counts.checkedSolvedReplays,0);assert.equal(preReadySignal.counts.runErrors,5);assert.equal(preReadySignal.summary["pre-ready-signal"].workerToReadyMs,null);
  for(const row of preReadySignal.runs){assert.equal(row.shutdown.signal,"SIGUSR2");assert.match(row.error,/SIGUSR2/);}cleanup(preReadySignal);
  const sourcePaths=Object.keys(result.source.files),projectRoot=fileURLToPath(new URL("../",import.meta.url));
  for(const [index,path] of sourcePaths.entries()){
    const isolated=resolve(directory,`source-identity-${index}`);
    for(const source of sourcePaths){const target=resolve(isolated,source);mkdirSync(dirname(target),{recursive:true});copyFileSync(resolve(projectRoot,source),target);}
    const isolatedMeasurement=await import(pathToFileURL(resolve(isolated,"bench/startup-measure.mjs")).href);
    const mutatingSource=profile(`source-${index}`,"mutate-source");mutatingSource.env.RUBEND_STARTUP_FIXTURE_MUTATE_PATH=resolve(isolated,path);
    const sourceChanged=await isolatedMeasurement.measureStartup(config([mutatingSource]));rawResults.push(sourceChanged);cases++;
    assert.equal(sourceChanged.passed,false,path);assert.equal(sourceChanged.counts.checkedSolvedReplays,5,path);assert.ok(sourceChanged.errors.some(e=>e.stage==="source-postflight"&&e.path===path),path);cleanup(sourceChanged);
  }
  for(const mutate of [x=>x.iterations=4,x=>x.profiles[0].cacheBytes++,x=>x.profiles[0].binary="relative",x=>x.profiles[0].env={},x=>x.unexpected=true]){
    const malformed=config([profile("invalid")]);mutate(malformed);
    const rejected=await measure(malformed);cases++;
    assert.equal(rejected.passed,false);assert.equal(rejected.counts.launchedWorkers,0);assert.equal(rejected.counts.batchErrors,1);
  }
  const cliConfig=resolve(directory,"config.json");writeFileSync(cliConfig,JSON.stringify(config([bad])));
  const cli=spawnSync(process.execPath,[fileURLToPath(new URL("../bench/startup-measure.mjs",import.meta.url)),cliConfig],{encoding:"utf8",timeout:5000});cases++;
  assert.equal(cli.status,1);assert.equal(JSON.parse(cli.stdout).counts.launchedWorkers,0);
  const summary={passed:true,cases,workersChecked:checkedWorkers,sensitivity:{fastMedianMs:result.summary.fast.workerToReadyMs.median,delayedMedianMs:result.summary.delayed.workerToReadyMs.median},measurementClaim:"Fixture delay sensitivity only; not a product startup speedup"};
  mkdirSync("build/evidence",{recursive:true});writeFileSync("build/evidence/startup-measure-fixtures.json",JSON.stringify({summary,rawResults},null,2)+"\n");
  console.log(JSON.stringify(summary));
}finally{
  rmSync(directory,{recursive:true,force:true});
}
