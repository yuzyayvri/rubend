import assert from "node:assert/strict";
import {readFileSync,writeFileSync,mkdirSync,existsSync,cpSync,copyFileSync,chmodSync} from "node:fs";
import {resolve} from "node:path";
import {spawnSync} from "node:child_process";
import {createHash} from "node:crypto";
import {inputs} from "../scripts/manifest.mjs";

const [mode,output]=process.argv.slice(2);assert.ok(["build","profiles","package"].includes(mode));assert.ok(output);assert.equal(process.argv.length,4);
const directory=resolve(output);assert.ok(directory.startsWith(resolve("build/experiments")+"/"));const before=inputs(),hash=path=>createHash("sha256").update(readFileSync(path)).digest("hex");
const joint="/home/yuzy/rubend/.cache/joint/phase1-v1.raw",corner=resolve("build/evidence/r02-corner-full-bytes-v1.raw"),h0meta=resolve("build/evidence/h0-meta-v1.raw"),h0=resolve("build/evidence/h0-table-v1.raw");
const profiles=[
  {id:"small",entry:"src/small/main.bend",env:{}},
  {id:"inverse",entry:"bench/inverse-main.bend",env:{RUBEND_JOINT_CACHE:joint}},
  {id:"corner",entry:"src/corner/main.bend",env:{RUBEND_JOINT_CACHE:joint,RUBEND_CORNER_CACHE:corner,RUBEND_CORNER_POLICY:"combined"}},
  {id:"corner-first",entry:"src/corner-first/main.bend",env:{RUBEND_JOINT_CACHE:joint,RUBEND_CORNER_CACHE:corner,RUBEND_CORNER_POLICY:"combined"}},
  {id:"h0",entry:"src/h0/main.bend",env:{RUBEND_JOINT_CACHE:joint,RUBEND_H0_META_CACHE:h0meta,RUBEND_H0_CACHE:h0,RUBEND_H0_POLICY:"combined"}},
  {id:"segmented",entry:"src/segmented/main.bend",env:{RUBEND_JOINT_CACHE:joint,RUBEND_SEGMENTED_POLICY:"inverse-three"}}
];
function run(program,args,env={}){console.log(JSON.stringify({program,args}));const result=spawnSync(program,args,{encoding:"utf8",env:{...process.env,...env},timeout:180000,maxBuffer:4194304});if(result.stdout)process.stdout.write(result.stdout);if(result.stderr)process.stderr.write(result.stderr);assert.ifError(result.error);assert.equal(result.status,0,program+" failed");return result.stdout;}
const results=[];
if(mode==="build"){
  mkdirSync(resolve(directory,"profiles"));
  for(const profile of profiles){const binary=resolve(directory,"profiles",profile.id);run(process.execPath,["bench/build-experiment.mjs",profile.entry,binary]);run("bend",[profile.entry,"-o",binary+".c"]);run(process.execPath,["scripts/check-array-mode.mjs",binary+".c"]);results.push({id:profile.id,binary,binarySha256:hash(binary)});}
}else if(mode==="profiles"){
  for(const profile of profiles){const binary=resolve(directory,"profiles",profile.id),metadata=JSON.parse(readFileSync(binary+".json","utf8"));assert.equal(hash(binary),metadata.binarySha256);const env={...profile.env,RUBEND_BINARY:binary};run(process.execPath,["tests/native-lifecycle.mjs"],env);run(process.execPath,["tests/native-control-failures.mjs"],env);assert.equal(hash(binary),metadata.binarySha256);results.push({id:profile.id,retainedOwnerAndStableDescriptors:true,fragmentedStaleControl:true,nativeFailures:5,processAndIpcCleanup:true});}
}else{
  const stage=resolve(directory,"package");assert.equal(existsSync(stage),false);mkdirSync(stage);mkdirSync(resolve(stage,"build"));
  for(const path of["apps","licenses"])cpSync(path,resolve(stage,path),{recursive:true,errorOnExist:true,force:false});
  for(const path of["README.md","LICENSE","THIRD_PARTY_NOTICES.md"])copyFileSync(path,resolve(stage,path));
  cpSync("build/web",resolve(stage,"build/web"),{recursive:true,errorOnExist:true,force:false});
  const manifest=JSON.parse(readFileSync("build/manifest.json","utf8"));assert.deepEqual(manifest.sourceHashes,before);
  for(const path of["rubend","manifest.json",...Object.keys(manifest.artifacts)])copyFileSync(resolve("build",path),resolve(stage,"build",path));
  run(process.execPath,["tests/package.mjs",resolve(stage,"build")]);
  const wrapper=resolve(directory,"package-server.mjs");writeFileSync(wrapper,"#!"+process.execPath+"\nprocess.chdir("+JSON.stringify(stage)+");\nawait import("+JSON.stringify(resolve(stage,"apps/server.mjs"))+");\n",{flag:"wx"});chmodSync(wrapper,0o700);
  run(process.execPath,["tests/http.mjs"],{RUBEND_APP_COMMAND:wrapper,RUBEND_BINARY:resolve(stage,"build/rubend")});
  run(process.execPath,["tests/engine.mjs"],{RUBEND_BINARY:resolve(stage,"build/rubend")});
  run(process.execPath,["tests/export.mjs"]);run(process.execPath,["scripts/check.mjs"]);
  assert.equal(hash(resolve(stage,"build/rubend")),manifest.nativeSha256);results.push({stage,stagedNativeAndModulesVerified:true,httpAndAbortRecovery:true,engineAndReplay:true,unchangedLawAndToolchainChecks:16,nixSandboxOrRelocationClaim:false});
}
assert.deepEqual(inputs(),before,"Sources changed during background checks");writeFileSync(resolve(directory,mode+"-result.json"),JSON.stringify({format:"rubend-background-profile-checks-v1",passed:true,mode,results,sourceHashes:before,independentReview:false},null,2)+"\n",{flag:"wx"});console.log(JSON.stringify({passed:true,mode,profiles:results.length}));
