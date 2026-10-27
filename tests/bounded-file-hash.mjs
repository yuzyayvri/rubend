import assert from "node:assert/strict";
import {readFileSync,writeFileSync,mkdirSync,readdirSync,existsSync} from "node:fs";
import {resolve} from "node:path";
import {createHash} from "node:crypto";
import {execFileSync,spawnSync} from "node:child_process";
import {fileHash} from "../bench/bounded-file-hash.mjs";

assert.equal(process.argv.length,3);
const output=resolve(process.argv[2]),directory=output+"-fixtures";mkdirSync(directory);
const sizes=[0,1,262143,262144,262145,1048579],before=readdirSync("/proc/self/fd").length,rows=[];
for(const size of sizes){const path=resolve(directory,"size-"+size+".raw"),bytes=Buffer.from(Uint8Array.from({length:size},(_,i)=>(i*37+11)&255)),expected=createHash("sha256").update(bytes).digest("hex");writeFileSync(path,bytes,{flag:"wx"});assert.equal(fileHash(path),expected);rows.push({size,sha256:expected});}
const mutable=resolve(directory,"changed.raw");writeFileSync(mutable,"first",{flag:"wx"});const initial=fileHash(mutable);writeFileSync(mutable,"second");assert.notEqual(fileHash(mutable),initial);
for(let i=0;i<64;i++){assert.equal(fileHash(resolve(directory,"size-1.raw")),rows[1].sha256);assert.throws(()=>fileHash(directory),{code:"EISDIR"});}
assert.throws(()=>fileHash(resolve(directory,"missing.raw")),{code:"ENOENT"});assert.equal(readdirSync("/proc/self/fd").length,before);
const id="u05-hash-source-refusal-v1",experiment=resolve("build/experiments",id);assert.equal(existsSync(experiment),false);
const cache=resolve(".cache/joint/phase1-v1.raw"),planPath=resolve(directory,"wrong-seal-plan.json"),plan={format:"rubend-background-tests-v1",id,root:process.cwd(),revision:execFileSync("git",["rev-parse","HEAD"],{encoding:"utf8"}).trim(),sourceHashes:{[cache]:"0".repeat(64)},jobs:[{id:"noop",memoryMiB:128,seconds:5,cpus:[2],command:[process.execPath,"-e","process.exit(0)"]}]};writeFileSync(planPath,JSON.stringify(plan)+"\n",{flag:"wx"});
const refused=spawnSync(process.execPath,["bench/background-tests.mjs","start",planPath],{encoding:"utf8",timeout:15000,maxBuffer:1048576});assert.ifError(refused.error);assert.equal(refused.status,1);assert.equal(refused.signal,null);assert.ok((refused.stdout+refused.stderr).includes("Source changed during unattended checks: "+cache));assert.equal(existsSync(experiment),false,"Bad large-file seal must fail before creating or starting a queue");
writeFileSync(output,JSON.stringify({passed:true,byteBoundaryCases:rows,changedDataRejected:true,missingFileRejected:true,directoryRejected:true,successfulAndFailedDescriptorsClosed:64,largeBadSealRefusedBeforeQueueCreation:true,refusal:{command:[process.execPath,"bench/background-tests.mjs","start",planPath],status:refused.status,stdout:refused.stdout,stderr:refused.stderr},sourceHashes:Object.fromEntries(["bench/bounded-file-hash.mjs","bench/background-tests.mjs","tests/bounded-file-hash.mjs"].map(p=>[p,fileHash(p)]))})+"\n",{flag:"wx"});
console.log(JSON.stringify({passed:true,byteBoundaryCases:sizes.length,descriptorIterations:64,largeBadSealRefusedBeforeQueueCreation:true}));
