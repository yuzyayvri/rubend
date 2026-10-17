import assert from "node:assert/strict";
import {readFileSync,writeFileSync,mkdirSync,createReadStream,existsSync,statSync} from "node:fs";
import {createHash} from "node:crypto";
import {resolve,dirname,isAbsolute} from "node:path";
import {fileURLToPath} from "node:url";
import {spawnSync} from "node:child_process";
import {performance} from "node:perf_hooks";
import {Engine} from "../apps/engine.mjs";
import {validate} from "../apps/model.mjs";
import {loadCorpus} from "./corpus.mjs";
import {apply,solved} from "./fixed-work-model.mjs";

const root=fileURLToPath(new URL("../",import.meta.url));
const hash=bytes=>createHash("sha256").update(bytes).digest("hex");

export function parseCpu(raw,pid){
  assert.ok(Number.isSafeInteger(pid)&&pid>0);
  assert.ok(raw.startsWith(pid+" ("));
  const fields=raw.slice(raw.lastIndexOf(")")+2).trim().split(/\s+/);
  for(const index of [11,12,19])assert.match(fields[index]??"",/^\d+$/,"Invalid process CPU fields");
  const ticks=Number(fields[11])+Number(fields[12]);assert.ok(Number.isSafeInteger(ticks));
  return {pid,startTicks:fields[19],ticks};
}

const cpu=pid=>parseCpu(readFileSync("/proc/"+pid+"/stat","utf8"),pid);
const distribution=values=>{const a=[...values].sort((a,b)=>a-b),m=Math.floor(a.length/2);return {count:a.length,median:a.length%2?a[m]:(a[m-1]+a[m])/2,minimum:a[0],maximum:a.at(-1)};};

async function seal(path){
  const before=identity(path);
  const stream=createReadStream(path),digest=createHash("sha256");let bytes=0;
  for await(const chunk of stream){bytes+=chunk.length;digest.update(chunk);}
  assert.deepEqual(identity(path),before,"Fixed-time input changed while hashing");
  assert.equal(String(bytes),before.size);
  return {path,identity:before,bytes,sha256:digest.digest("hex")};
}

function identity(path){
  const s=statSync(path,{bigint:true});assert.ok(s.isFile(),"Fixed-time input must be a regular file");
  return Object.fromEntries(["dev","ino","size","mtimeNs","ctimeNs","mode"].map(k=>[k,String(s[k])]));
}

async function sample(engine,item,group,hz){
  const before=cpu(engine.child.pid),generation=engine.generation,events=[],started=performance.now();
  try{
  await new Promise((done,reject)=>{
    engine.solve({facelets:item.facelets,mode:group==="fast"?"fast":"exact",budgetMs:10000},event=>{
      events.push(event);
      if(event.type==="error"||event.type==="invalid")reject(Error(JSON.stringify(event)));
      else if(event.type==="done")done();
      else if(!["candidate","snapshot","measurement"].includes(event.type))reject(Error("Unexpected benchmark event "+event.type));
    }).catch(reject);
  });
  const after=cpu(engine.child.pid),hostMs=performance.now()-started;
  assert.equal(engine.generation,generation);
  assert.equal(after.startTicks,before.startTicks);assert.ok(after.ticks>=before.ticks);
  const snapshots=events.filter(e=>e.type==="snapshot"),timings=events.filter(e=>e.type==="measurement"),done=events.at(-1);
  assert.equal(snapshots.length,1);assert.equal(timings.length,1);
  assert.notEqual(done.reason,"time_limit");assert.equal(done.type,"done");
  const snapshot=snapshots[0],timing=timings[0];
  assert.equal(snapshot.slice,500);assert.equal(timing.slices,500);
  assert.equal(done.nodes,snapshot.nodes);assert.equal(done.length,snapshot.length);assert.equal(done.lower,snapshot.lower);
  assert.equal(done.optimal,snapshot.status===1?1:0);
  assert.ok([0,1,3].includes(snapshot.status),"Invalid fixed-work completion");
  assert.ok(Number.isSafeInteger(snapshot.length)&&snapshot.length>=0&&snapshot.length<=31);
  assert.ok(Number.isSafeInteger(snapshot.lower)&&snapshot.lower>=0&&snapshot.lower<=snapshot.length);
  assert.equal(snapshot.request,group==="fast"?0:2);
  const input=validate(item.facelets);
  assert.deepEqual(snapshot.state[0],[input.cp,input.co,input.ep,input.eh,input.eo],"Native input root differs");
  assert.ok(Number.isSafeInteger(snapshot.nodes)&&snapshot.nodes>=0);
  if(snapshot.length<31)assert.equal(apply(item.facelets,snapshot.moves),solved,"Independent fixed-work replay failed");
  if(group==="warmup"){assert.equal(snapshot.length,item.depth);assert.equal(done.optimal,1);assert.equal(done.lower,item.depth);}
  const {elapsedMs,...semantic}=snapshot;
  return {id:item.id,facelets:item.facelets,group,hostMs,nativeMs:timing.nativeMs,cpuTicks:after.ticks-before.ticks,cpuMs:1000*(after.ticks-before.ticks)/hz,semantic};
  }catch(error){error.jobEvidence={id:item.id,facelets:item.facelets,group,before,generation,events,hostMs:performance.now()-started};throw error;}
}

