import assert from "node:assert/strict";
import {readFileSync,writeFileSync,mkdirSync} from "node:fs";
import {createHash} from "node:crypto";
import {execFileSync} from "node:child_process";

const destination="docs/verification/r04-h0-reference-contours-v1",analyses={};
for(const stratum of["pilot","development"]){
  const name="r04-h0-contour-"+stratum,resource=JSON.parse(readFileSync("build/evidence/"+name+"-run-v1.json","utf8")),report=JSON.parse(readFileSync("build/evidence/"+name+"-v1.json","utf8"));assert.equal(resource.exitCode,0);assert.equal(resource.stoppedFor,null);assert.equal(report.passed,true);assert.equal(report.rounds.length,5);assert.equal(report.rounds.flatMap(r=>r.jobs).length,320);
  const summary=JSON.parse(execFileSync(process.execPath,["bench/summarize-corner-contours.mjs","build/evidence/"+name+"-v1.json"],{encoding:"utf8"}));assert.equal(summary.comparisons["inverse-three/h0-combined"].observedTenPercentContourGate,false);analyses[stratum]=summary;
  writeFileSync("build/evidence/"+name+"-summary-v1.json",JSON.stringify(summary,null,2)+"\n",{flag:"wx"});
}
const sources=["bench/contour-compare.mjs","bench/summarize-corner-contours.mjs","tests/contour-compare.mjs","tests/corner-contour-summary.mjs"];
writeFileSync("build/evidence/h0-reference-contours-summary.json",JSON.stringify({passed:true,disposition:"Reference H0 misses the ten-percent marginal CPU gate over inverse-three on both finite sets. Keep the data/reference but do not promote this kernel.",measured:640,shallowChecks:6520,analyses,analysisSourceHashes:Object.fromEntries(sources.map(p=>[p,createHash("sha256").update(readFileSync(p)).digest("hex")])),limiter:"Additional ranking and lookup cost is a hypothesis, not yet a measured source profile. A fused one-pass ranking treatment is being checked separately.",independentReview:false},null,2)+"\n",{flag:"wx"});
mkdirSync(destination,{recursive:true});const names=["h0-reference-contours-summary",...['pilot','development'].flatMap(s=>["r04-h0-contour-"+s+"-config-v1","r04-h0-contour-"+s+"-run-v1","r04-h0-contour-"+s+"-v1","r04-h0-contour-"+s+"-summary-v1"])];
const receipts=names.map(n=>JSON.parse(execFileSync(process.execPath,["bench/archive-evidence.mjs","build/evidence/"+n+".json",destination+"/"+n+".json.gz"],{encoding:"utf8"})));
writeFileSync(destination+"/index.json",JSON.stringify({receipts},null,2)+"\n",{flag:"wx"});console.log(JSON.stringify({passed:true,archives:receipts.length,referenceKernelNotPromoted:true}));
