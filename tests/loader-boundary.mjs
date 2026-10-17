import assert from "node:assert/strict";
import {spawnSync} from "node:child_process";
import {mkdtempSync,writeFileSync,copyFileSync,truncateSync,rmSync,mkdirSync} from "node:fs";
import {tmpdir} from "node:os";
import {join,resolve} from "node:path";

const directory=mkdtempSync(join(tmpdir(),"rubend-loader-")),record={passed:false,cases:[]};
const count=300001,bytes=Buffer.alloc(count*4);let fingerprint=2166136261;
for(let i=0;i<count;i++){const word=(Math.imul(i,2654435761)^2779096485)>>>0;bytes.writeUInt32LE(word,i*4);fingerprint=(Math.imul(fingerprint,16777619)^word^i)>>>0;}
copyFileSync("build/loader-boundary-test.js","build/loader-boundary-test.cjs");
const backends=[{name:"native",program:resolve("build/loader-boundary-test"),args:[]},{name:"javascript",program:process.execPath,args:["--require",resolve("tests/loader-growth.cjs"),resolve("build/loader-boundary-test.cjs")]}];
if(process.argv.includes("--wrapped"))backends.push({name:"native-injected",program:resolve("build/loader-boundary-wrapped-test"),args:[]});
try{
  const full=join(directory,"full.raw"),fifo=join(directory,"unopened.fifo"),sparse=join(directory,"sparse.raw");writeFileSync(full,bytes);writeFileSync(sparse,"");truncateSync(sparse,4294967300);assert.equal(spawnSync("mkfifo",[fifo]).status,0);
  for(const backend of backends)for(const mode of ["legacy","words"]){
    if(backend.name==="javascript"&&mode==="legacy")continue;
    const run=(file,offset,n,env={})=>spawnSync(backend.program,[...backend.args,mode,file,String(offset),String(n),...(backend.name.startsWith("native")?["--threads","1"]:[])],{encoding:"utf8",timeout:10000,maxBuffer:1048576,env:{...process.env,...env}});
    const result=run(full,17,count);assert.equal(result.status,0,result.stderr);assert.equal(JSON.parse(result.stdout).fingerprint,fingerprint);record.cases.push({backend:backend.name,mode,test:"nonzero-offset-multichunk"});
    for(const [label,file,offset,n] of [["wrapped-count-before-open",fifo,0,1073741824],["index-overflow-before-open",fifo,4294967295,17],["capacity-before-open",fifo,1048576,1],["sparse-wide-size",sparse,0,0]]){const result=run(file,offset,n);assert.ifError(result.error);assert.equal(result.status,2,`${label}: ${result.stderr}`);record.cases.push({backend:backend.name,mode,test:label});}
    for(const [label,data] of [["short",bytes.subarray(0,-1)],["trailing",Buffer.concat([bytes,Buffer.from([0])])]]){const file=join(directory,label);writeFileSync(file,data);assert.equal(run(file,17,count).status,2);record.cases.push({backend:backend.name,mode,test:label});}
    if(backend.name!=="native")for(const file of [sparse,join(directory,"short"),join(directory,"trailing")]){const result=run(file,17,count,{RUBEND_TEST_MUTATION_PATH:file,RUBEND_TEST_MUTATION_AT:"4294967295",RUBEND_TEST_MUTATION:"grow"});assert.equal(result.status,2);const observed=JSON.parse(result.stderr.trim().split("\n").at(-1));assert.equal(observed.closed,true);assert.equal(observed.mutated,false);record.cases.push({backend:backend.name,mode,test:"initial-size-failure-close",...observed});}
    if(backend.name!=="native")for(const mutation of ["grow","short"]){const file=join(directory,`mutated-${mode}-${mutation}`);writeFileSync(file,bytes);const at=mode==="words"?262144*4:65536*4,result=run(file,17,count,{RUBEND_TEST_MUTATION_PATH:file,RUBEND_TEST_MUTATION_AT:String(at),RUBEND_TEST_MUTATION:mutation});assert.equal(result.status,2,result.stderr);const observed=JSON.parse(result.stderr.trim().split("\n").at(-1));assert.equal(observed.mutated,true);assert.equal(observed.closed,true);assert.ok(observed.total>=at);assert.doesNotMatch(result.stdout,/loaded|ready/);record.cases.push({backend:backend.name,mode,test:`${mutation}-after-complete-chunk`,...observed});}
  }
  record.passed=true;console.log(JSON.stringify(record));
}finally{rmSync(directory,{recursive:true,force:true});mkdirSync("build/evidence",{recursive:true});writeFileSync("build/evidence/loader-boundary-test.json",JSON.stringify(record,null,2)+"\n");}
