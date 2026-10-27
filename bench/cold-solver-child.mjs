import assert from "node:assert/strict";
import {createInterface} from "node:readline";
import {Engine} from "../apps/engine.mjs";
import {validate} from "../apps/model.mjs";
import {nativeIdentity} from "./startup-measure.mjs";

let job=null,engine=null,stopping=false;const input=createInterface({input:process.stdin}),emit=(type,data={})=>process.stdout.write("RUBEND_COLD "+JSON.stringify({format:"rubend-cold-event-v1",id:job.id,type,...data})+"\n");
async function run(){
  let terminal=null;
  try{
    assert.ok(["rubend","cubing-min2phase"].includes(job.solver));validate(job.facelets);assert.ok(Number.isInteger(job.budgetMs)&&job.budgetMs>=50&&job.budgetMs<=30000);
    if(job.solver==="rubend"){
      engine=new Engine({binary:job.binary});const owner=nativeIdentity(engine.child.pid);assert.ok(owner);emit("owner",{...owner,directory:engine.directory});await engine.ready(30000);if(stopping)return;emit("phase",{phase:"native-ready"});
      await new Promise((done,reject)=>{engine.solve({facelets:job.facelets,mode:"fast",budgetMs:job.budgetMs},event=>{if(stopping){if(event.type==="error")done();return;}if(event.type==="candidate")emit("candidate",{moves:event.moves,native:event});else if(event.type==="progress")emit("bound",{native:event});else if(event.type==="done"){if(event.reason==="time_limit")reject(Error("Engine emergency watchdog is not native completion"));else{terminal=event;done();}}else reject(Error(JSON.stringify(event)));}).catch(reject);});
    }else{
      const[{puzzles},{KPattern},{experimentalSolve3x3x3IgnoringCenters,setSearchDebug},{patternData}]=await Promise.all([import("cubing/puzzles"),import("cubing/kpuzzle"),import("cubing/search"),import("../tests/support.mjs")]);setSearchDebug({logPerf:false});const puzzle=await puzzles["3x3x3"].kpuzzle(),pattern=new KPattern(puzzle,patternData(validate(job.facelets)));emit("phase",{phase:"input-prepared-not-solver-ready"});const algorithm=await experimentalSolve3x3x3IgnoringCenters(pattern);if(!stopping){const{parseReferenceHtm}=await import("./final-comparison-records.mjs");emit("candidate",{moves:parseReferenceHtm(algorithm.toString())});terminal={referenceReturned:true};}
    }
    if(!stopping)emit("done",{terminal});
  }catch(error){if(!stopping){emit("error",{message:String(error.stack??error)});process.exitCode=1;}}
  finally{if(engine){await engine.close();emit("phase",{phase:"native-closed",nativeSignal:engine.child.signalCode});}if(stopping)emit("stopped",{processOwnedCancellation:true});input.close();process.stdin.destroy();}
}
input.on("line",line=>{try{assert.ok(line.length<=8192);const message=JSON.parse(line);if(message.type==="start"){assert.equal(job,null);job=message;void run();}else{assert.equal(message.type,"stop");assert.ok(job&&message.id===job.id);if(stopping)return;stopping=true;if(engine)void engine.close();else if(job.solver==="cubing-min2phase"){emit("stopped",{processOwnedCancellation:true,workerThreadCancellation:"Owned process exit"});input.close();process.stdout.write("",()=>process.exit(0));}}}catch(error){process.stderr.write(String(error.stack??error)+"\n");process.exitCode=1;stopping=true;void engine?.close();input.close();process.stdin.destroy();}});
