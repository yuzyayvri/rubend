import assert from "node:assert/strict";
import {mkdtempSync,writeFileSync,copyFileSync,chmodSync,readFileSync,rmSync,existsSync} from "node:fs";
import {resolve} from "node:path";
import {tmpdir} from "node:os";
import {createHash} from "node:crypto";
import {compareContours} from "../bench/contour-compare.mjs";
import {solved} from "../apps/model.mjs";

const directory=mkdtempSync(resolve(tmpdir(),"rubend-contour-protocol-"));
const output=mkdtempSync(resolve("build/evidence/contour-protocol-"));
const digest=path=>createHash("sha256").update(readFileSync(path)).digest("hex");
try{
  const binary=resolve(directory,"worker"),cache=resolve(directory,"cache"),warmup=resolve(directory,"warmup.json");
  copyFileSync(new URL("./fixtures/contour-worker.mjs",import.meta.url),binary);chmodSync(binary,0o700);
  writeFileSync(binary+".json",JSON.stringify({binarySha256:digest(binary)}));writeFileSync(cache,"fixture-cache");
  writeFileSync(warmup,JSON.stringify({records:Array.from({length:163},()=>({facelets:solved,depth:0}))}));
  const results=[];
  for(const variant of["ordinary","corner","h0"]){
    const config={binary,cache,cacheSha256:digest(cache),warmup,count:1,iterations:1,target:1,output:resolve(output,variant+".json")};
    if(variant==="corner")Object.assign(config,{cornerCache:cache,cornerSha256:digest(cache)});
    if(variant==="h0")Object.assign(config,{h0Cache:cache,h0Sha256:digest(cache),h0Meta:cache,h0MetaSha256:digest(cache)});
    const path=resolve(directory,variant+".json");writeFileSync(path,JSON.stringify(config));
    const report=await compareContours(config,path);
    assert.equal(report.passed,true,JSON.stringify({variant,errors:report.errors}));
    const workers=report.rounds.flatMap(r=>r.workers),jobs=report.rounds.flatMap(r=>r.jobs);
    assert.equal(workers.length,variant==="ordinary"?3:4);assert.equal(jobs.length,workers.length);
    for(const worker of workers){assert.equal(worker.shallowPassed,163);assert.equal(worker.shutdown.forced,false);assert.equal(worker.shutdown.ipcRemoved,true);assert.equal(existsSync("/proc/"+worker.identity.pid),false);}
    results.push({variant,workers:workers.length,shallowJobs:workers.length*163,measurementJobs:jobs.length});
  }
  console.log(JSON.stringify({passed:true,fixtureProtocolIntegration:true,notSolverPerformance:true,results}));
}finally{rmSync(directory,{recursive:true,force:true});rmSync(output,{recursive:true,force:true});}
