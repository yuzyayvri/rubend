import assert from "node:assert/strict";
import {spawn} from "node:child_process";
import {nativeIdentity} from "../bench/startup-measure.mjs";
import {settleOwnedProcesses} from "../bench/owned-process-settlement.mjs";

const rows=[];
for(const delayed of[false,true]){
  const child=spawn(process.execPath,["-e",'process.on("SIGTERM",()=>setTimeout(()=>process.exit(0),60));setInterval(()=>{},1000);process.stdout.write("ready\\n")'],{stdio:["ignore","pipe","inherit"]}),closed=new Promise(done=>child.once("close",(code,signal)=>done({code,signal})));
  try{
    await new Promise((done,reject)=>{child.stdout.once("data",done);child.once("error",reject);});const owner={...nativeIdentity(child.pid),ipcDirectory:null};assert.ok(owner.startTicks);
    if(delayed)child.kill("SIGTERM");const result=await settleOwnedProcesses([owner],delayed?1000:20);rows.push({delayed,...result});assert.equal(result.initial[0].ownerGone,false);assert.equal(result.complete,delayed,"A terminating owner must settle; an unchanged live owner must still fail");assert.equal(result.cleanup[0].ownerGone,delayed);
    if(delayed){assert.deepEqual(await closed,{code:0,signal:null});assert.equal((await settleOwnedProcesses([owner],1)).complete,true);}
  }finally{if(nativeIdentity(child.pid))child.kill("SIGKILL");await closed;}
}
for(const limit of[0,-1,1.5,5001])await assert.rejects(settleOwnedProcesses([],limit));
console.log(JSON.stringify({passed:true,realProcessControls:rows,invalidLimitsRejected:4,performanceMeasurement:false}));
