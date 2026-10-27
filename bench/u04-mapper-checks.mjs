import assert from "node:assert/strict";
import {readFileSync,writeFileSync,mkdirSync} from "node:fs";
import {resolve} from "node:path";
import {createHash} from "node:crypto";
import {execFileSync,spawnSync} from "node:child_process";
import {inputs} from "../scripts/manifest.mjs";

const[mode,id]=process.argv.slice(2);assert.equal(process.argv.length,4);assert.ok(["plan","compile","oracle","native","confirm"].includes(mode));assert.match(id,/^u04-mapper-[a-z0-9-]+$/);
const read=p=>JSON.parse(readFileSync(p,"utf8")),hash=p=>createHash("sha256").update(readFileSync(p)).digest("hex"),directory=resolve("build/experiments",id),files=["bench/u04-mapper-checks.mjs","bench/phase2-mapper.bend","bench/phase2-mapper-native.bend","bench/phase2-mapper-cost.mjs","tests/phase2-mapper.mjs","docs/verification/next-plan/U04/PHASE2-MAPPER-COST.md","build/experiments/u04-phase2-v1/oracle.json"],prior=read("docs/verification/next-plan/U04/u04-phase2-v1/index.json");
assert.equal(prior.passed,true);assert.equal(hash(files.at(-1)),prior.archives.find(a=>a.path==="8-oracle.json.gz").sha256);
if(mode==="plan"){
  const paths=execFileSync("git",["ls-files","-z"],{encoding:"utf8"}).split("\0").filter(Boolean);paths.push(...files);const path=resolve("build/evidence",id+"-plan.json"),jobs=[{id:"compile",memoryMiB:3072,seconds:180,cpus:[2,3,4,5]},{id:"oracle",memoryMiB:1024,seconds:90,cpus:[2]},{id:"native",memoryMiB:2048,seconds:240,cpus:[2]},{id:"confirm",memoryMiB:3072,seconds:150,cpus:[2,3,4,5]}].map(j=>({...j,command:[process.execPath,"bench/u04-mapper-checks.mjs",j.id,id]}));writeFileSync(path,JSON.stringify({format:"rubend-background-tests-v1",id,root:process.cwd(),revision:execFileSync("git",["rev-parse","HEAD"],{encoding:"utf8"}).trim(),sourceHashes:Object.fromEntries(paths.map(p=>[p,hash(p)])),jobs,expectedMinutes:4,queueHardLimitMinutes:12,scope:"U04 private native corner-class mapper planning costs. Exhaust40320entries, two actual data corruptions, runtime-seeded consumed work/checksum parity. Five alternating control/AA/mapper cohorts of one million helper probes; separate initialization, sampled process CPU/RSS and separate gprof binary. Existing23laws unchanged. No engine speed/strength acceptance, combined distance table, pruning, production changes, new laws, cache/holdout access or publication."},null,2)+"\n",{flag:"wx"});console.log(JSON.stringify({path,expectedMinutes:4,maximumMinutes:12}));process.exit();
}
const accepted=read("build/evidence/u06-gui-demand-v1-plan.json"),sourceHashes={...inputs(),...Object.fromEntries(files.map(p=>[p,hash(p)]))};for(const[p,h]of Object.entries(inputs()))assert.equal(h,accepted.sourceHashes[p],"Accepted app/laws changed");
function run(program,args,seconds=120,options={}){const r=spawnSync(program,args,{encoding:"utf8",timeout:seconds*1000,maxBuffer:4*1024*1024,...options});assert.ifError(r.error);process.stdout.write(r.stdout??"");process.stderr.write(r.stderr??"");assert.equal(r.status,0,program+" failed");return r.stdout;}
if(mode==="compile"){
  mkdirSync(directory,{recursive:true});run("bend",["bench/phase2-mapper.bend","--verdict"],60);run("bend",["bench/phase2-mapper.bend","-o",resolve(directory,"mapper.mjs")]);run(process.execPath,["bench/build-experiment.mjs","bench/phase2-mapper-native.bend",resolve(directory,"mapper-native")]);run("bend",["bench/phase2-mapper-native.bend","-o",resolve(directory,"mapper.c")]);run(process.execPath,["scripts/check-array-mode.mjs",resolve(directory,"mapper.c")]);run("clang",["-std=gnu11","-O3","-g","-pg","-pthread",resolve(directory,"mapper.c"),"-lm","-ldl","-o",resolve(directory,"mapper-profile")]);
  writeFileSync(resolve(directory,"compile.json"),JSON.stringify({passed:true,sourceHashes,artifacts:Object.fromEntries(["mapper.mjs","mapper-native","mapper-native.json","mapper.c","mapper-profile"].map(p=>{const path=resolve(directory,p);return[path,hash(path)];})),pureDefinitionsKernelChecked:true,distanceTableGenerated:false,newDomainLaw:false,productionIntegrated:false})+"\n",{flag:"wx"});process.exit();
}
const compile=read(resolve(directory,"compile.json"));assert.equal(compile.passed,true);for(const[p,h]of Object.entries(compile.artifacts))assert.equal(hash(p),h);
if(mode==="oracle")run(process.execPath,["tests/phase2-mapper.mjs",resolve(directory,"mapper.mjs"),resolve(directory,"oracle.json")],70);
if(mode==="native")run(process.execPath,["bench/phase2-mapper-cost.mjs",directory,resolve(directory,"oracle.json"),resolve(directory,"native.json")],220);
if(mode==="confirm"){
  for(const name of["oracle","native"])assert.equal(read(resolve(directory,name+".json")).passed,true);run("just",["check"],130);writeFileSync(resolve(directory,"confirmation.json"),JSON.stringify({passed:true,pureDefinitionsKernelChecked:true,entriesAndActualCorruptionsPassed:true,nativeBackendParity:true,existing23LawsUnchanged:true,distanceTableGenerated:false,newDomainLaw:false,productionIntegrated:false,performanceAcceptance:false,releaseHoldoutOpened:false,independentReview:false})+"\n",{flag:"wx"});
}
for(const[p,h]of Object.entries(sourceHashes))assert.equal(hash(p),h);
