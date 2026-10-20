import assert from "node:assert/strict";
import {scorecard,compareScorecards} from "./scorecard.mjs";

export function analyzeAa(report){
  assert.equal(report.format,"rubend-warm-comparison-v1");assert.equal(report.passed,true);assert.deepEqual(report.errors,[]);
  assert.notEqual(report.conditions?.customEngineFactory,true,"Instrumented reports cannot clear the release A/A noise gate");
  const config=report.config,ids=config.profiles.map(p=>p.id);assert.equal(ids.length,2);assert.notEqual(ids[0],ids[1]);
  assert.deepEqual(...config.profiles.map(({id,...profile})=>profile),"A/A must use the same binary, data, and environment");
  assert.equal(config.iterations,5);assert.equal(report.rounds.length,5);assert.ok(report.rounds.every(r=>r.status==="ok"));
  const jobs=report.rounds.flatMap((r,index)=>r.jobs.map(j=>({...j,id:index+":"+j.id})));
  const expected=5*2*(Object.values(config.corpora).reduce((sum,c)=>sum+c.count,0)+1);
  assert.equal(jobs.length,expected);assert.equal(report.counts.successfulJobs,expected);assert.equal(report.counts.errors,0);
  assert.ok(jobs.every(j=>j.status==="ok"));
  const groups={};
  for(const group of["fast","exact","superflip"]){
    const rows=ids.map(id=>jobs.filter(j=>j.group===group&&j.profile===id)),count=5*(group==="superflip"?1:config.corpora[group].count);
    assert.ok(rows.every(r=>r.length===count));const cases=rows[0].map(j=>({id:j.id,facelets:j.facelets})),budget=rows[0][0].budgetMs;
    assert.ok(rows.flat().every(j=>j.budgetMs===budget));
    const cards=rows.map(r=>scorecard(cases,r,{deadlines:[budget]})),observations=cards.map(c=>c.observations[0]),comparison=compareScorecards(...cards)[0];
    const firstP95=observations.map(o=>o.p95FirstMs),resolutionLimited=firstP95.some(v=>v===null||v<20);
    const ratio=firstP95[0]>0&&firstP95[1]!==null?firstP95[1]/firstP95[0]:null;
    const deadlineTied=Object.entries(comparison.paired).every(([key,value])=>key==="ties"||value===0)&&observations[0].exact.completed===observations[1].exact.completed;
    const nativeDifferences=rows[0].filter(a=>{const b=rows[1].find(j=>j.id===a.id);assert.ok(b);return a.nativeDone.lower!==b.nativeDone.lower||a.nativeDone.length!==b.nativeDone.length||a.nativeDone.optimal!==b.nativeDone.optimal;}).length;
    const latencyWithinFloor=ratio!==null&&Math.abs(ratio-1)<=.05;
    groups[group]={cases:count,firstP95Ms:firstP95,ratio,resolutionLimited,latencyWithinFloor,deadlineTied,nativeDifferences,comparison,verdict:deadlineTied&&nativeDifferences===0&&latencyWithinFloor&&!resolutionLimited?"stable-on-this-sample":"inconclusive"};
  }
  return{format:"rubend-u00-aa-diagnostic-v1",functionalChecksPassed:true,groups,verdict:Object.values(groups).every(g=>g.verdict==="stable-on-this-sample")?"stable-on-this-sample":"inconclusive",clock:"Host event times rounded to one millisecond. Below 20 ms, five percent is less than one clock unit.",claim:"Noise diagnostic only. No performance gain, native CPU attribution, independent review, or U00 completion is claimed."};
}
