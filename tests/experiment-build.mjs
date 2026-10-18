import assert from "node:assert/strict";
import {mkdtempSync,mkdirSync,writeFileSync,readFileSync,chmodSync,rmSync,statSync,existsSync} from "node:fs";
import {tmpdir} from "node:os";
import {resolve} from "node:path";
import {spawnSync} from "node:child_process";

const builder=resolve("bench/build-experiment.mjs"),temporary=mkdtempSync(resolve(tmpdir(),"rubend-build-snapshot-")),bin=resolve(temporary,"bin");
mkdirSync(bin);writeFileSync(resolve(bin,"bend"),`#!${process.execPath}
import {writeFileSync} from "node:fs";
if(process.argv[2]==="version")console.log("Compiler fixture only");
else writeFileSync(process.argv[4],"same-native-bytes");
`);chmodSync(resolve(bin,"bend"),0o700);
writeFileSync(resolve(temporary,"flake.lock"),"{}");writeFileSync(resolve(temporary,"entry.bend"),"import ./dependency.bend as D\n");
const first="def value() -> U32:\n  1\n",second="def value() -> U32:\n  2\n",dependency=resolve(temporary,"dependency.bend");
function run(name){return spawnSync(process.execPath,[builder,"entry.bend","build/"+name],{cwd:temporary,encoding:"utf8",maxBuffer:1048576,env:{...process.env,PATH:bin+":"+process.env.PATH}});}
const metadata=name=>JSON.parse(readFileSync(resolve(temporary,"build/"+name+".json")));
const snapshot=m=>resolve(temporary,m.sourceSnapshot??".cache/experiment-sources/"+m.binarySha256);
try{
  writeFileSync(dependency,first);const a=run("first");assert.equal(a.status,0,a.stderr);const before=metadata("first"),pathA=resolve(snapshot(before),"dependency.bend");
  writeFileSync(dependency,second);const b=run("second");assert.equal(b.status,0,b.stderr);const after=metadata("second"),pathB=resolve(snapshot(after),"dependency.bend");
  assert.equal(before.binarySha256,after.binarySha256);assert.equal(readFileSync(pathA,"utf8"),first,"A source change with identical machine code overwrote the first frozen snapshot");
  assert.notEqual(snapshot(before),snapshot(after));assert.equal(readFileSync(pathB,"utf8"),second);
  const timer=spawnSync(process.execPath,[resolve(builder,"../build-fixed-timer.mjs"),"build/first.json","build/timer"],{cwd:temporary,encoding:"utf8"});assert.notEqual(timer.status,0);assert.match(timer.stderr,/requires a frozen fixed-work source graph/);assert.equal(existsSync(resolve(temporary,"build/timer-sources")),false);
  const existing=readFileSync(resolve(temporary,"build/first.json")),again=run("first");assert.notEqual(again.status,0);assert.match(again.stderr,/fresh output/);assert.deepEqual(readFileSync(resolve(temporary,"build/first.json")),existing);
  const identity=()=>{const s=statSync(pathB,{bigint:true});return[s.ino,s.size,s.mtimeNs,s.ctimeNs].map(String);},oldIdentity=identity();
  const reused=run("third");assert.equal(reused.status,0,reused.stderr);assert.equal(metadata("third").sourceSnapshot,after.sourceSnapshot);assert.deepEqual(identity(),oldIdentity);
  chmodSync(pathB,0o600);writeFileSync(pathB,"corrupt fixture");const corrupt=run("fourth");assert.notEqual(corrupt.status,0);assert.match(corrupt.stderr,/snapshot conflict/);assert.equal(existsSync(resolve(temporary,"build/fourth.json")),false);assert.equal(readFileSync(pathB,"utf8"),"corrupt fixture");
  console.log(JSON.stringify({passed:true,compilerFixtureOnly:true,sameBinaryDifferentSourcesPreserved:true,outputOverwriteRejected:true,identicalSnapshotNotRewritten:true,snapshotConflictRejected:true}));
}finally{rmSync(temporary,{recursive:true,force:true});}
