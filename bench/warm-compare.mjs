import assert from "node:assert/strict";
import {createHash} from "node:crypto";
import {createReadStream,existsSync,readFileSync,statSync} from "node:fs";
import {isAbsolute,resolve} from "node:path";
import {fileURLToPath} from "node:url";
import {Engine} from "../apps/engine.mjs";
import {apply,solved,validate,encode} from "../apps/model.mjs";
import Cubie from "../build/cubie.mjs";
import {nativeIdentity,sampleNativeRss} from "./startup-measure.mjs";

const root=fileURLToPath(new URL("../",import.meta.url));
const message=e=>e instanceof Error?e.message:String(e);
const integer=(v,min=0,max=Number.MAX_SAFE_INTEGER)=>Number.isSafeInteger(v)&&v>=min&&v<=max;
function identity(path){const s=statSync(path,{bigint:true});assert.ok(s.isFile(),`Not a file: ${path}`);return Object.fromEntries(["dev","ino","size","mtimeNs","ctimeNs","mode"].map(k=>[k,String(s[k])]));}
async function seal(path){
  const before=identity(path),hash=createHash("sha256");let bytes=0;
  for await(const chunk of createReadStream(path)){bytes+=chunk.length;hash.update(chunk);}
  assert.deepEqual(identity(path),before,`Input identity changed: ${path}`);assert.equal(String(bytes),before.size);
  return {path,identity:before,sha256:hash.digest("hex"),bytes};
}
function configuration(input){
  assert.ok(input&&typeof input==="object"&&!Array.isArray(input));
  assert.ok(Object.keys(input).every(k=>["profiles","iterations","readyTimeoutMs","rssSampleMs","shutdownTimeoutMs","corpora"].includes(k)),"Unknown configuration field");
  const c={iterations:5,readyTimeoutMs:120000,rssSampleMs:100,shutdownTimeoutMs:1000,...input};
  assert.ok(integer(c.iterations,5,100));
  for(const k of ["readyTimeoutMs","rssSampleMs","shutdownTimeoutMs"])assert.ok(integer(c[k],1,180000));
  assert.equal(c.profiles?.length,2);assert.equal(new Set(c.profiles.map(p=>p.id)).size,2);
  for(const p of c.profiles){
    assert.ok(Object.keys(p).every(k=>["id","binary","cache","cacheSha256","cacheBytes","env","buildMetadata"].includes(k)));
    assert.match(p.id,/^[a-zA-Z0-9_-]{1,64}$/);
    for(const k of ["binary","cache","buildMetadata"])assert.ok(typeof p[k]==="string"&&isAbsolute(p[k]),`Absolute ${k} required`);
    assert.match(p.cacheSha256,/^[a-f0-9]{64}$/);assert.ok(integer(p.cacheBytes,1));
    assert.ok(p.env&&typeof p.env==="object"&&!Array.isArray(p.env));
    for(const [k,v] of Object.entries(p.env))assert.ok(/^[A-Z_][A-Z0-9_]*$/.test(k)&&typeof v==="string"&&!v.includes("\0"));
    assert.equal(p.env.RUBEND_JOINT_CACHE,p.cache);
  }
  assert.equal(c.profiles[0].cache,c.profiles[1].cache);assert.equal(c.profiles[0].cacheSha256,c.profiles[1].cacheSha256);assert.equal(c.profiles[0].cacheBytes,c.profiles[1].cacheBytes);
  assert.deepEqual(Object.keys(c.corpora).sort(),["exact","fast","warmup"]);
  for(const [group,v] of Object.entries(c.corpora)){assert.ok(Object.keys(v).every(k=>["path","count","budgetMs"].includes(k)));assert.ok(isAbsolute(v.path));assert.ok(integer(v.count,1));assert.ok(integer(v.budgetMs,50,30000));if(group!=="fast")assert.ok(v.budgetMs<=30000);}
  return c;
}
function environment(env,fn){const saved=Object.fromEntries(Object.keys(env).map(k=>[k,process.env[k]]));try{Object.assign(process.env,env);return fn();}finally{for(const [k,v] of Object.entries(saved))if(v===undefined)delete process.env[k];else process.env[k]=v;}}
function distribution(values){if(!values.length)return null;const a=[...values].sort((x,y)=>x-y),m=Math.floor(a.length/2);return {count:a.length,median:a.length%2?a[m]:(a[m-1]+a[m])/2,minimum:a[0],maximum:a.at(-1)};}
async function job(engine,item,group,budgetMs){
  const record={id:item.id,facelets:item.facelets,group,mode:group==="fast"?"fast":"exact",budgetMs,status:"error",events:[],error:null};
  const generation=engine.generation,started=performance.now();let watchdog;
  try{
    await new Promise((done,reject)=>{
      watchdog=setTimeout(()=>{record.watchdogExpired=true;engine.close();reject(Error("Adapter watchdog expired before Engine emergency restart"));},budgetMs+1500);
      engine.solve(record,event=>{
        record.events.push(structuredClone(event));
        if(["error","invalid"].includes(event.type))reject(Error(`Native failure: ${JSON.stringify(event)}`));
        else if(event.type==="done")done();
        else if(!["candidate","progress"].includes(event.type))reject(Error(`Unexpected event: ${event.type}`));
      }).catch(reject);
    });
    record.hostCompletionMs=performance.now()-started;record.overshootMs=Math.max(0,record.hostCompletionMs-budgetMs);
    assert.equal(engine.generation,generation,"Worker generation changed");
    let lower=0,nodes=0,best=31;
    for(const event of record.events){
      assert.ok(integer(event.elapsedMs),"Missing host elapsed time");assert.ok(integer(event.nodes,0,4294967295),"Missing native work counters");assert.ok(event.nodes>=nodes,"Work counters regressed");nodes=event.nodes;
      assert.ok(integer(event.lower,lower,30),"Invalid lower bound");lower=event.lower;
      if(event.type==="candidate"){
        assert.equal(apply(item.facelets,event.moves),solved,"Invalid candidate replay");assert.equal(event.moves.length,event.length);assert.ok(event.length<=best);best=event.length;
      }
      assert.ok(lower<=best,"Lower exceeds incumbent");
      if(event.optimal)assert.ok(event.optimal===1&&best===lower,"False optimality");
    }
    const candidates=record.events.filter(e=>e.type==="candidate"),terminal=record.events.at(-1);
    assert.equal(terminal.type,"done");assert.notEqual(terminal.reason,"time_limit","Host emergency deadline is not native completion");
    assert.ok(candidates.length,"Missing answer");assert.ok([0,1].includes(terminal.optimal));assert.equal(terminal.length,best);
    record.first=candidates[0];record.terminalBest=candidates.at(-1);record.bestAtDeadline=candidates.filter(e=>e.elapsedMs<=budgetMs).at(-1)??null;record.nativeDone=terminal;record.workSteps=terminal.nodes;
    if(group==="warmup"){assert.equal(best,item.depth);assert.equal(terminal.lower,item.depth);assert.equal(terminal.optimal,1);}
    record.status="ok";
  }catch(error){record.hostCompletionMs=performance.now()-started;record.overshootMs=Math.max(0,record.hostCompletionMs-budgetMs);record.error=message(error);}
  finally{clearTimeout(watchdog);}
  record.generationBefore=generation;record.generationAfter=engine.generation;
  return record;
}
async function shutdown(engine,timeout){
  const child=engine.child,directory=engine.directory;let forced=false;
  const timer=setTimeout(()=>{forced=true;child.kill("SIGKILL");},timeout);
  await engine.close();clearTimeout(timer);
  const s={awaited:true,forced,exitCode:child.exitCode,signal:child.signalCode,ipcRemoved:!existsSync(directory)};
  return s;
}
function summarize(result){
  const jobs=result.rounds.flatMap(r=>r.jobs),sealed=!result.errors.some(e=>e.stage==="postflight"),success=result.rounds.filter(r=>r.status==="ok"&&sealed).flatMap(r=>r.jobs.filter(j=>j.status==="ok")),ids=result.config?.profiles.map(p=>p.id)??[];
  result.counts={plannedRounds:result.config?.iterations??0,attemptedRounds:result.rounds.length,workers:result.rounds.flatMap(r=>r.workers).length,attemptedJobs:jobs.length,nativeValidatedJobs:jobs.filter(j=>j.status==="ok").length,successfulJobs:success.length,failedJobs:jobs.length-success.length,errors:result.errors.length,noAnswerByDeadline:success.filter(j=>!j.bestAtDeadline).length};
  result.summary={};
  for(const group of ["fast","exact","superflip"]){
    const selected=success.filter(j=>j.group===group);
    const paired={wins:0,ties:0,losses:0,noAnswer:0,failedPairs:0,byCase:{}};
    for(const round of result.rounds)for(const id of new Set(round.jobs.filter(j=>j.group===group).map(j=>j.id))){
      const pair=ids.map(p=>round.jobs.find(j=>j.group===group&&j.id===id&&j.profile===p));
      const k=!sealed||round.status!=="ok"||pair.some(j=>j?.status!=="ok")?"failedPairs":pair.some(j=>!j.bestAtDeadline)?"noAnswer":pair[1].bestAtDeadline.length<pair[0].bestAtDeadline.length?"wins":pair[1].bestAtDeadline.length>pair[0].bestAtDeadline.length?"losses":"ties";
      paired[k]++;paired.byCase[id]??={wins:0,ties:0,losses:0,noAnswer:0,failedPairs:0};paired.byCase[id][k]++;
    }
    result.summary[group]={paired,profiles:Object.fromEntries(ids.map(id=>{const a=selected.filter(j=>j.profile===id),onTime=a.filter(j=>j.bestAtDeadline);return [id,{successfulJobs:a.length,noAnswerByDeadline:a.length-onTime.length,meanDeadlineLength:onTime.length?onTime.reduce((n,j)=>n+j.bestAtDeadline.length,0)/onTime.length:null,meanTerminalLength:a.length?a.reduce((n,j)=>n+j.terminalBest.length,0)/a.length:null,firstMs:distribution(a.map(j=>j.first.elapsedMs)),hostCompletionMs:distribution(a.map(j=>j.hostCompletionMs)),overshootMs:distribution(a.map(j=>j.overshootMs)),totalWorkSteps:a.reduce((n,j)=>n+j.workSteps,0),intervals:a.map(j=>({round:j.round,id:j.id,lower:j.nativeDone.lower,upper:j.terminalBest.length,optimal:j.nativeDone.optimal,deadlineUpper:j.bestAtDeadline?.length??null}))}];}))};
  }
  result.passed=result.errors.length===0&&result.rounds.length===result.config?.iterations&&result.rounds.every(r=>r.status==="ok");
}
export async function compareWarm(input,sourcePath=null){
  const result={format:"rubend-warm-comparison-v1",startedAt:new Date().toISOString(),conditions:{clock:"Engine elapsedMs is rounded to one millisecond; deadline selection uses that observed clock",work:"Native nodes are search state-machine work steps, not expanded nodes",startup:"Recorded separately; host SHA256 warms file cache; not cold disk",limits:"Run externally with bench/run-limited.mjs; real configuration requests one low-priority core, 6144 MiB, 900 seconds",claim:"No strength or speed verdict before repeated evidence and independent review"},passed:false,rounds:[],errors:[],seals:{},afterSeals:{}};
  try{
    if(sourcePath!==null){assert.ok(isAbsolute(sourcePath),"Configuration path must be absolute");result.seals[sourcePath]=await seal(sourcePath);assert.deepEqual(JSON.parse(readFileSync(sourcePath,"utf8")),input,"Configuration file differs from input");assert.deepEqual(identity(sourcePath),result.seals[sourcePath].identity,"Configuration changed while reading");}
    const config=configuration(input);result.config=config;
    const paths=["bench/warm-compare.mjs","bench/startup-measure.mjs","apps/engine.mjs","apps/model.mjs","build/model.mjs","build/cubie.mjs","build/notation.mjs"].map(p=>resolve(root,p));
    paths.push(...Object.values(config.corpora).map(c=>c.path),...config.profiles.flatMap(p=>[p.binary,p.buildMetadata,p.cache]));
    for(const path of new Set(paths))result.seals[path]=await seal(path);
    for(const p of config.profiles){assert.equal(result.seals[p.cache].sha256,p.cacheSha256,"Cache SHA256 mismatch");assert.equal(result.seals[p.cache].bytes,p.cacheBytes);const metadata=JSON.parse(readFileSync(p.buildMetadata,"utf8"));assert.equal(metadata.binarySha256,result.seals[p.binary].sha256,"Binary metadata mismatch");}
    const cases=Object.fromEntries(Object.entries(config.corpora).map(([group,c])=>{const items=JSON.parse(readFileSync(c.path,"utf8")).records;assert.equal(items.length,c.count);for(const [i,item] of items.entries()){item.id??=`${group}-${i}`;validate(item.facelets);if(group==="warmup")assert.ok(integer(item.depth,0,30));}assert.equal(new Set(items.map(i=>i.id)).size,items.length);return [group,items];}));
    cases.superflip=[{id:"superflip",facelets:encode(Cubie.to_facelets({...Cubie.solved(),eo:4095}))}];
    for(let iteration=0;iteration<config.iterations;iteration++){
      const round={iteration,status:"error",workers:[],jobs:[],errors:[]};result.rounds.push(round);const engines={},originals={};
      try{
        const order=iteration%2?[...config.profiles].reverse():config.profiles;
        for(const p of order){
          for(const path of [p.binary,p.buildMetadata,p.cache])assert.deepEqual(identity(path),result.seals[path].identity,`Input identity changed: ${path}`);
          const started=performance.now(),engine=environment(p.env,()=>new Engine({binary:p.binary}));engines[p.id]=engine;
          originals[p.id]={child:engine.child,stopped:engine.childStopped,directory:engine.directory};
          const worker={profile:p.id,generation:engine.generation,processIdentity:nativeIdentity(engine.child.pid),ipcDirectory:engine.directory,rss:[],shutdown:null};round.workers.push(worker);
          worker.monitor=setInterval(()=>worker.rss.push(sampleNativeRss(worker.processIdentity,"sample",started)),config.rssSampleMs);
          await engine.ready(config.readyTimeoutMs);worker.initializationMs=performance.now()-started;worker.rss.push(sampleNativeRss(worker.processIdentity,"ready",started));assert.ok(worker.rss.at(-1).rssKiB!==null,"Missing native RSS");
        }
        let index=0;
        for(const group of ["warmup","fast","exact","superflip"])for(const item of cases[group]){
          const order=(iteration+index++)%2?[...config.profiles].reverse():config.profiles;
          for(const p of order){const outcome=await job(engines[p.id],item,group,group==="superflip"?5000:config.corpora[group].budgetMs);Object.assign(outcome,{profile:p.id,round:iteration,order:order.map(p=>p.id)});round.jobs.push(outcome);assert.equal(outcome.status,"ok",outcome.error);}
        }
        round.status="ok";
      }catch(error){round.errors.push(message(error));}
      finally{
        for(const worker of round.workers){
          clearInterval(worker.monitor);delete worker.monitor;
          try{
            const original=originals[worker.profile];
            worker.shutdown=await shutdown(engines[worker.profile],config.shutdownTimeoutMs);
            let forced=false;
            const timer=setTimeout(()=>{forced=true;original.child.kill("SIGKILL");},config.shutdownTimeoutMs);
            await original.stopped;clearTimeout(timer);
            worker.originalShutdown={forced,exitCode:original.child.exitCode,signal:original.child.signalCode,ipcRemoved:!existsSync(original.directory)};
            for(const s of [worker.shutdown,worker.originalShutdown])assert.ok(s.ipcRemoved&&!s.forced&&(s.exitCode===null||s.exitCode===0)&&(s.signal===null||s.signal==="SIGTERM"),`Unclean shutdown: ${JSON.stringify(s)}`);
          }catch(error){round.status="error";round.errors.push(message(error));}
        }
      }
      if(round.status!=="ok"){result.errors.push({stage:"round",iteration,messages:round.errors});break;}
    }
  }catch(error){result.errors.push({stage:"preflight",message:message(error)});}
  finally{
    for(const [path,before] of Object.entries(result.seals))try{const after=await seal(path);result.afterSeals[path]=after;assert.deepEqual(after,before,`Input changed: ${path}`);}catch(error){result.errors.push({stage:"postflight",path,message:message(error)});}
  }
  summarize(result);return result;
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  let result;
  try{assert.equal(process.argv.length,3,"Usage: node bench/warm-compare.mjs /absolute/config.json");const path=resolve(process.argv[2]);result=await compareWarm(JSON.parse(readFileSync(path,"utf8")),path);}
  catch(error){result={format:"rubend-warm-comparison-v1",passed:false,errors:[{stage:"configuration",message:message(error)}]};}
  console.log(JSON.stringify(result,null,2));if(!result.passed)process.exitCode=1;
}
