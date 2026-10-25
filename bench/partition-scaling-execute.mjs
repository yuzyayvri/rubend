import assert from "node:assert/strict";
import {readFileSync,writeFileSync,statSync,existsSync,renameSync} from "node:fs";
import {resolve} from "node:path";
import {pathToFileURL} from "node:url";
import {performance} from "node:perf_hooks";
import {runPartitionAttempt} from "./partition-attempt.mjs";
import {partitionBlocks,PartitionCollector} from "./partition-coordinator.mjs";
import {scorePartitionRecords} from "./partition-worker-model.mjs";
import {fileHash} from "./reference-provenance.mjs";

assert.equal(process.argv.length,7);
const [mode,id,inputText,directoryText,outputText]=process.argv.slice(2),inputPath=resolve(inputText),directory=resolve(directoryText),output=resolve(outputText),read=p=>JSON.parse(readFileSync(p,"utf8")),input=read(inputPath),prior=read(input.referencePath),reference=partitionBlocks(prior.execution.stdout.trim().split("\n").map(s=>JSON.parse(s)),prior.jobs),L=(await import(pathToFileURL(input.ledgerModule))).default,diagnostic=id.startsWith("diagnostic-");
assert.ok(mode==="single"||mode==="double");assert.equal(existsSync(output),false);assert.equal(fileHash(input.referencePath),input.referenceSha256);assert.equal(fileHash(input.binary),input.binarySha256);assert.equal(prior.jobs.length,1124);
const identity=()=>{const s=statSync(input.cache,{bigint:true});return["dev","ino","size","mtimeNs","ctimeNs"].map(k=>String(s[k]));},cacheBefore=identity(),report={passed:false,id,mode,diagnostic,inputSha256:fileHash(inputPath),binarySha256:input.binarySha256,cacheSha256:input.cacheSha256,attempts:[],samples:[],errors:[],allWorkersGone:false,nativeMakespanMs:null,semanticMatch:false},parts=mode==="single"?[prior.jobs]:[prior.jobs.filter((_,i)=>i%2===0),prior.jobs.filter((_,i)=>i%2===1)];
assert.deepEqual(cacheBefore,input.cacheIdentity);
assert.equal(fileHash(input.ledgerModule),input.ledgerModuleSha256);
function save(){const temp=output+".tmp";writeFileSync(temp,JSON.stringify(report)+"\n",{flag:"wx"});renameSync(temp,output);}
function sample(){const owners=[];try{const ids=readFileSync("/proc/self/task/"+process.pid+"/children","utf8").trim().split(/\s+/).filter(Boolean).map(Number);for(const pid of ids)try{const text=readFileSync("/proc/"+pid+"/stat","utf8"),fields=text.slice(text.lastIndexOf(")")+2).trim().split(/\s+/),status=readFileSync("/proc/"+pid+"/status","utf8");owners.push({pid,startTicks:fields[19],cpuTicks:Number(fields[11])+Number(fields[12]),rssKiB:Number(status.match(/^VmRSS:\s+(\d+)/m)?.[1]??0)});}catch(error){if(error.code!=="ENOENT"&&error.code!=="ESRCH")report.errors.push(String(error));}}catch(error){report.errors.push(String(error));}report.samples.push({atMs:performance.now()-report.launchAtMs,owners});}
let timer;
try{
  report.launchAtMs=performance.now();save();if(diagnostic)timer=setInterval(sample,100);
  const settled=await Promise.allSettled(parts.map(async(jobs,index)=>{const attempt=await runPartitionAttempt({id:id+"-p"+index,directory,binary:input.binary,taskset:input.taskset,cpu:2+index,jobs,scopes:prior.scopes,cache:input.cache});attempt.requestPath=resolve(directory,id+"-p"+index+"-requests.tsv");attempt.requestsText=readFileSync(attempt.requestPath,"utf8");return attempt;}));
  report.attempts=settled.filter(r=>r.status==="fulfilled").map(r=>r.value);for(const r of settled)if(r.status==="rejected")report.errors.push(String(r.reason));if(timer){clearInterval(timer);timer=null;sample();}
  save();assert.deepEqual(report.errors,[]);assert.equal(report.attempts.length,parts.length);
  const collector=new PartitionCollector(prior.jobs,reference);
  for(let index=0;index<parts.length;index++){
    const a=report.attempts[index];assert.equal(a.exitCode,0,a.stderr);assert.equal(a.signal,null);assert.equal(a.timedOut,false);assert.equal(a.forced,false);assert.deepEqual(a.errors,[]);assert.ok(a.identity?.startTicks);assert.equal(a.identity.pid,a.pid);assert.equal(a.workerGone,true);assert.equal(a.binarySha256,input.binarySha256);assert.equal(a.cpu,2+index);assert.equal(a.affinityAtReady,String(2+index));assert.ok(a.readyAtMs>=a.spawnedAtMs&&a.readyAtMs<=a.closedAtMs);const blocks=partitionBlocks(a.records,parts[index]);collector.observeReady(blocks.ready);for(const block of blocks.blocks)collector.admit(block);
  }
  report.nativeMakespanMs=Math.max(...report.attempts.map(a=>a.closedAtMs))-report.launchAtMs;
  const analysis=scorePartitionRecords(collector.transcript(),prior.jobs,prior.scopes,prior.oracles,L);assert.deepEqual(analysis,prior.analysis);report.analysis=analysis;report.semanticMatch=true;report.allWorkersGone=report.attempts.every(a=>a.workerGone);report.phaseTimings=report.attempts.map(a=>({id:a.id,initializationToObservedReadyMs:a.readyAtMs-a.spawnedAtMs,observedReadyToCloseMs:a.closedAtMs-a.readyAtMs,totalOwnerLifetimeMs:a.closedAtMs-a.spawnedAtMs}));
  if(mode==="double"){report.concurrentLifetimeOverlapMs=Math.min(...report.attempts.map(a=>a.closedAtMs))-Math.max(...report.attempts.map(a=>a.spawnedAtMs));assert.ok(report.concurrentLifetimeOverlapMs>0);}
  if(diagnostic){assert.ok(report.samples.some(s=>s.owners.length===parts.length));report.sampledPeakDirectNativeRssKiB=Math.max(...report.samples.map(s=>s.owners.reduce((sum,p)=>sum+p.rssKiB,0)));assert.ok(report.sampledPeakDirectNativeRssKiB>0);report.profileScope="Untimed readiness-phase profile with 100-ms samples of direct owned native children only. CPU ticks and aggregate RSS are diagnostic, not measured-cohort CPU or full cgroup memory.";}
  assert.deepEqual(identity(),cacheBefore);assert.equal(fileHash(input.binary),input.binarySha256);report.passed=true;
}catch(error){report.errors.push(String(error.stack??error));}
finally{if(timer)clearInterval(timer);save();}
console.log(JSON.stringify({passed:report.passed,id,mode,jobs:report.analysis?.jobs,replays:report.analysis?.replays,owners:report.attempts.length,nativeMakespanMs:report.nativeMakespanMs,allWorkersGone:report.allWorkersGone,errors:report.errors}));
if(!report.passed)process.exitCode=1;
