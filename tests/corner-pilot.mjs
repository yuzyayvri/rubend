import assert from "node:assert/strict";
import {mkdtempSync,rmSync,statSync} from "node:fs";
import {tmpdir} from "node:os";
import {resolve} from "node:path";
import {spawnSync} from "node:child_process";

assert.equal(process.argv.length,4,"Expected corner pilot and rejecting-fixture binaries");
const binary=resolve(process.argv[2]),unit=resolve(process.argv[3]),temporary=mkdtempSync(resolve(tmpdir(),"rubend-corner-pilot-"));
const moves=resolve(temporary,"moves.raw"),distances=resolve(temporary,"permutation.raw");
function run(program,args){const r=spawnSync(program,args,{encoding:"utf8",timeout:90000,maxBuffer:1048576,killSignal:"SIGKILL"});assert.ifError(r.error);assert.equal(r.signal,null);return r;}
try{
  const built=run(binary,["--threads","1","audit",moves,distances]);assert.equal(built.status,0,built.stderr);
  const report=JSON.parse(built.stdout);assert.equal(report.audited,true);assert.equal(report.states,40320);assert.equal(report.edges,725760);assert.equal(report.maximum,7);
  assert.equal(statSync(moves).size,3060504);assert.equal(statSync(distances).size,40320);
  const oracle=run(process.execPath,["tests/corner-transitions.mjs",moves,distances]);assert.equal(oracle.status,0,oracle.stderr);
  const checked=JSON.parse(oracle.stdout);assert.equal(checked.passed,true);assert.equal(checked.permutationTransitions+checked.twistTransitions,765126);
  const negative=run(unit,["--threads","1"]);assert.equal(negative.status,0,negative.stderr);assert.equal(JSON.parse(negative.stdout).passed,true);
  const missing=run(binary,["--threads","1","full-audit"]);assert.equal(missing.status,2);assert.match(missing.stderr,/fresh output paths/);
  const overwrite=run(binary,["--threads","1","audit",moves,distances]);assert.equal(overwrite.status,2);assert.match(overwrite.stderr,/nonempty joint cache/);
  console.log(JSON.stringify({passed:true,smallProjectionAudited:true,independent:checked,negative:JSON.parse(negative.stdout),fullNeedsOutputPaths:true,nonemptyOutputRejected:true}));
}finally{rmSync(temporary,{recursive:true,force:true});}
