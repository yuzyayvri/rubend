import assert from "node:assert/strict";
import {readFileSync,readdirSync,writeFileSync,renameSync,existsSync} from "node:fs";
import {resolve} from "node:path";
import {execFileSync} from "node:child_process";
import {loadAdmittedEvaluationFreeze} from "../bench/evaluation-freeze-admission.mjs";
import {fileHash} from "../bench/bounded-file-hash.mjs";

const id="u07-final-report-v1",freezePath=resolve("build/experiments/u07-final-evaluation-v1/freeze.json"),digest="7db44c8dd10f127bcaee094bd35ffeb7b63f75ab9e6d326c0804c49b01b1db0d",campaign=resolve("build/experiments/u07-final-evaluation-v1"),directory=resolve("build/experiments",id),planPath=resolve("build/evidence",id+"-plan.json");
assert.equal(existsSync(planPath),false);
assert.equal(existsSync(directory),false);
const freeze=loadAdmittedEvaluationFreeze(freezePath,digest,{stage:"final-frozen"}),paths=new Set([...Object.keys(freeze.sourceHashes),freezePath,resolve(import.meta.filename)]),registrations=readdirSync(resolve(campaign,"queues")).filter(p=>p.endsWith(".json"));
assert.equal(registrations.length,23);
for(const name of registrations){const registrationPath=resolve(campaign,"queues",name),r=JSON.parse(readFileSync(registrationPath)),indexPath=resolve("docs/verification/next-plan/U07",r.id,"index.json"),index=JSON.parse(readFileSync(indexPath)),confirmationPath=resolve("build/experiments",r.id,"confirmation.json"),confirmation=JSON.parse(readFileSync(confirmationPath));assert(index.passed&&index.workerGone&&!index.resourceStops);assert.equal(confirmation.continuationNeeded,false);for(const path of [registrationPath,indexPath,confirmationPath,...confirmation.outputs.map(o=>o.path)])paths.add(path);}
const plan={format:"rubend-background-tests-v1",id,root:process.cwd(),revision:execFileSync("git",["rev-parse","HEAD"],{encoding:"utf8"}).trim(),sourceHashes:Object.fromEntries([...paths].sort().map(path=>[path,fileHash(path)])),jobs:[{id:"report",memoryMiB:4096,seconds:600,cpus:[2],command:[process.execPath,"bench/final-comparative-report.mjs",freezePath,digest,campaign,directory]}],expectedMinutes:10,queueHardLimitMinutes:12,scope:"Analyze only the completed frozen 57678-slot campaign. Recheck canonical indices, raw output hashes, exclusive ledgers and every returned answer through unchanged Bend and geometry replay. Apply the predeclared exact/anytime contracts, censoring, uncertainty and optimality contradiction gates. No solver execution, repeated slot, configuration selection, source repair, tuning, push, merge or publication. Four GiB, CPU2, nice10, noSwap and desktop reserve."};
writeFileSync(planPath,JSON.stringify(plan,null,2)+"\n",{flag:"wx"});
const pointer=resolve("build/evidence/u07-final-current.json"),temporary=pointer+".report-pending";
writeFileSync(temporary,JSON.stringify({id,planPath,statusPath:resolve(directory,"status.json"),freezePath,digest,campaign})+"\n",{flag:"wx"});
renameSync(temporary,pointer);
console.log(JSON.stringify({state:"planned",id,planPath,sourceSeals:paths.size,solverExecution:false}));
