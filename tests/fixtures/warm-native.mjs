#!/usr/bin/env node
import {createReadStream,appendFileSync,readFileSync,existsSync} from "node:fs";
import {createInterface} from "node:readline";
const emit=event=>console.log(JSON.stringify(event));
const mode=process.env.WARM_FIXTURE_MODE??"ok";
const ledger=process.env.WARM_LIVENESS_LEDGER;
const birth=pid=>{try{const stat=readFileSync(`/proc/${pid}/stat`,"utf8");return stat.slice(stat.lastIndexOf(")")+2).trim().split(/\s+/)[19];}catch{return null;}};
if(ledger){const previous=existsSync(ledger)?readFileSync(ledger,"utf8").trim().split("\n").filter(Boolean).map(x=>JSON.parse(x)):[];const live=previous.filter(x=>x.type==="start"&&birth(x.pid)===x.startTicks).length+1;appendFileSync(ledger,JSON.stringify({type:"start",pid:process.pid,startTicks:birth(process.pid),live})+"\n");}
if(["forced","fallback-forced"].includes(mode))process.on("SIGTERM",()=>{if(ledger)appendFileSync(ledger,JSON.stringify({type:"term",pid:process.pid,ignored:true})+"\n");});
const solved="UUUUUUUUURRRRRRRRRFFFFFFFFFDDDDDDDDDLLLLLLLLLBBBBBBBBB";
const superflip=[7,1,16,14,3,8,4,9,0,5,16,14,1,5,16,5,17,8,4,2];
let jobs=0;
emit({type:"ready"});
for await(const line of createInterface({input:createReadStream(process.argv[2])})){
  const [facelets,search]=line.split("\t");jobs++;
  if(["fallback","fallback-forced"].includes(mode)&&jobs===2)continue;
  if(mode==="mutate"&&jobs===2)appendFileSync(process.env.WARM_MUTATE_PATH,"\n");
  const moves=facelets===solved?[]:superflip;
  if(mode==="wrong"&&jobs===2)moves.push(0);
  if(mode==="unknown"&&jobs===2){emit({type:"surprise"});continue;}
  if(mode==="late"&&search==="fast")await new Promise(r=>setTimeout(r,100));
  emit({type:"candidate",moves,length:moves.length,lower:0,nodes:1,optimal:moves.length===0?1:0});
  const done={type:"done",length:moves.length,lower:0,nodes:2,optimal:moves.length===0?1:0};
  if(mode==="missing"&&jobs===2)delete done.nodes;
  if(mode==="falseoptimal"&&jobs===2)done.optimal=2;
  if(mode==="native-time-limit"&&jobs===2)done.reason="time_limit";
  emit(done);
  if(mode==="exit"&&jobs===2)process.exit(7);
}
