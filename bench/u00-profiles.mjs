import assert from "node:assert/strict";
import {readFileSync,writeFileSync,mkdirSync,existsSync,createReadStream} from "node:fs";
import {resolve} from "node:path";
import {pathToFileURL} from "node:url";
import {spawnSync} from "node:child_process";
import {createHash} from "node:crypto";

const [mode,argument,owner]=process.argv.slice(2);assert.ok(["plan","gates","profiles"].includes(mode));
const read=path=>JSON.parse(readFileSync(path,"utf8")),hash=path=>createHash("sha256").update(readFileSync(path)).digest("hex"),save=(path,data)=>writeFileSync(path,JSON.stringify(data,null,2)+"\n",{flag:"wx"});
function run(program,args,env={},quiet=false){const r=spawnSync(program,args,{encoding:"utf8",timeout:300000,maxBuffer:8*1024*1024,env:{...process.env,...env}});if(!quiet&&r.stdout)process.stdout.write(r.stdout);if(r.stderr)process.stderr.write(r.stderr);assert.ifError(r.error);assert.equal(r.status,0,program+" failed");return r.stdout.trim();}
function verifyProfile(profile){const metadata=read(profile.binary+".json");assert.equal(hash(profile.binary),metadata.binarySha256);for(const [path,expected]of Object.entries(metadata.sourceHashes))assert.equal(hash(path),expected,"Profile does not match current source: "+path);return metadata;}
if(mode==="plan"){
  assert.equal(process.argv.length,5);assert.match(argument,/^u00-profiles-[a-z0-9-]+$/);const id=argument,historicalRoot=resolve(owner),directory=resolve("build/experiments",id),revision=run("git",["rev-parse","HEAD"],{},true);
  const joint=resolve(".cache/joint/phase1-v1.raw"),corner=resolve(historicalRoot,"build/evidence/r02-corner-full-bytes-v1.raw"),h0=resolve(historicalRoot,"build/evidence/h0-table-v1.raw"),meta=resolve(historicalRoot,"build/evidence/h0-meta-v1.raw");for(const p of[joint,corner,h0,meta])assert.ok(existsSync(p));
  const profiles=[{id:"small",env:{}},{id:"inverse",env:{RUBEND_JOINT_CACHE:joint}},{id:"corner",env:{RUBEND_JOINT_CACHE:joint,RUBEND_CORNER_CACHE:corner,RUBEND_CORNER_POLICY:"combined"}},{id:"corner-first",env:{RUBEND_JOINT_CACHE:joint,RUBEND_CORNER_CACHE:corner,RUBEND_CORNER_POLICY:"combined"}},{id:"h0",env:{RUBEND_JOINT_CACHE:joint,RUBEND_H0_CACHE:h0,RUBEND_H0_META_CACHE:meta,RUBEND_H0_POLICY:"combined"}},{id:"segmented",env:{RUBEND_JOINT_CACHE:joint,RUBEND_SEGMENTED_POLICY:"inverse-three"}}].map(p=>({...p,binary:resolve(historicalRoot,"build/experiments/r06-unattended-20261019-v1/profiles",p.id)}));
  for(const p of profiles)verifyProfile(p);
  const sourceHashes={};for(const p of run("git",["ls-files","-z"],{},true).split("\0").filter(Boolean))sourceHashes[p]=hash(p);
  const evidence=resolve("build/evidence/next-plan/U00");mkdirSync(evidence,{recursive:true});const specPath=resolve(evidence,id+"-spec.json"),planPath=resolve("build/evidence",id+"-plan.json");assert.ok(!existsSync(specPath)&&!existsSync(planPath),"Use a fresh immutable id");
  save(specPath,{format:"rubend-u00-profile-spec-v1",revision,directory,profiles,caches:[joint,corner,h0,meta],jointSha256:read("build/experiments/u00-controls-v1/control/raw-aa-config.json").profiles[0].cacheSha256});
  for(const p of[specPath,...profiles.flatMap(p=>[p.binary,p.binary+".json"]),"build/model.mjs","build/cubie.mjs","build/notation.mjs","build/rubend","build/manifest.json"])sourceHashes[p]=hash(p);
  const jobs=[{id:"gates",memoryMiB:4096,seconds:600,cpus:[2,3,4,5],command:[process.execPath,"bench/u00-profiles.mjs","gates",specPath]},{id:"profiles",memoryMiB:4096,seconds:900,cpus:[2],command:[process.execPath,"bench/u00-profiles.mjs","profiles",specPath]}];
  save(planPath,{format:"rubend-background-tests-v1",id,root:process.cwd(),revision,sourceHashes,jobs,expectedMinutes:10,queueHardLimitMinutes:25,scope:"Check existing capability/goal guards and six source-identical preserved optional native profiles through Engine, HTTP, cancellation, and real control failures. No new database, native profile rebuild, browser, publication, or performance claim."});console.log(JSON.stringify({planPath,profiles:profiles.length,expectedMinutes:10,maximumMinutes:25,noNativeRebuild:true}));
}else{
  assert.equal(process.argv.length,4);const spec=read(argument);assert.equal(spec.format,"rubend-u00-profile-spec-v1");const directory=resolve(spec.directory);assert.ok(directory.startsWith(resolve("build/experiments")+"/"));
  if(mode==="gates"){
    for(const test of["u00-aa","latency-probe","ui-proxy-origin","fixture-portability","commit-policy"])run(process.execPath,["tests/"+test+".mjs"]);
    for(const name of["search-profile","inverse-bound","corner-bound","h0-bound"]){const binary=resolve(directory,name);run("bend",["tests/"+name+".bend","-o",binary]);run(binary,["--threads","1"]);}
    const js=resolve(directory,"search-profile.mjs");run("bend",["tests/search-profile.bend","-o",js]);const module=(await import(pathToFileURL(js).href)).default;assert.equal(module.checks(),true);assert.equal(module.domain_checks(),true);run("just",["check"]);save(resolve(directory,"gates.json"),{passed:true,existingCapabilityAndGoalGuards:true,nativeAndJs:true,newLawsAdded:false});
  }else{
    for(const name of["RUBEND_APP_COMMAND","RUBEND_JOINT_CACHE","RUBEND_CORNER_CACHE","RUBEND_H0_CACHE","RUBEND_H0_META_CACHE","RUBEND_CORNER_POLICY","RUBEND_H0_POLICY","RUBEND_SEGMENTED_POLICY"])delete process.env[name];
    const seal=async path=>{const h=createHash("sha256");for await(const bytes of createReadStream(path))h.update(bytes);return h.digest("hex");};
    const caches=Object.fromEntries(await Promise.all(spec.caches.map(async p=>[p,await seal(p)])));assert.equal(caches[spec.caches[0]],spec.jointSha256);
    const results=[];
    for(const profile of spec.profiles){
      const metadata=verifyProfile(profile);const env={...profile.env,RUBEND_BINARY:profile.binary};
      for(const test of["engine","http","native-lifecycle","native-control-failures"]){const stdout=run(process.execPath,["tests/"+test+".mjs"],env),nativeRecord=["engine","http"].includes(test)?read("build/evidence/"+test+".json"):null;save(resolve(directory,profile.id+"-"+test+".json"),{passed:true,profile:profile.id,test,binarySha256:metadata.binarySha256,stdout,nativeRecord,performanceClaim:false});}
      assert.equal(hash(profile.binary),metadata.binarySha256);results.push({profile:profile.id,engine:true,http:true,controlFailureCases:5,sourceGraphIdentical:true});
    }
    for(const [p,h]of Object.entries(caches))assert.equal(await seal(p),h,"Cache changed: "+p);save(resolve(directory,"profiles.json"),{passed:true,results,caches,noNativeRebuild:true,performanceClaim:false,remaining:"Real-browser optional-profile and capability-mismatch coverage remain open."});console.log(JSON.stringify({passed:true,profiles:results.length,realControlFailures:results.length*5,performanceClaim:false}));
  }
}
