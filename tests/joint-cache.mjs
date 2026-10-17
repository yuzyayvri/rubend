import assert from "node:assert/strict";
import {spawnSync} from "node:child_process";
import {mkdtempSync,readFileSync,writeFileSync,rmSync,mkdirSync} from "node:fs";
import {tmpdir} from "node:os";
import {join,resolve} from "node:path";

const directory=mkdtempSync(join(tmpdir(),"rubend-cache-test-")),path=join(directory,"test.raw"),binary=resolve("build/joint-cache-test");
const run=(mode,file)=>spawnSync(binary,[mode,file,"--threads","1"],{encoding:"utf8",timeout:10000,maxBuffer:1048576});
try{
  const shifted=spawnSync(binary,["shift","--threads","1"],{encoding:"utf8",timeout:10000});assert.equal(shifted.status,0,shifted.stderr);assert.match(shifted.stdout,/"overlapMoveAndPrefix":true/);
  assert.equal(run("write",path).status,0);
  const bytes=readFileSync(path);assert.equal(bytes.length,70001*4);
  for(let i=0;i<70001;i++)assert.equal(bytes.readUInt32LE(i*4),(Math.imul(i,2654435761)^2779096485)>>>0);
  assert.equal(run("read",path).status,0);
  assert.notEqual(run("write",path).status,0,"Existing cache must not be overwritten");
  assert.deepEqual(readFileSync(path),bytes);
  const short=join(directory,"short.raw"),long=join(directory,"long.raw");writeFileSync(short,bytes.subarray(0,-1));writeFileSync(long,Buffer.concat([bytes,Buffer.from([0])]));
  assert.notEqual(run("read",short).status,0);assert.notEqual(run("read",long).status,0);assert.notEqual(run("read",join(directory,"missing.raw")).status,0);
  const record={passed:true,words:70001,byteOrder:"little-endian",chunkBoundaryWords:65536,truncationRejected:true,trailingBytesRejected:true,overwriteRejected:true,missingRejected:true,overlapRelocationAndPrefix:true};
  mkdirSync("build/evidence",{recursive:true});writeFileSync("build/evidence/joint-cache-test.json",JSON.stringify(record,null,2)+"\n");console.log(JSON.stringify(record));
}finally{rmSync(directory,{recursive:true,force:true});}
