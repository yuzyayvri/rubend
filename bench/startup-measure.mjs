import {createHash} from "node:crypto";
import {closeSync,constants,createReadStream,existsSync,openSync,readFileSync,statSync} from "node:fs";
import {isAbsolute, resolve} from "node:path";
import {fileURLToPath} from "node:url";
import {spawnSync} from "node:child_process";
import {Engine} from "../apps/engine.mjs";
import {apply, solved} from "../apps/model.mjs";

const root=fileURLToPath(new URL("../",import.meta.url));
const integer=(n,min,max)=>Number.isSafeInteger(n)&&n>=min&&n<=max;
const object=x=>x!==null&&typeof x==="object"&&!Array.isArray(x);
const message=e=>e instanceof Error?e.message:String(e);
function requireThat(condition,text){if(!condition)throw Error(text);}
function keys(value,allowed){requireThat(Object.keys(value).every(k=>allowed.includes(k)),"Unknown configuration field");}

function configuration(value){
  requireThat(object(value),"Configuration must be an object");
  keys(value,["profiles","iterations","readyTimeoutMs","solveTimeoutMs","rssSampleMs"]);
  const config={iterations:5,readyTimeoutMs:120000,solveTimeoutMs:3000,rssSampleMs:10,...value};
  requireThat(integer(config.iterations,5,100),"At least five iterations are required");
  for(const key of ["readyTimeoutMs","solveTimeoutMs","rssSampleMs"])requireThat(integer(config[key],1,1800000),`Invalid ${key}`);
  requireThat(Array.isArray(config.profiles)&&config.profiles.length>=1&&config.profiles.length<=8,"Invalid profiles");
  const ids=new Set();
  for(const p of config.profiles){
    requireThat(object(p),"Invalid profile");
    keys(p,["id","binary","cache","cacheSha256","cacheBytes","cacheWords","env","buildMetadata"]);
    requireThat(typeof p.id==="string"&&/^[a-zA-Z0-9_-]{1,64}$/.test(p.id)&&!ids.has(p.id),"Invalid or duplicate profile id");ids.add(p.id);
    for(const key of ["binary","cache"])requireThat(typeof p[key]==="string"&&isAbsolute(p[key]),`${key} must be absolute`);
    requireThat(typeof p.cacheSha256==="string"&&/^[0-9a-f]{64}$/.test(p.cacheSha256),"Invalid cache SHA256");
    requireThat(integer(p.cacheBytes,4,Number.MAX_SAFE_INTEGER)&&integer(p.cacheWords,1,Number.MAX_SAFE_INTEGER)&&p.cacheWords*4===p.cacheBytes,"Invalid cache geometry");
    requireThat(object(p.env)&&Object.keys(p.env).length<=16,"Invalid environment map");
    for(const [key,v] of Object.entries(p.env))requireThat(/^[A-Z_][A-Z0-9_]*$/.test(key)&&typeof v==="string"&&v.length<=4096&&!v.includes("\0"),"Invalid environment entry");
    requireThat(Object.values(p.env).includes(p.cache),"Environment must explicitly select the cache path");
    if(p.buildMetadata!==undefined)requireThat(typeof p.buildMetadata==="string"&&isAbsolute(p.buildMetadata),"buildMetadata must be absolute");
  }
  return config;
}

