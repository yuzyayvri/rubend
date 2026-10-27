import assert from "node:assert/strict";
import {readFileSync,writeFileSync,mkdirSync,existsSync,openSync,closeSync,renameSync} from "node:fs";
import {resolve} from "node:path";
import {spawn,spawnSync} from "node:child_process";
import {createHash} from "node:crypto";
import {fileURLToPath} from "node:url";
import {fileHash} from "./bounded-file-hash.mjs";

const root=resolve(fileURLToPath(new URL("..",import.meta.url))),self=fileURLToPath(import.meta.url),hash=bytes=>createHash("sha256").update(bytes).digest("hex");process.chdir(root);
const [mode,argument]=process.argv.slice(2);assert.ok(["start","run","status"].includes(mode));assert.ok(argument);assert.equal(process.argv.length,4);
const planPath=resolve(argument),bytes=readFileSync(planPath),plan=JSON.parse(bytes),planSha256=hash(bytes);
assert.equal(plan.format,"rubend-background-tests-v1");assert.match(plan.id,/^[a-z0-9-]+$/);assert.equal(resolve(plan.root),root);assert.match(plan.revision,/^[a-f0-9]{40}$/);assert.ok(plan.jobs.length>0);
const directory=resolve("build/experiments",plan.id),statusPath=resolve(directory,"status.json");
for(const job of plan.jobs){assert.match(job.id,/^[a-z0-9-]+$/);assert.equal(job.command[0],process.execPath);assert.ok(job.command.every(value=>typeof value==="string"&&!value.includes("\0")));assert.ok(Number.isInteger(job.seconds)&&job.seconds>0&&job.seconds<=1800);assert.ok(Number.isInteger(job.memoryMiB)&&job.memoryMiB>=128&&job.memoryMiB<=16384);assert.ok(job.cpus.length>=1&&job.cpus.length<=4);}
assert.equal(new Set(plan.jobs.map(job=>job.id)).size,plan.jobs.length);
function identity(pid){try{const raw=readFileSync("/proc/"+pid+"/stat","utf8"),fields=raw.slice(raw.lastIndexOf(")")+2).trim().split(/\s+/);return{pid,startTicks:fields[19]};}catch{return null;}}
function status(){const value=JSON.parse(readFileSync(statusPath,"utf8"));assert.equal(value.planSha256,planSha256,"Existing run belongs to another plan");const live=value.worker&&identity(value.worker.pid);return{...value,workerAlive:Boolean(live&&live.startTicks===value.worker.startTicks)};}
function verify(){const result=spawnSync("git",["rev-parse","HEAD"],{encoding:"utf8"});assert.equal(result.status,0);assert.equal(result.stdout.trim(),plan.revision,"Revision changed during unattended checks");for(const [path,expected]of Object.entries(plan.sourceHashes))assert.equal(fileHash(resolve(root,path)),expected,"Source changed during unattended checks: "+path);}
if(mode==="status"){console.log(JSON.stringify(status(),null,2));process.exit();}
if(mode==="start"){
  if(existsSync(directory)){assert.ok(existsSync(statusPath),"Incomplete launch directory preserved; use a fresh run id");console.log(JSON.stringify(status(),null,2));process.exit();}
  verify();mkdirSync(directory);writeFileSync(resolve(directory,"plan.json"),bytes,{flag:"wx"});
  const state={format:"rubend-background-test-status-v1",planSha256,state:"starting",startedAt:new Date().toISOString(),jobs:[],worker:null};writeFileSync(statusPath,JSON.stringify(state,null,2)+"\n",{flag:"wx"});
  const log=openSync(resolve(directory,"worker.log"),"wx");let child;try{child=spawn(process.execPath,[self,"run",planPath],{cwd:root,env:process.env,detached:true,stdio:["ignore",log,log]});}finally{closeSync(log);}
  await new Promise((done,reject)=>{child.once("spawn",done);child.once("error",reject);});child.unref();
  console.log(JSON.stringify({started:true,id:plan.id,pid:child.pid,statusPath,log:resolve(directory,"worker.log"),automaticModelWakeups:false}));process.exit();
}
let state=status();assert.equal(state.state,"starting","Run already started; never repeat immutable jobs");state.worker=identity(process.pid);state.state="running";
function save(){const temporary=resolve(directory,"status-"+process.pid+".tmp");writeFileSync(temporary,JSON.stringify(state,null,2)+"\n");renameSync(temporary,statusPath);}
save();
try{
  assert.equal(hash(readFileSync(resolve(directory,"plan.json"))),planSha256);verify();
  for(const job of plan.jobs){
    verify();const name=plan.id+"-"+job.id,receipt=resolve("build/evidence",name+".json"),row={id:job.id,state:"running",startedAt:new Date().toISOString(),receipt};assert.equal(existsSync(receipt),false,"Existing receipt must never be overwritten");state.jobs.push(row);save();
    const log=openSync(resolve(directory,job.id+".log"),"wx");let result;try{result=spawnSync(process.execPath,["bench/run-limited.mjs",name,String(job.memoryMiB),String(job.seconds),job.cpus.join(","),...job.command],{cwd:root,env:process.env,stdio:["ignore",log,log],timeout:(job.seconds+15)*1000});}finally{closeSync(log);}
    row.finishedAt=new Date().toISOString();row.exitCode=result.status;row.signal=result.signal;assert.ifError(result.error);assert.equal(result.status,0,"Job failed; read "+job.id+".log");const record=JSON.parse(readFileSync(receipt,"utf8"));assert.equal(record.exitCode,0);assert.equal(record.stoppedFor,null);row.receiptSha256=hash(readFileSync(receipt));verify();row.state="passed";save();
  }
  state.state="passed";
}catch(error){state.state="failed";state.error=String(error.stack??error);const current=state.jobs.at(-1);if(current?.state==="running")current.state="failed";}
finally{state.finishedAt=new Date().toISOString();save();}
process.exitCode=state.state==="passed"?0:1;
