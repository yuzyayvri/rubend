import assert from "node:assert/strict";
import {readFileSync,writeFileSync,mkdirSync,chmodSync} from "node:fs";
import {createHash} from "node:crypto";
import {execFileSync} from "node:child_process";

const destination=process.argv[2]??"docs/verification/r04-meta-v1",read=path=>JSON.parse(readFileSync(path,"utf8"));
const hash=path=>createHash("sha256").update(readFileSync(path)).digest("hex");
for(const name of["r04-h0-meta-v1","r04-h0-meta-oracle-v1","r04-h0-meta-check-v1","r04-h0-meta-frame-v1","r04-h0-meta-proof-v1"]){const r=read("build/evidence/"+name+".json");assert.equal(r.exitCode,0);assert.equal(r.stoppedFor,null);}
const checks=read("build/evidence/h0-meta.json"),oracle=read("build/evidence/h0-meta-oracle.json");assert.equal(checks.passed,true);assert.equal(checks.negative.length,9);assert.equal(oracle.logicalWordsCompared,2892000);assert.equal(oracle.productMoveChecks,36000);assert.ok(oracle.stabilizerRequired>0);
const path="build/evidence/h0-meta-v1.raw";assert.equal(hash(path),oracle.payloadSha256);chmodSync(path,0o444);
const sources=["src/h0-meta.bend","bench/h0-meta-pilot.bend","tests/h0-meta-oracle.mjs","tests/h0-meta.bend","tests/h0-meta.mjs","PROOF.bend","justfile"];
writeFileSync("build/evidence/h0-meta-summary.json",JSON.stringify({passed:true,checkedLaws:23,newLaws:0,sourceHashes:Object.fromEntries(sources.map(path=>[path,hash(path)])),payload:{path,sha256:hash(path),bytes:readFileSync(path).length,mode:"0444"},goal:450429,logicalWords:2892000,fullH0Built:false,combinedRegressionDue:true,independentReview:false},null,2)+"\n");
const names=["r04-h0-meta-v1","r04-h0-meta-oracle-v1","r04-h0-meta-check-v1","r04-h0-meta-frame-v1","r04-h0-meta-proof-v1","h0-meta","h0-meta-oracle","h0-meta-summary"];
mkdirSync(destination,{recursive:true});const receipts=names.map(name=>JSON.parse(execFileSync(process.execPath,["bench/archive-evidence.mjs","build/evidence/"+name+".json",destination+"/"+name+".json.gz"],{encoding:"utf8"})));
writeFileSync(destination+"/index.json",JSON.stringify({receipts},null,2)+"\n",{flag:"wx"});console.log(JSON.stringify({passed:true,archives:receipts.length,payloadSha256:hash(path)}));