function identity(path){
  const s=statSync(path,{bigint:true});
  requireThat(s.isFile(),`Not a regular file: ${path}`);
  return Object.fromEntries(["dev","ino","size","mtimeNs","ctimeNs","mode"].map(k=>[k,String(s[k])]));
}
function same(actual,expected,path){requireThat(JSON.stringify(actual)===JSON.stringify(expected),`Input identity changed: ${path}`);}
async function digest(path){
  const before=identity(path),hash=createHash("sha256");let bytes=0;
  const started=performance.now();
  for await(const chunk of createReadStream(path)){bytes+=chunk.length;hash.update(chunk);}
  const sha256=hash.digest("hex"),elapsedMs=performance.now()-started;
  same(identity(path),before,path);
  requireThat(String(bytes)===before.size,`Incomplete hash stream: ${path}`);
  return {identity:before,sha256,bytes,elapsedMs};
}
async function cacheValidation(profile,expected,ledger){
  const started=performance.now();
  const check=await digest(profile.cache);
  check.sha256Ms=check.elapsedMs;
  check.elapsedMs=performance.now()-started;
  ledger.push({profile:profile.id,...check});
  requireThat(check.bytes===profile.cacheBytes,`Cache byte count mismatch: ${profile.id}`);
  requireThat(check.sha256===profile.cacheSha256,`Cache SHA256 mismatch: ${profile.id}`);
  if(expected)same(check.identity,expected,profile.cache);
  return check;
}
function withEnvironment(env,fn){
  const saved=Object.fromEntries(Object.keys(env).map(k=>[k,process.env[k]]));
  try{Object.assign(process.env,env);return fn();}
  finally{for(const [k,v] of Object.entries(saved)){if(v===undefined)delete process.env[k];else process.env[k]=v;}}
}
function processSnapshot(pid,expected=null,includeStatus=false){
  let fd;
  try{
    requireThat(integer(pid,1,Number.MAX_SAFE_INTEGER),"Invalid native PID");
    fd=openSync(`/proc/${pid}`,constants.O_RDONLY|constants.O_DIRECTORY);
    const directory=`/proc/self/fd/${fd}`,stat=readFileSync(`${directory}/stat`,"utf8");
    requireThat(stat.startsWith(`${pid} (`),"Native PID mismatch");
    const startTicks=stat.slice(stat.lastIndexOf(")")+2).trim().split(/\s+/)[19];
    requireThat(/^\d+$/.test(startTicks),"Invalid native start identity");
    const identity={pid,startTicks},matched=expected===null||(identity.pid===expected.pid&&identity.startTicks===expected.startTicks);
    return {identity,matched,status:matched&&includeStatus?readFileSync(`${directory}/status`,"utf8"):null};
  }catch{return null;}
  finally{if(fd!==undefined)closeSync(fd);}
}
export function nativeIdentity(pid){return processSnapshot(pid)?.identity??null;}
export function sampleNativeRss(expected,kind,started){
  const snapshot=expected?processSnapshot(expected.pid,expected,true):null,status=snapshot?.status;
  const resident=status?.match(/^VmRSS:\s+(\d+) kB$/m),peak=status?.match(/^VmHWM:\s+(\d+) kB$/m);
  return {kind,elapsedMs:performance.now()-started,identityMatched:snapshot?.matched??false,rssKiB:resident?Number(resident[1]):null,hwmKiB:peak?Number(peak[1]):null};
}
function solvedReplay(engine,timeout){
  return new Promise((resolveJob,reject)=>{
    const events=[],timer=setTimeout(()=>{engine.close();reject(Error("Solved replay timeout"));},timeout);
    engine.solve({facelets:solved,mode:"exact",budgetMs:50},event=>{
      events.push(event);
      if(event.type==="error"||event.type==="invalid"){clearTimeout(timer);reject(Error(`Solved replay failed: ${JSON.stringify(event)}`));}
      if(event.type==="done"){
        clearTimeout(timer);
        try{
          const answers=events.filter(e=>e.type==="candidate");
          requireThat(answers.length>0,"Missing solved candidate");
          for(const answer of answers)requireThat(answer.length===0&&answer.moves.length===0&&answer.lower===0&&apply(solved,answer.moves)===solved,"Invalid solved candidate");
          requireThat(event.optimal===1&&event.lower===0&&event.length===0,"Missing optimal zero bound");
          resolveJob({passed:true,candidates:answers.length,done:event});
        }catch(error){engine.close();reject(error);}
      }
    }).catch(error=>{clearTimeout(timer);reject(error);});
  });
}
async function run(profile,iteration,config,sealed,ledger){
  const record={profile:profile.id,iteration,status:"error",error:null,ready:false,replay:{passed:false},hostValidation:null,workerToReadyMs:null,includingHostValidationMs:null,nativeRss:{samples:[]},shutdown:null};
  let engine,monitor,killTimer;
  try{
    same(identity(profile.binary),sealed.binary.identity,profile.binary);
    record.hostValidation=await cacheValidation(profile,sealed.cache.identity,ledger);
    const started=performance.now();
    engine=withEnvironment(profile.env,()=>new Engine({binary:profile.binary}));
    record.pid=engine.child.pid;
    record.processIdentity=nativeIdentity(record.pid);
    record.ipcDirectory=engine.directory;
    const capture=kind=>record.nativeRss.samples.push(sampleNativeRss(record.processIdentity,kind,started));
    engine.once("ready",()=>{
      record.workerToReadyMs=performance.now()-started;
      record.includingHostValidationMs=record.hostValidation.elapsedMs+record.workerToReadyMs;
      record.ready=true;capture("ready");
    });
    capture("constructed");monitor=setInterval(()=>capture("sample"),config.rssSampleMs);
    await engine.ready(config.readyTimeoutMs);
    requireThat(record.ready,"Missing observed ready event");
    requireThat(record.nativeRss.samples.find(s=>s.kind==="ready")?.rssKiB!==null,"Native RSS unavailable at ready");
    record.replay=await solvedReplay(engine,config.solveTimeoutMs);
    same(identity(profile.cache),sealed.cache.identity,profile.cache);
    same(identity(profile.binary),sealed.binary.identity,profile.binary);
    record.status="ok";
  }catch(error){record.error=message(error);}
  finally{
    clearInterval(monitor);
    if(engine){
      const child=engine.child;
      let forced=false;
      killTimer=setTimeout(()=>{forced=true;child.kill("SIGKILL");},250);
      await engine.close();clearTimeout(killTimer);
      record.shutdown={awaited:true,forced,exitCode:child.exitCode,signal:child.signalCode,ipcRemoved:!existsSync(engine.directory)};
      if(!record.shutdown.ipcRemoved){record.status="error";record.error="Engine IPC cleanup failed";}
      if(child.exitCode!==null&&child.exitCode!==0){record.status="error";record.error=`Native worker exited with code ${child.exitCode}`;}
      if(forced||(child.signalCode!==null&&child.signalCode!=="SIGTERM")){record.status="error";record.error=`Native worker shutdown failed: ${forced?"forced SIGKILL":child.signalCode}`;}
    }
    record.nativeRss.peakObservedKiB=record.nativeRss.samples.reduce((peak,s)=>Math.max(peak,s.rssKiB??0,s.hwmKiB??0),0);
  }
  return record;
}
function distribution(values){
  if(!values.length)return null;
  const sorted=[...values].sort((a,b)=>a-b),middle=Math.floor(sorted.length/2);
  return {count:values.length,median:sorted.length%2?sorted[middle]:(sorted[middle-1]+sorted[middle])/2,minimum:sorted[0],maximum:sorted.at(-1)};
}
function summaries(result){
  result.counts={plannedRuns:result.config?result.config.iterations*result.config.profiles.length:0,attemptedRuns:result.runs.length,launchedWorkers:result.runs.filter(r=>r.pid!==undefined).length,readyEvents:result.runs.filter(r=>r.ready).length,checkedSolvedReplays:result.runs.filter(r=>r.replay.passed).length,successfulRuns:result.runs.filter(r=>r.status==="ok").length,runErrors:result.runs.filter(r=>r.status!=="ok").length,batchErrors:result.errors.length,hostHashBytes:(result.cacheHashStreams??[]).reduce((n,r)=>n+r.bytes,0)};
  result.summary=Object.fromEntries((result.config?.profiles??[]).map(p=>{
    const records=result.runs.filter(r=>r.profile===p.id&&r.status==="ok");
    return [p.id,Object.fromEntries(["workerToReadyMs","includingHostValidationMs"].map(k=>[k,distribution(records.map(r=>r[k]))]).concat([["hostValidationMs",distribution(records.map(r=>r.hostValidation.elapsedMs))],["nativePeakObservedKiB",distribution(records.map(r=>r.nativeRss.peakObservedKiB))]]))];
  }));
  result.passed=result.errors.length===0&&result.counts.successfulRuns===result.counts.plannedRuns&&result.counts.plannedRuns>0;
}

