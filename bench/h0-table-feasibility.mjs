import assert from "node:assert/strict";
import {spawnSync} from "node:child_process";
import {readFileSync,writeFileSync} from "node:fs";
import {createHash} from "node:crypto";

const binary=process.argv[2],output=process.argv[3];
assert.ok(binary&&output,"Expected frozen binary and fresh output path");
const hash=path=>createHash("sha256").update(readFileSync(path)).digest("hex");
const build=JSON.parse(readFileSync(binary+".json","utf8"));assert.equal(hash(binary),build.binarySha256);
const inputs=["build/evidence/h0-classes-v1.raw","build/evidence/h0-edges-v1.raw","build/evidence/h0-meta-v1.raw"];
const cohorts=[];
for(let i=0;i<5;i++){
  const started=performance.now();
  const result=spawnSync(binary,["--threads","1","--",...inputs,"10000000","probe"],{encoding:"utf8",timeout:240000,maxBuffer:4194304});
  assert.ifError(result.error);assert.equal(result.status,0,result.stdout+result.stderr);
  const record=JSON.parse(result.stdout.trim());
  assert.equal(record.complete,false);assert.equal(record.audited,false);assert.equal(record.expanded,10000000);assert.ok(record.visited>record.expanded&&record.visited<117567450);
  assert.equal(record.probeNodes,1000000);assert.ok(record.probeReads>=18000000&&record.probeReads<=65000000);assert.ok(record.knownReads>0&&record.knownReads<record.probeReads);assert.ok(record.generationMs>0&&record.probeMs>0);
  if(cohorts.length)for(const field of["expanded","visited","probeNodes","probeReads","knownReads","checksum"])assert.equal(record[field],cohorts[0][field]);
  cohorts.push({...record,elapsedMs:Math.round(performance.now()-started),stderr:result.stderr});
  console.log(JSON.stringify({cohort:i+1,...record}));
}
const generationSeconds=Math.max(...cohorts.map(c=>c.generationMs/1000/10000000*117567450));
const auditSeconds=Math.max(...cohorts.map(c=>c.probeMs/1000/1000000*117567450));
const marginSeconds=120,forecastSeconds=3*(generationSeconds+auditSeconds)+marginSeconds;
const report={format:"rubend-h0-feasibility-v1",purpose:"Conservative local full generation admission, not an engine speed comparison",binary,binarySha256:hash(binary),sourceHashes:build.sourceHashes,inputHashes:Object.fromEntries(inputs.map(p=>[p,hash(p)])),cohorts,forecast:{generationSeconds,auditSeconds,multiplier:3,marginSeconds,forecastSeconds,capSeconds:1800,admitted:forecastSeconds<1800},independentReview:false};
writeFileSync(output,JSON.stringify(report,null,2)+"\n",{flag:"wx"});console.log(JSON.stringify(report.forecast));
