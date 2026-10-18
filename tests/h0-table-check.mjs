import assert from "node:assert/strict";
import {spawnSync} from "node:child_process";
import {mkdtempSync,rmSync} from "node:fs";
import {join} from "node:path";

const directory=mkdtempSync("build/h0-product-fixtures-"),classes=join(directory,"classes.raw"),edges=join(directory,"edges.raw"),meta=join(directory,"meta.raw");
function run(program,args){const r=spawnSync(program,args,{encoding:"utf8",timeout:120000,maxBuffer:4194304});assert.ifError(r.error);assert.equal(r.status,0,r.stdout+r.stderr);return r.stdout;}
try{
  run("build/h0-class-pilot",["--threads","1","--",classes]);run("build/h0-edge-pilot",["--threads","1","--",edges]);run("build/h0-meta-pilot",["--threads","1","--",classes,edges,meta]);
  for(const test of["tests/h0-table-orbit.mjs","tests/h0-table-audit.mjs"])process.stdout.write(run(process.execPath,[test,classes,edges,meta]));
  console.log(JSON.stringify({passed:true,freshFixtures:true,sealedEvidenceRequired:false}));
}finally{rmSync(directory,{recursive:true,force:true});}
