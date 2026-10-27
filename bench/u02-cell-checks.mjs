import assert from "node:assert/strict";
import {readFileSync,writeFileSync,mkdirSync} from "node:fs";
import {resolve} from "node:path";
import {createHash} from "node:crypto";
import {execFileSync,spawnSync} from "node:child_process";
import {inputs} from "../scripts/manifest.mjs";

const [mode,id]=process.argv.slice(2);assert.equal(process.argv.length,4);assert.ok(["guard","plan","confirm"].includes(mode));assert.match(id,/^u02-cells-[a-z0-9-]+$/);
const hash=p=>createHash("sha256").update(readFileSync(p)).digest("hex"),read=p=>JSON.parse(readFileSync(p,"utf8")),directory=resolve("build/experiments",id+"-guard"),guardPath=resolve("build/evidence",id+"-guard.json");
function run(p,args,seconds=120){const r=spawnSync(p,args,{encoding:"utf8",timeout:seconds*1000,maxBuffer:4*1024*1024});assert.ifError(r.error);process.stdout.write(r.stdout??"");process.stderr.write(r.stderr??"");assert.equal(r.status,0,p+" failed");return r.stdout;}
if(mode==="guard"){
  mkdirSync(directory);
  const sources=["bench/generate-piece-cells.mjs","bench/piece-cells.bend","bench/piece-cells.manifest.json","bench/u02-cell-checks.mjs","tests/piece-cells.mjs"],sourceHashes={...inputs(),...Object.fromEntries(sources.map(p=>[p,hash(p)]))};
  run(process.execPath,["bench/generate-piece-cells.mjs","--check"]);run("bend",["PROOF.bend","--verdict"]);run("bend",["bench/piece-cells.bend","--verdict"]);
  const source=readFileSync("bench/piece-cells.bend","utf8").replace("import ../src/model.bend as M","import "+resolve("src/model.bend")+" as M"),withoutRefinement=source.slice(0,source.indexOf("\ndef cube_ext(")),wrong=withoutRefinement.replace(/corner_rotate\((c\d+)\)/,"$1");assert.ok(withoutRefinement.length>0);assert.notEqual(wrong,withoutRefinement);
  const wrongPath=resolve(directory,"wrong-rotation.bend");writeFileSync(wrongPath,wrong,{flag:"wx"});run("bend",["bench/piece-cells.bend","-o",resolve(directory,"piece-cells.mjs")]);run("bend",[wrongPath,"-o",resolve(directory,"wrong-rotation.mjs")]);
  run(process.execPath,["tests/piece-cells.mjs",resolve(directory,"piece-cells.mjs"),resolve(directory,"wrong-rotation.mjs"),resolve(directory,"samples.json")]);
  const broken=source.replace("def corner_rotate(state: Corner) -> Corner:\n  match state:\n    case C00{}: C01{}","def corner_rotate(state: Corner) -> Corner:\n  match state:\n    case C00{}: C00{}");assert.notEqual(broken,source);
  const brokenPath=resolve(directory,"false-rotation.bend");writeFileSync(brokenPath,broken,{flag:"wx"});const negatives=[],wrongWhole=source.replace(/corner_rotate\((c\d+)\)/,"$1"),wrongWholePath=resolve(directory,"false-refinement.bend");assert.notEqual(wrongWhole,source);writeFileSync(wrongWholePath,wrongWhole,{flag:"wx"});
  for(const [path,location]of [[brokenPath,"corner_encode_rotate"],[wrongWholePath,"move_refinement"]])for(const flag of ["--check-only","--verdict"]){const r=spawnSync("bend",[path,flag],{encoding:"utf8",timeout:120000,maxBuffer:4*1024*1024});assert.ifError(r.error);assert.equal(r.status,1);const output=(r.stdout??"")+(r.stderr??"");assert.match(output,new RegExp("Location: "+location));assert.match(output,/expected/);assert.match(output,/observed/);negatives.push({flag,location,output});}
  run("just",["check"],150);for(const[p,h]of Object.entries(sourceHashes))assert.equal(hash(p),h);
  const artifacts=Object.fromEntries(["piece-cells.mjs","wrong-rotation.mjs","wrong-rotation.bend","false-rotation.bend","false-refinement.bend","samples.json"].map(p=>[resolve(directory,p),hash(resolve(directory,p))]));
  writeFileSync(guardPath,JSON.stringify({passed:true,sourceHashes,artifacts,negatives,finiteCellProofs:true,wholeStateRefinementProved:true,wordRefinementProved:true,packedRefinementProved:false,inverseReconstructionProved:false,independentReview:false},null,2)+"\n",{flag:"wx"});process.exit();
}
const guard=read(guardPath);assert.equal(guard.passed,true);for(const[p,h]of Object.entries({...guard.sourceHashes,...guard.artifacts}))assert.equal(hash(p),h);
if(mode==="plan"){
  const paths=execFileSync("git",["ls-files","-z"],{encoding:"utf8"}).split("\0").filter(Boolean);paths.push(guardPath,resolve("build/evidence",id+"-guard-resource.json"),...Object.keys(guard.artifacts));const path=resolve("build/evidence",id+"-plan.json");
  writeFileSync(path,JSON.stringify({format:"rubend-background-tests-v1",id,root:process.cwd(),revision:execFileSync("git",["rev-parse","HEAD"],{encoding:"utf8"}).trim(),sourceHashes:Object.fromEntries(paths.map(p=>[p,hash(p)])),jobs:[{id:"confirm",memoryMiB:3072,seconds:180,cpus:[2,3,4,5],command:[process.execPath,"bench/u02-cell-checks.mjs","confirm",id]}],expectedMinutes:2,queueHardLimitMinutes:3,scope:"Confirm finite typed cell codecs and universal one-move and word refinement to Model facelets, deterministic generation, sampled runtime correspondence and actual mutation rejection. Packed linkage and inverse reconstruction remain unproved. No production change, table generation, timing rerun, holdout or publication."},null,2)+"\n",{flag:"wx"});console.log(JSON.stringify({path,expectedMinutes:2,maximumMinutes:3}));process.exit();
}
const samples=read(resolve(directory,"samples.json"));assert.equal(samples.passed,true);assert.equal(samples.moveComparisons,36000);assert.equal(samples.legalViews,1000);assert.ok(samples.mutation);assert.equal(guard.wholeStateRefinementProved,true);assert.equal(guard.negatives.length,4);run(process.execPath,["bench/generate-piece-cells.mjs","--check"]);run("bend",["bench/piece-cells.bend","--verdict"]);writeFileSync(resolve("build/experiments",id,"confirmation.json"),JSON.stringify({passed:true,moveComparisons:36000,finiteCellProofs:true,wholeStateRefinementProved:true,wordRefinementProved:true,packedRefinementProved:false,inverseReconstructionProved:false,independentReview:false})+"\n",{flag:"wx"});