export async function compareFixedTime(config,configPath){
  assert.ok(isAbsolute(configPath));
  assert.deepEqual(JSON.parse(readFileSync(configPath,"utf8")),config,"Fixed-time configuration differs from file");
  assert.ok(Object.keys(config).every(k=>["iterations","profiles","warmup","exact","cache","cacheSha256","output"].includes(k)));
  assert.equal(config.iterations,5);assert.equal(config.profiles.length,2);
  assert.equal(new Set(config.profiles.map(p=>p.id)).size,2);
  for(const profile of config.profiles){
    assert.deepEqual(Object.keys(profile).sort(),["binary","id"]);
    assert.match(profile.id,/^[a-zA-Z0-9_-]{1,64}$/);assert.ok(isAbsolute(profile.binary));
  }
  for(const key of ["warmup","exact","cache","output"])assert.ok(isAbsolute(config[key]));
  assert.match(config.cacheSha256,/^[a-f0-9]{64}$/);
  assert.ok(config.output.startsWith(resolve(root,"build/evidence")+"/")&&config.output.endsWith(".json"));
  assert.ok(!existsSync(config.output),"Use a fresh evidence path");
  const queried=spawnSync("getconf",["CLK_TCK"],{encoding:"utf8"});assert.equal(queried.status,0);
  const hz=Number(queried.stdout.trim());assert.ok(Number.isInteger(hz)&&hz>=10&&hz<=1000000);
  const paths=[configPath,config.warmup,config.exact,new URL("./corpora/pilot.txt",import.meta.url),new URL("./corpora/manifest.json",import.meta.url),new URL("./corpus.mjs",import.meta.url),new URL("./fixed-time-compare.mjs",import.meta.url),new URL("./fixed-work-model.mjs",import.meta.url),new URL("../apps/engine.mjs",import.meta.url),new URL("../apps/model.mjs",import.meta.url),new URL("../build/model.mjs",import.meta.url),new URL("../build/cubie.mjs",import.meta.url),new URL("../build/notation.mjs",import.meta.url),config.cache,...config.profiles.flatMap(p=>[p.binary,p.binary+".json"])];
  const seals=[];
  for(const path of new Set(paths.map(p=>p instanceof URL?fileURLToPath(p):resolve(p))))seals.push(await seal(path));
  const warmup=JSON.parse(readFileSync(config.warmup,"utf8")).records.map((r,i)=>({...r,id:"warmup-"+i}));
  assert.equal(warmup.length,163);
  const fast=loadCorpus("pilot").slice(0,8);
  const exact=JSON.parse(readFileSync(config.exact,"utf8")).records.map((r,i)=>({...r,id:"diagnosis-"+i}));
  assert.equal(exact.length,3);
  for(const before of seals)assert.deepEqual(identity(before.path),before.identity,"Fixed-time input changed before execution");
  assert.equal(seals.find(s=>s.path===resolve(config.cache)).sha256,config.cacheSha256);
  const builds=config.profiles.map(p=>{const data=JSON.parse(readFileSync(p.binary+".json","utf8"));assert.equal(data.format,"rubend-fixed-timer-build-v1");assert.equal(data.fixedSlices,500);assert.equal(data.binarySha256,seals.find(s=>s.path===resolve(p.binary)).sha256);return data;});
  assert.equal(builds[0].templateSha256,builds[1].templateSha256);
  const report={format:"rubend-fixed-time-comparison-v1",passed:false,config,hz,builds,seals,rounds:[],errors:[],planned:{warmupJobs:1630,measurementJobs:110},conditions:"Exactly 500 portfolio slices per job. Native milliseconds exclude serialization. Process CPU ticks include work through observed done and exclude descheduling. Asynchronous post-done cleanup is not part of that sample. Host wall time remains separate. Ten-second request budget is a safety watchdog, not a search-time deadline. No diagnostic observer is linked."};
  try{
    for(let round=0;round<5;round++){
      const engines={},workers=[],jobs=[];
      const cohort={round,status:"error",workers,jobs};report.rounds.push(cohort);
      const saved=process.env.RUBEND_JOINT_CACHE;process.env.RUBEND_JOINT_CACHE=config.cache;
      try{
        const order=round%2?[...config.profiles].reverse():config.profiles;
        for(const profile of order){
          for(const path of [profile.binary,profile.binary+".json",config.cache])assert.deepEqual(identity(path),seals.find(s=>s.path===resolve(path)).identity,"Worker input identity changed");
          const engine=new Engine({binary:profile.binary});engines[profile.id]=engine;
          await engine.ready(120000);workers.push({profile:profile.id,identity:cpu(engine.child.pid),directory:engine.directory});
        }
        let index=0;
        for(const [group,items] of [["warmup",warmup],["fast",fast],["exact",exact]])for(const item of items){
          const order=(round+index++)%2?[...config.profiles].reverse():config.profiles,pair=[];
          for(const profile of order){const record=await sample(engines[profile.id],item,group,hz);record.profile=profile.id;if(group!=="warmup")jobs.push(record);pair.push(record);}
          assert.deepEqual(pair[0].semantic,pair[1].semantic,"Equal-work native states differ");
        }
      }finally{
        for(const engine of Object.values(engines)){
          let forced=false;const timer=setTimeout(()=>{forced=true;engine.child?.kill("SIGKILL");},1000);
          try{await engine.close();}finally{clearTimeout(timer);}
          const worker=workers.find(w=>w.identity.pid===engine.child.pid);
          if(worker)worker.shutdown={forced,exitCode:engine.child.exitCode,signal:engine.child.signalCode,ipcRemoved:!existsSync(engine.directory)};
          assert.equal(forced,false,"Fixed-time shutdown required force");
        }
        for(const worker of workers){assert.ok(!existsSync(worker.directory));try{assert.notEqual(cpu(worker.identity.pid).startTicks,worker.identity.startTicks);}catch(error){if(error.code!=="ENOENT"&&error.code!=="ESRCH")throw error;}}
        if(saved===undefined)delete process.env.RUBEND_JOINT_CACHE;else process.env.RUBEND_JOINT_CACHE=saved;
      }
      cohort.status="ok";
    }
    for(const before of seals)assert.deepEqual(await seal(before.path),before,"Fixed-time input changed");
    const [a,b]=config.profiles.map(p=>p.id);
    report.summary={};
    for(const group of ["fast","exact"]){
      const ratios=[],nativeRatios=[],hostRatios=[];
      for(const round of report.rounds)for(const before of round.jobs.filter(j=>j.group===group&&j.profile===a)){
        const after=round.jobs.find(j=>j.group===group&&j.id===before.id&&j.profile===b);
        assert.ok(before.cpuTicks>=10&&after.cpuTicks>=10,"Insufficient CPU-tick resolution");
        assert.ok(before.nativeMs>0&&after.nativeMs>0);
        ratios.push(after.cpuMs/before.cpuMs);nativeRatios.push(after.nativeMs/before.nativeMs);hostRatios.push(after.hostMs/before.hostMs);
      }
      report.summary[group]={pairedCpuTimeRatio:distribution(ratios),pairedNativeWallRatio:distribution(nativeRatios),pairedHostWallRatio:distribution(hostRatios),geometricCpuRatio:Math.exp(ratios.reduce((s,r)=>s+Math.log(r),0)/ratios.length)};
    }
    report.passed=true;
  }catch(error){report.errors.push({message:String(error.stack??error),jobEvidence:error.jobEvidence??null});}
  finally{
    for(const before of seals)try{assert.deepEqual(await seal(before.path),before,"Fixed-time input changed");}catch(error){report.passed=false;report.errors.push({stage:"postflight",path:before.path,message:String(error)});}
    mkdirSync(dirname(resolve(config.output)),{recursive:true});writeFileSync(config.output,JSON.stringify(report)+"\n",{flag:"wx"});
  }
  return report;
}

if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  assert.equal(process.argv.length,3,"Expected fixed-time configuration");
  const path=resolve(process.argv[2]),config=JSON.parse(readFileSync(path,"utf8")),result=await compareFixedTime(config,path);
  console.log(JSON.stringify({passed:result.passed,errors:result.errors,summary:result.summary,output:config.output}));
  if(!result.passed)process.exitCode=1;
}
