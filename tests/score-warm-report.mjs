import assert from "node:assert/strict";
import {mkdtempSync,writeFileSync,rmSync} from "node:fs";
import {tmpdir} from "node:os";
import {resolve} from "node:path";
import {spawnSync} from "node:child_process";
import {solved} from "../apps/model.mjs";

const temporary=mkdtempSync(resolve(tmpdir(),"rubend-warm-score-")),raw=resolve(temporary,"raw.json"),resource=resolve(temporary,"resource.json");
const report={format:"rubend-warm-comparison-v1",passed:true,counts:{errors:0},config:{profiles:[{id:"before"},{id:"after"}]},rounds:[{status:"ok",jobs:["fast","exact","superflip"].flatMap(group=>["before","after"].map(profile=>({id:group,group,profile,facelets:solved,mode:group==="fast"?"fast":"exact",budgetMs:50,status:"ok",events:[{type:"candidate",elapsedMs:1,length:0,lower:0,moves:[],optimal:1},{type:"done",elapsedMs:2,length:0,lower:0,nodes:1,optimal:1}]})))}]};
const run=args=>spawnSync(process.execPath,["bench/score-warm.mjs",...args],{encoding:"utf8",maxBuffer:1048576});
try{
  writeFileSync(raw,JSON.stringify(report));writeFileSync(resource,JSON.stringify({exitCode:0,stoppedFor:null,stdout:JSON.stringify(report)}));
  const a=run(["--report",raw]),b=run([resource]);assert.equal(a.status,0,a.stderr);assert.equal(b.status,0,b.stderr);
  const direct=JSON.parse(a.stdout),wrapped=JSON.parse(b.stdout);assert.deepEqual(direct.groups,wrapped.groups);assert.match(direct.resourceValidation,/no resource enforcement claim/);
  let rejected=0;
  for(const change of [r=>r.passed=false,r=>r.counts.errors=1,r=>r.format="wrong",r=>r.rounds[0].jobs[0].events[0].moves=[0]]){const bad=structuredClone(report);change(bad);writeFileSync(raw,JSON.stringify(bad));assert.notEqual(run(["--report",raw]).status,0);rejected++;}
  console.log(JSON.stringify({passed:true,legacyAndDirectScoresAgree:true,reportModeDoesNotClaimResourceValidation:true,rejectedFixtures:rejected}));
}finally{rmSync(temporary,{recursive:true,force:true});}