export async function measureStartup(input){
  const result={format:"rubend-startup-measure-v1",startedAt:new Date().toISOString(),passed:false,conditions:{timer:"Before Engine construction through observed real ready event; includes FIFO and process construction, excludes host SHA256",fileCache:"Complete host SHA256 streams warm the file cache before every worker; not cold disk startup",rss:"Linux native worker /proc RSS and HWM samples including immediate ready read; excludes host and browser; sampled peak is not a guaranteed lifetime peak",geometry:"Declared cache bytes and U32 word counts are input geometry, not native read counters",nativeReadBytes:null},runs:[],errors:[],identities:{},cacheHashStreams:[]};
  try{
    const config=configuration(input);result.config=config;
    const git=spawnSync("git",["rev-parse","HEAD"],{cwd:root,encoding:"utf8"});
    result.source={head:git.status===0?git.stdout.trim():null,files:{}};
    for(const path of ["bench/startup-measure.mjs","apps/engine.mjs","apps/model.mjs","build/model.mjs","build/cubie.mjs","build/notation.mjs"])result.source.files[path]=await digest(resolve(root,path));
    for(const profile of config.profiles){
      const binary=await digest(profile.binary),cache=await cacheValidation(profile,undefined,result.cacheHashStreams);
      const metadataPath=profile.buildMetadata??`${profile.binary}.json`;
      if(profile.buildMetadata!==undefined)requireThat(existsSync(metadataPath),`Missing explicit build metadata: ${profile.id}`);
      const metadata=existsSync(metadataPath)?{path:metadataPath,content:JSON.parse(readFileSync(metadataPath,"utf8")),...(await digest(metadataPath))}:null;
      if(metadata?.content.binarySha256!==undefined)requireThat(metadata.content.binarySha256===binary.sha256,`Build metadata binary SHA256 mismatch: ${profile.id}`);
      result.identities[profile.id]={binary,cache,buildMetadata:metadata};
    }
    for(let iteration=0;iteration<config.iterations;iteration++){
      const order=iteration%2?[...config.profiles].reverse():config.profiles;
      for(const profile of order)result.runs.push(await run(profile,iteration,config,result.identities[profile.id],result.cacheHashStreams));
    }
    for(const profile of config.profiles){
      try{
        const sealed=result.identities[profile.id];
        sealed.after={binary:await digest(profile.binary),cache:await cacheValidation(profile,sealed.cache.identity,result.cacheHashStreams)};
        same(sealed.after.binary.identity,sealed.binary.identity,profile.binary);
        requireThat(sealed.after.binary.sha256===sealed.binary.sha256,`Binary SHA256 changed: ${profile.id}`);
        if(sealed.buildMetadata){const after=await digest(sealed.buildMetadata.path);same(after.identity,sealed.buildMetadata.identity,sealed.buildMetadata.path);requireThat(after.sha256===sealed.buildMetadata.sha256,"Build metadata changed");}
      }catch(error){result.errors.push({profile:profile.id,stage:"postflight",message:message(error)});}
    }
    result.source.afterFiles={};
    for(const [path,sealed] of Object.entries(result.source.files)){
      try{
        const after=await digest(resolve(root,path));result.source.afterFiles[path]=after;
        same(after.identity,sealed.identity,path);
        requireThat(after.sha256===sealed.sha256,`Measurement source SHA256 changed: ${path}`);
      }catch(error){result.errors.push({path,stage:"source-postflight",message:message(error)});}
    }
  }catch(error){result.errors.push({stage:"preflight",message:message(error)});}
  summaries(result);return result;
}

if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  let result;
  try{requireThat(process.argv.length===3,"Usage: node bench/startup-measure.mjs /absolute/config.json");result=await measureStartup(JSON.parse(readFileSync(process.argv[2],"utf8")));}
  catch(error){result={format:"rubend-startup-measure-v1",passed:false,runs:[],errors:[{stage:"configuration",message:message(error)}]};summaries(result);}
  console.log(JSON.stringify(result,null,2));if(!result.passed)process.exitCode=1;
}
