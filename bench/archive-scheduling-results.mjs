import assert from "node:assert/strict";
import {readFileSync,writeFileSync,mkdirSync} from "node:fs";
import {resolve} from "node:path";
import {execFileSync} from "node:child_process";
import {createHash} from "node:crypto";

assert.equal(process.argv.length,3,"Expected completed scheduling queue id");const id=process.argv[2];assert.match(id,/^[a-z0-9-]+$/);
const hash=bytes=>createHash("sha256").update(bytes).digest("hex"),read=path=>JSON.parse(readFileSync(path,"utf8")),directory=resolve("build/experiments",id),planPath=resolve("build/evidence",id+"-plan.json"),plan=read(planPath),state=read(resolve(directory,"status.json"));
assert.equal(state.state,"passed");assert.equal(state.planSha256,hash(readFileSync(planPath)));assert.equal(state.jobs.length,3);
for(const [path,expected]of Object.entries(plan.sourceHashes))assert.equal(hash(readFileSync(path)),expected);
const receipts=state.jobs.map(job=>{const bytes=readFileSync(job.receipt),record=JSON.parse(bytes);assert.equal(job.state,"passed");assert.equal(hash(bytes),job.receiptSha256);assert.equal(record.exitCode,0);assert.equal(record.stoppedFor,null);return job.receipt;});
const manifest=read(resolve(directory,"source-manifest.json"));for(const [path,expected]of Object.entries(manifest.outputHashes))assert.equal(hash(readFileSync(path)),expected);
const build=read(resolve(directory,"build-result.json"));assert.equal(build.passed,true);assert.equal(build.budgets.length,15);
const results={};
for(const policy of["short-first","exact-reserve"]){
  const result=read(resolve(directory,policy+"-result.json")),report=read(resolve(directory,policy+"-report.json"));assert.equal(result.passed,true);assert.equal(result.nativeJobs,1750);assert.equal(report.passed,true);assert.equal(report.counts.errors,0);assert.equal(report.counts.successfulJobs,1750);assert.ok(result.independentCandidateReplays>0);assert.equal(report.rounds.length,5);
  for(const round of report.rounds)for(const worker of round.workers)assert.ok(worker.shutdown.ipcRemoved&&!worker.shutdown.forced);
  const groups=Object.fromEntries(Object.entries(result.score.groups).map(([name,group])=>{const before=group.profiles.reference[0],after=group.profiles[policy][0];return[name,{referenceP95Ms:before.p95FirstMs,candidateP95Ms:after.p95FirstMs,latencyFloorPassed:after.p95FirstMs<=before.p95FirstMs*1.05,...group.comparison[0]}];}));
  results[policy]={groups,nativeJobs:result.nativeJobs,independentCandidateReplays:result.independentCandidateReplays,disposition:"Reject promotion. Deadline lengths tie, but a Superflip lower bound and first-answer p95 regress. No default change."};
  assert.equal(groups.superflip.paired.lowerLosses,1);assert.equal(groups.superflip.latencyFloorPassed,false);
}
const summary={format:"rubend-scheduling-disposition-v1",passed:true,planRevision:plan.revision,elapsedSeconds:(Date.parse(state.finishedAt)-Date.parse(state.startedAt))/1000,results,independentReview:false,claim:"Finite five-cohort policy comparisons on reused canaries. Not a general speed or playing-strength ranking. Source layout and uncontrolled desktop activity limit cross-run timing comparisons."};
const summaryPath=resolve(directory,"disposition.json");writeFileSync(summaryPath,JSON.stringify(summary,null,2)+"\n",{flag:"wx"});const destination=resolve("docs/verification",id);mkdirSync(destination);
const files=[planPath,resolve(directory,"status.json"),resolve(directory,"source-manifest.json"),resolve(directory,"build-result.json"),...receipts,...["short-first","exact-reserve"].flatMap(policy=>["config","report","score","result"].map(kind=>resolve(directory,policy+"-"+kind+".json"))),summaryPath];
const archives=files.map((path,index)=>JSON.parse(execFileSync(process.execPath,["bench/archive-evidence.mjs",path,resolve(destination,String(index)+"-"+path.split("/").at(-1)+".gz")],{encoding:"utf8"})));
writeFileSync(resolve(destination,"index.json"),JSON.stringify({archives,summary},null,2)+"\n",{flag:"wx"});console.log(JSON.stringify({passed:true,elapsedSeconds:summary.elapsedSeconds,policies:Object.keys(results),nativeJobs:3500,index:resolve(destination,"index.json")}));
