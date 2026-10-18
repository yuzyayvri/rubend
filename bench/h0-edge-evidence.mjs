import assert from "node:assert/strict";
import {readFileSync,writeFileSync,mkdirSync,chmodSync} from "node:fs";
import {createHash} from "node:crypto";
import {execFileSync} from "node:child_process";

const destination=process.argv[2]??"docs/verification/r04-edges-v1",read=path=>JSON.parse(readFileSync(path,"utf8"));
const hash=path=>createHash("sha256").update(readFileSync(path)).digest("hex");
for(const name of["r04-h0-edges-compile-v1","r04-h0-edge-data-v1","r04-h0-edge-check-v1","r04-h0-components-regression-v1","r04-h0-product-check-v1"]){const r=read("build/evidence/"+name+".json");assert.equal(r.exitCode,0);assert.equal(r.stoppedFor,null);}
const checks=read("build/evidence/h0-edges.json"),oracle=read("build/evidence/h0-edge-oracle.json");assert.equal(checks.passed,true);assert.equal(oracle.physicalWordsCompared,4194304);assert.equal(checks.negative.length,7);
const product=JSON.parse(read("build/evidence/r04-h0-product-check-v1.json").stdout.trim());assert.equal(product.samples,4096);assert.ok(product.repaired>0&&product.unrepaired>0);
const path="build/evidence/h0-edges-v1.raw";assert.equal(hash(path),oracle.payloadSha256);chmodSync(path,0o444);
const sources=["src/h0-edges.bend","src/h0-edge-table.bend","bench/h0-edge-pilot.bend","tests/h0-edge-oracle.mjs","tests/h0-edges.bend","tests/h0-edges.mjs","tests/h0-product.bend","PROOF.bend","justfile"];
writeFileSync("build/evidence/h0-edge-summary.json",JSON.stringify({passed:true,checkedLaws:23,newLaws:0,sourceHashes:Object.fromEntries(sources.map(path=>[path,hash(path)])),payload:{path,sha256:hash(path),bytes:readFileSync(path).length,mode:"0444"},placements:34650,commutations:29937600,product,combinedRegression:true,fullH0Built:false,independentReview:false},null,2)+"\n");
const names=["r04-h0-edges-compile-v1","r04-h0-edge-data-v1","r04-h0-edge-check-v1","r04-h0-components-regression-v1","r04-h0-product-check-v1","h0-edges","h0-edge-oracle","h0-edge-summary"];
mkdirSync(destination,{recursive:true});const receipts=names.map(name=>JSON.parse(execFileSync(process.execPath,["bench/archive-evidence.mjs","build/evidence/"+name+".json",destination+"/"+name+".json.gz"],{encoding:"utf8"})));
writeFileSync(destination+"/index.json",JSON.stringify({receipts},null,2)+"\n",{flag:"wx"});console.log(JSON.stringify({passed:true,archives:receipts.length,payloadSha256:hash(path)}));
