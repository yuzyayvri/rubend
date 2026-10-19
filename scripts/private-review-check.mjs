import {spawnSync} from "node:child_process";
import {mkdirSync,writeFileSync} from "node:fs";
import {resolve} from "node:path";

const [mode="focused",label="private-review-"+Date.now()]=process.argv.slice(2);
if(!["focused","full"].includes(mode)||!/^[-a-z0-9]+$/.test(label))throw Error("Usage: node scripts/private-review-check.mjs [focused|full] [unique-label]");
const directory=resolve("build/evidence",label);mkdirSync(directory,{recursive:false});
const commands=mode==="full"?[["just","test"],["just","check"]]:[[process.execPath,"tests/contour-protocol.mjs"],[process.execPath,"tests/keyboard-playback.mjs"],[process.execPath,"tests/contour-compare.mjs"],[process.execPath,"tests/model-client.mjs"],[process.execPath,"tests/engine-lifecycle.mjs"]];
const head=spawnSync("git",["rev-parse","HEAD"],{encoding:"utf8"}).stdout.trim();
const report={format:"rubend-private-review-check-v1",head,mode,startedAt:new Date().toISOString(),passed:false,checks:[]};
const save=()=>writeFileSync(resolve(directory,"status.json"),JSON.stringify(report,null,2)+"\n");save();
for(const [index,command]of commands.entries()){
  const started=Date.now(),result=spawnSync(command[0],command.slice(1),{encoding:"utf8",timeout:mode==="full"?1700000:15000,maxBuffer:16*1024*1024});
  const path=resolve(directory,index+".log");writeFileSync(path,(result.stdout??"")+(result.stderr??""));
  const check={command,status:result.status,signal:result.signal,error:result.error?.message??null,elapsedMs:Date.now()-started,log:path};report.checks.push(check);save();console.log(JSON.stringify(check));
}
report.finishedAt=new Date().toISOString();report.passed=report.checks.every(c=>c.status===0&&!c.error);save();
console.log(JSON.stringify({passed:report.passed,directory}));process.exitCode=report.passed?0:1;
