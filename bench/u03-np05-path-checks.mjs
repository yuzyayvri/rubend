import assert from "node:assert/strict";
import {readFileSync,writeFileSync,mkdirSync,readdirSync} from "node:fs";
import {resolve,dirname} from "node:path";
import {execFileSync,spawnSync} from "node:child_process";
import {fileHash} from "./reference-provenance.mjs";
import {cpuObserverIdentity,measureCpu} from "./cpu-measure.mjs";

const [mode,id]=process.argv.slice(2);
assert.equal(process.argv.length,4);
assert.ok(["plan","proof","audit","confirm"].includes(mode));
assert.match(id,/^u03-np05-path-[a-z0-9-]+$/);
const read=p=>JSON.parse(readFileSync(p,"utf8")),oldDirectory=resolve("build/experiments/u03-six-cycle-v1"),directory=resolve("build/experiments",id),oldPlanPath="build/evidence/u03-six-cycle-v1-plan.json",oldPlan=read(oldPlanPath),oldIndexPath="docs/verification/next-plan/U03/u03-six-cycle-v1/index.json",oldIndex=read(oldIndexPath),oldAuditPath=resolve(oldDirectory,"audit.json"),oldAudit=read(oldAuditPath),buildPath=resolve(oldDirectory,"build.json"),build=read(buildPath),controlsPath=resolve(oldDirectory,"audit-controls.json"),controls=read(controlsPath),oldConfirmationPath=resolve(oldDirectory,"confirmation.json"),oldConfirmation=read(oldConfirmationPath),observer=cpuObserverIdentity();
assert.equal(oldIndex.passed,true);
assert.equal(oldIndex.workerGone,true);
assert.equal(oldIndex.resourceStops,false);
function archived(path){const name=path.split("/").at(-1),matches=oldIndex.archives.filter(a=>a.path.replace(/^\d+-/,"")===name+".gz");assert.equal(matches.length,1,path);assert.equal(fileHash(path),matches[0].sha256,path);}
for(const path of [oldPlanPath,oldAuditPath,buildPath,controlsPath,oldConfirmationPath])archived(path);
assert.equal(oldAudit.passed,true);
assert.equal(oldAudit.states,42577920);
assert.equal(oldAudit.edges,766402560);
assert.equal(oldAudit.allWorkersGone,true);
assert.equal(build.passed,true);
assert.equal(build.pattern,1);
assert.equal(build.complete.status,"built-unverified");
assert.equal(build.complete.counters.reached,42577920);
assert.equal(build.complete.counters.expanded,42577920);
assert.equal(build.complete.identity.goal,4307008);
assert.deepEqual(build.complete.identity.labels,[1,3,5,7,9,11]);
assert.equal(fileHash(build.complete.payload.path),build.complete.payload.sha256);
assert.equal(fileHash(oldAudit.input.payload.path),oldAudit.input.payload.sha256);
assert.equal(fileHash(build.rows.at(-1).manifest),build.rows.at(-1).manifestSha256);
assert.equal(controls.passed,true);
assert.equal(controls.controls.length,4);
assert.equal(controls.sourceControls.length,2);
assert.equal(oldConfirmation.root87GateReused,true);
const auditors=["bench/projected-distance-audit.mjs","bench/projected-distance-audit-worker.mjs","bench/projected-distance-audit-run.mjs","tests/projected-distance-audit.mjs"];
for(const p of auditors)assert.equal(fileHash(p),oldPlan.sourceHashes[p]);
const gatePath="build/experiments/u06-bounded-reference-v4/gate-reuse.json",gate=read(gatePath),walk=dir=>readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(dir+"/"+e.name):[dir+"/"+e.name]),roots=["flake.nix","flake.lock","justfile","scripts/check.mjs","LAWS.bend","PROOF.bend",...walk("src"),...walk("tests/toolchain")];
assert.equal(roots.length,87);
assert.deepEqual(roots.sort(),Object.keys(gate.currentSourceHashes).sort());
assert.equal(gate.originalJustCheckExecutedSuccessfully,true);
for(const [p,h] of Object.entries(gate.currentSourceHashes))assert.equal(fileHash(p),h);
assert.equal(fileHash(gate.receipt),gate.gateReceiptSha256);
assert.equal(fileHash(gate.confirmation),gate.gateConfirmationSha256);
const source="bench/np05-projection.bend",newFiles=[source,"bench/u03-np05-path-checks.mjs","tests/np05-projection.mjs","docs/verification/next-plan/U03/NP05-PROJECTION-PATH.md","build/evidence/u03-np05-development-v1.json","build/evidence/u03-np05-development-v1-source.bend","build/evidence/u03-np05-development-v2.json","build/evidence/u03-np05-development-v3.json","build/evidence/np05-proof-kinds.bend","build/evidence/u03-np05-kinds-v1.json",oldPlanPath,oldIndexPath,oldAuditPath,buildPath,controlsPath,oldConfirmationPath,resolve(oldDirectory,"audit-input.json"),build.complete.payload.path,build.rows.at(-1).manifest];
if(mode==="plan"){
  const paths=[...new Set([...Object.keys(oldPlan.sourceHashes),...execFileSync("git",["ls-files","-z"],{encoding:"utf8"}).split("\0").filter(Boolean),...newFiles])],jobs=[{id:"proof",memoryMiB:1024,seconds:180,cpus:[2]},{id:"audit",memoryMiB:2560,seconds:240,cpus:[2,3,4,5]},{id:"confirm",memoryMiB:512,seconds:90,cpus:[2]}].map(j=>({...j,command:[process.execPath,"bench/u03-np05-path-checks.mjs",j.id,id]})),path=resolve("build/evidence",id+"-plan.json");
  writeFileSync(path,JSON.stringify({format:"rubend-background-tests-v1",id,root:process.cwd(),revision:execFileSync("git",["rev-parse","HEAD"],{encoding:"utf8"}).trim(),sourceHashes:Object.fromEntries(paths.map(p=>[p,fileHash(p)])),observer,jobs,expectedMinutes:3,queueHardLimitMinutes:10,scope:"Approved NP05 finite-path semantic kernel and second complete reference-graph audit. Fresh ordinary+BendTT, seven actual false-source variants through both entrypoints, archived translation/module/source/diagnostics, maximum and actual one-move Unit-quotient instances. Typed path carries exact endpoints and HTM count; projected minimum includes attaining witness and minimality, not assumed full-cube admissibility. Finite per-word commutation instances at successive actual legal reaching roots; no global concrete six-edge commutation/certificate constructor or universal U32 codec theorem claimed. Development affine callback failure source+receipts preserved. Reuse first complete audit and all unchanged validator controls, both builds/native/pure admission/root87 original passing evidence. Audit pattern1 only, all42577920states/766402560edges and existing explicit actual JS codec/transition reflection scopes, four fixed local processes/cleanup. No regeneration/native engine build/production pruning/performance verdict/holdout/competitor/push/independent review. Whole queue ten minutes below thirty-minute policy; nice10, reserves/no swap and pressure backstops."},null,2)+"\n",{flag:"wx"});
  console.log(JSON.stringify({path,expectedMinutes:3,queueMaximumMinutes:10}));
  process.exit();
}
assert.deepEqual(read(resolve(directory,"plan.json")).observer,observer);
function execute(program,args,seconds=25){const r=spawnSync(program,args,{encoding:"utf8",timeout:seconds*1000,maxBuffer:4*1024*1024});assert.ifError(r.error);return{program,args,status:r.status,signal:r.signal,stdout:r.stdout??"",stderr:r.stderr??""};}
function passing(program,args,seconds=25){const r=execute(program,args,seconds);assert.equal(r.status,0,r.stdout+r.stderr);assert.equal(r.signal,null);return r;}
if(mode==="proof"){
  const generated=resolve(directory,"generated");mkdirSync(generated);
  const body=readFileSync(source,"utf8"),ordinary=passing("bend",[source]),verdict=passing("bend",[source,"--verdict"]);
  for(const r of [ordinary,verdict])assert.match(r.stdout,/ALL PROOFS CHECK/);
  const modulePath=resolve(generated,"projection.mjs"),translated=resolve(generated,"projection.bendtt");
  passing("bend",[source,"-o",modulePath]);passing("bend",[source,"-o",translated]);
  const mutations=[
    ["root","M.replay(word, M.solved())","M.solved()"],
    ["commutation","== step(move, project(root(reaching))) : A}","== project(root(reaching)) : A}"],
    ["path-count","count: {length == 1n+remaining : Nat}","count: {length == remaining : Nat}"],
    ["endpoint","same: {start == goal : A}","same: {start != goal : A}"],
    ["solution","for solution: {M.replay(word, root(reaching)) == M.solved() : M.Cube}","for solution: Unit"],
    ["minimum","K.Le(distance, K.length(word))","K.Le(1n+distance, K.length(word))"],
    ["maximum","case 1n+rest 1n+tail: 1n+maximum(rest, tail)","case 1n+rest 1n+tail: 2n+maximum(rest, tail)"]
  ],controls=[],artifacts=[modulePath,translated];
  for(const [name,from,to] of mutations){
    assert.ok(body.includes(from),name);
    const path=resolve(generated,"wrong-"+name+".bend"),mutated=body.replace(from,to).replace(/^import (\.\S+) as /gm,(_,p)=>"import "+resolve(dirname(source),p)+" as ");
    writeFileSync(path,mutated,{flag:"wx"});artifacts.push(path);
    for(const flags of [[],["--verdict"]]){
      const result=execute("bend",[path,...flags]),record={name,sourceSha256:fileHash(path),source:mutated,...result};
      writeFileSync(resolve(directory,"proof-control-"+String(controls.length).padStart(2,"0")+".json"),JSON.stringify(record)+"\n",{flag:"wx"});
      assert.equal(result.signal,null);assert.match(result.stdout+result.stderr,/SOME PROOFS FAIL/);assert.match(result.stdout+result.stderr,/Location:/);controls.push(record);
    }
  }
  const test=passing(process.execPath,["tests/np05-projection.mjs",modulePath,resolve(directory,"oracle.json")]);process.stdout.write(test.stdout);
  const input={...oldAudit.input,pattern:1,labels:build.complete.identity.labels,goal:build.complete.identity.goal,payload:build.complete.payload,sourceBuildPath:buildPath,sourceBuildSha256:fileHash(buildPath),sourceManifestPath:build.rows.at(-1).manifest,sourceManifestSha256:build.rows.at(-1).manifestSha256,maximumDistance:build.complete.counters.depth};
  writeFileSync(resolve(directory,"audit-input.json"),JSON.stringify(input)+"\n",{flag:"wx"});
  writeFileSync(resolve(directory,"proof-bundle.json"),JSON.stringify({source,sourceSha256:fileHash(source),sourceText:body,artifacts:artifacts.map(p=>({path:p,sha256:fileHash(p),text:readFileSync(p,"utf8")})),failedDevelopment:{source:readFileSync("build/evidence/u03-np05-development-v1-source.bend","utf8"),receipt:read("build/evidence/u03-np05-development-v1.json")}})+"\n",{flag:"wx"});
  writeFileSync(resolve(directory,"proof.json"),JSON.stringify({passed:true,sourceSha256:fileHash(source),ordinary,verdict,artifacts:Object.fromEntries(artifacts.map(p=>[p,fileHash(p)])),controls,test,finitePathKernel:true,globalConcreteCommutationInstantiated:false,universalCodecProved:false,root87GateReused:true,independentReview:false})+"\n",{flag:"wx"});
}
if(mode==="audit"){
  assert.equal(read(resolve(directory,"proof.json")).passed,true);
  const measurementPath=resolve(directory,"audit-command.json"),record=measureCpu([process.execPath,"bench/projected-distance-audit-run.mjs",resolve(directory,"audit-input.json"),resolve(directory,"audit-workers"),resolve(directory,"audit.json")],measurementPath);
  writeFileSync(resolve(directory,"audit-measurement.json"),JSON.stringify({measurementPath,sha256:fileHash(measurementPath),record})+"\n",{flag:"wx"});
  assert.equal(record.exitCode,0,record.stderr);assert.equal(record.signal,null);assert.equal(record.measurementAvailable,true,record.measurementError);assert.equal(read(resolve(directory,"audit.json")).passed,true);
}
if(mode==="confirm"){
  const proof=read(resolve(directory,"proof.json")),oracle=read(resolve(directory,"oracle.json")),audit=read(resolve(directory,"audit.json"));
  assert.equal(proof.passed,true);assert.equal(proof.controls.length,14);assert.equal(fileHash(source),proof.sourceSha256);for(const [p,h]of Object.entries(proof.artifacts))assert.equal(fileHash(p),h);
  assert.equal(oracle.passed,true);assert.equal(oracle.maximumPairs,1093);assert.equal(oracle.actualOneMovePaths.length,18);
  assert.equal(audit.passed,true);assert.equal(audit.input.pattern,1);assert.equal(audit.input.goal,4307008);assert.equal(audit.input.payload.sha256,build.complete.payload.sha256);
  for(const [k,v] of Object.entries({states:42577920,edges:766402560,roundtrips:665280,codecChecks:1330560,transitionChecks:11975040,zeros:1,maximum:10}))assert.equal(audit[k],v,k);
  assert.equal(audit.allWorkersGone,true);assert.equal(audit.serialHistogramAndChecksumAgree,true);
  for(const [p,h]of Object.entries(gate.currentSourceHashes))assert.equal(fileHash(p),h);
  writeFileSync(resolve(directory,"confirmation.json"),JSON.stringify({passed:true,bothSixEdgeReferenceGraphsAudited:true,eachGraphStates:42577920,eachGraphDirectedEdges:766402560,newGraphPattern:1,oldGraphAuditReused:true,allNewAuditWorkersGone:true,np05FinitePathKernelChecked:true,actualFalseProofEntrypoints:14,unitQuotientOneMoveInstances:18,globalSixEdgeProjectionInstantiated:false,universalU32CodecProved:false,nativeBackendRefinementProved:false,np05FullyDischarged:false,productionPruningEnabled:false,root87GateReused:true,existing23LawsChanged:false,performanceAcceptance:false,releaseHoldoutOpened:false,independentReview:false})+"\n",{flag:"wx"});
}
