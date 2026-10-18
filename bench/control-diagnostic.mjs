import assert from "node:assert/strict";
import {readFileSync,readdirSync} from "node:fs";
import {spawnSync} from "node:child_process";
import {createHash} from "node:crypto";
import {Engine} from "../apps/engine.mjs";
import {parseCpu} from "./fixed-time-compare.mjs";

assert.equal(process.argv.length,3);
const config=JSON.parse(readFileSync(process.argv[2],"utf8")),hz=Number(spawnSync("getconf",["CLK_TCK"],{encoding:"utf8"}).stdout.trim());
assert.equal(config.profiles.length,2);assert.ok(hz>0);
function snapshot(pid){
  const status=readFileSync(`/proc/${pid}/status`,"utf8");
  return {cpu:parseCpu(readFileSync(`/proc/${pid}/stat`,"utf8"),pid),voluntary:Number(status.match(/^voluntary_ctxt_switches:\s+(\d+)/m)[1]),involuntary:Number(status.match(/^nonvoluntary_ctxt_switches:\s+(\d+)/m)[1]),tasks:readdirSync(`/proc/${pid}/task`).map(Number)};
}
const result={format:"rubend-control-io-diagnostic-v1",claim:"One instrumented job per profile. Not a performance comparison or promotion result.",rows:[]};
for(const profile of config.profiles){
  const saved=Object.fromEntries(Object.keys(profile.env).map(k=>[k,process.env[k]]));Object.assign(process.env,profile.env);
  const engine=new Engine({binary:profile.binary}),row={profile:profile.id,binarySha256:createHash("sha256").update(readFileSync(profile.binary)).digest("hex"),events:[]};result.rows.push(row);
  try{
    await engine.ready(120000);row.pid=engine.child.pid;row.before=snapshot(row.pid);row.startedUnixMs=Date.now();
    await new Promise((done,reject)=>{
      const timer=setTimeout(()=>reject(Error("Diagnostic watchdog")),5000);
      engine.solve({facelets:config.cases[0].facelets,mode:"exact",budgetMs:2000},event=>{
        row.events.push(event);
        if(["error","invalid"].includes(event.type)){clearTimeout(timer);reject(Error(JSON.stringify(event)));}
        if(event.type==="done"){clearTimeout(timer);if(event.reason==="time_limit")reject(Error("Host timeout is not native completion"));else done();}
      }).catch(error=>{clearTimeout(timer);reject(error);});
    });
    row.finishedUnixMs=Date.now();row.after=snapshot(row.pid);row.cpuMs=(row.after.cpu.ticks-row.before.cpu.ticks)*1000/hz;
    row.voluntary=row.after.voluntary-row.before.voluntary;row.involuntary=row.after.involuntary-row.before.involuntary;
  }finally{await engine.close();for(const [k,v]of Object.entries(saved))if(v===undefined)delete process.env[k];else process.env[k]=v;}
}
console.log(JSON.stringify(result,null,2));
