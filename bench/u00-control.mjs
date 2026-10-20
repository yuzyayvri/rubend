import assert from "node:assert/strict";
import {readFileSync,writeFileSync,mkdirSync,copyFileSync,cpSync,existsSync} from "node:fs";
import {createHash} from "node:crypto";
import {resolve} from "node:path";
import {spawnSync} from "node:child_process";
import {gunzipSync} from "node:zlib";
import {inputs} from "../scripts/manifest.mjs";
import {saveSourceSnapshot} from "./source-snapshot.mjs";
import {compareWarm} from "./warm-compare.mjs";
import {analyzeAa} from "./u00-aa.mjs";

const [mode,path]=process.argv.slice(2);assert.ok(["freeze","small-aa","raw-aa"].includes(mode));assert.equal(process.argv.length,4);
const spec=JSON.parse(readFileSync(path,"utf8")),directory=resolve(spec.directory);assert.ok(directory.startsWith(resolve("build/experiments")+"/"));
const hash=path=>createHash("sha256").update(readFileSync(path)).digest("hex"),save=(path,data)=>writeFileSync(path,JSON.stringify(data,null,2)+"\n",{flag:"wx"});
function run(program,args){const r=spawnSync(program,args,{encoding:"utf8",timeout:300000,maxBuffer:8*1024*1024});if(r.stdout)process.stdout.write(r.stdout);if(r.stderr)process.stderr.write(r.stderr);assert.ifError(r.error);assert.equal(r.status,0,program+" failed");return r.stdout;}
function inspectFrozen(relative){
  const binary=resolve(spec.historicalRoot,relative),metadataPath=binary+".json";
  if(!existsSync(binary)||!existsSync(metadataPath))return{binary,available:false};
  const metadata=JSON.parse(readFileSync(metadataPath,"utf8"));assert.equal(hash(binary),metadata.binarySha256);
  const snapshot=metadata.sourceSnapshot??".cache/experiment-sources/"+metadata.binarySha256;
  assert.ok(snapshot.startsWith(".cache/experiment-sources/")&&!snapshot.split("/").includes(".."));
  for(const [name,expected]of Object.entries(metadata.sourceHashes)){assert.ok(!name.startsWith("/")&&!name.split("/").includes(".."));assert.equal(hash(resolve(spec.historicalRoot,snapshot,name)),expected,"Frozen source changed: "+name);}
  const currentDifferences=Object.entries(metadata.sourceHashes).filter(([name,expected])=>!existsSync(name)||hash(name)!==expected).map(([name])=>name);
  return{binary,available:true,entry:metadata.entry,binarySha256:metadata.binarySha256,metadataSha256:hash(metadataPath),sourceSnapshot:snapshot,sourceIntegrity:true,currentDifferences};
}
const before=inputs();
if(mode==="freeze"){
  run(process.execPath,["scripts/build.mjs"]);run("just",["check"]);
  for(const test of["u00-aa","scorecard","score-warm-report","resource-policy","engine-lifecycle"])run(process.execPath,["tests/"+test+".mjs"]);
  assert.deepEqual(inputs(),before);const manifest=JSON.parse(readFileSync("build/manifest.json","utf8"));assert.deepEqual(manifest.sourceHashes,before);assert.equal(hash("build/rubend"),manifest.nativeSha256);
  const stage=resolve(directory,"control");assert.equal(existsSync(stage),false);mkdirSync(resolve(stage,"build"),{recursive:true});
  cpSync("apps",resolve(stage,"apps"),{recursive:true,errorOnExist:true,force:false});cpSync("build/web",resolve(stage,"build/web"),{recursive:true,errorOnExist:true,force:false});
  for(const name of["rubend","manifest.json",...Object.keys(manifest.artifacts)])copyFileSync(resolve("build",name),resolve(stage,"build",name));
  const sourceHashes={...before};for(const name of["bench/u00-control.mjs","bench/u00-aa.mjs","bench/warm-compare.mjs","bench/startup-measure.mjs","bench/scorecard.mjs","justfile"])sourceHashes[name]=hash(name);
  const snapshot=saveSourceSnapshot(manifest.nativeSha256,sourceHashes,Object.fromEntries(Object.keys(sourceHashes).map(name=>[name,readFileSync(name,"utf8")])));
  const smallBinary=resolve(stage,"build/rubend"),metadata={format:"rubend-u00-integration-control-v1",entry:"src/main.bend",profile:"Light",binarySha256:manifest.nativeSha256,sourceHashes,...snapshot,revision:spec.revision};save(smallBinary+".json",metadata);
  const corpus=JSON.parse(readFileSync("bench/corpora/manifest.json","utf8"));for(const c of corpus.corpora)assert.equal(hash("bench/corpora/"+c.file),c.sha256);
  const history=JSON.parse(gunzipSync(readFileSync("docs/verification/signing-history-v1/history.json.gz")));
  const inventory=spec.historicalControls.map(inspectFrozen);const raw=inventory.find(c=>c.binary===resolve(spec.historicalRoot,"build/experiments/r06-raw-v5"));assert.ok(raw?.available);assert.equal(raw.entry,"bench/advanced-main.bend");assert.deepEqual(raw.currentDifferences,[],"The raw control must match the current Bend source graph");
  const sourceQuality=JSON.parse(readFileSync(spec.qualityConfig,"utf8"));assert.equal(sourceQuality.iterations,5);
  const corpora={};for(const [group,c]of Object.entries(sourceQuality.corpora)){assert.ok(existsSync(c.path));const target=resolve(stage,group+".json");copyFileSync(c.path,target);corpora[group]={...c,path:target};}
  const common={iterations:5,readyTimeoutMs:120000,rssSampleMs:100,shutdownTimeoutMs:1000,corpora};
  const generated={binary:smallBinary,buildMetadata:smallBinary+".json",tableSource:"generated",env:{}};
  const cached={binary:raw.binary,buildMetadata:raw.binary+".json",cache:sourceQuality.profiles[1].cache,cacheSha256:sourceQuality.profiles[1].cacheSha256,cacheBytes:sourceQuality.profiles[1].cacheBytes,env:{RUBEND_JOINT_CACHE:sourceQuality.profiles[1].cache}};
  for(const [name,profile]of[["small",generated],["raw",cached]])save(resolve(stage,name+"-aa-config.json"),{...common,profiles:[{id:"control-a",...profile},{id:"control-b",...profile}]});
  save(resolve(directory,"inventory.json"),{format:"rubend-u00-control-inventory-v1",revision:spec.revision,currentDefault:{profile:"Light",binary:smallBinary,metadata:snapshot,binarySha256:manifest.nativeSha256},rawAaControl:{profile:"RawJoint",binary:raw.binary,entry:raw.entry,notInverseThree:true},historical:inventory,historicalMappings:history.commits.length,corpora:corpus.corpora.map(c=>({name:c.name,count:c.count,sha256:c.sha256,evaluated:false})),releaseHoldoutEvaluated:false,sourceHashes:before});
  console.log(JSON.stringify({passed:true,frozen:smallBinary,historicalControls:inventory.length,noLargeTableGenerated:true}));
}else{
  for(const name of["RUBEND_JOINT_CACHE","RUBEND_CORNER_CACHE","RUBEND_H0_CACHE","RUBEND_H0_META_CACHE","RUBEND_CORNER_POLICY","RUBEND_H0_POLICY","RUBEND_SEGMENTED_POLICY"])delete process.env[name];
  const kind=mode==="small-aa"?"small":"raw",configPath=resolve(directory,"control",kind+"-aa-config.json");
  const report=await compareWarm(JSON.parse(readFileSync(configPath,"utf8")),configPath);save(resolve(directory,kind+"-aa-report.json"),report);assert.equal(report.passed,true,JSON.stringify(report.errors));
  const diagnostic=analyzeAa(report);save(resolve(directory,kind+"-aa-diagnostic.json"),diagnostic);
  if(kind==="raw")assert.equal(inspectFrozen("build/experiments/r06-raw-v5").sourceIntegrity,true);
  assert.deepEqual(inputs(),before);console.log(JSON.stringify({passed:true,kind,successfulJobs:report.counts.successfulJobs,noiseVerdict:diagnostic.verdict,claim:diagnostic.claim}));
}
