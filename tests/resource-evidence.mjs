import assert from "node:assert/strict";
import {mkdtempSync,readFileSync,writeFileSync,rmSync} from "node:fs";
import {resolve} from "node:path";
import {spawnSync} from "node:child_process";
import {cpuList} from "../bench/resource-policy.mjs";

const directory=mkdtempSync(resolve("build/resource-evidence-")),receipt=resolve(directory,"collision.json"),allowed=cpuList(readFileSync("/proc/self/status","utf8").match(/^Cpus_allowed_list:\s+([^\n]+)/m)[1].trim()),cpu=allowed.has(2)?2:[...allowed][0];
function run(code,runner="bench/run-limited.mjs",name="collision"){const r=spawnSync(process.execPath,[runner,name,"256","10",String(cpu),process.execPath,"-e",code],{encoding:"utf8",timeout:20000,maxBuffer:1048576,env:{...process.env,RUBEND_EVIDENCE:directory}});assert.ifError(r.error);return r;}
try{
  const late=run(`require("node:fs").writeFileSync(${JSON.stringify(receipt)},JSON.stringify({artifact:"child"}),{flag:"wx"});console.log("child-wrote");`);
  assert.ok(late.stdout.includes("child-wrote"),late.stdout+late.stderr);
  assert.equal(JSON.parse(readFileSync(receipt,"utf8")).artifact,"child","Resource receipt overwrote the child artifact");assert.notEqual(late.status,0);assert.match(late.stderr,/EEXIST/);
  writeFileSync(receipt,JSON.stringify({artifact:"earlier"}));const early=run('console.log("must-not-run")');assert.notEqual(early.status,0);assert.ok(!early.stdout.includes("must-not-run"));assert.deepEqual(JSON.parse(readFileSync(receipt,"utf8")),{artifact:"earlier"});
  const source=readFileSync("bench/run-limited.mjs","utf8"),needle=',{flag:"wx"}';assert.equal(source.split(needle).length,2);
  const mutant=resolve(directory,"mutant.mjs"),mutatedReceipt=resolve(directory,"mutated.json");writeFileSync(mutant,source.replace(needle,"").replace('from "./resource-policy.mjs"','from "../../bench/resource-policy.mjs"').replace('from "../scripts/artifact-lease.mjs"','from "../../scripts/artifact-lease.mjs"'));
  const negative=run(`require("node:fs").writeFileSync(${JSON.stringify(mutatedReceipt)},JSON.stringify({artifact:"child"}),{flag:"wx"});console.log("child-wrote");`,mutant,"mutated");assert.equal(negative.status,0,negative.stdout+negative.stderr);assert.equal(JSON.parse(readFileSync(mutatedReceipt,"utf8")).format,"rubend-local-experiment-v1");assert.equal(JSON.parse(readFileSync(mutatedReceipt,"utf8")).artifact,undefined);
  const report={passed:true,existingReceiptRejectedBeforeLaunch:true,childArtifactPreserved:true,actualOverwriteMutationDetected:true};writeFileSync("build/evidence/resource-evidence.json",JSON.stringify(report,null,2)+"\n");console.log(JSON.stringify(report));
}finally{rmSync(directory,{recursive:true,force:true});}
