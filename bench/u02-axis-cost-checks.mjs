import assert from "node:assert/strict";
import {readFileSync,writeFileSync,mkdirSync} from "node:fs";
import {resolve} from "node:path";
import {createHash} from "node:crypto";
import {execFileSync,spawnSync} from "node:child_process";
import {loadCorpus} from "./corpus.mjs";

const [mode,id]=process.argv.slice(2);assert.equal(process.argv.length,4);assert.match(id,/^u02-axis-cost-[a-z0-9-]+$/);assert.ok(["preflight","plan","compile","profile","measure","confirm"].includes(mode));
const directory=resolve("build/experiments",id),generated=resolve("build",id+"-sources"),hash=p=>createHash("sha256").update(readFileSync(p)).digest("hex");
function run(p,args,seconds=120,options={}){const r=spawnSync(p,args,{encoding:"utf8",timeout:seconds*1000,maxBuffer:8*1024*1024,...options});assert.ifError(r.error);process.stdout.write(r.stdout??"");process.stderr.write(r.stderr??"");assert.equal(r.status,0,p+" failed");return r.stdout;}
if(mode==="preflight"){
  run(process.execPath,["tests/axis-search-cost.mjs"]);run("bend",["PROOF.bend","--verdict"]);run("just",["check"],150);process.exit();
}
if(mode==="plan"){
  const paths=execFileSync("git",["ls-files","-z"],{encoding:"utf8"}).split("\0").filter(Boolean);
  const jobs=[{id:"compile",memoryMiB:3072,seconds:420,cpus:[2,3,4,5]},{id:"profile",memoryMiB:3072,seconds:180,cpus:[2]},{id:"measure",memoryMiB:3072,seconds:900,cpus:[2]},{id:"confirm",memoryMiB:3072,seconds:180,cpus:[2,3,4,5]}].map(job=>({...job,command:[process.execPath,"bench/u02-axis-cost-checks.mjs",job.id,id]}));
  const path=resolve("build/evidence",id+"-plan.json");writeFileSync(path,JSON.stringify({format:"rubend-background-tests-v1",id,root:process.cwd(),revision:execFileSync("git",["rev-parse","HEAD"],{encoding:"utf8"}).trim(),sourceHashes:Object.fromEntries(paths.map(p=>[p,hash(p)])),jobs,expectedMinutes:10,queueHardLimitMinutes:28,scope:"Collect fresh native fixed-fuel A/A and conditional A/B costs on four fixed pilot cases, five alternating cohorts, identical raw data and one CPU. Separate whole-process gprof instrumented run, startup and RSS records. No default promotion, deadline-quality claim, inference, new PDB, holdout or publication."},null,2)+"\n",{flag:"wx"});console.log(JSON.stringify({path,expectedMinutes:10,maximumMinutes:28}));process.exit();
}
if(mode==="compile"){
  run(process.execPath,["bench/generate-axis-search.mjs",generated]);
  const original=readFileSync("bench/contour-target.bend","utf8").replace(/^import (\.\.?\/\S+\.bend) as /gm,(_,p)=>"import "+resolve("bench",p)+" as ");
  for(const[label,text]of [["control",original],["candidate",readFileSync(resolve(generated,"contour.bend"),"utf8")]]){
    assert.equal(text.split("work(20000000n,").length,2);const source=text.replace("work(20000000n,","work(1000000n,");writeFileSync(resolve(generated,label+".bend"),source,{flag:"wx"});run("bend",[resolve(generated,label+".bend"),"-o",resolve(generated,label)],150);
  }
  run("bend",[resolve(generated,"control.bend"),"-o",resolve(generated,"control.c")],80);run("bend",[resolve(generated,"candidate.bend"),"-o",resolve(generated,"candidate.c")],80);
  const arrayMode=JSON.parse(run(process.execPath,["scripts/check-array-mode.mjs",resolve(generated,"candidate.c")]));assert.equal(arrayMode.sharedArrayMode,0);
  const files=["control","candidate","control.bend","candidate.bend","control.c","candidate.c","search.bend","manifest.json"];
  writeFileSync(resolve(directory,"compile.json"),JSON.stringify({passed:true,arrayMode,fuel:1000000,artifacts:Object.fromEntries(files.map(p=>[resolve(generated,p),hash(resolve(generated,p))]))})+"\n",{flag:"wx"});process.exit();
}
const compile=JSON.parse(readFileSync(resolve(directory,"compile.json"),"utf8"));assert.equal(compile.passed,true);for(const[p,h]of Object.entries(compile.artifacts))assert.equal(hash(p),h);
if(mode==="profile"){
  const profileDirectory=resolve(generated,"profile");mkdirSync(profileDirectory);
  const binary=resolve(profileDirectory,"control-profile"),command=["-std=gnu11","-O3","-g","-pg","-pthread",resolve(generated,"control.c"),"-lm","-ldl","-o",binary];
  run("clang",command,120);
  const input=resolve(profileDirectory,"request.txt"),item=loadCorpus("pilot")[0];writeFileSync(input,item.facelets+"\texact\t30000\n",{flag:"wx"});
  const env={...process.env,RUBEND_JOINT_CACHE:resolve(".cache/joint/phase1-v1.raw"),RUBEND_CONTOUR_PROFILE:"inverse-three",RUBEND_CONTOUR_TARGET:"20",BEND_NO_TELEMETRY:"1"};
  const raw=run(binary,[input,"--threads","1"],40,{cwd:profileDirectory,env});
  const events=raw.trim().split("\n").filter(s=>s.startsWith("{")).map(s=>JSON.parse(s)),done=events.find(e=>e.type==="done");assert.ok(done&&done.nodes===1000000);
  const profile=run("gprof",["-l","-b",binary,resolve(profileDirectory,"gmon.out")],30);
  assert.ok(profile.includes("Flat profile")&&profile.includes("seconds"));
  writeFileSync(resolve(directory,"profile.json"),JSON.stringify({passed:true,instrumented:true,excludedFromTiming:true,includesInitialization:true,compilerCommand:command,binarySha256:hash(binary),case:item,events,profile,performanceAcceptance:false})+"\n",{flag:"wx"});
}else if(mode==="measure"){
  run("uptime",[]);run("nproc",[]);
  run(process.execPath,["bench/axis-search-cost.mjs",generated,resolve(directory,"cost.json")],880);
}
else{
  const cost=JSON.parse(readFileSync(resolve(directory,"cost.json"),"utf8")),profile=JSON.parse(readFileSync(resolve(directory,"profile.json"),"utf8"));assert.equal(cost.passed,true);assert.equal(profile.passed,true);assert.equal(cost.rows.filter(r=>r.experiment==="aa").length,40);assert.equal(cost.performanceAcceptance,false);
  run(process.execPath,["tests/axis-search-cost.mjs"]);run("just",["check"],150);
  writeFileSync(resolve(directory,"confirmation.json"),JSON.stringify({passed:true,aa:cost.aa,ab:cost.ab??null,abSkipped:cost.abSkipped??null,profilePreserved:true,performanceAcceptance:false,deadlineQualityMeasured:false,independentReview:false})+"\n",{flag:"wx"});
}
