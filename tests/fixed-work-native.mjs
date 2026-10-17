import assert from "node:assert/strict";
import {spawnSync} from "node:child_process";
import {mkdtempSync,writeFileSync,rmSync} from "node:fs";
import {tmpdir} from "node:os";
import {resolve} from "node:path";
import {solved,validateRecords} from "../bench/fixed-work-model.mjs";

assert.ok(process.argv[2],"Expected fixed-work binary path");
const binary=resolve(process.argv[2]),temporary=mkdtempSync(`${tmpdir()}/rubend-fixed-work-native-`),path=resolve(temporary,"requests.tsv");
function run(text){
  writeFileSync(path,text);
  return spawnSync(binary,["--threads","1","--gpu","off","light",path],{encoding:"utf8",timeout:10000,killSignal:"SIGKILL",maxBuffer:8*1024*1024});
}
try{
  const cases=Array.from({length:100},(_,i)=>({id:`chunk-${i}`,facelets:solved,request:2}));
  const request=cases.map(entry=>`${entry.id}\t${entry.facelets}\t${entry.request}\t1`).join("\n");
  assert.ok(request.length>4096);
  const result=run(request);
  assert.ifError(result.error);
  assert.equal(result.status,0,result.stderr);
  assert.equal(validateRecords(result.stdout.trim().split("\n").map(JSON.parse),cases,1).counts.snapshots,200);
  for(const text of ["bad\trequest\n",`${"x".repeat(65537)}\n`]){
    const result=run(text);
    assert.ifError(result.error);
    assert.equal(result.status,2,result.stderr);
    assert.match(result.stderr,/Invalid fixed-work request|Expected id, facelets, request, slices|exceeded 64 KiB/);
  }
  console.log("Fixed-work native bytechunk, unterminated-last-line, malformed request, and 64-KiB boundary checks passed.");
}finally{rmSync(temporary,{recursive:true,force:true});}
