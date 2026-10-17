import assert from "node:assert/strict";
import {spawnSync} from "node:child_process";
import {createHash} from "node:crypto";
import {mkdtempSync,writeFileSync,readFileSync,rmSync,mkdirSync,statSync} from "node:fs";
import {tmpdir} from "node:os";
import {resolve,dirname} from "node:path";
import {validateRecords} from "./fixed-work-model.mjs";

const args=process.argv.slice(2),options={};
for(let i=0;i<args.length;i+=2){assert.match(args[i],/^--[a-z-]+$/);assert.ok(args[i+1]);assert.equal(options[args[i]],undefined);options[args[i]]=args[i+1];}
const allowed=new Set(["--reference","--candidate","--tier","--slices","--corpus","--output"]);
for(const key of Object.keys(options))assert.ok(allowed.has(key),`Unknown option ${key}`);
assert.ok(options["--reference"]&&options["--candidate"],"Expected --reference BINARY --candidate BINARY");
const tier=options["--tier"]??"light",slices=Number(options["--slices"]??6);
assert.ok(["light","raw"].includes(tier));
assert.ok(Number.isInteger(slices)&&slices>=0&&slices<=256);
const fixture=JSON.parse(readFileSync(new URL("./fixed-work-cases.json",import.meta.url),"utf8"));
let cases=fixture.cases.flatMap(entry=>[0,2].map(request=>({...entry,id:`${entry.id}-${request===0?"fast":"exact"}`,request})));
if(options["--corpus"]){
  const corpus=JSON.parse(readFileSync(options["--corpus"],"utf8"));
  assert.equal(corpus.records.length,163);
  cases=corpus.records.map((entry,i)=>({id:`shallow-${i}`,facelets:entry.facelets,depth:entry.depth,request:2}));
}
for(const entry of cases){assert.match(entry.id,/^[a-z0-9-]+$/);assert.match(entry.facelets,/^[URFDLB]{54}$/);}
const hash=value=>createHash("sha256").update(value).digest("hex");
function seal(path){
  const identity=()=>{
    const status=statSync(path,{bigint:true});assert.ok(status.isFile(),"Binary must be a regular file");
    return ["dev","ino","size","mtimeNs","ctimeNs","mode"].map(key=>String(status[key]));
  };
  const before=identity(),sha256=hash(readFileSync(path));
  assert.deepEqual(identity(),before,`${path} changed during hashing`);
  return {identity:before,sha256};
}
const temporary=mkdtempSync(`${tmpdir()}/rubend-fixed-work-`);
const requestPath=resolve(temporary,"requests.tsv");
writeFileSync(requestPath,cases.map(entry=>`${entry.id}\t${entry.facelets}\t${entry.request}\t${slices}\n`).join(""));
function run(path){
  const binary=resolve(path);
  const before=seal(binary);
  const result=spawnSync(binary,["--threads","1","--gpu","off",tier,requestPath],{encoding:"utf8",maxBuffer:64*1024*1024,timeout:120000,killSignal:"SIGKILL"});
  assert.deepEqual(seal(binary),before,`${binary} changed during execution`);
  assert.ifError(result.error);
  assert.equal(result.signal,null,`${binary} signalled ${result.signal}`);
  assert.equal(result.status,0,`${binary} failed\n${result.stderr}\n${result.stdout.slice(-3000)}`);
  const records=result.stdout.trim().split("\n").filter(Boolean).map(line=>JSON.parse(line));
  const validated=validateRecords(records,cases,slices);
  return {binarySha256:before.sha256,...validated};
}
try{
  const reference=run(options["--reference"]),candidate=run(options["--candidate"]);
  assert.deepEqual(candidate.counts,reference.counts);
  assert.deepEqual(candidate.snapshots,reference.snapshots,"Fixed-work semantic traversal differs");
  const output=resolve(options["--output"]??`build/evidence/fixed-work-${tier}.json`);
  mkdirSync(dirname(output),{recursive:true});
  const result={format:"rubend-fixed-work-v1",tier,slices,cases,referenceBinarySha256:reference.binarySha256,candidateBinarySha256:candidate.binarySha256,counts:candidate.counts,snapshotSha256:hash(JSON.stringify(candidate.snapshots)),snapshotIdentities:candidate.snapshots.map(record=>({id:record.id,request:record.request,slice:record.slice,nodes:record.nodes,stateSha256:hash(JSON.stringify(record.state))})),snapshots:candidate.snapshots,passed:true};
  writeFileSync(output,JSON.stringify(result,null,2)+"\n");
  console.log(JSON.stringify({passed:true,tier,cases:cases.length,slices,...candidate.counts,output}));
}finally{rmSync(temporary,{recursive:true,force:true});}
