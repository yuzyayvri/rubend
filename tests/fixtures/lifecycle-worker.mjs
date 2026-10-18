#!/nix/store/gxq2cd70i077rah1d4hkzc1lpq8q4pv8-nodejs-24.21.0/bin/node
import {appendFileSync,createReadStream,existsSync,readFileSync} from "node:fs";
import {createInterface} from "node:readline";

const mode=process.env.RUBEND_LIFECYCLE_MODE??"cooperative",legacy=mode==="legacy",log=process.env.RUBEND_LIFECYCLE_LOG;
const record=(type,extra={})=>appendFileSync(log,JSON.stringify({type,pid:process.pid,at:performance.timeOrigin+performance.now(),...extra})+"\n");
const emit=event=>console.log(JSON.stringify(event));
const ticks=pid=>{try{const text=readFileSync(`/proc/${pid}/stat`,"utf8");return text.slice(text.lastIndexOf(")")+2).trim().split(/\s+/)[19];}catch{return null;}};
const previous=existsSync(log)?readFileSync(log,"utf8").trim().split("\n").filter(Boolean).map(JSON.parse):[];
record("start",{directory:process.argv[2],startTicks:ticks(process.pid),livePreviousPids:previous.filter(r=>r.type==="start"&&ticks(r.pid)===r.startTicks).map(r=>r.pid)});
if(mode==="ignore-term")process.on("SIGTERM",()=>record("term-ignored"));
const input=createInterface({input:createReadStream(process.argv[2],{flags:"r+"})});
const control=process.env.RUBEND_CONTROL_FIFO?createInterface({input:createReadStream(process.env.RUBEND_CONTROL_FIFO,{flags:"r+"})}):null;
setTimeout(()=>{record("ready");emit(legacy?{type:"ready"}:{type:"ready",protocol:mode==="bad-protocol"?3:2,jobIds:true,cancel:true});},mode==="delayed"?250:0);
let current=0;
input.on("line",line=>{
  const [facelets,,,id]=line.split("\t"),jobId=Number(id);current=jobId;
  record("job",{jobId,facelets});
  if(mode==="bad-id"){emit({type:"progress",lower:0});return;}
  if(mode==="malformed"){emit(null);return;}
  if(mode==="bad-terminal"){emit({type:"done",jobId,length:0,lower:0,optimal:0});return;}
  if(mode==="fixed-events"){emit({type:"snapshot",jobId,state:[]});emit({type:"measurement",jobId,nativeMs:1});}
  if(mode==="bad-replay"){emit({type:"candidate",jobId,moves:[],length:0,lower:0});return;}
  if(facelets==="UUUUUUUUURRRRRRRRRFFFFFFFFFDDDDDDDDDLLLLLLLLLBBBBBBBBB"){
    emit({type:"candidate",...(legacy?{}:{jobId}),moves:[],length:0,lower:0});
    emit({type:"done",...(legacy?{}:{jobId}),length:0,lower:0,optimal:1});
  }
});
control?.on("line",line=>{
  const jobId=Number(line);record("cancel",{jobId});
  if(legacy||mode==="ignore-cancel"||mode==="ignore-term")return;
  emit({type:mode==="done-race"?"done":"cancelled",jobId});
  if(mode==="late")setTimeout(()=>emit({type:"candidate",jobId,moves:[18],length:1,lower:0}),20);
  if(current===jobId)current=0;
});
