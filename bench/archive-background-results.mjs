import assert from "node:assert/strict";
import {readFileSync,writeFileSync,mkdirSync,existsSync} from "node:fs";
import {resolve} from "node:path";
import {execFileSync} from "node:child_process";
import {createHash} from "node:crypto";

assert.equal(process.argv.length,3,"Expected completed background run id");const id=process.argv[2];assert.match(id,/^[a-z0-9-]+$/);
const hash=bytes=>createHash("sha256").update(bytes).digest("hex"),read=path=>JSON.parse(readFileSync(path,"utf8")),directory=resolve("build/experiments",id),planPath=resolve("build/evidence",id+"-plan.json"),plan=read(planPath),state=read(resolve(directory,"status.json"));
assert.equal(state.state,"passed");assert.equal(state.planSha256,hash(readFileSync(planPath)));assert.equal(state.jobs.length,plan.jobs.length);assert.deepEqual(read(resolve(directory,"plan.json")),plan);
for(const [path,expected]of Object.entries(plan.sourceHashes))assert.equal(hash(readFileSync(path)),expected,"Source changed since completed checks: "+path);
const receipts=[];let lifecycleOwners=0,controlFailures=0;
for(const job of state.jobs){assert.equal(job.state,"passed");const bytes=readFileSync(job.receipt),record=JSON.parse(bytes);assert.equal(hash(bytes),job.receiptSha256);assert.equal(record.exitCode,0);assert.equal(record.stoppedFor,null);receipts.push(job.receipt);for(const line of record.stdout.split("\n")){let value;try{value=JSON.parse(line);}catch{continue;}if(value.passed&&value.singleNonblockingControlOwner){lifecycleOwners++;for(const observation of value.observations)assert.equal(existsSync("/proc/"+observation.pid),false,"An observed lifecycle PID is still present; inspect its identity");}if(value.passed&&Array.isArray(value.rows)&&value.claim?.startsWith("Real native control failures"))controlFailures+=value.rows.length;}}
assert.equal(lifecycleOwners,6);assert.equal(controlFailures,30);
const results=["build","profiles","package"].map(mode=>{const path=resolve(directory,mode+"-result.json"),result=read(path);assert.equal(result.passed,true);for(const [source,expected]of Object.entries(result.sourceHashes))assert.equal(plan.sourceHashes[source],expected);return{path,result};});
assert.equal(results[0].result.results.length,6);assert.equal(results[1].result.results.length,6);for(const profile of results[0].result.results)assert.equal(hash(readFileSync(profile.binary)),profile.binarySha256);
const summary={format:"rubend-background-results-v1",passed:true,planRevision:plan.revision,startedAt:state.startedAt,finishedAt:state.finishedAt,elapsedSeconds:(Date.parse(state.finishedAt)-Date.parse(state.startedAt))/1000,jobs:state.jobs,lifecycleProfiles:lifecycleOwners,realNativeControlFailures:controlFailures,stagedPackage:results[2].result.results,independentReview:false,automaticModelWakeups:false};
const summaryPath=resolve("build/evidence",id+"-summary.json");writeFileSync(summaryPath,JSON.stringify(summary,null,2)+"\n",{flag:"wx"});
const destination=resolve("docs/verification",id);mkdirSync(destination);
const files=[planPath,resolve(directory,"status.json"),...receipts,...results.map(value=>value.path),summaryPath],archives=files.map((path,index)=>JSON.parse(execFileSync(process.execPath,["bench/archive-evidence.mjs",path,resolve(destination,String(index)+"-"+path.split("/").at(-1)+".gz")],{encoding:"utf8"})));
writeFileSync(resolve(destination,"index.json"),JSON.stringify({archives,summary},null,2)+"\n",{flag:"wx"});console.log(JSON.stringify({passed:true,jobs:state.jobs.length,lifecycleProfiles:lifecycleOwners,controlFailures,elapsedSeconds:summary.elapsedSeconds,index:resolve(destination,"index.json")}));
