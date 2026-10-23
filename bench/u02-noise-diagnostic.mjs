import assert from "node:assert/strict";
import {readFileSync,writeFileSync,createReadStream,existsSync,readdirSync} from "node:fs";
import {resolve} from "node:path";
import {createHash} from "node:crypto";
import {execFileSync} from "node:child_process";
import {performance} from "node:perf_hooks";
import {Engine} from "../apps/engine.mjs";
import {loadCorpus} from "./corpus.mjs";
import {inputs} from "../scripts/manifest.mjs";
import {nativeTelemetry,telemetryDelta} from "./native-telemetry.mjs";

const [mode,id]=process.argv.slice(2);assert.equal(process.argv.length,4);assert.ok(["plan","diagnose"].includes(mode));assert.match(id,/^u02-noise-[a-z0-9-]+$/);
const prior="u02-axis-cost-confirm-v1",compilePath=resolve("build/experiments",prior,"compile.json"),compile=JSON.parse(readFileSync(compilePath,"utf8")),priorPlan=JSON.parse(readFileSync(resolve("build/evidence",prior+"-plan.json"),"utf8")),hash=p=>createHash("sha256").update(readFileSync(p)).digest("hex");
const costPath=resolve("build/experiments",prior,"cost.json"),priorCost=JSON.parse(readFileSync(costPath,"utf8"));assert.equal(priorCost.passed,true);
const archive=JSON.parse(readFileSync(resolve("docs/verification/next-plan/U02",prior,"index.json"),"utf8"));assert.equal(archive.passed,true);
for(const [name,path]of [["compile",compilePath],["cost",costPath]])assert.equal(hash(path),archive.archives.find(a=>new RegExp("^\\d+-"+name+"\\.json\\.gz$").test(a.path)).sha256);
assert.equal(compile.passed,true);for(const [p,h]of Object.entries(compile.artifacts))assert.equal(hash(p),h);
for(const [p,h]of Object.entries(inputs()))assert.equal(priorPlan.sourceHashes[p],h,"Previously checked production input changed: "+p);
const proofFixtures=Object.keys(priorPlan.sourceHashes).filter(p=>p.startsWith("tests/toolchain/"));for(const p of proofFixtures)assert.equal(hash(p),priorPlan.sourceHashes[p]);
if(mode==="plan"){
  const paths=execFileSync("git",["ls-files","-z"],{encoding:"utf8"}).split("\0").filter(Boolean);paths.push(compilePath,costPath,resolve("build/evidence",prior+"-plan.json"),...Object.keys(compile.artifacts));
  const path=resolve("build/evidence",id+"-plan.json");writeFileSync(path,JSON.stringify({format:"rubend-background-tests-v1",id,root:process.cwd(),revision:execFileSync("git",["rev-parse","HEAD"],{encoding:"utf8"}).trim(),sourceHashes:Object.fromEntries(paths.map(p=>[p,hash(p)])),jobs:[{id:"diagnose",memoryMiB:3072,seconds:180,cpus:[2],command:[process.execPath,"bench/u02-noise-diagnostic.mjs","diagnose",id]}],expectedMinutes:2,queueHardLimitMinutes:3,scope:"One instrumented control-only diagnostic with reused verified binary. Record scheduler runtime/wait, faults, switches, selected-lane frequency and observer CPU on24 fixed-work requests. Do not rerun the failed A/A acceptance or measure a candidate. Reuse unchanged proof/toolchain evidence. No promotion, table build, holdout, system changes or publication."},null,2)+"\n",{flag:"wx"});console.log(JSON.stringify({path,expectedMinutes:2,maximumMinutes:3}));process.exit();
}
const binary=resolve("build",prior+"-sources/control"),cache=resolve(".cache/joint/phase1-v1.raw"),expected="2ccfd40fdc0cf4769c58d9646f6b0ea787571ce5200b5d124c8f17dcc70f73b5";
async function seal(){const h=createHash("sha256");for await(const c of createReadStream(cache))h.update(c);assert.equal(h.digest("hex"),expected);}
await seal();
const readTelemetry=path=>nativeTelemetry(readFileSync(path+"/stat","utf8"),readFileSync(path+"/schedstat","utf8"),readFileSync(path+"/status","utf8"));
function telemetry(pid){
  const main=readTelemetry("/proc/"+pid),threads=readdirSync("/proc/"+pid+"/task").map(tid=>readTelemetry("/proc/"+pid+"/task/"+tid));
  const snapshot={...main,threads,threadSchedulerAggregate:true};
  for(const key of ["runtimeNs","waitNs","slices","voluntary","involuntary"])snapshot[key]=threads.reduce((sum,t)=>sum+t[key],0);
  return snapshot;
}
function delta(a,b){assert.deepEqual(a.threads.map(t=>[t.pid,t.startTicks]),b.threads.map(t=>[t.pid,t.startTicks]),"Thread membership changed during the observation");return telemetryDelta(a,b);}
function frequency(){try{return Number(readFileSync("/sys/devices/system/cpu/cpu2/cpufreq/scaling_cur_freq","utf8").trim());}catch(e){if(e.code==="ENOENT")return null;throw e;}}
const cases=loadCorpus("development").slice(0,4),report={format:"rubend-control-noise-diagnostic-v1",passed:false,instrumented:true,acceptanceRun:false,performanceAcceptance:false,candidateRun:false,prior,proofEvidenceReused:true,proofFixtures:proofFixtures.length,rows:[],workers:[],errors:[],cacheSha256:expected,releaseHoldoutOpened:false,independentReview:false};
Object.assign(process.env,{RUBEND_JOINT_CACHE:cache,RUBEND_CONTOUR_PROFILE:"inverse-three",RUBEND_CONTOUR_TARGET:"20"});
try{
  for(let worker=0;worker<6;worker++){
    const engine=new Engine({binary,eventProtocol:"fixed-work"}),owner={worker,pid:engine.child.pid,directory:engine.directory};report.workers.push(owner);
    try{
      await engine.ready(120000);
      for(const item of worker%2?[...cases].reverse():cases){
        const before=telemetry(engine.child.pid),observer=telemetry(process.pid),frequencies=[frequency()],started=performance.now(),events=[];
        const timer=setInterval(()=>frequencies.push(frequency()),100);
        try{await new Promise((done,reject)=>{engine.solve({facelets:item.facelets,mode:"exact",budgetMs:30000},e=>{events.push(e);if(e.type==="done")done();else if(["error","invalid"].includes(e.type))reject(Error(JSON.stringify(e)));}).catch(reject);});}finally{clearInterval(timer);}
        const hostMs=performance.now()-started,after=telemetry(engine.child.pid),observerAfter=telemetry(process.pid),m=events.filter(e=>e.type==="measurement"),done=events.filter(e=>e.type==="done");
        assert.equal(m.length,1);assert.equal(done.length,1);assert.equal(m[0].profile,3);assert.equal(m[0].target,20);assert.equal(done[0].nodes,5000000);assert.equal(done[0].length,31);assert.equal(done[0].optimal,0);assert.deepEqual(m[0].moves,[]);assert.equal(done[0].lower,m[0].bound);assert.equal(m[0].status,0);assert.equal(before.processor,2);assert.equal(after.processor,2);
        assert.ok([...before.threads,...after.threads].every(t=>t.processor===2));
        report.rows.push({worker,id:item.id,hostMs,nativeMs:m[0].nativeMs,before,after,delta:delta(before,after),observerDelta:delta(observer,observerAfter),frequenciesKHz:frequencies,result:{nodes:done[0].nodes,lower:done[0].lower,length:done[0].length,status:m[0].status}});
        const first=report.rows.find(r=>r.id===item.id);assert.deepEqual(report.rows.at(-1).result,first.result);
        const old=priorCost.rows.find(r=>r.id===item.id).result;assert.deepEqual(report.rows.at(-1).result,{nodes:old.nodes,lower:old.lower,length:old.length,status:old.status});
      }
    }finally{await engine.close();owner.ipcRemoved=!existsSync(engine.directory);assert.equal(owner.ipcRemoved,true);}
  }
  report.passed=true;
}catch(e){report.errors.push(String(e.stack??e));}
finally{try{await seal();}catch(e){report.passed=false;report.errors.push(String(e));}report.schedulerTimingAvailable=report.rows.some(r=>r.delta.runtimeNs>0);report.frequencyAvailable=report.rows.some(r=>r.frequenciesKHz.some(f=>f!==null));writeFileSync(resolve("build/experiments",id,"diagnostic.json"),JSON.stringify(report)+"\n",{flag:"wx"});}
console.log(JSON.stringify({passed:report.passed,rows:report.rows.length,errors:report.errors,acceptanceRun:false}));if(!report.passed)process.exitCode=1;
