#!/nix/store/gxq2cd70i077rah1d4hkzc1lpq8q4pv8-nodejs-24.21.0/bin/node
import {createReadStream,readFileSync} from "node:fs";
import {createInterface} from "node:readline";

const cooperative=!process.argv[1].includes("legacy"),emit=event=>console.log(JSON.stringify(event));
const cache=readFileSync(process.env.RUBEND_JOINT_CACHE);
if(cache.length!==4096)process.exit(2);
emit({type:"initializing"});
setTimeout(()=>emit(cooperative?{type:"ready",protocol:2,jobIds:true,cancel:true}:{type:"ready"}),100);
const input=createInterface({input:createReadStream(process.argv[2],{flags:"r+"})});
const control=createInterface({input:createReadStream(process.env.RUBEND_CONTROL_FIFO,{flags:"r+"})});
input.on("line",line=>{
  const [facelets,,,id]=line.split("\t"),tag=cooperative?{jobId:Number(id)}:{};
  if(facelets==="UUUUUUUUURRRRRRRRRFFFFFFFFFDDDDDDDDDLLLLLLLLLBBBBBBBBB"){
    emit({type:"candidate",...tag,moves:[],length:0,lower:0,nodes:1});
    emit({type:"done",...tag,length:0,lower:0,nodes:1,optimal:1});
  }else emit({type:"progress",...tag,lower:0,nodes:100000});
});
control.on("line",line=>{if(cooperative)emit({type:"cancelled",jobId:Number(line)});});
