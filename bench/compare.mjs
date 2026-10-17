import assert from "node:assert/strict";
import {mkdirSync,writeFileSync,readFileSync} from "node:fs";
import {createHash} from "node:crypto";
import {performance} from "node:perf_hooks";
import {puzzles} from "cubing/puzzles";
import {KPattern} from "cubing/kpuzzle";
import {experimentalSolve3x3x3IgnoringCenters} from "cubing/search";
import {Engine} from "../apps/engine.mjs";
import {apply,solved,parse} from "../apps/model.mjs";
import {randomSource,randomCube,faceletsOf,patternData} from "../tests/support.mjs";
import {inputs,digest} from "../scripts/manifest.mjs";

const count=Number(process.env.CASES??12),budgetMs=Number(process.env.BUDGET_MS??1000);
assert.ok(Number.isInteger(count)&&count>=1&&count<=40);assert.ok(Number.isInteger(budgetMs)&&budgetMs>=50&&budgetMs<=1500);
const corpusName=process.env.CORPUS_SEED??"rubend-uniform-development-v1";
assert.ok(["rubend-uniform-development-v1","rubend-uniform-holdout-v1","rubend-uniform-release-smoke-v1"].includes(corpusName));
const random=randomSource(corpusName),corpus=Array.from({length:count},(_,id)=>{const cube=randomCube(random);return {id,cube,facelets:faceletsOf(cube)};});
const buildIdentity=JSON.parse(readFileSync("build/manifest.json","utf8"));
assert.deepEqual(inputs(),buildIdentity.sourceHashes,"Build is stale; run the build before benchmarking.");
assert.equal(digest(process.env.RUBEND_BINARY??"build/rubend"),buildIdentity.nativeSha256,"Native binary differs from the build manifest.");
const kpuzzle=await puzzles["3x3x3"].kpuzzle(),engine=new Engine(),records=[];
try{
  await engine.ready();
  for(const item of corpus){
    const start=performance.now(),alg=await experimentalSolve3x3x3IgnoringCenters(new KPattern(kpuzzle,patternData(item.cube))),referenceMs=performance.now()-start;
    const referenceMoves=parse(alg.toString());assert.equal(apply(item.facelets,referenceMoves),solved);
    const events=[];
    await new Promise(async(resolve,reject)=>{try{await engine.solve({facelets:item.facelets,mode:"fast",budgetMs},event=>{events.push(event);if(event.type==="error")reject(Error(event.message));if(event.type==="done")resolve();});}catch(e){reject(e);}});
    const answers=events.filter(e=>e.type==="candidate"),last=answers.at(-1);
    if(last)assert.equal(apply(item.facelets,last.moves),solved);
    records.push({id:item.id,facelets:item.facelets,rubend:{budgetMs,firstMs:answers[0]?.elapsedMs??null,firstLength:answers[0]?.length??null,firstMoves:answers[0]?.moves??null,length:last?.length??null,moves:last?.moves??null,nodes:events.at(-1).nodes??events.filter(e=>e.type==="progress").at(-1)?.nodes??0},reference:{implementation:"cubing@0.66.0 bundled 3x3 solver",elapsedMs:referenceMs,length:referenceMoves.length,moves:referenceMoves}});
    console.log(JSON.stringify({case:item.id,rubendLength:last?.length??null,firstMs:answers[0]?.elapsedMs??null,referenceLength:referenceMoves.length,referenceMs:Math.round(referenceMs)}));
  }
  assert.deepEqual(inputs(),buildIdentity.sourceHashes,"Sources changed during the benchmark; discard this run.");
  assert.equal(digest(process.env.RUBEND_BINARY??"build/rubend"),buildIdentity.nativeSha256,"Native binary changed during the benchmark.");
  const valid=records.filter(r=>r.rubend.length!==null),times=valid.map(r=>r.rubend.firstMs).sort((a,b)=>a-b);
  const summary={cases:count,solved:valid.length,budgetMs,meanRubendFirstLength:valid.reduce((s,r)=>s+r.rubend.firstLength,0)/valid.length,meanRubendLength:valid.reduce((s,r)=>s+r.rubend.length,0)/valid.length,meanReferenceLength:records.reduce((s,r)=>s+r.reference.length,0)/count,p95FirstMs:times[Math.ceil(.95*times.length)-1]??null};
  const result={checkedAt:new Date().toISOString(),corpus:corpusName,sampling:"Fisher–Yates permutations and orientation constraints, rejection-sampled SHA256-counter draws",comparisonLimit:"The reference returns one solution, not a matched fixed-budget anytime curve. Reference initialization is included in its first run. Neither solver is an optimality oracle here.",buildIdentity,summary,records};
  mkdirSync("build/evidence",{recursive:true});writeFileSync(`build/evidence/compare-${corpusName}-${count}-${budgetMs}.json`,JSON.stringify(result,null,2));console.log(JSON.stringify(summary));
}finally{await engine.close();}
