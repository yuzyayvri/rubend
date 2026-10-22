import assert from "node:assert/strict";
import {readFileSync,readdirSync,writeFileSync,mkdirSync,existsSync,createReadStream} from "node:fs";
import {resolve,basename} from "node:path";
import {fileURLToPath} from "node:url";
import {createHash} from "node:crypto";
import {execFileSync} from "node:child_process";
import {gunzipSync} from "node:zlib";
import {nativeIdentity} from "./startup-measure.mjs";

const root=fileURLToPath(new URL("..",import.meta.url)),read=p=>JSON.parse(readFileSync(p,"utf8")),hashBytes=b=>createHash("sha256").update(b).digest("hex");
async function hashFile(path){const h=createHash("sha256");for await(const chunk of createReadStream(path))h.update(chunk);return h.digest("hex");}
export async function checkBackgroundResults(id,archive=true){
  assert.match(id,/^u\d{2}-[a-z0-9-]+$/);const directory=resolve(root,"build/experiments",id),planPath=resolve(root,"build/evidence",id+"-plan.json"),statusPath=resolve(directory,"status.json"),plan=read(planPath),state=read(statusPath),planHash=await hashFile(planPath);
  assert.equal(plan.format,"rubend-background-tests-v1");assert.equal(plan.id,id);assert.equal(resolve(plan.root),resolve(root));assert.equal(state.state,"passed","Background run is not passed");assert.equal(state.planSha256,planHash,"Plan digest mismatch");assert.equal(await hashFile(resolve(directory,"plan.json")),planHash,"Copied plan mismatch");assert.equal(execFileSync("git",["rev-parse","HEAD"],{cwd:root,encoding:"utf8"}).trim(),plan.revision,"Revision changed since the completed run");assert.equal(state.jobs.length,plan.jobs.length,"Job count mismatch");assert.ok(state.worker);assert.notEqual(nativeIdentity(state.worker.pid)?.startTicks,state.worker.startTicks,"Background worker is still alive");
  for(const[path,expected]of Object.entries(plan.sourceHashes))assert.equal(await hashFile(resolve(root,path)),expected,"Source seal mismatch: "+path);
  for(let i=0;i<plan.jobs.length;i++){const job=plan.jobs[i],row=state.jobs[i];assert.equal(row.id,job.id);assert.equal(row.state,"passed");assert.equal(await hashFile(row.receipt),row.receiptSha256,"Resource digest mismatch");const resource=read(row.receipt);assert.equal(resource.format,"rubend-local-experiment-v1");assert.equal(resource.exitCode,0);assert.equal(resource.stoppedFor,null);assert.deepEqual(resource.command,job.command,"Resource command mismatch");for(const k of["memoryMiB","seconds","cpus"])assert.deepEqual(resource.limits[k],job[k],"Resource limit mismatch: "+k);}
  const summary={passed:true,id,revision:plan.revision,sourceSeals:Object.keys(plan.sourceHashes).length,jobs:state.jobs.length,workerGone:true,resourceStops:false,independentReview:false};if(!archive)return summary;
  const destination=resolve(root,"docs/verification/next-plan","U"+id.slice(1,3),id),paths=[planPath,statusPath,...state.jobs.map(j=>j.receipt),...readdirSync(directory).filter(p=>p.endsWith(".json")&&!["plan.json","status.json"].includes(p)).map(p=>resolve(directory,p))],archives=[];mkdirSync(destination,{recursive:true});
  for(const[i,path]of [...new Set(paths)].entries()){const name=i+"-"+basename(path)+".gz",target=resolve(destination,name);if(!existsSync(target))execFileSync(process.execPath,[resolve(root,"bench/archive-evidence.mjs"),path,target],{cwd:root,encoding:"utf8"});const bytes=readFileSync(target),decoded=gunzipSync(bytes);assert.equal(hashBytes(decoded),await hashFile(path),"Existing archive differs from source");JSON.parse(decoded.toString("utf8"));archives.push({path:name,sha256:hashBytes(decoded),compressedSha256:hashBytes(bytes)});}
  const index={format:"rubend-background-archive-v1",...summary,startedAt:state.startedAt,finishedAt:state.finishedAt,archives},indexPath=resolve(destination,"index.json");if(existsSync(indexPath))assert.deepEqual(read(indexPath),index,"Existing archive index differs");else writeFileSync(indexPath,JSON.stringify(index,null,2)+"\n",{flag:"wx"});return{...summary,index:indexPath,archives:archives.length};
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){assert.ok(process.argv.length===3||(process.argv.length===4&&process.argv[3]==="--verify-only"));console.log(JSON.stringify(await checkBackgroundResults(process.argv[2],process.argv[3]!=="--verify-only")));}
