import assert from "node:assert/strict";
import {readFileSync,writeFileSync,mkdirSync,readdirSync} from "node:fs";
import {resolve,dirname} from "node:path";
import {execFileSync,spawnSync} from "node:child_process";
import {fileHash} from "./reference-provenance.mjs";

const [mode,id]=process.argv.slice(2);
assert.equal(process.argv.length,4);assert.ok(["plan","proof","oracle","confirm"].includes(mode));assert.match(id,/^u05-safety-[a-z0-9-]+$/);
const read=p=>JSON.parse(readFileSync(p,"utf8")),directory=resolve("build/experiments",id),source="bench/exact-work-safety.bend",oldPlanPath="build/evidence/u03-six-conditional-v1-plan.json",oldPlan=read(oldPlanPath),files=[oldPlanPath],reused=[];
const bendPath="/nix/store/wdvvgydvk6sadcy7xf4hyrg7iq59ngmv-bend-2.0.37/bin/bend",kernelPath=process.env.BENDTT;assert.ok(kernelPath?.startsWith("/nix/store/"));
const toolchain={bendPath,bendSha256:fileHash(bendPath),kernelPath,kernelSha256:fileHash(kernelPath),nodePath:process.execPath,nodeSha256:fileHash(process.execPath)};files.push(bendPath,kernelPath,process.execPath);
function archived(unit,path){const indexPath="docs/verification/next-plan/"+unit+"/index.json",index=read(indexPath),name=path.split("/").at(-1),matches=index.archives.filter(a=>a.path.replace(/^\d+-/,"")===name+".gz");assert.equal(index.passed,true);assert.equal(index.workerGone,true);assert.equal(index.resourceStops,false);assert.equal(matches.length,1,path);assert.equal(fileHash(path),matches[0].sha256,path);files.push(indexPath,path);return matches[0].sha256;}
archived("U03/u03-six-conditional-v1",oldPlanPath);
for(const unit of ["u05-interior-v1","u05-ledger-v2","u05-worker-v1","u05-pool-v1"]){
  const base=resolve("build/experiments",unit),confirmationPath=resolve(base,"confirmation.json"),confirmationSha256=archived("U05/"+unit,confirmationPath),confirmation=read(confirmationPath);assert.equal(confirmation.passed,true);
  const names=unit==="u05-pool-v1"?["verification","observation","controls"]:unit==="u05-interior-v1"?["compile","observation"]:unit==="u05-worker-v1"?["compile","observation","admission"]:["compile","oracle","native"];
  const records={};for(const name of names){const path=resolve(base,name+".json");records[name]={path,sha256:archived("U05/"+unit,path)};}
  let sourceHashes={},artifacts={};
  if(unit!=="u05-pool-v1"){
    const compile=read(records.compile.path);assert.equal(compile.passed,true);
    sourceHashes=Object.fromEntries(Object.entries(compile.sourceHashes).filter(([p])=>p.startsWith("src/")||p.startsWith("bench/")||p.startsWith("tests/")||p.startsWith("build/")&&p.endsWith(".mjs")));
    artifacts=compile.artifacts;for(const [p,h]of Object.entries(artifacts)){assert.equal(fileHash(p),h,p);files.push(p);}
  }else{
    const path="build/evidence/u05-pool-v1-plan.json",plan=read(path);archived("U05/"+unit,path);sourceHashes=Object.fromEntries(Object.entries(plan.sourceHashes).filter(([p])=>/^bench\/(partition-|prefix-values)/.test(p)||p.startsWith("tests/partition-")));
    assert.equal(confirmation.allOwnersGone,true);assert.equal(confirmation.failedWorkerCannotCommit,true);
  }
  for(const [p,h]of Object.entries(sourceHashes)){assert.equal(fileHash(p),h,p);files.push(p);}
  reused.push({unit,confirmationPath,confirmationSha256,records,sourceHashes,artifacts,freshExecution:false});
}
const gatePath="build/experiments/u06-bounded-reference-v4/gate-reuse.json",gate=read(gatePath),walk=dir=>readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(dir+"/"+e.name):[dir+"/"+e.name]),roots=["flake.nix","flake.lock","justfile","scripts/check.mjs","LAWS.bend","PROOF.bend",...walk("src"),...walk("tests/toolchain")];
archived("U06/u06-bounded-reference-v4",gatePath);assert.equal(roots.length,87);assert.deepEqual(roots.sort(),Object.keys(gate.currentSourceHashes).sort());for(const [p,h]of Object.entries(gate.currentSourceHashes))assert.equal(fileHash(p),h);assert.equal(gate.originalJustCheckExecutedSuccessfully,true);assert.equal(fileHash(gate.receipt),gate.gateReceiptSha256);assert.equal(fileHash(gate.confirmation),gate.gateConfirmationSha256);files.push(gate.receipt,gate.confirmation,gate.plan);
files.push(source,"bench/u05-safety-checks.mjs","tests/exact-work-safety.mjs","docs/verification/next-plan/U05/EXACT-WORK-SAFETY.md","build/evidence/u05-safety-development-v1.json","build/evidence/u05-safety-development-v1-source.bend","build/evidence/u05-safety-development-v2.json");
if(mode==="plan"){
  const paths=[...new Set([...Object.keys(oldPlan.sourceHashes),...execFileSync("git",["ls-files","-z"],{encoding:"utf8"}).split("\0").filter(Boolean),...files])],jobs=[{id:"proof",memoryMiB:1024,seconds:300,cpus:[2]},{id:"oracle",memoryMiB:1024,seconds:90,cpus:[2]},{id:"confirm",memoryMiB:512,seconds:60,cpus:[2]}].map(j=>({...j,command:[process.execPath,"bench/u05-safety-checks.mjs",j.id,id]})),path=resolve("build/evidence",id+"-plan.json");
  writeFileSync(path,JSON.stringify({format:"rubend-background-tests-v1",id,root:process.cwd(),revision:execFileSync("git",["rev-parse","HEAD"],{encoding:"utf8"}).trim(),sourceHashes:Object.fromEntries(paths.map(p=>[p,fileHash(p)])),toolchain,jobs,expectedMinutes:2,queueHardLimitMinutes:8,scope:"Approved NP06 completed exact-context failure reuse at smaller Nat radius, exact full root/context equality transport; NP07 finite required indices/coverage representative/all-completed witnesses -> no solving word<=d and lower d+1, prefixes included as complete original-root words; NP08 actual typed legal reference inverse-snoc+composition left action and solving-word reconstruction. Fresh ordinary+BendTT,12actualfalse-source variants x2entrypoints, source/translation/diagnostic bundle. Genuine U-turn radius0/contour0 instances,4225radius+4225index pairs,83fixeddevelopmentprefixesx18moves=1494actualreferencecases/4482packets/2988independentfaceletreplays and noncommutingwrong-right counterexample. Preserve initial erased-specialization developmentfailure/source. Reuse unchanged root87/actualinterior/ledger/nativeworker/twoworkerfailure-retry evidence by exact canonical records, current relevant runtime source and artifact hashes. No new native execution/build, production cache/dualstate/pruning/globaloptimumlabel, proof of actual optimized exhaustion/coverage manufacture, performance claim, tablegeneration/search/holdout/competitor/push/independent review. Proof1GiBCPU2nice10/5min, finite1GiB90s, confirm512MiB60s, whole8min below30; exact compiler/kernel/Node fingerprints, desktopreserve/noswap/backstops and fullpriorinputunion."},null,2)+"\n",{flag:"wx"});console.log(JSON.stringify({path,expectedMinutes:2,maximumMinutes:8,reusedUnits:reused.length}));process.exit();
}
assert.deepEqual(toolchain,read(resolve(directory,"plan.json")).toolchain);
function execute(program,args,seconds=25){const r=spawnSync(program,args,{encoding:"utf8",timeout:seconds*1000,maxBuffer:4*1024*1024});assert.ifError(r.error);return{program,args,status:r.status,signal:r.signal,stdout:r.stdout??"",stderr:r.stderr??""};}
function passing(program,args,seconds=25){const r=execute(program,args,seconds);assert.equal(r.status,0,r.stdout+r.stderr);assert.equal(r.signal,null);return r;}
if(mode==="proof"){
  const generated=resolve(directory,"generated");mkdirSync(generated);const body=readFileSync(source,"utf8"),ordinary=passing(bendPath,[source]),verdict=passing(bendPath,[source,"--verdict"]);for(const r of [ordinary,verdict])assert.match(r.stdout,/ALL PROOFS CHECK/);
  const modulePath=resolve(generated,"safety.mjs"),translation=resolve(generated,"safety.bendtt");passing(bendPath,[source,"-o",modulePath]);passing(bendPath,[source,"-o",translation]);
  const mutations=[
    ["radius","for contained: K.Le(remaining, radius)","for contained: K.Le(radius, remaining)"],
    ["cube-key","for same_cube: {cached_cube == requested_cube : M.Cube}","for same_cube: Unit"],
    ["context-key","for same_context: {cached_context == requested_context : Context}","for same_context: Unit"],
    ["coverage","for coverage: Coverage(count, admission, cube, depth)","for coverage: Unit"],
    ["completion","for complete: AllCompleted(count, admission, cube, depth)","for complete: Unit"],
    ["shorter","shorter: K.Le(K.length(word), original_length)","shorter: K.Le(original_length, K.length(word))"],
    ["original-radius","original_within: K.Le(original_length, depth)","original_within: Unit"],
    ["solution","solution: {M.replay(word, cube) == M.solved() : M.Cube}","solution: Unit"],
    ["lower","K.Le(1n+depth, K.length(word))","K.Le(2n+depth, K.length(word))"],
    ["required-index","valid: K.Le(1n+value, count)","valid: Unit"],
    ["right-action","C.compose(P.turn(M.inverse(move), P.solved_cells()), R.inverse_root(reaching))","P.turn(M.inverse(move), R.inverse_root(reaching))"],
    ["inverse-move","P.turn(M.inverse(move), P.solved_cells())","P.turn(move, P.solved_cells())"]
  ],controls=[],artifacts=[modulePath,translation];
  for(const [name,from,to]of mutations){assert.ok(body.includes(from),name);const path=resolve(generated,"wrong-"+name+".bend"),mutated=body.replace(from,to).replace(/^import (\.\S+) as /gm,(_,p)=>"import "+resolve(dirname(source),p)+" as ");writeFileSync(path,mutated,{flag:"wx"});artifacts.push(path);for(const flags of [[],["--verdict"]]){const result=execute(bendPath,[path,...flags]),record={name,sourceSha256:fileHash(path),...result};writeFileSync(resolve(directory,"proof-control-"+String(controls.length).padStart(2,"0")+".json"),JSON.stringify(record)+"\n",{flag:"wx"});assert.equal(result.signal,null);assert.match(result.stdout+result.stderr,/SOME PROOFS FAIL/);assert.match(result.stdout+result.stderr,/Location:/);controls.push(record);}}
  writeFileSync(resolve(directory,"proof-bundle.json"),JSON.stringify({source,sourceSha256:fileHash(source),sourceText:body,artifacts:artifacts.map(p=>({path:p,sha256:fileHash(p),text:readFileSync(p,"utf8")})),failedDevelopment:{source:readFileSync("build/evidence/u05-safety-development-v1-source.bend","utf8"),receipt:read("build/evidence/u05-safety-development-v1.json")}})+"\n",{flag:"wx"});
  writeFileSync(resolve(directory,"reuse.json"),JSON.stringify({passed:true,units:reused,root87GateReused:true,originalJustCheckExecutedSuccessfully:true,freshRuntimeExecution:false})+"\n",{flag:"wx"});
  writeFileSync(resolve(directory,"proof.json"),JSON.stringify({passed:true,modulePath,sourceSha256:fileHash(source),toolchain,ordinary,verdict,artifacts:Object.fromEntries(artifacts.map(p=>[p,fileHash(p)])),controls,np06SemanticPredicateChecked:true,np07ConditionalCoverageChecked:true,np08TypedReferenceLeftActionChecked:true,optimizedRuntimeWitnessesCertified:false,existing23LawsChanged:false,newNativeExecution:false,independentReview:false})+"\n",{flag:"wx"});
}
if(mode==="oracle"){
  const proof=read(resolve(directory,"proof.json"));assert.equal(proof.passed,true);for(const [p,h]of Object.entries(proof.artifacts))assert.equal(fileHash(p),h);const result=passing(process.execPath,["tests/exact-work-safety.mjs",proof.modulePath,resolve(directory,"oracle.json")],80);process.stdout.write(result.stdout);
}
if(mode==="confirm"){
  const proof=read(resolve(directory,"proof.json")),oracle=read(resolve(directory,"oracle.json")),reuse=read(resolve(directory,"reuse.json"));assert.equal(proof.passed,true);assert.equal(proof.controls.length,24);assert.equal(oracle.passed,true);for(const [k,n]of Object.entries({radiusChecks:4225,indexChecks:4225,moveCases:1494,actualReferencePackets:4482,independentReplayChecks:2988}))assert.equal(oracle[k],n);assert.equal(reuse.units.length,4);assert.equal(reuse.freshRuntimeExecution,false);assert.equal(fileHash(source),proof.sourceSha256);for(const [p,h]of Object.entries(proof.artifacts))assert.equal(fileHash(p),h);for(const [p,h]of Object.entries(gate.currentSourceHashes))assert.equal(fileHash(p),h);
  writeFileSync(resolve(directory,"confirmation.json"),JSON.stringify({passed:true,np06SemanticExactContextAndRadius:true,np07ConditionalFiniteCoverageAndLowerBound:true,np08TypedReferenceLeftActionAndReconstruction:true,actualFalseProofEntrypoints:24,radiusChecks:4225,indexChecks:4225,actualReferenceMoveCases:1494,actualReferencePackets:4482,independentReplayChecks:2988,referenceChecksum:oracle.checksum,wrongRightActionRefuted:true,oldRuntimeUnitsReused:4,root87GateReused:true,existing23LawsChanged:false,optimizedRuntimeExhaustionOrCoverageCertified:false,newNativeExecution:false,productionCacheEnabled:false,productionDualStateChanged:false,performanceAcceptance:false,releaseHoldoutOpened:false,independentReview:false},null,2)+"\n",{flag:"wx"});
}
