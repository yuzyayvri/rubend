import assert from "node:assert/strict";
import {readFileSync,writeFileSync,existsSync} from "node:fs";
import {resolve} from "node:path";
import {spawnSync} from "node:child_process";
import {createHash,randomUUID} from "node:crypto";

const hash=bytes=>createHash("sha256").update(bytes).digest("hex"),revision=spawnSync("git",["rev-parse","HEAD"],{encoding:"utf8"}).stdout.trim(),rows=[];
function invoke(mode,path){const result=spawnSync(process.execPath,["bench/background-tests.mjs",mode,path],{encoding:"utf8",timeout:10000});assert.ifError(result.error);assert.equal(result.status,0,result.stderr);return JSON.parse(result.stdout);}
for(const type of["pass","fail","drift"]){
  const id="background-fixture-"+randomUUID(),path=resolve("build/evidence",id+"-plan.json"),fixture=resolve("build/evidence",id+"-input.txt");writeFileSync(fixture,"before",{flag:"wx"});
  const body=type==="pass"?"console.log('fixture passed')":type==="fail"?"process.exit(7)":"require('node:fs').writeFileSync("+JSON.stringify(fixture)+",'changed')";
  const job={id:"first",memoryMiB:128,seconds:10,cpus:[2],command:[process.execPath,"-e",body]},plan={format:"rubend-background-tests-v1",id,root:process.cwd(),revision,sourceHashes:{[fixture]:hash("before")},jobs:[job,...type==="fail"?[{...job,id:"must-not-run",command:[process.execPath,"-e","console.log('unexpected')"]}]:[]]};
  writeFileSync(path,JSON.stringify(plan)+"\n",{flag:"wx"});const launch=invoke("start",path);assert.equal(launch.started,true);
  const repeated=invoke("start",path);assert.ok(["starting","running","passed","failed"].includes(repeated.state));
  let state;const started=performance.now();for(;;){state=invoke("status",path);if(["passed","failed"].includes(state.state))break;assert.ok(performance.now()-started<30000,"Background fixture timeout");await new Promise(done=>setTimeout(done,100));}
  assert.equal(state.state,type==="pass"?"passed":"failed");assert.equal(state.jobs.length,1);
  if(type==="fail"){assert.equal(state.jobs[0].exitCode,7);assert.equal(existsSync(resolve("build/evidence",id+"-must-not-run.json")),false);}
  if(type==="drift")assert.match(state.error,/Source changed during unattended checks/);
  const receipt=readFileSync(state.jobs[0].receipt),last=invoke("start",path);assert.equal(last.state,state.state);assert.deepEqual(readFileSync(state.jobs[0].receipt),receipt);
  rows.push({type,state:state.state,duplicateLaunchDidNotRepeat:true,receiptPreserved:true,sourceChangeDetected:type==="drift",directory:resolve("build/experiments",id)});
}
console.log(JSON.stringify({passed:true,rows,detachedExecution:true,failFast:true,automaticModelWakeups:false}));
