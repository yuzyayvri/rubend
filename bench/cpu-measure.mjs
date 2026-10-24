import assert from "node:assert/strict";
import {readFileSync,writeFileSync,mkdirSync,mkdtempSync,existsSync} from "node:fs";
import {resolve,dirname,isAbsolute} from "node:path";
import {execFileSync,spawnSync} from "node:child_process";
import {createHash} from "node:crypto";
import {fileHash} from "./reference-provenance.mjs";

const format=JSON.stringify({format:"rubend-command-cpu-usage-v1",wallSeconds:"%e",userSeconds:"%U",systemSeconds:"%S",maximumRssKiB:"%M",exitCode:"%x"}).replace(/"(%[eUSMx])"/g,"$1");
export function cpuObserverIdentity(){
  const path=execFileSync("which",["time"],{encoding:"utf8"}).trim();assert.ok(isAbsolute(path));const version=execFileSync(path,["--version"],{encoding:"utf8"}).trim();assert.match(version,/GNU Time/);return{path,sha256:fileHash(path),version,format};
}
export function decodeCpuUsage(text,exitCode){
  const value=JSON.parse(text);assert.deepEqual(Object.keys(value).sort(),["format","wallSeconds","userSeconds","systemSeconds","maximumRssKiB","exitCode"].sort());assert.equal(value.format,"rubend-command-cpu-usage-v1");assert.ok(Number.isInteger(exitCode)&&exitCode>=0&&exitCode<=255);assert.equal(value.exitCode,exitCode,"CPU observer exit status disagrees with command");
  for(const k of["wallSeconds","userSeconds","systemSeconds"])assert.ok(Number.isFinite(value[k])&&value[k]>=0,"Invalid CPU observer time: "+k);
  assert.ok(Number.isSafeInteger(value.maximumRssKiB)&&value.maximumRssKiB>=0);
  return{wallMs:Math.round(value.wallSeconds*1000),userCpuMs:Math.round(value.userSeconds*1000),systemCpuMs:Math.round(value.systemSeconds*1000),totalCpuMs:Math.round((value.userSeconds+value.systemSeconds)*1000),gnuTimeMaximumRssKiB:value.maximumRssKiB,quantizationMsPerCpuField:10,scope:"Command and descendants whose CPU is accumulated through waited-for exits; not an inner search interval or all detached processes",observerProcessCpuIncluded:false,aggregateRssMeasured:false};
}
export function measureCpu(command,outputPath){
  assert.ok(Array.isArray(command)&&command.length>0&&command.every(x=>typeof x==="string"&&!x.includes("\0")));assert.ok(isAbsolute(command[0]));const output=resolve(outputPath);assert.ok(output.startsWith(resolve("build")+"/"));assert.equal(existsSync(output),false,"CPU measurement output exists; command must not run");
  const observer=cpuObserverIdentity(),commandSha256=fileHash(command[0]);mkdirSync(dirname(output),{recursive:true});const directory=mkdtempSync(resolve(dirname(output),"cpu-observer-")),rawPath=resolve(directory,"usage.json"),args=["-q","-f",format,"-o",rawPath,...command];
  const startedAt=new Date().toISOString(),run=spawnSync(observer.path,args,{env:{...process.env,LC_ALL:"C"},encoding:"utf8",maxBuffer:16*1024*1024});let usage=null,raw=null,measurementError=null;
  try{assert.ifError(run.error);assert.equal(run.signal,null);raw=readFileSync(rawPath,"utf8");usage=decodeCpuUsage(raw,run.status);}catch(error){measurementError=String(error.stack??error);}
  assert.equal(fileHash(observer.path),observer.sha256);assert.equal(fileHash(command[0]),commandSha256);
  const record={format:"rubend-command-cpu-measurement-v1",startedAt,finishedAt:new Date().toISOString(),command,commandSha256,observer:{...observer,args},exitCode:run.status,signal:run.signal,error:run.error?String(run.error):null,stdout:run.stdout??"",stderr:run.stderr??"",commandSucceeded:run.status===0&&run.signal===null&&!run.error,measurementAvailable:usage!==null,measurementError,usage,raw:raw===null?null:{path:rawPath,sha256:createHash("sha256").update(raw).digest("hex"),text:raw},externalResourceBoundRequired:true,ownsNoIndependentTimeoutOrCancellation:true,wallIsNotCpu:true};
  writeFileSync(output,JSON.stringify(record,null,2)+"\n",{flag:"wx"});return record;
}
