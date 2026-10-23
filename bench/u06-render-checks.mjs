import assert from "node:assert/strict";
import {readFileSync,writeFileSync,mkdirSync,existsSync} from "node:fs";
import {resolve,dirname} from "node:path";
import {createHash,randomBytes} from "node:crypto";
import {execFileSync,spawnSync} from "node:child_process";
import {createServer} from "node:http";
import {build} from "esbuild";
import {inputs} from "../scripts/manifest.mjs";
import {withArtifactLease} from "../scripts/artifact-lease.mjs";
import {checkRenderBaseline} from "./render-baseline-model.mjs";

const[mode,id]=process.argv.slice(2);assert.equal(process.argv.length,4);assert.ok(["plan","prepare","measure","confirm","address"].includes(mode));assert.match(id,/^u06-render-baseline-[a-z0-9-]+$/);
const read=p=>JSON.parse(readFileSync(p,"utf8")),hash=p=>createHash("sha256").update(readFileSync(p)).digest("hex"),directory=resolve("build/experiments",id),spec=read("bench/render-baseline-spec.json"),files=["bench/u06-render-checks.mjs","bench/render-baseline-spec.json","bench/render-baseline-page.mjs","bench/render-baseline-model.mjs","tests/render-baseline-model.mjs","docs/verification/next-plan/U06/RENDERING-BASELINE.md","build/model.mjs","build/cubie.mjs","build/notation.mjs","build/manifest.json"];
if(mode==="plan"){
  const paths=execFileSync("git",["ls-files","-z"],{encoding:"utf8"}).split("\0").filter(Boolean);paths.push(...files);
  const path=resolve("build/evidence",id+"-plan.json"),jobs=[{id:"prepare",memoryMiB:1024,seconds:90,cpus:[2,3,4,5]},{id:"measure",memoryMiB:512,seconds:210,cpus:[2]},{id:"confirm",memoryMiB:1024,seconds:60,cpus:[2]}].map(j=>({...j,command:[process.execPath,"bench/u06-render-checks.mjs",j.id,id]}));
  writeFileSync(path,JSON.stringify({format:"rubend-background-tests-v1",id,root:process.cwd(),revision:execFileSync("git",["rev-parse","HEAD"],{encoding:"utf8"}).trim(),sourceHashes:Object.fromEntries(paths.map(p=>[p,hash(p)])),jobs,expectedMinutes:2,queueHardLimitMinutes:8,scope:"U06 unchanged actual CubeScene browser baseline only. One hidden IAB page runs5fixed cohorts idle/orbit/playback/resize/set, counts actual render submissions and new mesh/group UUIDs, checks54canonical colors from Bend model, records visibility and posts immutable evidence. Visible document semantics required; hidden or inactive rendering is inconclusive, not speedup. Temporary origin/body/nonce guarded loopback server is bounded; app-managed browser outside its cgroup, no enforced browser CPU/RSS claim. Reuse unchanged proof/toolchain evidence by exact source hashes. No native search, table generation, production UI change, performance promotion, new law, holdout or publication."},null,2)+"\n",{flag:"wx"});console.log(JSON.stringify({path,expectedMinutes:2,maximumMinutes:8}));process.exit();
}
if(mode==="address"){
  const path=resolve(directory,"ready.json"),deadline=performance.now()+15000;
  while(!existsSync(path)&&performance.now()<deadline)await new Promise(done=>setTimeout(done,50));
  assert.ok(existsSync(path),"Browser fixture was not ready within15seconds; inspect queue logs");console.log(JSON.stringify(read(path)));process.exit();
}
withArtifactLease();
const sourceHashes={...inputs(),...Object.fromEntries(files.map(p=>[p,hash(p)]))},prior=read("build/experiments/u04-deadline-v1/compile.json"),priorIndex=read("docs/verification/next-plan/U04/u04-deadline-v1/index.json");assert.equal(priorIndex.passed,true);for(const[p,h]of Object.entries(inputs()))assert.equal(h,prior.sourceHashes[p],"Changed proof/application inputs need fresh gates");
function run(program,args,seconds=30){const r=spawnSync(program,args,{encoding:"utf8",timeout:seconds*1000,maxBuffer:4*1024*1024});assert.ifError(r.error);process.stdout.write(r.stdout??"");process.stderr.write(r.stderr??"");assert.equal(r.status,0,program+" failed");}
if(mode==="prepare"){
  run(process.execPath,["tests/render-baseline-model.mjs"]);const bundle=resolve(directory,"browser/fixture.js");mkdirSync(dirname(bundle),{recursive:true});
  const built=await build({entryPoints:["bench/render-baseline-page.mjs"],bundle:true,format:"esm",outfile:bundle,minify:true,metafile:true,target:"es2022"});
  const dependencies=Object.fromEntries(Object.keys(built.metafile.inputs).map(p=>[p,hash(p)]));
  writeFileSync(resolve(directory,"compile.json"),JSON.stringify({passed:true,bundle,bundleSha256:hash(bundle),dependencies,sourceHashes,unchangedProofEvidence:"docs/verification/next-plan/U04/u04-deadline-v1/index.json",productionChanged:false})+"\n",{flag:"wx"});process.exit();
}
const compile=read(resolve(directory,"compile.json"));assert.equal(compile.passed,true);assert.equal(hash(compile.bundle),compile.bundleSha256);for(const[p,h]of Object.entries(compile.dependencies))assert.equal(hash(p),h);
if(mode==="measure"){
  const nonce=randomBytes(24).toString("hex"),bundle=readFileSync(compile.bundle),html='<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="rubend-run" content="'+nonce+'"><title>Rubend rendering baseline</title><style>body{margin:20px;background:#ede9de;color:#17231c;font:16px system-ui}button{padding:10px}#scene{width:'+spec.hostWidth+'px;height:'+spec.hostHeight+'px}#fallback{color:#932b20}#result{white-space:pre-wrap;max-height:160px;overflow:auto}</style></head><body><h1>Rubend rendering baseline</h1><button id="run">Run fixed baseline</button><p id="status">Ready. No production changes.</p><p id="fallback" hidden>Renderer unavailable</p><div id="scene"></div><output id="result"></output><script type="module" src="/fixture.js"></script></body></html>';
  let origin,saved=false,accept,reject;const completed=new Promise((yes,no)=>{accept=yes;reject=no;});
  const server=createServer((req,res)=>{
    const same=req.headers.host===origin.host&&(!req.headers.origin||req.headers.origin===origin.origin);res.setHeader("Cache-Control","no-store");
    if(!same){res.writeHead(403);res.end();return;}
    if(req.method==="GET"&&["/","/fixture.js"].includes(req.url)){res.setHeader("Content-Type",req.url==="/"?"text/html; charset=utf-8":"text/javascript; charset=utf-8");res.end(req.url==="/"?html:bundle);return;}
    if(req.method!=="POST"||req.url!=="/result"){res.writeHead(404);res.end();return;}
    if(req.headers.origin!==origin.origin||req.headers["x-rubend-run"]!==nonce){res.writeHead(403);res.end();return;}
    if(saved){res.writeHead(409);res.end();return;}
    let bytes=0,chunks=[];req.on("data",chunk=>{bytes+=chunk.length;if(bytes>2*1024*1024){res.writeHead(413);res.end();req.destroy();}else chunks.push(chunk);});
    req.on("end",()=>{try{
      assert.ok(bytes<=2*1024*1024);const raw=JSON.parse(Buffer.concat(chunks).toString("utf8")),analysis=checkRenderBaseline(raw,spec);assert.equal(saved,false);saved=true;
      writeFileSync(resolve(directory,"observation.json"),JSON.stringify({...raw,...analysis,raw,bundleSha256:compile.bundleSha256,sourceHashes})+"\n",{flag:"wx"});res.once("finish",()=>accept(analysis));res.writeHead(200);res.end("saved");
    }catch(error){res.writeHead(400);res.end(String(error));reject(error);}});
  });
  await new Promise(done=>server.listen(0,"127.0.0.1",done));origin=new URL("http://127.0.0.1:"+server.address().port);
  const timer=setTimeout(()=>reject(Error("Browser evidence did not finish within180seconds")),180000);
  try{
    assert.equal((await fetch(origin,{headers:{Origin:"http://example.invalid"}})).status,403);
    assert.equal((await fetch(new URL("/result",origin),{method:"POST"})).status,403);
    assert.equal((await fetch(new URL("/missing",origin))).status,404);
    writeFileSync(resolve(directory,"ready.json"),JSON.stringify({origin:origin.origin,pid:process.pid,temporary:true,previewMustStayHidden:true,guardChecks:3,browserResourceLimitsEnforced:false})+"\n",{flag:"wx"});
    console.log(JSON.stringify({ready:true,origin:origin.origin,requiresHiddenBrowser:true}));const result=await completed;console.log(JSON.stringify(result));
  }finally{clearTimeout(timer);server.closeAllConnections();await new Promise(done=>server.close(done));}
}
if(mode==="confirm"){
  const observation=read(resolve(directory,"observation.json"));assert.equal(observation.passed,true);assert.equal(observation.bundleSha256,compile.bundleSha256);const checked=checkRenderBaseline(observation.raw,spec);assert.equal(checked.disposition,observation.disposition);run(process.execPath,["tests/render-baseline-model.mjs"]);
  writeFileSync(resolve(directory,"confirmation.json"),JSON.stringify({passed:true,disposition:observation.disposition,existingProofEvidenceReused:true,unchangedLawInputs:true,productionChanged:false,fullApplicationVerified:false,performanceAcceptance:false,newDomainLaw:false,releaseHoldoutOpened:false,independentReview:false})+"\n",{flag:"wx"});
}
for(const[p,h]of Object.entries(sourceHashes))assert.equal(hash(p),h);
