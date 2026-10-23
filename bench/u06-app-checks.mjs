import assert from "node:assert/strict";
import {readFileSync,writeFileSync,createReadStream,statSync} from "node:fs";
import {resolve} from "node:path";
import {createHash} from "node:crypto";
import {execFileSync,spawnSync} from "node:child_process";
import {inputs} from "../scripts/manifest.mjs";

const[mode,id]=process.argv.slice(2);assert.equal(process.argv.length,4);assert.ok(["plan","regression","artifacts"].includes(mode));assert.match(id,/^u06-app-regression-[a-z0-9-]+$/);
const read=p=>JSON.parse(readFileSync(p,"utf8")),hash=p=>createHash("sha256").update(readFileSync(p)).digest("hex"),directory=resolve("build/experiments",id),files=["bench/u06-app-checks.mjs","docs/verification/next-plan/U06/DEMAND-RENDERING.md"];
if(mode==="plan"){
  const paths=execFileSync("git",["ls-files","-z"],{encoding:"utf8"}).split("\0").filter(Boolean);paths.push(...files);const path=resolve("build/evidence",id+"-plan.json"),jobs=[{id:"regression",memoryMiB:3072,seconds:1200,cpus:[2,3,4,5]},{id:"artifacts",memoryMiB:512,seconds:30,cpus:[2]}].map(j=>({...j,command:[process.execPath,"bench/u06-app-checks.mjs",j.id,id]}));
  writeFileSync(path,JSON.stringify({format:"rubend-background-tests-v1",id,root:process.cwd(),revision:execFileSync("git",["rev-parse","HEAD"],{encoding:"utf8"}).trim(),sourceHashes:Object.fromEntries(paths.map(p=>[p,hash(p)])),jobs,expectedMinutes:10,queueHardLimitMinutes:23,scope:"U06 rebuilt actual app regression after verified demand-scene treatment. Run complete just test including new callback/render scorer/fixture guards, existing native/HTTP/model/keyboard/export/profile suites and build proof gate. Seal actual built UI, native binary and manifest; preserve existing raw cache hash/identity. Reuse passing unchanged just-check evidence, no duplicate browser benchmark. No full-app browser claim until later hidden lanes, no new laws/large databases/holdout/publication or deployment."},null,2)+"\n",{flag:"wx"});console.log(JSON.stringify({path,expectedMinutes:10,maximumMinutes:23}));process.exit();
}
const previous=read("docs/verification/next-plan/U06/u06-render-demand-v2/index.json"),previousPlan=read("build/evidence/u06-render-demand-v2-plan.json");assert.equal(previous.passed,true);for(const[p,h]of Object.entries(inputs()))assert.equal(h,previousPlan.sourceHashes[p],"Application/proof inputs changed after scene confirmation");
const sourceHashes=inputs();
if(mode==="regression"){
  const cache=resolve(".cache/joint/phase1-v1.raw"),identity=()=>{const s=statSync(cache,{bigint:true});return["dev","ino","size","mtimeNs","ctimeNs"].map(k=>String(s[k]));},before=identity(),expected="2ccfd40fdc0cf4769c58d9646f6b0ea787571ce5200b5d124c8f17dcc70f73b5";
  async function seal(){const h=createHash("sha256");for await(const chunk of createReadStream(cache))h.update(chunk);assert.equal(h.digest("hex"),expected);assert.deepEqual(identity(),before);}
  await seal();const r=spawnSync("just",["test"],{encoding:"utf8",timeout:1180000,maxBuffer:16*1024*1024});process.stdout.write(r.stdout??"");process.stderr.write(r.stderr??"");assert.ifError(r.error);assert.equal(r.status,0,"Full app regression failed");assert.equal(r.signal,null);await seal();
  const manifest=read("build/manifest.json");assert.deepEqual(manifest.sourceHashes,sourceHashes);assert.equal(hash("build/rubend"),manifest.nativeSha256);const paths=["build/rubend","build/rubend.c","build/manifest.json","build/web/main.js","build/web/worker.js","build/web/index.html","build/web/style.css","build/web/favicon.svg"];
  writeFileSync(resolve(directory,"regression.json"),JSON.stringify({passed:true,completeJustTest:true,newFrameTestsInRegularSuite:true,sourceHashes,artifacts:Object.fromEntries(paths.map(p=>[p,hash(p)])),cacheSha256:expected,cacheIdentityUnchanged:true,browserRerun:false,productBrowserAcceptance:false,performanceAcceptance:false,independentReview:false})+"\n",{flag:"wx"});
}
if(mode==="artifacts"){
  const result=read(resolve(directory,"regression.json"));assert.equal(result.passed,true);for(const[p,h]of Object.entries(result.artifacts))assert.equal(hash(p),h);assert.deepEqual(read("build/manifest.json").sourceHashes,sourceHashes);
  writeFileSync(resolve(directory,"confirmation.json"),JSON.stringify({passed:true,actualAppRebuilt:true,completeJustTest:true,artifactsSealed:true,existingJustCheckEvidenceReused:true,cacheUnchanged:true,browserAcceptancePending:true,operatorReview:false,performanceAcceptance:false,newDomainLaw:false,releaseHoldoutOpened:false,independentReview:false})+"\n",{flag:"wx"});console.log(JSON.stringify({passed:true,actualAppRebuilt:true,artifactsSealed:true,browserAcceptancePending:true}));
}
assert.deepEqual(inputs(),sourceHashes);
