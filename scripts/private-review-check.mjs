import {spawn,spawnSync} from "node:child_process";
import {mkdirSync,writeFileSync,openSync,closeSync,readFileSync} from "node:fs";
import {resolve} from "node:path";
import {createHash} from "node:crypto";

const [mode="focused",label="private-review-"+Date.now()]=process.argv.slice(2);
if(!["focused","full","launch"].includes(mode)||!/^[-a-z0-9]+$/.test(label))throw Error("Usage: node scripts/private-review-check.mjs [focused|full|launch] [unique-label]");
if(mode==="launch"){
  mkdirSync("build/evidence",{recursive:true});
  const log=resolve("build/evidence",label+".log"),fd=openSync(log,"wx");
  const args=["develop","--command","node","bench/run-limited.mjs",label+"-resource","4096","1800","2,3,4,5",process.execPath,"scripts/private-review-check.mjs","full",label];
  const child=spawn("nix",args,{detached:true,stdio:["ignore",fd,fd]});
  child.on("error",error=>{console.error(error);process.exitCode=1;});
  child.once("spawn",()=>{
    const launch={pid:child.pid,startedAt:new Date().toISOString(),command:["nix",...args],log,status:resolve("build/evidence",label,"status.json"),resource:resolve("build/evidence",label+"-resource.json"),checkAfterMinutes:35};
    writeFileSync(resolve("build/evidence",label+"-launch.json"),JSON.stringify(launch,null,2)+"\n",{flag:"wx"});
    console.log(JSON.stringify(launch));closeSync(fd);child.unref();
  });
}else{
const directory=resolve("build/evidence",label);mkdirSync(directory,{recursive:false});
const commands=mode==="full"?[["just","test"],["just","check"]]:[[process.execPath,"tests/contour-protocol.mjs"],[process.execPath,"tests/keyboard-playback.mjs"],[process.execPath,"tests/contour-compare.mjs"],[process.execPath,"tests/model-client.mjs"],[process.execPath,"tests/engine-lifecycle.mjs"]];
const head=spawnSync("git",["rev-parse","HEAD"],{encoding:"utf8"}).stdout.trim();
const sources=Object.fromEntries(["apps/web/main.mjs","apps/web/model-client.mjs","apps/engine.mjs","bench/contour-compare.mjs","tests/contour-protocol.mjs","tests/keyboard-playback.mjs","scripts/private-review-check.mjs","justfile"].map(path=>[path,createHash("sha256").update(readFileSync(path)).digest("hex")]));
const report={format:"rubend-private-review-check-v1",head,sources,mode,startedAt:new Date().toISOString(),passed:false,checks:[]};
const save=()=>writeFileSync(resolve(directory,"status.json"),JSON.stringify(report,null,2)+"\n");save();
for(const [index,command]of commands.entries()){
  const started=Date.now(),result=spawnSync(command[0],command.slice(1),{encoding:"utf8",timeout:mode==="full"?1700000:15000,maxBuffer:16*1024*1024});
  const path=resolve(directory,index+".log");writeFileSync(path,(result.stdout??"")+(result.stderr??""));
  const check={command,status:result.status,signal:result.signal,error:result.error?.message??null,elapsedMs:Date.now()-started,log:path,stdout:result.stdout??"",stderr:result.stderr??""};report.checks.push(check);save();console.log(JSON.stringify({...check,stdout:undefined,stderr:undefined}));
}
report.finishedAt=new Date().toISOString();report.passed=report.checks.every(c=>c.status===0&&!c.error);save();
console.log(JSON.stringify({passed:report.passed,directory}));process.exitCode=report.passed?0:1;
}
