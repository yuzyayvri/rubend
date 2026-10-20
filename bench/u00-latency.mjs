import assert from "node:assert/strict";
import {readFileSync,writeFileSync,mkdirSync,existsSync} from "node:fs";
import {resolve} from "node:path";
import {spawnSync} from "node:child_process";
import {createHash} from "node:crypto";
import {compareWarm} from "./warm-compare.mjs";
import {LatencyProbeEngine,summarizeLatencyTrace} from "./latency-probe.mjs";

const [mode,argument]=process.argv.slice(2);assert.equal(process.argv.length,4);assert.ok(["plan","check","trace"].includes(mode));
const read=path=>JSON.parse(readFileSync(path,"utf8")),hash=path=>createHash("sha256").update(readFileSync(path)).digest("hex"),save=(path,data)=>writeFileSync(path,JSON.stringify(data,null,2)+"\n",{flag:"wx"});
function run(program,args){const r=spawnSync(program,args,{encoding:"utf8",timeout:300000,maxBuffer:8*1024*1024});if(r.stdout&&program!=="git")process.stdout.write(r.stdout);if(r.stderr)process.stderr.write(r.stderr);assert.ifError(r.error);assert.equal(r.status,0,program+" failed");return r.stdout.trim();}
const producers=["bench/u00-latency.mjs","bench/latency-probe.mjs","bench/warm-compare.mjs","bench/scorecard.mjs","apps/engine.mjs"];
if(mode==="plan"){
  assert.match(argument,/^u00-latency-[a-z0-9-]+$/);const id=argument,directory=resolve("build/experiments",id),revision=run("git",["rev-parse","HEAD"]);
  const control=resolve("build/experiments/u00-controls-v1"),originalPath=resolve(control,"raw-aa-report.json"),original=read(originalPath);assert.equal(original.passed,true);assert.equal(read(resolve(control,"status.json")).state,"passed");
  const configuration=resolve(control,"control/raw-aa-config.json");assert.deepEqual(read(configuration),original.config);
  const sourceHashes={};for(const name of run("git",["ls-files","-z"]).split("\0").filter(Boolean))sourceHashes[name]=hash(name);
  const originalInventory=read(resolve(control,"inventory.json"));assert.equal(originalInventory.rawAaControl.profile,"RawJoint");
  for(const name of["apps/engine.mjs","apps/model.mjs"])assert.equal(hash(name),originalInventory.sourceHashes[name],"Production host adapter changed");
  for(const p of original.config.profiles){assert.equal(hash(p.binary),original.seals[p.binary].sha256);assert.equal(hash(p.buildMetadata),original.seals[p.buildMetadata].sha256);}
  const evidence=resolve("build/evidence/next-plan/U00");mkdirSync(evidence,{recursive:true});const specPath=resolve(evidence,id+"-spec.json"),planPath=resolve("build/evidence",id+"-plan.json");assert.ok(!existsSync(specPath)&&!existsSync(planPath),"Use a fresh immutable diagnostic id");
  save(specPath,{format:"rubend-u00-latency-spec-v1",revision,directory,configuration,originalPath,originalSha256:hash(originalPath),profile:"RawJoint",scope:"One fixed instrumented repeat of the original full five-cohort raw A/A sequence. Preserve native work, budgets, cases, and rounded public events. Add host precision and available proc counters only. No release timing claim, kernel setting changes, table generation, promotion, or automatic wakeup."});
  for(const path of[specPath,configuration,originalPath,...original.config.profiles.flatMap(p=>[p.binary,p.buildMetadata]),...Object.values(original.config.corpora).map(c=>c.path)])sourceHashes[path]=hash(path);
  const jobs=[{id:"checks",memoryMiB:4096,seconds:600,cpus:[2,3,4,5],command:[process.execPath,"bench/u00-latency.mjs","check",specPath]},{id:"trace",memoryMiB:5632,seconds:600,cpus:[2],command:[process.execPath,"bench/u00-latency.mjs","trace",specPath]}];
  save(planPath,{format:"rubend-background-tests-v1",id,root:process.cwd(),revision,sourceHashes,jobs,expectedMinutes:8,queueHardLimitMinutes:20,scope:read(specPath).scope});console.log(JSON.stringify({planPath,expectedMinutes:8,maximumMinutes:20,automaticModelWakeups:false}));
}else{
  const spec=read(argument),directory=resolve(spec.directory);assert.equal(spec.format,"rubend-u00-latency-spec-v1");assert.ok(directory.startsWith(resolve("build/experiments")+"/"));assert.equal(hash(spec.originalPath),spec.originalSha256);
  const producerHashes=Object.fromEntries(producers.map(p=>[p,hash(p)]));
  if(mode==="check"){
    for(const name of["latency-probe","warm-compare","u00-aa","engine-lifecycle"])run(process.execPath,["tests/"+name+".mjs"]);run("just",["check"]);
    save(resolve(directory,"checks.json"),{passed:true,producerHashes,publicSolverProtocolChanged:false,largeTableGenerated:false});
  }else{
    for(const name of["RUBEND_JOINT_CACHE","RUBEND_CORNER_CACHE","RUBEND_H0_CACHE","RUBEND_H0_META_CACHE","RUBEND_CORNER_POLICY","RUBEND_H0_POLICY","RUBEND_SEGMENTED_POLICY"])delete process.env[name];
    const rows=[],report=await compareWarm(read(spec.configuration),spec.configuration,{createEngine:(options,context)=>new LatencyProbeEngine(options,context,rows)});
    save(resolve(directory,"warm-report.json"),report);save(resolve(directory,"timing-trace.json"),{format:"rubend-u00-latency-trace-v1",spec,producerHashes,rows});assert.equal(report.passed,true,JSON.stringify(report.errors));assert.equal(report.conditions.customEngineFactory,true);
    const summary=summarizeLatencyTrace(rows,read(spec.originalPath));save(resolve(directory,"timing-summary.json"),summary);assert.equal(summary.firstPrefixesMatchingOriginal,true,"First-answer work differs from the original control; no equal-work attribution is allowed");
    console.log(JSON.stringify({passed:true,nativeJobs:report.counts.successfulJobs,diagnosticSamples:summary.samples,prefixesMatchOriginal:summary.firstPrefixesMatchingOriginal,counterUnavailable:summary.counterUnavailable,schedulerWaitAccountingAvailable:summary.schedulerWaitAccountingAvailable,claim:summary.claim}));
  }
  for(const [path,expected]of Object.entries(producerHashes))assert.equal(hash(path),expected);assert.equal(hash(spec.originalPath),spec.originalSha256);
}
