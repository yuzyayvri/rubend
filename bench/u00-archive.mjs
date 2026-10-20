import assert from "node:assert/strict";
import {readFileSync,writeFileSync,mkdirSync,existsSync} from "node:fs";
import {resolve} from "node:path";
import {execFileSync} from "node:child_process";
import {createHash} from "node:crypto";
import {nativeIdentity} from "./startup-measure.mjs";

const id=process.argv[2];assert.equal(process.argv.length,3);assert.match(id,/^u00-[a-z0-9-]+$/);
const directory=resolve("build/experiments",id),planPath=resolve("build/evidence",id+"-plan.json"),read=p=>JSON.parse(readFileSync(p,"utf8")),hash=p=>createHash("sha256").update(readFileSync(p)).digest("hex");
const plan=read(planPath),statusPath=resolve(directory,"status.json"),state=read(statusPath);assert.equal(state.state,"passed");assert.equal(state.planSha256,hash(planPath));
for(const [p,h]of Object.entries(plan.sourceHashes))assert.equal(hash(p),h,"Changed source: "+p);
assert.equal(state.jobs.length,plan.jobs.length);
for(const job of state.jobs){assert.equal(job.state,"passed");assert.equal(hash(job.receipt),job.receiptSha256);const r=read(job.receipt);assert.equal(r.exitCode,0);assert.equal(r.stoppedFor,null);}
const reports=["small","raw"].map(kind=>resolve(directory,kind+"-aa-report.json"));
for(const p of reports){const r=read(p);assert.equal(r.passed,true);for(const w of r.rounds.flatMap(round=>round.workers)){assert.notDeepEqual(nativeIdentity(w.processIdentity.pid),w.processIdentity);assert.equal(existsSync(w.ipcDirectory),false);assert.equal(w.shutdown.forced,false);}}
const destination=resolve("docs/verification/next-plan/U00",id);mkdirSync(destination);
const paths=[planPath,statusPath,...state.jobs.map(j=>j.receipt),resolve(directory,"inventory.json"),...reports,...["small","raw"].map(k=>resolve(directory,k+"-aa-diagnostic.json"))];
const archives=paths.map((p,index)=>JSON.parse(execFileSync(process.execPath,["bench/archive-evidence.mjs",p,resolve(destination,index+"-"+p.split("/").at(-1)+".gz")],{encoding:"utf8"})));
const summary={format:"rubend-u00-archive-v1",passed:true,revision:plan.revision,startedAt:state.startedAt,finishedAt:state.finishedAt,elapsedSeconds:(Date.parse(state.finishedAt)-Date.parse(state.startedAt))/1000,successfulJobs:reports.reduce((sum,p)=>sum+read(p).counts.successfulJobs,0),verdicts:Object.fromEntries(["small","raw"].map(k=>[k,read(resolve(directory,k+"-aa-diagnostic.json")).verdict])),independentReview:false};
writeFileSync(resolve(destination,"index.json"),JSON.stringify({summary,archives},null,2)+"\n",{flag:"wx"});console.log(JSON.stringify(summary));
