import assert from "node:assert/strict";
import {spawnSync} from "node:child_process";
import {resolve} from "node:path";
import {pathToFileURL} from "node:url";

for(const args of[{},[1],["bad\0argument"]]){
  const r=spawnSync(process.execPath,["tests/http.mjs"],{encoding:"utf8",timeout:5000,env:{...process.env,RUBEND_APP_COMMAND:process.execPath,RUBEND_APP_ARGS:JSON.stringify(args)}});assert.ifError(r.error);assert.notEqual(r.status,0);assert.match(r.stderr,/App arguments must be an array of strings without NUL/);
}
const entry="process.chdir("+JSON.stringify(process.cwd())+"); await import("+JSON.stringify(pathToFileURL(resolve("apps/server.mjs")).href)+");";
const r=spawnSync(process.execPath,["tests/http.mjs"],{encoding:"utf8",timeout:15000,env:{...process.env,RUBEND_APP_COMMAND:process.execPath,RUBEND_APP_ARGS:JSON.stringify(["--input-type=module","--eval",entry])}});assert.ifError(r.error);assert.equal(r.status,0,r.stderr);assert.match(r.stdout,/abort recovery passed/);
console.log(JSON.stringify({passed:true,rejectedArgumentShapes:3,explicitEntrypointHttp:true}));
