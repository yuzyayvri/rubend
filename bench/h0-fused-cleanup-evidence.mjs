import assert from "node:assert/strict";
import {readFileSync,writeFileSync} from "node:fs";
import {createHash} from "node:crypto";
import {execFileSync} from "node:child_process";

const destination="docs/verification/r04-h0-fused-rejected-v1",resource=JSON.parse(readFileSync("build/evidence/r04-h0-fused-rejection-check-run-v2.json")),restoration=JSON.parse(readFileSync("build/evidence/h0-reference-restoration.json"));assert.equal(resource.exitCode,0);assert.equal(resource.stoppedFor,null);assert.equal(restoration.passed,true);assert.equal(restoration.allAllocatedCodeAndDataEqual,true);
const paths=["src/h0-bound.bend","scripts/generate-h0-profile.mjs","src/h0/search.bend","src/h0/main.bend","src/h0/manifest.json","bench/rejected-h0-fused.bend","bench/h0-bound-query.bend","tests/h0-fast-codec.bend","tests/h0-bound.bend","justfile"];
writeFileSync("build/evidence/h0-fused-cleanup-summary.json",JSON.stringify({passed:true,restoration,sourceHashes:Object.fromEntries(paths.map(p=>[p,createHash("sha256").update(readFileSync(p)).digest("hex")])),scope:"Fused code remains only in an explicit rejected benchmark module and portable prototype. Live H0 runtime exposes only reference policies. Benchmark readers retain support for frozen prototype outputs.",checkedLaws:23,independentReview:false},null,2)+"\n",{flag:"wx"});
const receipts=["h0-reference-restoration","r04-h0-fused-rejection-check-run-v2","h0-fused-cleanup-summary"].map(n=>JSON.parse(execFileSync(process.execPath,["bench/archive-evidence.mjs","build/evidence/"+n+".json",destination+"/"+n+".json.gz"],{encoding:"utf8"})));
writeFileSync(destination+"/cleanup-index.json",JSON.stringify({receipts},null,2)+"\n",{flag:"wx"});console.log(JSON.stringify({passed:true,restoredRuntimeVerified:true,archives:receipts.length}));
