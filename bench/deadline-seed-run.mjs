import assert from "node:assert/strict";
import {readFileSync,writeFileSync,createReadStream,statSync} from "node:fs";
import {resolve} from "node:path";
import {createHash} from "node:crypto";
import {spawnSync} from "node:child_process";
import {loadCorpus} from "./corpus.mjs";
import {apply,solved} from "./fixed-work-model.mjs";
import {scoreDeadlineRecords,summarizeDeadlineScores} from "./deadline-seed-model.mjs";
import {withArtifactLease} from "../scripts/artifact-lease.mjs";

withArtifactLease();assert.equal(process.argv.length,4);
const binary=resolve(process.argv[2]),output=resolve(process.argv[3]),spec=JSON.parse(readFileSync("bench/deadline-seed-spec.json","utf8")),hash=p=>createHash("sha256").update(readFileSync(p)).digest("hex"),binarySha256=hash(binary);
assert.equal(spec.format,"rubend-deadline-seed-spec-v1");assert.equal(spec.candidateSeed,3);assert.equal(spec.controlSeed,18);assert.deepEqual(spec.budgetsMs,[100,1000]);assert.equal(spec.cohorts,5);assert.equal(spec.confirmationOffset,520);assert.equal(spec.confirmationCases,8);assert.deepEqual(spec.diagnosticOffsets,[512,518]);assert.equal(spec.aaCopies,2);assert.equal(spec.warmupBudgetMs,25);assert.equal(spec.promotion,false);
const corpus=loadCorpus("development"),confirmation=corpus.slice(520,528),diagnostic=[corpus[512],corpus[518]],cases=[];
function add(root,kind,budgetMs,cohort,arm){const baseId=root.id+"/"+budgetMs,id=[kind,root.id,budgetMs,cohort,arm].join("-");cases.push({...root,id,baseId,kind,budgetMs,cohort,arm,seed:kind==="aa"?18:arm===1?3:18});}
for(const root of[{id:"solved",facelets:solved,depth:0},{id:"one-turn",facelets:apply(solved,[0]),depth:1}])for(const arm of[0,1])add(root,"warmup",25,0,arm);
for(const root of confirmation)for(const budget of spec.budgetsMs)for(const arm of[0,1])add(root,"aa",budget,0,arm);
for(let cohort=0;cohort<5;cohort++)for(const[kind,roots]of[["confirmation",confirmation],["diagnostic",diagnostic]])for(const root of roots)for(const budget of spec.budgetsMs)for(const arm of(cohort%2?[1,0]:[0,1]))add(root,kind,budget,cohort,arm);
assert.equal(cases.length,236);assert.equal(new Set(cases.map(c=>c.id)).size,cases.length);
const cache=resolve(".cache/joint/phase1-v1.raw"),cacheSha256="2ccfd40fdc0cf4769c58d9646f6b0ea787571ce5200b5d124c8f17dcc70f73b5",identity=()=>{const s=statSync(cache,{bigint:true});return["dev","ino","size","mtimeNs","ctimeNs"].map(k=>String(s[k]));},before=identity();
async function seal(){const h=createHash("sha256");for await(const chunk of createReadStream(cache))h.update(chunk);assert.equal(h.digest("hex"),cacheSha256);assert.deepEqual(identity(),before);}
await seal();
const requestPath=output+".tsv";writeFileSync(requestPath,cases.map(c=>[c.id,c.facelets,c.seed,c.budgetMs].join("\t")).join("\n")+"\n",{flag:"wx"});assert.ok(statSync(requestPath).size<65536);
const result={passed:false,format:"rubend-deadline-seed-observation-v1",spec,binarySha256,cacheSha256,cases,errors:[],rawRecords:[],initialSetupCharged:true,availabilityAfterCertificate:true,integerNativeClockMs:1,tableLoadExcluded:true,cpuSpeedupMeasured:false,perArmPeakMemoryMeasured:false,applicationLatencyMeasured:false,performanceAcceptance:false,productIntegrated:false,releaseHoldoutOpened:false,independentReview:false};
try{
  const run=spawnSync(binary,["--threads","1","--gpu","off",requestPath],{env:{...process.env,RUBEND_JOINT_CACHE:cache},encoding:"utf8",timeout:260000,maxBuffer:32*1024*1024});
  result.nativeExit={status:run.status,signal:run.signal,error:run.error?String(run.error):null,stderr:run.stderr};
  result.rawRecords=(run.stdout??"").trim().split("\n").filter(Boolean).map(s=>JSON.parse(s));
  assert.ifError(run.error);assert.equal(run.status,0,run.stderr);assert.equal(run.signal,null);assert.equal(hash(binary),binarySha256);
  const analysis=scoreDeadlineRecords(result.rawRecords,cases),scored=summarizeDeadlineScores(analysis,spec);
  Object.assign(result,analysis,scored,{passed:true});
}catch(error){result.errors.push(String(error.stack??error));}
finally{
  try{await seal();assert.equal(hash(binary),binarySha256);}catch(error){result.passed=false;result.errors.push(String(error.stack??error));}
  writeFileSync(output,JSON.stringify(result)+"\n",{flag:"wx"});
}
console.log(JSON.stringify({passed:result.passed,errors:result.errors,requests:cases.length,replays:result.replays,workSteps:result.workSteps,seedSteps:result.seedSteps,lateCandidates:result.lateCandidates,disposition:result.disposition,confirmationWins:result.confirmation?.wins,confirmationLosses:result.confirmation?.losses,repeatableWins:result.confirmation?.repeatableWins,latencyByBudget:result.latencyByBudget,performanceAcceptance:false}));
if(!result.passed)process.exitCode=1;
