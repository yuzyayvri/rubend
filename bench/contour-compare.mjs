import assert from "node:assert/strict";
import {readFileSync,createReadStream,statSync,existsSync,writeFileSync,mkdirSync} from "node:fs";
import {createHash} from "node:crypto";
import {spawnSync} from "node:child_process";
import {resolve,dirname} from "node:path";
import {performance} from "node:perf_hooks";
import {Engine} from "../apps/engine.mjs";
import {loadCorpus} from "./corpus.mjs";
import {parseCpu} from "./fixed-time-compare.mjs";
import {apply,solved} from "../apps/model.mjs";

const identity=path=>{
  const s=statSync(path,{bigint:true});assert.ok(s.isFile());
  return Object.fromEntries(["dev","ino","size","mtimeNs","ctimeNs","mode"].map(k=>[k,String(s[k])]));
};
async function seal(path){
  const before=identity(path),digest=createHash("sha256");let bytes=0;
  for await(const chunk of createReadStream(path)){digest.update(chunk);bytes+=chunk.length;}
  assert.deepEqual(identity(path),before);
  return {path,identity:before,bytes,sha256:digest.digest("hex")};
}
const cpu=pid=>parseCpu(readFileSync("/proc/"+pid+"/stat","utf8"),pid);
const codes={forward:0,"inverse-one":1,"inverse-three":3};

export function validateContour(events,item,profile,target){
  assert.ok(events.every(e=>["measurement","candidate","done"].includes(e.type)),"Unexpected contour event");
  const done=events.at(-1),measurements=events.filter(e=>e.type==="measurement"),candidates=events.filter(e=>e.type==="candidate");
  assert.equal(events.filter(e=>e.type==="done").length,1);assert.equal(measurements.length,1);assert.equal(done.type,"done");assert.notEqual(done.reason,"time_limit");
  const measurement=measurements[0];assert.equal(measurement.profile,codes[profile]);assert.equal(measurement.target,target);
  assert.ok([0,1].includes(measurement.status));assert.equal(done.optimal,measurement.status===1?1:0);
  assert.ok(Number.isInteger(done.lower)&&done.lower>=0&&done.lower<=done.length&&done.length<=31);
  assert.ok(Number.isInteger(done.nodes)&&done.nodes>0&&done.nodes<=20000000);
  assert.ok(Number.isSafeInteger(measurement.nativeMs)&&measurement.nativeMs>=0);
  assert.equal(done.lower,measurement.bound);
  const complete=done.lower>=target||done.optimal===1;
  if(!complete)assert.equal(done.nodes,20000000,"Partial result must exhaust its fuel");
  if(done.optimal===0)assert.ok(done.lower<=target,"Completed target was overshot");
  if(done.length<31){
    assert.equal(candidates.length,1);assert.equal(measurement.moves.length,done.length);assert.equal(apply(item.facelets,measurement.moves),solved);
    assert.deepEqual(candidates[0].moves,measurement.moves);assert.equal(candidates[0].length,done.length);assert.equal(candidates[0].lower,done.lower);
  }else{assert.deepEqual(measurement.moves,[]);assert.equal(candidates.length,0);assert.equal(done.optimal,0);}
  if(item.depth!==undefined){assert.equal(done.optimal,1);assert.equal(done.length,item.depth);assert.equal(done.lower,item.depth);}
  return {measurement,done,complete};
}

async function sample(engine,item,profile,target,hz){
  const before=cpu(engine.child.pid),generation=engine.generation,events=[],started=performance.now();
  try{
    await new Promise((done,reject)=>{
      engine.solve({facelets:item.facelets,mode:"exact",budgetMs:30000},event=>{
        events.push(event);
        if(event.type==="error"||event.type==="invalid")reject(Error(JSON.stringify(event)));
        else if(event.type==="done")done();
        else if(!["measurement","candidate"].includes(event.type))reject(Error("Unexpected contour event"));
      }).catch(reject);
    });
    const after=cpu(engine.child.pid),hostMs=performance.now()-started;
    assert.equal(engine.generation,generation);assert.equal(after.startTicks,before.startTicks);assert.ok(after.ticks>=before.ticks);
    const {measurement,done,complete}=validateContour(events,item,profile,target);
    return {id:item.id,facelets:item.facelets,depth:item.depth??null,profile,target,complete,hostMs,cpuTicks:after.ticks-before.ticks,cpuMs:1000*(after.ticks-before.ticks)/hz,nativeMs:measurement.nativeMs,lower:done.lower,length:done.length,optimal:done.optimal,nodes:done.nodes,moves:measurement.moves};
  }catch(error){error.jobEvidence={id:item.id,profile,target,events,hostMs:performance.now()-started};throw error;}
}

