import assert from "node:assert/strict";
import {mkdtempSync,writeFileSync,rmSync} from "node:fs";
import {tmpdir} from "node:os";
import {resolve} from "node:path";
import {spawnSync} from "node:child_process";

const temporary=mkdtempSync(resolve(tmpdir(),"rubend-corner-orders-")),a=resolve(temporary,"a.json"),b=resolve(temporary,"b.json");
const report={format:"rubend-contour-comparison-v1",passed:true,errors:[],config:{count:1,target:15,split:"pilot",stratum:"uniform",cacheSha256:"cache",cornerSha256:"corner"},seals:[{path:"fixture",sha256:"same"}],rounds:Array.from({length:5},()=>({status:"ok",jobs:["forward","inverse-three","corner","combined"].map(profile=>({id:"case",facelets:"fixture",profile,target:15,complete:true,depth:null,lower:15,length:31,optimal:0,nodes:100,moves:[]}))}))};
function run(next){writeFileSync(b,JSON.stringify(next));return spawnSync(process.execPath,["bench/compare-corner-orders.mjs",a,b],{encoding:"utf8",maxBuffer:1048576});}
try{
  writeFileSync(a,JSON.stringify(report));const good=run(report);assert.equal(good.status,0,good.stderr);assert.equal(JSON.parse(good.stdout).pairedJobs,20);
  let rejected=0;
  for(const [change,message] of [[r=>r.rounds[0].jobs[0].nodes++,/Order changed terminal metadata/],[r=>r.rounds[0].jobs[0].moves=[0],/Order changed terminal metadata/],[r=>r.config.target=16,/Expected values to be strictly equal/],[r=>r.seals[0].sha256="changed",/Shared input content changed/],[r=>r.rounds.pop(),/Expected values to be strictly equal/],[r=>r.passed=false,/Expected values to be strictly equal/]]){
    const next=structuredClone(report);change(next);const bad=run(next);assert.notEqual(bad.status,0);assert.match(bad.stderr,message);rejected++;
  }
  console.log(JSON.stringify({passed:true,terminalMetadataAndMovesAndWorkChecked:true,commonInputsChecked:true,rejectedFixtures:rejected}));
}finally{rmSync(temporary,{recursive:true,force:true});}
