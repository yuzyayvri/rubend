import assert from "node:assert/strict";
import {mkdtempSync,writeFileSync,readFileSync,existsSync,rmSync,mkdirSync} from "node:fs";
import {tmpdir} from "node:os";
import {resolve} from "node:path";
import {spawnSync} from "node:child_process";
import {gunzipSync} from "node:zlib";
import {createHash} from "node:crypto";

const directory=mkdtempSync(resolve(tmpdir(),"rubend-evidence-fixture-"));
try{
  const source=resolve(directory,"input.json"),output=resolve(directory,"output.json.gz");
  const bytes=Buffer.from(JSON.stringify({passed:true,values:[0,1,2]})+"\n");
  writeFileSync(source,bytes);
  const run=(src,dst)=>spawnSync(process.execPath,["bench/archive-evidence.mjs",src,dst],{encoding:"utf8"});
  const good=run(source,output);assert.equal(good.status,0,good.stderr);
  const receipt=JSON.parse(good.stdout);
  assert.equal(receipt.sha256,createHash("sha256").update(bytes).digest("hex"));
  assert.deepEqual(gunzipSync(readFileSync(output)),bytes);
  const again=run(source,output);assert.equal(again.status,1);assert.match(again.stderr,/EEXIST/);
  const bad=resolve(directory,"bad.json"),destination=resolve(directory,"bad.json.gz");writeFileSync(bad,"not-json");
  assert.equal(run(bad,destination).status,1);assert.equal(existsSync(destination),false);
  const folder=resolve(directory,"folder");mkdirSync(folder);
  assert.equal(run(folder,destination).status,1);assert.equal(existsSync(destination),false);
  console.log(JSON.stringify({passed:true,roundtrip:true,hashVerified:true,overwriteRejected:true,invalidJsonRejected:true,directoryRejected:true}));
}finally{rmSync(directory,{recursive:true,force:true});}
