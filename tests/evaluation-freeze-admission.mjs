import assert from "node:assert/strict";
import {readFileSync,writeFileSync,mkdtempSync,rmSync} from "node:fs";
import {resolve} from "node:path";
import {loadAdmittedEvaluationFreeze} from "../bench/evaluation-freeze-admission.mjs";
import {valueDigest} from "../bench/final-evaluation-protocol.mjs";

assert.equal(process.argv.length,3);const source=resolve(process.argv[2]),freeze=JSON.parse(readFileSync(source,"utf8")),directory=mkdtempSync(resolve("build/experiments/freeze-refusals-")),load=(path,digest,stage="admission-preflight")=>loadAdmittedEvaluationFreeze(path,digest,{stage});let checks=0;
try{const actual=load(source,valueDigest(freeze));assert.equal(Object.isFrozen(actual),true);assert.equal(Object.isFrozen(actual.actors[0].config),true);assert.throws(()=>load(source,"0".repeat(64)));checks++;assert.throws(()=>load(source,valueDigest(freeze),"final-frozen"));checks++;
  const mutations=[r=>r.stage="fixture",r=>r.releaseHoldoutOpened=true,r=>r.protocol.timing.cohorts=4,r=>r.actors.pop(),r=>r.actors[0].config.id="wrong",r=>r.sourceHashes[Object.keys(r.sourceHashes)[0]]="0".repeat(64),r=>{r.stage="final-frozen";r.admissionEvidence=null;},r=>r.createdAt="invalid"];
  for(let i=0;i<mutations.length;i++){const r=structuredClone(freeze);mutations[i](r);const path=resolve(directory,i+".json");writeFileSync(path,JSON.stringify(r),{flag:"wx"});assert.throws(()=>load(path,valueDigest(r),r.stage));checks++;}const tooLarge=resolve(directory,"large.json");writeFileSync(tooLarge," ".repeat(4194305),{flag:"wx"});assert.throws(()=>load(tooLarge,"0".repeat(64)));checks++;assert.equal(freeze.stage,"admission-preflight");assert.equal(freeze.admissionEvidence,null);console.log(JSON.stringify({passed:true,admissionNegatives:checks,deepImmutableAfterValidation:true,sourceDriftRejected:true,calibrationCannotBecomeFinal:true,releaseHoldoutOpened:false}));
}finally{rmSync(directory,{recursive:true,force:true});}
