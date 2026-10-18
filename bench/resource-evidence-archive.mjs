import assert from "node:assert/strict";
import {readFileSync,writeFileSync,mkdirSync} from "node:fs";
import {createHash} from "node:crypto";
import {execFileSync} from "node:child_process";

const read=p=>JSON.parse(readFileSync(p,"utf8")),destination="docs/verification/r04-evidence-guard-v1";
const tests=read("build/evidence/resource-evidence.json");for(const k of["passed","existingReceiptRejectedBeforeLaunch","childArtifactPreserved","actualOverwriteMutationDetected"])assert.equal(tests[k],true);
for(const name of["r04-evidence-guard-check-v1","r04-h0-contour-smoke-run-v2"]){const r=read("build/evidence/"+name+".json");assert.equal(r.exitCode,0);assert.equal(r.stoppedFor,null);}
const smoke=read("build/evidence/r04-h0-contour-smoke-v2.json");assert.equal(smoke.passed,true);assert.equal(smoke.rounds.flatMap(r=>r.jobs).length,16);
const sources=["bench/run-limited.mjs","tests/resource-evidence.mjs","justfile"];
writeFileSync("build/evidence/resource-evidence-summary.json",JSON.stringify({passed:true,tests,sourceHashes:Object.fromEntries(sources.map(p=>[p,createHash("sha256").update(readFileSync(p)).digest("hex")])),invalidated:"r04-h0-contour-smoke-v1 used the same filename for child and receipt. Its child report was overwritten. Do not use it for timing adjudication.",replacement:"r04-h0-contour-smoke-v2 child report and r04-h0-contour-smoke-run-v2 resource receipt",independentReview:false},null,2)+"\n");
mkdirSync(destination,{recursive:true});const names=["resource-evidence","resource-evidence-summary","r04-evidence-guard-check-v1","r04-h0-contour-smoke-v1","r04-h0-contour-smoke-config-v2","r04-h0-contour-smoke-v2","r04-h0-contour-smoke-run-v2"],receipts=names.map(n=>JSON.parse(execFileSync(process.execPath,["bench/archive-evidence.mjs","build/evidence/"+n+".json",destination+"/"+n+".json.gz"],{encoding:"utf8"})));
writeFileSync(destination+"/index.json",JSON.stringify({receipts},null,2)+"\n",{flag:"wx"});console.log(JSON.stringify({passed:true,archives:receipts.length,invalidSmokeRetainedButExcluded:true}));
