import assert from "node:assert/strict";
import {readFileSync,statSync} from "node:fs";
import {resolve} from "node:path";
import {release as kernelRelease} from "node:os";
import {fileHash} from "./bounded-file-hash.mjs";
import {valueDigest,validateFinalProtocol} from "./final-evaluation-protocol.mjs";

function freezeDeep(value){if(value&&typeof value==="object"){for(const child of Object.values(value))freezeDeep(child);Object.freeze(value);}return value;}
const digests=new WeakMap();
const admitted=new WeakSet();
export function assertAdmittedFreeze(freeze){assert.equal(admitted.has(freeze),true,"Case access requires a validated freeze capability");}
export function admittedFreezeDigest(freeze){if(Object.isFrozen(freeze)){if(!digests.has(freeze))digests.set(freeze,valueDigest(freeze));return digests.get(freeze);}return valueDigest(freeze);}
export function frozenFileIdentity(path){const s=statSync(path,{bigint:true});assert.ok(s.isFile());return Object.fromEntries(["dev","ino","size","mtimeNs","ctimeNs"].map(k=>[k,String(s[k])]));}
export function loadAdmittedEvaluationFreeze(path,expectedDigest,{stage,sourceVerification="hashes"}={}){
  const absolute=resolve(path);assert.ok(absolute.startsWith(resolve("build/experiments")+"/"));assert.ok(statSync(absolute).size<=4194304);assert.match(expectedDigest,/^[a-f0-9]{64}$/);assert.ok(["hashes","identities"].includes(sourceVerification));const freeze=JSON.parse(readFileSync(absolute,"utf8"));assert.equal(valueDigest(freeze),expectedDigest);assert.equal(freeze.format,"rubend-final-evaluation-freeze-v1");assert.equal(freeze.stage,stage);assert.ok(["admission-preflight","final-frozen"].includes(stage));validateFinalProtocol(freeze.protocol);assert.equal(freeze.releaseHoldoutOpened,false);assert.ok(Number.isFinite(Date.parse(freeze.createdAt)));assert.equal(freeze.actors.length,10);assert.equal(new Set(freeze.actors.map(a=>a.id)).size,10);assert.ok(Object.keys(freeze.sourceHashes).length>0);for(const[p,h]of Object.entries(freeze.sourceHashes)){assert.match(h,/^[a-f0-9]{64}$/);if(sourceVerification==="hashes")assert.equal(fileHash(p),h,"Frozen evaluation source drift: "+p);else{assert.ok(freeze.sourceIdentities?.[p]);assert.deepEqual(frozenFileIdentity(p),freeze.sourceIdentities[p],"Frozen evaluation file identity drift: "+p);}}
  for(const actor of freeze.actors){assert.equal(actor.configurationSha256,valueDigest(Object.fromEntries(Object.entries(actor).filter(([k])=>k!=="configurationSha256"))));assert.equal(actor.config.evidenceKind,"measured");assert.equal(actor.config.id,actor.id);}
  if(freeze.computeEnvironment){assert.equal(process.version,freeze.computeEnvironment.node);assert.equal(process.arch,freeze.computeEnvironment.architecture);assert.equal(kernelRelease(),freeze.computeEnvironment.kernel,"Kernel changed after configuration freeze");assert.equal(readFileSync("/proc/cpuinfo","utf8").match(/^model name\s*:\s*(.+)$/m)?.[1]??"unavailable",freeze.computeEnvironment.cpuModel);}
  if(stage==="final-frozen"){
    assert.ok(freeze.admissionEvidence);assert.equal(JSON.parse(readFileSync(freeze.admissionEvidence.indexPath,"utf8")).format,"rubend-background-archive-v1");
    const a=freeze.admissionEvidence;assert.ok(a);assert.equal(fileHash(a.indexPath),a.indexSha256);const index=JSON.parse(readFileSync(a.indexPath,"utf8"));assert.equal(index.passed,true);assert.equal(index.workerGone,true);assert.equal(index.resourceStops,false);assert.equal(fileHash(a.confirmationPath),a.confirmationSha256);assert.equal(index.archives.find(r=>/^\d+-confirmation\.json\.gz$/.test(r.path)).sha256,a.confirmationSha256);const confirmation=JSON.parse(readFileSync(a.confirmationPath,"utf8"));assert.equal(confirmation.passed,true);assert.equal(confirmation.finalEvaluationAdmitted,true);assert.equal(confirmation.protocolSha256,valueDigest(freeze.protocol));assert.equal(confirmation.actorsSha256,valueDigest(freeze.actors));assert.equal(confirmation.sourcesSha256,valueDigest(freeze.sourceHashes));assert.equal(confirmation.identitiesSha256,valueDigest(freeze.sourceIdentities));assert.equal(confirmation.holdoutEvaluated,false);
  }else{assert.ok(Array.isArray(freeze.calibrationCases)&&freeze.calibrationCases.length>0);assert.equal(freeze.admissionEvidence,null);}
  const result=freezeDeep(freeze);admitted.add(result);return result;
}
