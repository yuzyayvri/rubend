import assert from "node:assert/strict";
import {readFileSync,writeFileSync,mkdirSync,mkdtempSync,chmodSync,existsSync,rmSync} from "node:fs";
import {resolve} from "node:path";
import {spawnSync} from "node:child_process";
import {createHash} from "node:crypto";

mkdirSync("build/experiments",{recursive:true});
const directory=mkdtempSync(resolve("build/experiments/control-detached-test-")),hash=x=>createHash("sha256").update(x).digest("hex");
const target=resolve(directory,"target"),source=resolve(directory,"input.json"),wrapper=resolve(directory,"wrapper"),output=resolve(directory,"output.json");
try{
  const bytes=Buffer.from(`#!${process.execPath}\nconsole.log(JSON.stringify({args:process.argv.slice(2),control:process.env.RUBEND_CONTROL_FIFO??null,pid:process.pid}));\n`);
  writeFileSync(target,bytes);chmodSync(target,0o755);
  writeFileSync(target+".json",JSON.stringify({binarySha256:hash(bytes)}));
  writeFileSync(source,JSON.stringify({profiles:[{id:"legacy"},{id:"cooperative-raw",binary:target,buildMetadata:target+".json",env:{}}]}));
  const run=(w,o)=>spawnSync(process.execPath,["bench/control-detached-probe.mjs",source,w,o],{encoding:"utf8"});
  const created=run(wrapper,output);assert.equal(created.status,0,created.stderr);
  const result=spawnSync(wrapper,["one two","$RUBEND_CONTROL_FIFO"],{encoding:"utf8",env:{...process.env,RUBEND_CONTROL_FIFO:"must-not-reach-native"}});
  assert.equal(result.status,0,result.stderr);assert.deepEqual(JSON.parse(result.stdout),{args:["one two","$RUBEND_CONTROL_FIFO"],control:null,pid:result.pid});
  const config=JSON.parse(readFileSync(output,"utf8")),metadata=JSON.parse(readFileSync(wrapper+".json","utf8"));
  assert.equal(config.profiles[0].binary,wrapper);assert.equal(config.profiles[1].binary,target);assert.equal(metadata.target,target);assert.equal(metadata.targetBinarySha256,hash(bytes));assert.equal(metadata.binarySha256,hash(readFileSync(wrapper)));
  const preserved=readFileSync(wrapper),collision=run(wrapper,output);assert.notEqual(collision.status,0);assert.match(collision.stderr,/Fresh probe paths required/);assert.deepEqual(readFileSync(wrapper),preserved);
  writeFileSync(target,Buffer.concat([bytes,Buffer.from("\n")]));
  const mismatch=run(resolve(directory,"other"),resolve(directory,"other.json"));assert.notEqual(mismatch.status,0);assert.ok(mismatch.stderr.includes(hash(bytes)));assert.equal(existsSync(resolve(directory,"other")),false);assert.equal(existsSync(resolve(directory,"other.json")),false);
  console.log(JSON.stringify({passed:true,sameNativeTargetSealed:true,controlRemoved:true,argumentsPreserved:true,execPreservesPid:true,collisionPreservesWrapper:true,targetMismatchRejectedBeforeWrites:true}));
}finally{rmSync(directory,{recursive:true,force:true});}
