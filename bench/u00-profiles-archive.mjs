import assert from "node:assert/strict";
import {readFileSync,writeFileSync,mkdirSync} from "node:fs";
import {resolve} from "node:path";
import {execFileSync} from "node:child_process";
import {createHash} from "node:crypto";
import {nativeIdentity} from "./startup-measure.mjs";

const id=process.argv[2];assert.equal(process.argv.length,3);assert.match(id,/^u00-profiles-[a-z0-9-]+$/);
const directory=resolve("build/experiments",id),planPath=resolve("build/evidence",id+"-plan.json"),read=p=>JSON.parse(readFileSync(p,"utf8")),hash=p=>createHash("sha256").update(readFileSync(p)).digest("hex");
const plan=read(planPath),statusPath=resolve(directory,"status.json"),state=read(statusPath);assert.equal(state.state,"passed");assert.notEqual(nativeIdentity(state.worker.pid)?.startTicks,state.worker.startTicks);
for(const [path,expected]of Object.entries(plan.sourceHashes))assert.equal(hash(path),expected,"Source seal changed: "+path);
for(const job of state.jobs){assert.equal(job.state,"passed");assert.equal(hash(job.receipt),job.receiptSha256);const receipt=read(job.receipt);assert.equal(receipt.exitCode,0);assert.equal(receipt.stoppedFor,null);}
const specPath=plan.jobs[0].command.at(-1),spec=read(specPath),profilesPath=resolve(directory,"profiles.json"),gatesPath=resolve(directory,"gates.json"),profiles=read(profilesPath);assert.equal(profiles.passed,true);assert.equal(read(gatesPath).passed,true);assert.equal(profiles.results.length,6);
const paths=[planPath,statusPath,specPath,...state.jobs.map(j=>j.receipt),gatesPath,profilesPath];
for(const profile of spec.profiles)for(const test of["engine","http","native-lifecycle","native-control-failures"]){
  const path=resolve(directory,profile.id+"-"+test+".json"),record=read(path);assert.equal(record.passed,true);assert.equal(record.profile,profile.id);assert.equal(record.test,test);assert.equal(record.binarySha256,read(profile.binary+".json").binarySha256);
  if(test==="native-lifecycle"){const result=JSON.parse(record.stdout);assert.equal(result.ipcRemoved,true);assert.equal(result.sameTableOwner,true);for(const row of result.observations)assert.equal(nativeIdentity(row.pid),null);}
  if(test==="native-control-failures"){const result=JSON.parse(record.stdout);assert.equal(result.rows.length,5);for(const row of result.rows){assert.equal(row.processRemoved,true);assert.equal(row.ipcRemoved,true);assert.equal(row.errorSettled,true);}}
  paths.push(path);
}
const destination=resolve("docs/verification/next-plan/U00",id);mkdirSync(destination);
const archives=paths.map((p,index)=>JSON.parse(execFileSync(process.execPath,["bench/archive-evidence.mjs",p,resolve(destination,index+"-"+p.split("/").at(-1)+".gz")],{encoding:"utf8"})));
const summary={format:"rubend-u00-profile-archive-v1",passed:true,revision:plan.revision,startedAt:state.startedAt,finishedAt:state.finishedAt,profiles:profiles.results,realControlFailures:30,noNativeRebuild:true,performanceClaim:false,browserCoverage:false,independentReview:false};
writeFileSync(resolve(destination,"index.json"),JSON.stringify({summary,archives},null,2)+"\n",{flag:"wx"});console.log(JSON.stringify(summary));
