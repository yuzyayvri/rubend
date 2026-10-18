import assert from "node:assert/strict";
import {mkdtempSync,writeFileSync,rmSync} from "node:fs";
import {tmpdir} from "node:os";
import {resolve} from "node:path";
import {spawnSync} from "node:child_process";

const temporary=mkdtempSync(resolve(tmpdir(),"rubend-corner-summary-")),path=resolve(temporary,"input.json"),profiles=["forward","inverse-three","corner","combined"];
const report={format:"rubend-contour-comparison-v1",passed:true,errors:[],config:{cornerCache:"/corner",target:15,count:1},rounds:Array.from({length:5},(_,round)=>({round,status:"ok",workers:profiles.map(profile=>({profile,shallowPassed:163,shutdown:{ipcRemoved:true,forced:false}})),jobs:profiles.map((profile,i)=>({profile,id:"case",facelets:"same",target:15,complete:true,lower:15,optimal:0,cpuTicks:100-i*20,cpuMs:1000-i*200,nativeMs:1000-i*200,nodes:10000-i*2000}))}))};
function run(input){writeFileSync(path,JSON.stringify(input));return spawnSync(process.execPath,["bench/summarize-corner-contours.mjs",path],{encoding:"utf8",maxBuffer:1048576});}
try{
  const good=run(report);assert.equal(good.status,0,good.stderr);const result=JSON.parse(good.stdout);assert.equal(result.comparisons["forward/corner"].observedTenPercentContourGate,true);assert.ok(Math.abs(result.comparisons["inverse-three/combined"].geometricCpuRatio-.5)<1e-10);
  const partial=structuredClone(report);for(const r of partial.rounds){r.jobs[0].complete=false;r.jobs[0].lower=14;}
  const censored=run(partial);assert.equal(censored.status,0,censored.stderr);const kept=JSON.parse(censored.stdout);assert.equal(kept.completed.forward.censored,5);assert.equal(kept.comparisons["forward/corner"].allTargetsComparable,false);assert.equal(Object.hasOwn(kept.comparisons["forward/corner"],"geometricCpuRatio"),false);
  let rejected=0;
  for(const change of [r=>r.passed=false,r=>r.rounds.pop(),r=>r.rounds[0].workers[0].shutdown.forced=true,r=>r.rounds[0].jobs.pop(),r=>r.rounds[0].jobs[0].nativeMs=1,r=>r.rounds[0].jobs[0].cpuMs=1,r=>r.rounds[0].jobs[1].facelets="changed",r=>r.rounds[1].jobs[0].nodes++,r=>r.rounds.forEach(c=>c.jobs[2].length=12)]){const bad=structuredClone(report);change(bad);assert.notEqual(run(bad).status,0);rejected++;}
  console.log(JSON.stringify({passed:true,censoredCasesRetained:true,cohortRatios:true,rejectedFixtures:rejected}));
}finally{rmSync(temporary,{recursive:true,force:true});}