export async function compareContours(config,configPath){
  assert.deepEqual(JSON.parse(readFileSync(configPath,"utf8")),config);
  assert.deepEqual(Object.keys(config).filter(k=>k!=="split").sort(),["binary","cache","cacheSha256","count","iterations","output","target","warmup"]);
  const split=config.split??"pilot";assert.ok(["pilot","development"].includes(split));
  assert.ok([1,5].includes(config.iterations));assert.ok([1,4,8,16].includes(config.count));
  assert.ok(Number.isInteger(config.target)&&config.target>=1&&config.target<=18);
  for(const key of ["binary","cache","warmup","output"])assert.equal(resolve(config[key]),config[key]);
  assert.ok(config.output.startsWith(resolve("build/evidence")+"/")&&!existsSync(config.output));
  const query=spawnSync("getconf",["CLK_TCK"],{encoding:"utf8"});assert.equal(query.status,0);const hz=Number(query.stdout.trim());assert.ok(hz>0);
  const files=[configPath,config.binary,config.binary+".json",config.cache,config.warmup,"bench/corpora/"+split+".txt","bench/corpora/manifest.json","bench/contour-compare.mjs","bench/fixed-time-compare.mjs","bench/corpus.mjs","apps/engine.mjs","apps/model.mjs","build/model.mjs","build/cubie.mjs","build/notation.mjs"].map(p=>resolve(p));
  const seals=[];for(const file of new Set(files))seals.push(await seal(file));
  assert.equal(seals.find(s=>s.path===config.cache).sha256,config.cacheSha256);
  const build=JSON.parse(readFileSync(config.binary+".json","utf8"));assert.equal(build.binarySha256,seals.find(s=>s.path===config.binary).sha256);
  const warmup=JSON.parse(readFileSync(config.warmup,"utf8")).records.map((r,i)=>({...r,id:"shallow-"+i}));assert.equal(warmup.length,163);
  const items=loadCorpus(split).slice(0,config.count),profiles=Object.keys(codes);
  const report={format:"rubend-contour-comparison-v1",passed:false,config,hz,build,seals,planned:{workers:config.iterations*3,shallowJobs:config.iterations*3*warmup.length,measurementJobs:config.iterations*3*items.length},rounds:[],errors:[],conditions:"Direct full-cube exact traversal from depth zero to declared lower bound, or a replay-checked optimum. Each request has 20,000,000 work-step fuel, not a time budget. CPU ticks include output; native monotonic time excludes output. Same binary and table, actual selected profile echoed by native metadata. Incomplete jobs remain in records. No instrumented observer."};
  try{
    for(let round=0;round<config.iterations;round++){
      const cohort={round,workers:[],jobs:[],status:"error"};report.rounds.push(cohort);
      const order=profiles.map((_,i)=>profiles[(i+round)%profiles.length]);
      for(const profile of order){
        for(const s of seals)assert.deepEqual(identity(s.path),s.identity);
        const saved=Object.fromEntries(["RUBEND_JOINT_CACHE","RUBEND_CONTOUR_PROFILE","RUBEND_CONTOUR_TARGET"].map(k=>[k,process.env[k]]));
        Object.assign(process.env,{RUBEND_JOINT_CACHE:config.cache,RUBEND_CONTOUR_PROFILE:profile,RUBEND_CONTOUR_TARGET:String(config.target)});
        let engine;
        try{
          engine=new Engine({binary:config.binary});await engine.ready(120000);
          const worker={profile,identity:cpu(engine.child.pid),directory:engine.directory,shallowPassed:0};cohort.workers.push(worker);
          for(const item of warmup){await sample(engine,item,profile,config.target,hz);worker.shallowPassed++;}
          for(const item of round%2?[...items].reverse():items)cohort.jobs.push(await sample(engine,item,profile,config.target,hz));
        }finally{
          if(engine){
            let forced=false;const timer=setTimeout(()=>{forced=true;engine.child?.kill("SIGKILL");},1000);
            try{await engine.close();}finally{clearTimeout(timer);}
            const worker=cohort.workers.find(w=>w.identity.pid===engine.child.pid);
            if(worker)worker.shutdown={forced,exitCode:engine.child.exitCode,signal:engine.child.signalCode,ipcRemoved:!existsSync(engine.directory)};
            assert.equal(forced,false);assert.ok(!existsSync(engine.directory));
            try{assert.notEqual(cpu(engine.child.pid).startTicks,worker?.identity.startTicks);}catch(error){if(!["ENOENT","ESRCH"].includes(error.code))throw error;}
          }
          for(const [k,v] of Object.entries(saved)){if(v===undefined)delete process.env[k];else process.env[k]=v;}
        }
      }
      cohort.status="ok";
    }
    report.passed=true;
  }catch(error){report.errors.push({message:String(error.stack??error),jobEvidence:error.jobEvidence??null});}
  finally{
    for(const s of seals)try{assert.deepEqual(await seal(s.path),s);}catch(error){report.passed=false;report.errors.push({stage:"postflight",path:s.path,message:String(error)});}
    mkdirSync(dirname(config.output),{recursive:true});writeFileSync(config.output,JSON.stringify(report)+"\n",{flag:"wx"});
  }
  return report;
}
if(process.argv[1]&&resolve(process.argv[1])===new URL(import.meta.url).pathname){
  assert.equal(process.argv.length,3);const path=resolve(process.argv[2]),report=await compareContours(JSON.parse(readFileSync(path,"utf8")),path);
  console.log(JSON.stringify({passed:report.passed,errors:report.errors,output:report.config.output,jobs:report.rounds.flatMap(r=>r.jobs).length}));if(!report.passed)process.exitCode=1;
}
