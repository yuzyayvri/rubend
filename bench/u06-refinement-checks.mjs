import assert from "node:assert/strict";
import {readFileSync,writeFileSync,readdirSync} from "node:fs";
import {resolve,dirname,relative} from "node:path";
import {execFileSync,spawnSync} from "node:child_process";
import {gunzipSync} from "node:zlib";
import {createHash} from "node:crypto";
import {fileHash} from "./reference-provenance.mjs";

const [mode,id]=process.argv.slice(2);assert.equal(process.argv.length,4);
assert.ok(["plan","inventory","confirm"].includes(mode));assert.match(id,/^u06-refinement-[a-z0-9-]+$/);
const read=p=>JSON.parse(readFileSync(p,"utf8")),text=p=>readFileSync(p,"utf8"),hash=b=>createHash("sha256").update(b).digest("hex");
const directory=resolve("build/experiments",id),prior="docs/verification/next-plan/U06/u06-bounded-reference-v4",index=read(prior+"/index.json"),evidence=[];
assert.equal(index.passed,true);assert.equal(index.workerGone,true);assert.equal(index.resourceStops,false);
function archived(name){
  const entry=index.archives.find(a=>a.path.endsWith("-"+name+".json.gz"));assert.ok(entry,name);
  const path=prior+"/"+entry.path,compressed=readFileSync(path),bytes=gunzipSync(compressed);
  assert.equal(hash(compressed),entry.compressedSha256);assert.equal(hash(bytes),entry.sha256);evidence.push(path);
  return JSON.parse(bytes);
}
const proof=archived("proof"),gate=archived("gate-reuse"),confirmation=archived("confirmation");
assert.equal(proof.passed,true);assert.equal(proof.rejected.length,16);assert.equal(confirmation.completeUnprunedBoundedReferenceChecked,true);
assert.equal(confirmation.optimizedTraversalRefinementProved,false);assert.equal(gate.originalJustCheckExecutedSuccessfully,true);assert.equal(gate.freshJustCheckExecuted,false);
for(const[p,h]of Object.entries(proof.sourceHashes).filter(([p])=>p.endsWith(".bend")||["bench/bounded-reference.bend.in","bench/generate-bounded-reference.mjs"].includes(p)))assert.equal(fileHash(p),h);
const reference=resolve("build/experiments/u06-bounded-reference-v3/generated/bounded-reference.mjs");assert.equal(fileHash(reference),proof.artifacts[reference]);
const walk=dir=>readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(dir+"/"+e.name):[dir+"/"+e.name]);
const rootInputs=["flake.nix","flake.lock","justfile","scripts/check.mjs","LAWS.bend","PROOF.bend",...walk("src"),...walk("tests/toolchain")];
assert.deepEqual(rootInputs.sort(),Object.keys(gate.currentSourceHashes).sort());for(const[p,h]of Object.entries(gate.currentSourceHashes))assert.equal(fileHash(p),h);
assert.equal(fileHash("bench/u02-packed-certificate-checks.mjs"),gate.gateScriptSha256);assert.equal(fileHash(gate.receipt),gate.gateReceiptSha256);assert.equal(fileHash(gate.confirmation),gate.gateConfirmationSha256);
const gatePlan=read(gate.plan);assert.equal(gatePlan.id,gate.gateId);assert.equal(gatePlan.sourceHashes["bench/u02-packed-certificate-checks.mjs"],gate.gateScriptSha256);
const files=["bench/u06-refinement-checks.mjs","tests/reference-label-boundary.mjs","docs/verification/next-plan/U06/REFINEMENT-GAPS.md","docs/architecture/PROOF-COVERAGE.md",prior+"/index.json",...evidence,reference,"build/model.mjs","build/cubie.mjs","build/notation.mjs","build/manifest.json",gate.receipt,gate.confirmation,gate.plan,...Object.keys(proof.sourceHashes).filter(p=>p.endsWith(".bend")),...Object.keys(proof.artifacts)];
const manifest=read("build/manifest.json");for(const name of["model.mjs","cubie.mjs","notation.mjs"])assert.equal(fileHash("build/"+name),manifest.artifacts[name]);
for(const p of[...walk("src"),...walk("apps")])assert.equal(fileHash(p),manifest.sourceHashes[p],"Current runtime differs from accepted build: "+p);
if(mode==="plan"){
  const paths=[...new Set([...execFileSync("git",["ls-files","-z"],{encoding:"utf8"}).split("\0").filter(Boolean),...files])],jobs=["inventory","confirm"].map(job=>({id:job,memoryMiB:512,seconds:60,cpus:[2],command:[process.execPath,"bench/u06-refinement-checks.mjs",job,id]})),path=resolve("build/evidence",id+"-plan.json");
  writeFileSync(path,JSON.stringify({format:"rubend-background-tests-v1",id,root:process.cwd(),revision:execFileSync("git",["rev-parse","HEAD"],{encoding:"utf8"}).trim(),sourceHashes:Object.fromEntries(paths.map(p=>[p,fileHash(p)])),jobs,expectedMinutes:1,queueHardLimitMinutes:2,scope:"Original U06 optimized-reference gap identification only. Source-bound seven-entrypoint import/type inventory, checked reference reused by archive/module/source hashes, all87unchanged root-gate inputs plus original receipt/script/confirmation. Actual18one-move roots at radii0/1/2,54queries and independent packet replay; actual nonshortest bounded-answer counterexample. JavaScript export label checks and three actual source faults. No new law, native traversal theorem, loaded-data proof, production label/default/pruning change, benchmark, table build, holdout, publishing or independent review."},null,2)+"\n",{flag:"wx"});
  console.log(JSON.stringify({path,expectedMinutes:1,maximumMinutes:2,memoryMiB:512}));process.exit();
}
function closure(entry,readSource=text){
  const pending=[resolve(entry)],seen=new Set(),nodes=[],edges=[];
  while(pending.length){const path=pending.pop();if(seen.has(path))continue;seen.add(path);assert.ok(path.startsWith(process.cwd()+"/"));const source=readSource(path);nodes.push({path:relative(process.cwd(),path),sha256:hash(source)});
    for(const match of source.matchAll(/^import\s+(\S+)(?:\s+as\s+\w+)?\s*$/gm)){const name=match[1];if(name==="Base")continue;assert.ok(name.startsWith(".")||name.startsWith("/"),"Unrecognized import: "+name);const dependency=resolve(dirname(path),name);edges.push({from:relative(process.cwd(),path),to:relative(process.cwd(),dependency)});pending.push(dependency);}
  }
  return {entry,nodes:nodes.sort((a,b)=>a.path.localeCompare(b.path)),edges:edges.sort((a,b)=>(a.from+a.to).localeCompare(b.from+b.to))};
}
function inspect(entry,readSource=text){
  const graph=closure(entry,readSource),main=readSource(resolve(entry)),prefix=dirname(entry),searchPath=prefix+"/search.bend",search=readSource(resolve(searchPath)),portfolio=readSource(resolve(prefix+"/portfolio.bend"));
  assert.ok(graph.nodes.some(n=>n.path==="src/certificate.bend"));assert.ok(graph.nodes.every(n=>n.path.startsWith("src/")),"Runtime unexpectedly imports a private/reference module");
  assert.match(main,/Cert\.certify\(original, to_moves\(moves\)\)/);assert.match(main,/Cert\.moves\(original, certificate\)/);
  const completion=search.match(/type Completion is Data:\n([\s\S]*?)\n\ndef /)?.[1];assert.ok(completion);const constructors=[...completion.matchAll(/^  (\w+)\{/gm)].map(m=>m[1]);assert.deepEqual(constructors,["Running","SearchOptimal","TaskFinished","InvalidTransform","ProfileMismatch",...(prefix==="src/owned"?["ContinuationFailure"]:[])]);
  const meta=search.match(/^  Meta\{[^\n]+/m)?.[0],session=portfolio.match(/^  Session\{[^\n]+/m)?.[0];assert.ok(meta&&session);assert.match(meta,/lower: U32/);assert.match(meta,/status: Completion/);assert.match(session,/lower: U32/);assert.match(session,/status: S\.Completion/);
  return {...graph,completionConstructors:constructors,metadataDeclaration:meta,sessionDeclaration:session,certificateBeforeCandidateObserved:true,proofCarryingReferenceImported:false};
}
if(mode==="inventory"){
  const entries=walk("src").filter(p=>/(?:^|\/)main\.bend$/.test(p)).sort();assert.equal(entries.length,7);const graphs=entries.map(p=>inspect(p)),faults=[];
  const mutations=[{name:"formal-completion-constructor",file:"src/small/search.bend",before:"  SearchOptimal{}",after:"  SearchOptimal{}\n  FormallyCertifiedOptimal{}",diagnostic:/Expected values to be strictly deep-equal/},{name:"numeric-bound-type-drift",file:"src/small/search.bend",before:"lower: U32",after:"lower: Nat",diagnostic:/lower: U32/},{name:"lost-native-certificate-call",file:"src/small/main.bend",before:"Cert.certify(original, to_moves(moves))",after:"None{}",diagnostic:/Cert/}];
  for(const m of mutations){const original=text(m.file);assert.ok(original.includes(m.before));let failure;try{inspect("src/small/main.bend",p=>p===resolve(m.file)?original.replace(m.before,m.after):text(p));}catch(error){failure=error;}assert.ok(failure instanceof assert.AssertionError,m.name);assert.match(failure.message,m.diagnostic);faults.push({name:m.name,diagnostic:failure.message});}
  const output=resolve(directory,"label-boundary.json"),run=spawnSync(process.execPath,["tests/reference-label-boundary.mjs",reference,resolve(directory,"faults"),output],{encoding:"utf8",timeout:45000,maxBuffer:1024*1024});assert.ifError(run.error);assert.equal(run.status,0,run.stdout+run.stderr);process.stdout.write(run.stdout);
  const gaps=[
    {id:"input-before-search",sources:["src/cubie.bend","bench/packed-certificate.bend.in"],missing:"Post-certificate admission does not prove every pre-search validator output has a typed reaching witness."},
    {id:"actual-target-membership",sources:["src/coordinates.bend","bench/subgroup-targets.bend","bench/subgroup-target-bridge.bend"],missing:"Connect actual packed coordinates, frame/inverse reconstruction and each concrete bound target to the proved subgroup predicates for every admitted input."},
    {id:"loaded-bound-admissibility",sources:["src/tables.bend","src/raw-table-io.bend","src/corner-table-io.bend","src/h0-table-io.bend"],missing:"A finite audited payload and its fingerprint do not supply the universal projection/admissibility and file-to-value premises required by each runtime lookup."},
    {id:"optimized-contour-simulation",sources:["src/search.bend","src/small/search.bend","bench/bounded-reference.bend.in"],missing:"Relate every permitted optimized frame/path, canonical cut, heuristic cut and exhausted contour to the complete unpruned reference, including empty paths and U32 bounds."},
    {id:"portfolio-and-interruption",sources:["src/portfolio.bend","src/small/portfolio.bend","src/worker-control.bend","src/main.bend"],missing:"Show frame deduplication, shared incumbents, exact/improving slices and interruption preserve required coverage and cannot turn unfinished work into exclusion."},
    {id:"optional-cache-and-partition",sources:["docs/architecture/NEXT-PROOF-STATEMENTS.md"],missing:"NP06 and NP07 remain unapproved. Diagnostic failure-cache and partition receipts are not completed-failure or global-contour theorems."},
    {id:"proof-evidence-transport",sources:["src/main.bend","apps/engine.mjs","apps/export.mjs"],missing:"Runtime numeric optimal flags and exported JSON do not carry a checked optimized exclusion witness. The current search-established label must remain distinct from formal certification."}
  ];
  for(const g of gaps)for(const p of g.sources)assert.ok(text(p).length>0);
  const labels=read(output);assert.equal(labels.sourceFaults,3);assert.equal(labels.queries,54);assert.equal(labels.packetReplays,36);
  writeFileSync(resolve(directory,"inventory.json"),JSON.stringify({passed:true,format:"rubend-optimized-reference-inventory-v1",sourceHashes:Object.fromEntries([...new Set([...files,...walk("src"),...walk("apps"),"docs/architecture/NEXT-PROOF-STATEMENTS.md"])].map(p=>[p,fileHash(p)])),graphs,sourceInventoryFaults:faults,referenceEvidence:{archive:prior+"/index.json",sourceSeals:index.sourceSeals,reused:true,module:reference,moduleSha256:fileHash(reference),falseProofEntrypoints:proof.rejected.length},rootGate:{reused:true,inputCount:rootInputs.length,freshJustCheckExecuted:false},gaps,applicationFormallyCertified:false,newProofStatementsImplemented:false,scope:"Pinned source/type/import observations and executable label checks, not proof of program absence, completeness or backend correctness",performanceAcceptance:false,releaseHoldoutOpened:false,independentReview:false},null,2)+"\n",{flag:"wx"});
}
if(mode==="confirm"){
  const report=read(resolve(directory,"inventory.json")),labels=read(resolve(directory,"label-boundary.json"));assert.equal(report.passed,true);assert.equal(report.graphs.length,7);assert.equal(report.gaps.length,7);assert.equal(report.applicationFormallyCertified,false);assert.equal(labels.passed,true);for(const[p,h]of Object.entries(report.sourceHashes))assert.equal(fileHash(p),h);for(const[p,h]of Object.entries(gate.currentSourceHashes))assert.equal(fileHash(p),h);
  writeFileSync(resolve(directory,"confirmation.json"),JSON.stringify({passed:true,sourceBoundGapInventory:true,productionEntrypoints:7,missingImplications:7,sourceInventoryFaults:3,actualExportFaults:3,referenceQueries:54,independentPacketReplays:36,actualBoundedNonShortestWitness:[1,0,1],referenceProofsReused:true,root23LawAndToolchainGateReused:true,unchangedRootInputs:87,freshJustCheckExecuted:false,optimizedTraversalRefinementProved:false,strongerApplicationLabelEnabled:false,productionChanged:false,performanceAcceptance:false,releaseHoldoutOpened:false,independentReview:false},null,2)+"\n",{flag:"wx"});
}
