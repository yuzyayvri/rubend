import assert from "node:assert/strict";
import {createReadStream,writeFileSync,mkdtempSync,rmSync,copyFileSync,chmodSync,openSync,readSync,writeSync,closeSync,truncateSync,statSync,existsSync} from "node:fs";
import {resolve} from "node:path";
import {spawnSync} from "node:child_process";
import {createHash} from "node:crypto";
import {solved} from "../apps/model.mjs";

const [binary,joint,corner,output]=process.argv.slice(2);
assert.equal(process.argv.length,6);for(const p of [binary,joint,corner,output])assert.equal(resolve(p),p);
assert.equal(existsSync(output),false);
async function hash(path){const digest=createHash("sha256");for await(const chunk of createReadStream(path))digest.update(chunk);return digest.digest("hex");}
const seals={};for(const p of [binary,joint,corner])seals[p]=await hash(p);
const temporary=mkdtempSync(resolve("build/evidence/corner-loader-")),records=[];
assert.equal(seals[corner],"a8f48d1e8dcc87e9d235da7753d5d3f9d8254191f77d32c3097533a7b5ed53ce");
function run(name,path,policy,expected){
  const r=spawnSync(binary,[solved,"exact","1000","--threads","1"],{encoding:"utf8",timeout:120000,maxBuffer:1048576,env:{...process.env,RUBEND_JOINT_CACHE:joint,RUBEND_CORNER_CACHE:path,RUBEND_CORNER_POLICY:policy}});
  records.push({name,status:r.status,signal:r.signal,error:r.error?.message??null,stdout:r.stdout,stderr:r.stderr});
  assert.equal(r.error,undefined);assert.equal(r.signal,null);assert.equal(r.status,2);assert.match(r.stdout+r.stderr,expected);
}
try{
  const short=resolve(temporary,"short.raw"),long=resolve(temporary,"trailing.raw"),changed=resolve(temporary,"changed.raw");
  writeFileSync(short,Buffer.from([0]));writeFileSync(long,Buffer.alloc(0));truncateSync(long,statSync(corner).size+4);
  copyFileSync(corner,changed);chmodSync(changed,0o600);const fd=openSync(changed,"r+"),byte=Buffer.alloc(1);try{readSync(fd,byte,0,1,0);byte[0]^=1;writeSync(fd,byte,0,1,0);}finally{closeSync(fd);}
  run("unknown-policy-before-cache",resolve(temporary,"missing.raw"),"unknown",/Invalid corner policy/);
  run("missing-corner",resolve(temporary,"missing.raw"),"corner",/No such file|open failed|open:/i);
  run("truncated-corner",short,"corner",/Truncated or malformed joint cache/);
  run("trailing-corner",long,"combined",/Truncated or malformed joint cache/);
  run("changed-corner",changed,"corner",/Corner table fingerprint mismatch/);
  const after={};for(const p of Object.keys(seals))after[p]=await hash(p);assert.deepEqual(after,seals);
  writeFileSync(output,JSON.stringify({passed:true,seals,records,sourceCachesUnchanged:true},null,2)+"\n",{flag:"wx"});
  console.log(JSON.stringify({passed:true,rejectingCases:records.length,output}));
}finally{rmSync(temporary,{recursive:true,force:true});}
