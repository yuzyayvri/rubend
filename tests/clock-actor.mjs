import assert from "node:assert/strict";
import {resolve} from "node:path";
import {writeFileSync} from "node:fs";
import {ComparisonActor} from "../bench/comparison-actor.mjs";
import {apply,solved} from "../bench/fixed-work-model.mjs";

const rows=[],sessions=[],checks=[],config=mode=>({id:"fixture",kind:"fixture",backend:"cubing-min2phase",canProve:false,program:process.execPath,args:[resolve("bench/clock-actor-fixture.mjs")],fixtureMode:mode,evidenceKind:"fixture",startupTimeoutMs:250}),request={caseId:"known-U",facelets:apply(solved,[0]),budgetMs:100,mode:"fast"};
async function warm(mode,expect){const actor=new ComparisonActor(config(mode));try{await actor.start();const row=await actor.request(request);rows.push({mode,...row});await expect(row,actor);checks.push(mode);}finally{const s=await actor.close();sessions.push({mode,...s});assert.ok(s.settlement.complete);}}
await warm("normal",r=>{assert.equal(r.status,"ok");assert.equal(r.candidates.length,1);assert.equal(r.proof,null);assert.ok(r.candidates[0].atMs<=r.budgetMs);});
await warm("incumbent-timeout",r=>{assert.equal(r.status,"timeout");assert.equal(r.candidates.length,1);assert.ok(r.candidates[0].atMs<r.budgetMs);assert.ok(r.finishedMs>=r.budgetMs);});
await warm("late",r=>{assert.equal(r.status,"timeout");assert.ok(r.candidates[0].atMs>r.budgetMs);});
await warm("split-frame",r=>{assert.equal(r.status,"timeout");assert.ok(r.candidates[0].atMs>r.budgetMs,"Only the complete frame arrival may receive answer credit");});
await warm("hang",r=>{assert.equal(r.status,"timeout");assert.equal(r.candidates.length,0);});
await warm("watchdog",r=>{assert.equal(r.status,"error");assert.match(r.error,/watchdog/);});
for(const mode of["bad-id","fake-proof","bad-moves","bad-json","crash"])await warm(mode,r=>{assert.equal(r.status,"error");assert.equal(r.proof,null);});
for(const mode of["no-ready","bad-ready"]){const actor=new ComparisonActor(config(mode));try{await assert.rejects(actor.start());checks.push(mode);}finally{sessions.push({mode,...await actor.close()});}}
{const actor=new ComparisonActor(config("no-ready"));const row=await actor.coldRequest(request);rows.push({mode:"cold-init-censored",...row});assert.equal(row.status,"timeout");assert.equal(row.initializationMs,null);assert.ok(row.finishedMs>=row.budgetMs&&row.finishedMs<1500);assert.equal(row.candidates.length,0);checks.push("cold-init-censored");sessions.push({mode:"cold-init-censored",...await actor.close()});}
{const actor=new ComparisonActor(config("normal"));try{await actor.start();await assert.rejects(actor.request({...request,budgetMs:0}));const first=await actor.request(request),second=await actor.request(request);assert.equal(second.requestId,first.requestId+1);assert.equal(first.sessionId,second.sessionId);checks.push("invalid-budget-and-sequential-recovery");}finally{sessions.push({mode:"sequential",...await actor.close()});}}
{const actor=new ComparisonActor(config("restart"));try{await actor.start();const first=await actor.request(request),second=await actor.request(request);assert.equal(first.status,"timeout");assert.equal(second.status,"timeout");assert.equal(second.sessionId,first.sessionId+1);assert.equal(second.requestId,first.requestId+1);checks.push("cancelled-worker-restart");}finally{sessions.push({mode:"restart",...await actor.close()});}}
const report={passed:true,checks,rows,sessions,releaseHoldoutOpened:false,scoredTimings:false};if(process.argv[2])writeFileSync(process.argv[2],JSON.stringify(report,null,2)+"\n",{flag:"wx"});console.log(JSON.stringify({passed:true,checks:checks.length,rows:rows.length,scoredTimings:false}));
