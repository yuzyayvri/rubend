import assert from "node:assert/strict";
import {readFileSync,writeFileSync,mkdirSync,statSync} from "node:fs";
import {createHash} from "node:crypto";
import {execFileSync} from "node:child_process";

const destination = process.argv[2] ?? "docs/verification/r04-corner-codec-v1";
const read = path => JSON.parse(readFileSync(path,"utf8"));
const hash = path => createHash("sha256").update(readFileSync(path)).digest("hex");
for (const name of ["r04-h0-codec-native-v2","r04-h0-codec-regression-v1","r04-h0-codec-target-v1","r04-h0-codec-export-v1"]) {
  const r = read("build/evidence/"+name+".json");assert.equal(r.exitCode,0);assert.equal(r.stoppedFor,null);
}
const checks = read("build/evidence/h0-corners.json");
assert.equal(checks.passed,true);assert.equal(checks.coordinates,153090);assert.equal(checks.targetSymmetryChecks,48);
const baseline = "bbe6429d424541f0554b47400e4557136cd9ac47";
for (const path of ["LAWS.bend","src/symmetry48-laws.bend"]) assert.equal(readFileSync(path,"utf8"),execFileSync("git",["show",baseline+":"+path],{encoding:"utf8"}));
const sources = ["src/h0-corners.bend","tests/h0-corners.bend","tests/h0-corners.mjs","PROOF.bend","LAWS.bend","justfile"];
const artifacts = ["build/evidence/r04-h0-codec-proof-v1.bendtt","build/evidence/r04-h0-default-v1.c","build/evidence/r01-init-c-before-v1/default.c"];
assert.equal(hash(artifacts[1]),hash(artifacts[2]));
writeFileSync("build/evidence/h0-corner-summary.json",JSON.stringify({passed:true,checkedLaws:23,newLaws:0,sourceHashes:Object.fromEntries(sources.map(path => [path,hash(path)])),artifacts:Object.fromEntries(artifacts.map(path => [path,{bytes:statSync(path).size,sha256:hash(path)}])),defaultNativeCUnchanged:true,quotientBuilt:false,universalProjectionProof:false,independentReview:false},null,2)+"\n");
mkdirSync(destination,{recursive:true});
const names = ["r04-h0-codec-native-v1","r04-h0-codec-native-v2","r04-h0-codec-regression-v1","r04-h0-codec-target-v1","r04-h0-codec-export-v1","h0-corners","h0-corner-summary"];
const receipts = names.map(name => JSON.parse(execFileSync(process.execPath,["bench/archive-evidence.mjs","build/evidence/"+name+".json",destination+"/"+name+".json.gz"],{encoding:"utf8"})));
writeFileSync(destination+"/index.json",JSON.stringify({receipts},null,2)+"\n",{flag:"wx"});
console.log(JSON.stringify({passed:true,archives:receipts.length,destination,coordinates:checks.coordinates}));
