import assert from "node:assert/strict";
import {readFileSync,writeFileSync,mkdtempSync,rmSync} from "node:fs";
import {spawnSync} from "node:child_process";
import {join,resolve} from "node:path";
import {solved} from "../apps/model.mjs";

const binary=process.argv[2],joint=process.argv[3]??process.env.RUBEND_JOINT_CACHE;assert.ok(binary&&joint,"Expected binary and audited joint-cache path");
const directory=mkdtempSync("build/h0-cache-input-"),metaPath=resolve("build/evidence/h0-meta-v1.raw"),distancePath=resolve("build/evidence/h0-table-v1.raw");
const env={...process.env,RUBEND_JOINT_CACHE:resolve(joint),RUBEND_H0_META_CACHE:metaPath,RUBEND_H0_CACHE:distancePath,RUBEND_H0_POLICY:"combined"},records=[];
function run(name,patch,status,includes){const r=spawnSync(binary,["--threads","1","--",solved,"exact","100"],{env:{...env,...patch},encoding:"utf8",timeout:120000,maxBuffer:4194304});assert.ifError(r.error);assert.equal(r.status,status,r.stdout+r.stderr);assert.ok((r.stdout+r.stderr).includes(includes));if(status!==0)assert.ok(!r.stdout.includes('"type":"candidate"'));records.push({name,status,stdout:r.stdout,stderr:r.stderr});return r.stdout;}
try{
  const good=run("valid",{},0,'"optimal":1');assert.ok(good.includes('"length":0'));
  run("invalid-policy",{RUBEND_H0_POLICY:"light"},2,"Invalid H0 policy");
  const meta=readFileSync(metaPath),badMeta=join(directory,"changed-meta.raw");meta.writeUInt32LE((meta.readUInt32LE(64)^1)>>>0,64);writeFileSync(badMeta,meta);run("changed-metadata",{RUBEND_H0_META_CACHE:badMeta},2,"H0 metadata fingerprint mismatch");
  const empty=join(directory,"empty.raw");writeFileSync(empty,Buffer.alloc(0));run("truncated-metadata",{RUBEND_H0_META_CACHE:empty},2,"Truncated or malformed joint cache");run("truncated-distance",{RUBEND_H0_CACHE:empty},2,"Truncated or malformed joint cache");
  const distance=readFileSync(distancePath),badDistance=join(directory,"changed-distance.raw");distance[0]^=1;writeFileSync(badDistance,distance);run("changed-distance",{RUBEND_H0_CACHE:badDistance},2,"H0 distance fingerprint mismatch");
  writeFileSync("build/evidence/h0-profile-cache.json",JSON.stringify({passed:true,records,independentReview:false},null,2)+"\n");console.log(JSON.stringify({passed:true,validSolved:true,rejected:records.length-1}));
}finally{rmSync(directory,{recursive:true,force:true});}
