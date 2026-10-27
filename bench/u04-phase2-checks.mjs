import assert from "node:assert/strict";
import {readFileSync,writeFileSync,mkdirSync} from "node:fs";
import {resolve} from "node:path";
import {createHash} from "node:crypto";
import {execFileSync,spawnSync} from "node:child_process";
import {inputs} from "../scripts/manifest.mjs";

const[mode,id]=process.argv.slice(2);assert.equal(process.argv.length,4);assert.ok(["plan","compile","oracle","confirm"].includes(mode));assert.match(id,/^u04-phase2-[a-z0-9-]+$/);
const read=p=>JSON.parse(readFileSync(p,"utf8")),hash=p=>createHash("sha256").update(readFileSync(p)).digest("hex"),directory=resolve("build/experiments",id),generated=resolve(directory,"generated"),binary=resolve(directory,"native/phase2-checksum"),files=["bench/u04-phase2-checks.mjs","bench/phase2-projection.bend","bench/phase2-projection-native.bend","bench/generate-phase2-projection.mjs","tests/phase2-projection.mjs","docs/verification/next-plan/U04/PHASE2-PROJECTION.md","build/model.mjs","build/cubie.mjs","build/notation.mjs","build/manifest.json"];
if(mode==="plan"){
  const paths=execFileSync("git",["ls-files","-z"],{encoding:"utf8"}).split("\0").filter(Boolean);paths.push(...files);const path=resolve("build/evidence",id+"-plan.json"),jobs=[{id:"compile",memoryMiB:3072,seconds:240,cpus:[2,3,4,5]},{id:"oracle",memoryMiB:1024,seconds:180,cpus:[2]},{id:"confirm",memoryMiB:3072,seconds:180,cpus:[2,3,4,5]}].map(j=>({...j,command:[process.execPath,"bench/u04-phase2-checks.mjs",j.id,id]}));
  writeFileSync(path,JSON.stringify({format:"rubend-background-tests-v1",id,root:process.cwd(),revision:execFileSync("git",["rev-parse","HEAD"],{encoding:"utf8"}).trim(),sourceHashes:Object.fromEntries(paths.map(p=>[p,hash(p)])),jobs,expectedMinutes:4,queueHardLimitMinutes:12,scope:"U04 pure private phase-two EP8×corner-combination/parity coordinate/action preflight, no distance table or pruning. Actual Subgroup Goal admission only, validated exact packed boundary,40320corner codecs/403200action comparisons,2240combined decodes,512seeded restricted-walk checkpoints×10children, rejected domains/ranges/aliases, three executable corruption counterexamples and native/JS checksum parity. Existing23law/toolchain gates. Accepted app/cache unchanged; no new domain law, large table, strength/time claim, holdout or publication."},null,2)+"\n",{flag:"wx"});console.log(JSON.stringify({path,expectedMinutes:4,maximumMinutes:12}));process.exit();
}
const accepted=read("build/evidence/u06-gui-demand-v1-plan.json"),sourceHashes={...inputs(),...Object.fromEntries(files.map(p=>[p,hash(p)]))};for(const[p,h]of Object.entries(inputs()))assert.equal(h,accepted.sourceHashes[p],"Accepted application or established laws changed");
function run(program,args,seconds=150){const r=spawnSync(program,args,{encoding:"utf8",timeout:seconds*1000,maxBuffer:4*1024*1024});assert.ifError(r.error);process.stdout.write(r.stdout??"");process.stderr.write(r.stderr??"");assert.equal(r.status,0,program+" failed");return r.stdout;}
if(mode==="compile"){
  run("bend",["bench/phase2-projection.bend","--verdict"],180);mkdirSync(generated,{recursive:true});run(process.execPath,["bench/generate-phase2-projection.mjs",generated]);for(const name of["base","parity","goal","action"])run("bend",[resolve(generated,name+".bend"),"-o",resolve(generated,name+".mjs")]);
  mkdirSync(resolve(directory,"native"),{recursive:true});run(process.execPath,["bench/build-experiment.mjs","bench/phase2-projection-native.bend",binary]);run("bend",["bench/phase2-projection-native.bend","-o",binary+".c"]);run(process.execPath,["scripts/check-array-mode.mjs",binary+".c"]);
  const artifacts=[...Object.keys(read(resolve(generated,"manifest.json")).sources),... ["base","parity","goal","action"].map(n=>resolve(generated,n+".mjs")),resolve(generated,"manifest.json"),binary,binary+".json",binary+".c"];writeFileSync(resolve(directory,"compile.json"),JSON.stringify({passed:true,sourceHashes,artifacts:Object.fromEntries(artifacts.map(p=>[p,hash(p)])),pureDefinitionsKernelChecked:true,newDomainLaw:false,distanceTableGenerated:false})+"\n",{flag:"wx"});process.exit();
}
const compile=read(resolve(directory,"compile.json"));assert.equal(compile.passed,true);for(const[p,h]of Object.entries(compile.artifacts))assert.equal(hash(p),h);
if(mode==="oracle"){
  const output=resolve(directory,"oracle.json");run(process.execPath,["tests/phase2-projection.mjs",... ["base","parity","goal","action"].map(n=>resolve(generated,n+".mjs")),output],150);const oracle=read(output),native=JSON.parse(run(binary,["--threads","1","--gpu","off","7"],30));assert.equal(native.format,"rubend-phase2-native-v1");assert.equal(native.cases,1400);assert.equal(native.checksum,oracle.checksum);writeFileSync(resolve(directory,"native.json"),JSON.stringify({passed:true,...native,checksumSeed:7,binarySha256:hash(binary),javascriptChecksum:oracle.checksum,backendParity:true,performanceAcceptance:false})+"\n",{flag:"wx"});
}
if(mode==="confirm"){
  assert.equal(read(resolve(directory,"oracle.json")).passed,true);assert.equal(read(resolve(directory,"native.json")).passed,true);run("just",["check"],160);writeFileSync(resolve(directory,"confirmation.json"),JSON.stringify({passed:true,pureDefinitionsKernelChecked:true,oracleAndCorruptionsPassed:true,nativeBackendParity:true,existing23LawsUnchanged:true,newDomainLaw:false,distanceTableGenerated:false,admissibilityProved:false,productionIntegrated:false,performanceAcceptance:false,releaseHoldoutOpened:false,independentReview:false})+"\n",{flag:"wx"});
}
for(const[p,h]of Object.entries(sourceHashes))assert.equal(hash(p),h);
