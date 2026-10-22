import assert from "node:assert/strict";
import {mkdirSync,writeFileSync} from "node:fs";
import {resolve} from "node:path";
import {createHash,randomBytes} from "node:crypto";
import {execFileSync} from "node:child_process";
import {checkBackgroundResults} from "../bench/check-background-results.mjs";
import {nativeIdentity} from "../bench/startup-measure.mjs";

const hash=b=>createHash("sha256").update(b).digest("hex"),head=execFileSync("git",["rev-parse","HEAD"],{encoding:"utf8"}).trim();let rejected=0;
mkdirSync(resolve("build/experiments"),{recursive:true});mkdirSync(resolve("build/evidence"),{recursive:true});
for(const mode of["good","unfinished","source","receipt","worker","revision","jobs","command","limits"]){
  const id="u02-result-fixture-"+randomBytes(8).toString("hex"),directory=resolve("build/experiments",id),source=resolve(directory,"source.json"),receipt=resolve(directory,"receipt.json");mkdirSync(directory);writeFileSync(source,"{}\n");const job={id:"fixture",command:[process.execPath,"fixture"],memoryMiB:128,seconds:1,cpus:[2]},resource={format:"rubend-local-experiment-v1",command:mode==="command"?[process.execPath,"wrong"]:job.command,limits:{memoryMiB:mode==="limits"?256:128,seconds:1,cpus:[2]},exitCode:0,stoppedFor:null},resourceBytes=JSON.stringify(resource);writeFileSync(receipt,resourceBytes);
  const plan={format:"rubend-background-tests-v1",id,root:process.cwd(),revision:mode==="revision"?"0".repeat(40):head,sourceHashes:{[source]:mode==="source"?"0".repeat(64):hash("{}\n")},jobs:mode==="jobs"?[job,{...job,id:"missing"}]:[job]},bytes=JSON.stringify(plan),state={state:mode==="unfinished"?"running":"passed",planSha256:hash(bytes),worker:mode==="worker"?nativeIdentity(process.pid):{pid:2147483647,startTicks:"0"},jobs:[{id:"fixture",state:"passed",receipt,receiptSha256:mode==="receipt"?"0".repeat(64):hash(resourceBytes)}]};writeFileSync(resolve("build/evidence",id+"-plan.json"),bytes);writeFileSync(resolve(directory,"plan.json"),bytes);writeFileSync(resolve(directory,"status.json"),JSON.stringify(state));
  if(mode==="good")assert.equal((await checkBackgroundResults(id,false)).passed,true);else{const expected={unfinished:/not passed/,source:/Source seal mismatch/,receipt:/Resource digest mismatch/,worker:/still alive/,revision:/Revision changed/,jobs:/Job count mismatch/,command:/Resource command mismatch/,limits:/Resource limit mismatch/}[mode];await assert.rejects(checkBackgroundResults(id,false),expected);rejected++;}
}
console.log(JSON.stringify({passed:true,validFixture:true,rejectedFixtures:rejected,archiveSideEffectsInTests:false}));
