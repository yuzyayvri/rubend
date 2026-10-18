import {spawn} from "node:child_process";
import {readFileSync,readdirSync,mkdirSync,writeFileSync,existsSync} from "node:fs";
import {resolve,dirname} from "node:path";
import {createHash} from "node:crypto";
import {admission,cpuList} from "./resource-policy.mjs";
import {withArtifactLease} from "../scripts/artifact-lease.mjs";

withArtifactLease();

const [name,memoryText,timeText,cpuText,...command]=process.argv.slice(2);
const memoryMiB=Number(memoryText),seconds=Number(timeText),cpus=cpuText?.split(",").map(Number);
if(!/^[a-z0-9-]+$/.test(name??"")||!command.length)throw Error("Usage: node bench/run-limited.mjs NAME MEMORY_MiB SECONDS CPU[,CPU...] PROGRAM [ARGS...]");
const output=resolve(process.env.RUBEND_EVIDENCE??"build/evidence",`${name}.json`);
if(existsSync(output))throw Error("Refusing an existing resource receipt; use a fresh experiment name.");
const available=Number(readFileSync("/proc/meminfo","utf8").match(/^MemAvailable:\s+(\d+)/m)[1])*1024;
const allowed=cpuList(readFileSync("/proc/self/status","utf8").match(/^Cpus_allowed_list:\s+([^\n]+)/m)[1].trim());
const policy=admission({memoryMiB,seconds,cpus},available,allowed);
const binary=resolve(command[0]);
const record={format:"rubend-local-experiment-v1",name,startedAt:new Date().toISOString(),cwd:process.cwd(),command,limits:{...policy,enforcement:"transient user cgroup scope: MemoryMax, no swap; taskset; timeout; CPU rlimit; aggregate RSS and desktop-headroom backstops"},binarySha256:createHash("sha256").update(readFileSync(binary)).digest("hex"),availableMiB:Math.floor(available/1048576),peakTreeRssKiB:0,samples:0,exitCode:null,signal:null,stoppedFor:null,stdout:"",stderr:""};
if(existsSync(`${binary}.json`)){record.build=JSON.parse(readFileSync(`${binary}.json`,"utf8"));if(record.build.binarySha256!==record.binarySha256)throw Error("Experiment binary does not match its build record.");}
const started=performance.now(),child=spawn("systemd-run",["--user","--scope","--quiet",`--property=MemoryMax=${memoryMiB*1048576}`,"--property=MemorySwapMax=0","--","prlimit",`--cpu=${seconds}`,"--","nice","-n","10","taskset","-c",cpus.join(","),"timeout","--signal=TERM","--kill-after=3s",`${seconds}s`,"stdbuf","-oL","-eL",...command],{stdio:["ignore","pipe","pipe"],detached:true});
function stop(reason){if(record.stoppedFor)return;record.stoppedFor=reason;try{process.kill(-child.pid,"SIGKILL");}catch{}}
for(const channel of ["stdout","stderr"])child[channel].on("data",chunk=>{record[channel]+=chunk.toString();process[channel].write(chunk);if(record.stdout.length+record.stderr.length>16777216)stop("output-limit");});
const timer=setInterval(()=>{
  const processes=[];
  for(const entry of readdirSync("/proc")){if(!/^\d+$/.test(entry))continue;try{const status=readFileSync(`/proc/${entry}/status`,"utf8");processes.push({pid:Number(entry),parent:Number(status.match(/^PPid:\s+(\d+)/m)[1]),rss:Number(status.match(/^VmRSS:\s+(\d+)/m)?.[1]??0)});}catch{}}
  const owned=new Set([child.pid]);let changed=true;while(changed){changed=false;for(const p of processes)if(owned.has(p.parent)&&!owned.has(p.pid)){owned.add(p.pid);changed=true;}}
  const rss=processes.filter(p=>owned.has(p.pid)).reduce((a,p)=>a+p.rss,0);record.peakTreeRssKiB=Math.max(record.peakTreeRssKiB,rss);record.samples++;
  if(rss>memoryMiB*1024)stop("aggregate-rss-limit");
  const headroom=Number(readFileSync("/proc/meminfo","utf8").match(/^MemAvailable:\s+(\d+)/m)[1]);
  if(headroom<policy.memoryPressureStopMiB*1024)stop("desktop-memory-pressure");
  if(performance.now()-started>seconds*1000+5000)stop("wall-limit-backstop");
},200);
process.on("SIGTERM",()=>stop("parent-termination"));process.on("SIGINT",()=>stop("parent-interruption"));
try{await new Promise((res,rej)=>{child.on("error",rej);child.on("close",(code,signal)=>{record.exitCode=code;record.signal=signal;res();});});}
finally{clearInterval(timer);record.elapsedMs=Math.round(performance.now()-started);record.finishedAt=new Date().toISOString();mkdirSync(dirname(output),{recursive:true});writeFileSync(output,JSON.stringify(record,null,2)+"\n",{flag:"wx"});process.stderr.write(`Experiment record: ${output}\n`);}
process.exitCode=record.exitCode??1;
