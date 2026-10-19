#!/usr/bin/env node
import {appendFileSync,createReadStream,readFileSync,writeFileSync} from "node:fs";
import {createInterface} from "node:readline";

const cache=readFileSync(process.env.RUBEND_STARTUP_FIXTURE_CACHE);
const selfStat=readFileSync("/proc/self/stat","utf8"),startTicks=selfStat.slice(selfStat.lastIndexOf(")")+2).trim().split(/\s+/)[19];
if(process.env.RUBEND_STARTUP_FIXTURE_LOG)appendFileSync(process.env.RUBEND_STARTUP_FIXTURE_LOG,JSON.stringify({pid:process.pid,startTicks,fifo:process.argv[2],bytes:cache.length})+"\n");
const mode=process.env.RUBEND_STARTUP_FIXTURE_MODE??"ok";
if(mode==="exit")process.exit(7);
if(mode==="pre-ready-signal")process.kill(process.pid,"SIGUSR2");
if(["ignore-term","solved-ignore-term","exit-after-done","unexpected-signal"].includes(mode))process.on("SIGTERM",()=>{});
const keepalive=setInterval(()=>{},1000);
if(mode!=="missing"&&mode!=="ignore-term")setTimeout(()=>{
  if(mode==="mutate")writeFileSync(process.env.RUBEND_STARTUP_FIXTURE_CACHE,Buffer.alloc(cache.length,2));
  if(mode==="mutate-binary")appendFileSync(process.argv[1],"\n");
  if(mode==="mutate-source")appendFileSync(process.env.RUBEND_STARTUP_FIXTURE_MUTATE_PATH,"\n");
  console.log(JSON.stringify({type:"ready"}));
},Number(process.env.RUBEND_STARTUP_FIXTURE_DELAY_MS??0));
const input=createInterface({input:createReadStream(process.argv[2],{flags:"r+"})});
input.on("line",()=>{
  if(mode==="no-done")return;
  const moves=mode==="wrong-solution"?[0]:[];
  console.log(JSON.stringify({type:"candidate",moves,length:moves.length,lower:0}));
  console.log(JSON.stringify({type:"done",length:0,lower:mode==="wrong-bound"?1:0,optimal:1}));
  if(mode==="exit-after-done")process.exit(7);
  if(mode==="unexpected-signal")process.kill(process.pid,"SIGUSR2");
});
input.on("close",()=>clearInterval(keepalive));
