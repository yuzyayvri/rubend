import assert from "node:assert/strict";
import {readFileSync,writeFileSync,mkdirSync} from "node:fs";
import {createHash} from "node:crypto";
import {execFileSync} from "node:child_process";

const destination="docs/verification/r04-h0-fused-check-v1",resource=JSON.parse(readFileSync("build/evidence/r04-h0-fused-check-build-run-v1.json","utf8")),queries=JSON.parse(readFileSync("build/evidence/h0-fast-bound-oracle.json","utf8"));
assert.equal(resource.exitCode,0);assert.equal(resource.stoppedFor,null);assert.equal(queries.passed,true);assert.equal(queries.kernel,"fast");assert.equal(queries.checked,47871);assert.ok(resource.stdout.includes('"cornerCodecs":153090,"edgeCodecs":34650'));assert.ok(resource.stdout.includes("ALL PROOFS CHECK"));
const paths=["src/h0-bound.bend","scripts/generate-h0-profile.mjs","src/h0/search.bend","src/h0/main.bend","src/h0/manifest.json","bench/h0-bound-query.bend","bench/h0-contour.bend","tests/h0-fast-codec.bend","tests/h0-bound.bend","tests/h0-bound-oracle.mjs","bench/contour-compare.mjs","bench/summarize-corner-contours.mjs","tests/contour-compare.mjs","tests/corner-contour-summary.mjs"];
writeFileSync("build/evidence/h0-fused-check-summary.json",JSON.stringify({passed:true,componentCorners:153090,componentEdges:34650,cubeQueries:47871,checkedLaws:23,sourceHashes:Object.fromEntries(paths.map(p=>[p,createHash("sha256").update(readFileSync(p)).digest("hex")])),builds:Object.fromEntries(["h0-bound-query-v3","h0-contour-v4","h0-release-v4"].map(n=>[n,JSON.parse(readFileSync("build/experiments/"+n+".json","utf8"))])),performance:"NOT YET ADJUDICATED",independentReview:false},null,2)+"\n",{flag:"wx"});
mkdirSync(destination,{recursive:true});const receipts=["r04-h0-fused-check-build-run-v1","h0-fast-bound-oracle","h0-fused-check-summary"].map(n=>JSON.parse(execFileSync(process.execPath,["bench/archive-evidence.mjs","build/evidence/"+n+".json",destination+"/"+n+".json.gz"],{encoding:"utf8"})));
writeFileSync(destination+"/index.json",JSON.stringify({receipts},null,2)+"\n",{flag:"wx"});console.log(JSON.stringify({passed:true,archives:receipts.length}));
