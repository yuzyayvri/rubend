import assert from "node:assert/strict";
import {readFileSync,writeFileSync} from "node:fs";
import {resolve} from "node:path";
import {createHash} from "node:crypto";
import {spawnSync,execFileSync} from "node:child_process";

const [mode,id]=process.argv.slice(2);assert.equal(process.argv.length,4);assert.ok(["preflight","plan","compile","functional","confirm"].includes(mode));assert.match(id,/^u02-axis-search-[a-z0-9-]+$/);
const directory=resolve("build/experiments",id),generated=resolve("build",id+"-sources"),hash=p=>createHash("sha256").update(readFileSync(p)).digest("hex");
function run(p,args,seconds=120){const r=spawnSync(p,args,{encoding:"utf8",timeout:seconds*1000,maxBuffer:4*1024*1024});assert.ifError(r.error);process.stdout.write(r.stdout??"");process.stderr.write(r.stderr??"");assert.equal(r.status,0,p+" failed");return r.stdout;}
if(mode==="preflight"){
  run(process.execPath,["bench/generate-axis-search.mjs",resolve("build/axis-search-v1"),"--check"]);
  run(process.execPath,["tests/axis-search.mjs","--unit"]);run("bend",["PROOF.bend","--verdict"]);run("just",["check"],150);
  writeFileSync(resolve("build/evidence",id+"-preflight.json"),JSON.stringify({passed:true,generatorReproducible:true,comparisonNegativeControls:6,nativeFunctionalPending:true,performanceClaim:false,independentReview:false})+"\n",{flag:"wx"});process.exit();
}
if(mode==="plan"){
  const paths=execFileSync("git",["ls-files","-z"],{encoding:"utf8"}).split("\0").filter(Boolean);paths.push("build/evidence/startup-fixed-raw-shallow.json");
  const jobs=[{id:"compile",memoryMiB:3072,seconds:600,cpus:[2,3,4,5],command:[process.execPath,"bench/u02-axis-search-checks.mjs","compile",id]},{id:"functional",memoryMiB:3072,seconds:900,cpus:[2],command:[process.execPath,"bench/u02-axis-search-checks.mjs","functional",id]},{id:"confirm",memoryMiB:3072,seconds:180,cpus:[2,3,4,5],command:[process.execPath,"bench/u02-axis-search-checks.mjs","confirm",id]}];
  const plan={format:"rubend-background-tests-v1",id,root:process.cwd(),revision:execFileSync("git",["rev-parse","HEAD"],{encoding:"utf8"}).trim(),sourceHashes:Object.fromEntries(paths.map(p=>[p,hash(p)])),jobs,expectedMinutes:8,queueHardLimitMinutes:28,scope:"Compile an isolated 16-field coordinate-carrying search, control and every-visit audit. Compare full canonical stacks, metadata and replay-checked answers for163 shallow and16 frozen pilot/development cubes with4096-step fuel. Preserve all actual compiler and runtime failures. No timing verdict, new pruning, PDB generation, holdout, production changes or publication."};
  const path=resolve("build/evidence",id+"-plan.json");writeFileSync(path,JSON.stringify(plan,null,2)+"\n",{flag:"wx"});console.log(JSON.stringify({path,expectedMinutes:8,maximumMinutes:28}));process.exit();
}
if(mode==="compile"){
  run(process.execPath,["bench/generate-axis-search.mjs",generated]);run(process.execPath,["bench/generate-axis-search.mjs",generated,"--check"]);
  run("bend",["PROOF.bend","--verdict"]);run("bend",[resolve(generated,"search.bend"),"--verdict"]);run("bend",[resolve(generated,"audit-search.bend"),"--verdict"]);
  for(const label of ["control","candidate","audit"]){const entry=resolve(generated,label+"-check.bend");run("bend",[entry,"-o",resolve(generated,label+"-check")],170);}
  run("bend",[resolve(generated,"candidate-check.bend"),"-o",resolve(generated,"candidate-check.c")],80);
  const arrayMode=JSON.parse(run(process.execPath,["scripts/check-array-mode.mjs",resolve(generated,"candidate-check.c")]));assert.equal(arrayMode.sharedArrayMode,0);
  const files=["manifest.json","search.bend","audit-search.bend","control-check.bend","candidate-check.bend","audit-check.bend","control-check","candidate-check","audit-check","candidate-check.c"];
  writeFileSync(resolve(directory,"compile.json"),JSON.stringify({passed:true,arrayMode,artifacts:Object.fromEntries(files.map(p=>[resolve(generated,p),hash(resolve(generated,p))])),nodeFields:16,performanceClaim:false})+"\n",{flag:"wx"});
}else{
  const compile=JSON.parse(readFileSync(resolve(directory,"compile.json"),"utf8"));assert.equal(compile.passed,true);for(const[p,h]of Object.entries(compile.artifacts))assert.equal(hash(p),h);
  if(mode==="functional")run(process.execPath,["tests/axis-search.mjs",generated,resolve(directory,"functional.json")],880);
  else{
    const result=JSON.parse(readFileSync(resolve(directory,"functional.json"),"utf8"));assert.equal(result.passed,true);assert.equal(result.checkedCases,179);assert.equal(result.results.length,537);assert.equal(result.releaseHoldoutOpened,false);assert.ok(result.auditVisits>0);
    run(process.execPath,["tests/axis-search.mjs","--unit"]);run("just",["check"],150);
    writeFileSync(resolve(directory,"confirmation.json"),JSON.stringify({passed:true,nativeCases:179,workers:3,auditVisits:result.auditVisits,performanceClaim:false,productionIntegrated:false,independentReview:false})+"\n",{flag:"wx"});
  }
}
