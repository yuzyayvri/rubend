import assert from "node:assert/strict";
import {mkdtempSync,writeFileSync,truncateSync,rmSync} from "node:fs";
import {join} from "node:path";
import {spawnSync} from "node:child_process";

const directory=mkdtempSync("build/segmented-loader-"),records=[];
function reject(mode,path,message){const r=spawnSync("build/segmented-loader-test",["--threads","1","--",mode,path],{encoding:"utf8",timeout:10000,maxBuffer:1048576});assert.ifError(r.error);assert.equal(r.signal,null);assert.notEqual(r.status,0,r.stdout+r.stderr);assert.ok(!r.stdout.includes("Unexpected segmented loader success"));if(message)assert.ok((r.stdout+r.stderr).includes(message));records.push({mode,status:r.status,output:r.stdout+r.stderr});}
try{
  for(const bytes of[0,4,1108546564]){const path=join(directory,"bad-"+bytes);writeFileSync(path,Buffer.alloc(0));truncateSync(path,bytes);reject("file",path,"Truncated or malformed joint cache");}
  reject("file",join(directory,"missing"));reject("fingerprint","unused","Segmented joint fingerprint mismatch");
  writeFileSync("build/evidence/segmented-loader.json",JSON.stringify({passed:true,records},null,2)+"\n");console.log(JSON.stringify({passed:true,rejections:records.length,sparseOversizeRejected:true}));
}finally{rmSync(directory,{recursive:true,force:true});}
