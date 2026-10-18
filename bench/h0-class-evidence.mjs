import assert from "node:assert/strict";
import {readFileSync,writeFileSync,mkdirSync,chmodSync} from "node:fs";
import {createHash} from "node:crypto";
import {execFileSync} from "node:child_process";

const destination=process.argv[2]??"docs/verification/r04-corner-classes-v1";
const read=path=>JSON.parse(readFileSync(path,"utf8"));
const hash=path=>createHash("sha256").update(readFileSync(path)).digest("hex");
for(const name of["r04-h0-classes-v6","r04-h0-classes-check-v1","r04-h0-classes-regression-v1"]){const r=read("build/evidence/"+name+".json");assert.equal(r.exitCode,0);assert.equal(r.stoppedFor,null);}
const checks=read("build/evidence/h0-classes.json"),oracle=read("build/evidence/h0-class-oracle.json");
assert.equal(checks.passed,true);assert.equal(oracle.passed,true);assert.equal(oracle.physicalWordsCompared,1048576);
const payload="build/evidence/h0-classes-v1.raw";assert.equal(hash(payload),oracle.payloadSha256);
chmodSync(payload,0o444);
const sources=["src/h0-classes.bend","bench/h0-class-pilot.bend","tests/h0-class-oracle.mjs","tests/h0-classes.bend","tests/h0-classes.mjs","PROOF.bend","justfile"];
writeFileSync("build/evidence/h0-class-summary.json",JSON.stringify({passed:true,checkedLaws:23,newLaws:0,sourceHashes:Object.fromEntries(sources.map(path=>[path,hash(path)])),payload:{path:payload,sha256:hash(payload),bytes:readFileSync(payload).length,mode:"0444"},classCount:3393,rawStates:153090,stabilizerAudit:true,distanceAudit:false,independentReview:false},null,2)+"\n");
mkdirSync(destination,{recursive:true});
const names=[...Array.from({length:6},(_,i)=>"r04-h0-classes-v"+(i+1)),"r04-h0-classes-check-v1","r04-h0-classes-regression-v1","h0-classes","h0-class-oracle","h0-class-summary"];
const receipts=names.map(name=>JSON.parse(execFileSync(process.execPath,["bench/archive-evidence.mjs","build/evidence/"+name+".json",destination+"/"+name+".json.gz"],{encoding:"utf8"})));
writeFileSync(destination+"/index.json",JSON.stringify({receipts},null,2)+"\n",{flag:"wx"});
console.log(JSON.stringify({passed:true,archives:receipts.length,classCount:3393,payloadSha256:hash(payload)}));
