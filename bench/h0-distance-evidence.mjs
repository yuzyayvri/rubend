import assert from "node:assert/strict";
import {readFileSync,writeFileSync,mkdirSync,chmodSync} from "node:fs";
import {createHash} from "node:crypto";
import {execFileSync} from "node:child_process";

const destination=process.argv[2]??"docs/verification/r04-corner-distances-v1",read=path=>JSON.parse(readFileSync(path,"utf8"));
const hash=path=>createHash("sha256").update(readFileSync(path)).digest("hex");
for(const name of["r04-h0-distances-v2","r04-h0-distance-check-v2","r04-h0-distances-proof-v1"]){const r=read("build/evidence/"+name+".json");assert.equal(r.exitCode,0);assert.equal(r.stoppedFor,null);}
const checks=read("build/evidence/h0-distances.json");assert.equal(checks.passed,true);assert.equal(checks.oracle.physicalWordsCompared,1048576);assert.equal(checks.negative.length,9);
const path="build/evidence/h0-distances-v1.raw";chmodSync(path,0o444);
const sources=["src/h0-distances.bend","bench/h0-distance-pilot.bend","tests/h0-distance-oracle.mjs","tests/h0-distances.bend","tests/h0-distances.mjs","PROOF.bend","justfile"];
writeFileSync("build/evidence/h0-distance-summary.json",JSON.stringify({passed:true,checkedLaws:23,newLaws:0,sourceHashes:Object.fromEntries(sources.map(path=>[path,hash(path)])),payload:{path,sha256:hash(path),bytes:readFileSync(path).length,mode:"0444"},rawStates:153090,classes:3393,edges:2755620,maximum:9,distanceSum:984482,fullRegressionAtThisHead:false,independentReview:false},null,2)+"\n");
const names=["r04-h0-distances-compile-v1","r04-h0-distances-compile-v2","r04-h0-distances-v1","r04-h0-distances-v2","r04-h0-distance-check-v1","r04-h0-distance-check-v2","r04-h0-distances-proof-v1","h0-distances","h0-distance-summary"];
mkdirSync(destination,{recursive:true});const receipts=names.map(name=>JSON.parse(execFileSync(process.execPath,["bench/archive-evidence.mjs","build/evidence/"+name+".json",destination+"/"+name+".json.gz"],{encoding:"utf8"})));
writeFileSync(destination+"/index.json",JSON.stringify({receipts},null,2)+"\n",{flag:"wx"});console.log(JSON.stringify({passed:true,archives:receipts.length,payloadSha256:hash(path)}));
