import assert from "node:assert/strict";
import {mkdtempSync,writeFileSync,readFileSync,existsSync,openSync,ftruncateSync,closeSync,rmSync} from "node:fs";
import {tmpdir} from "node:os";
import {resolve} from "node:path";
import {spawnSync} from "node:child_process";
import {gunzipSync} from "node:zlib";
import {createHash} from "node:crypto";

assert.equal(process.argv.length,3);const program=resolve(process.argv[2]),directory=mkdtempSync(resolve(tmpdir(),"rubend-streamed-archive-")),source=resolve(directory,"source.json"),destination=resolve(directory,"source.json.gz"),bytes=JSON.stringify({format:"archive-regression",raw:"a".repeat(33554432)}),hash=x=>createHash("sha256").update(x).digest("hex"),run=(a,b)=>spawnSync(process.execPath,[program,a,b],{encoding:"utf8",timeout:30000,maxBuffer:16384});
try{
  writeFileSync(source,bytes,{flag:"wx"});const first=run(source,destination);assert.equal(first.status,0,first.stderr);const compressed=readFileSync(destination);assert.equal(gunzipSync(compressed).toString("utf8"),bytes);const receipt=JSON.parse(first.stdout);assert.equal(receipt.sha256,hash(bytes));assert.equal(receipt.compressedSha256,hash(compressed));assert.equal(run(source,destination).status===0,false);assert.equal(hash(readFileSync(destination)),hash(compressed));const bad=resolve(directory,"bad.json"),target=resolve(directory,"bad.json.gz");writeFileSync(bad,"{bad",{flag:"wx"});assert.notEqual(run(bad,target).status,0);assert.equal(existsSync(target),false);assert.equal(hash(readFileSync(source)),hash(bytes));const large=resolve(directory,"too-large.json"),fd=openSync(large,"wx");ftruncateSync(fd,134217729);closeSync(fd);assert.notEqual(run(large,target).status,0);assert.equal(existsSync(target),false);console.log(JSON.stringify({passed:true,over32MiBRoundtrip:true,over128MiBRejected:true,exclusiveDestination:true,malformedRejected:true,sourcePreserved:true}));
}finally{rmSync(directory,{recursive:true});}
