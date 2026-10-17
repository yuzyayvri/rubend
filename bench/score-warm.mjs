import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {gunzipSync} from "node:zlib";
import {createHash} from "node:crypto";
import {scorecard,compareScorecards} from "./scorecard.mjs";

assert.equal(process.argv.length,3,"Expected resource-record path");
const path=process.argv[2],bytes=readFileSync(path),resource=JSON.parse((path.endsWith(".gz")?gunzipSync(bytes):bytes).toString("utf8"));
assert.equal(resource.exitCode,0);assert.equal(resource.stoppedFor,null);
const data=JSON.parse(resource.stdout);
assert.equal(data.passed,true);assert.equal(data.counts.errors,0);
const ids=data.config.profiles.map(p=>p.id);
assert.equal(ids.length,2);assert.notEqual(ids[0],ids[1]);
const hash=x=>createHash("sha256").update(x).digest("hex");
const report={format:"rubend-warm-scorecard-v1",inputSha256:hash(bytes),sourceHashes:Object.fromEntries(["score-warm.mjs","scorecard.mjs"].map(name=>[name,hash(readFileSync(new URL(name,import.meta.url)))])),groups:{}};
for(const group of ["fast","exact","superflip"]){
  const jobs=data.rounds.flatMap((round,index)=>{assert.equal(round.status,"ok");return round.jobs.filter(j=>j.group===group).map(j=>({...j,id:index+":"+j.id}));});
  const before=jobs.filter(j=>j.profile===ids[0]),after=jobs.filter(j=>j.profile===ids[1]);
  const cases=before.map(j=>({id:j.id,facelets:j.facelets}));
  const budget=before[0]?.budgetMs;assert.ok(budget);
  assert.ok(jobs.every(j=>j.budgetMs===budget));
  const baseline=scorecard(cases,before,{deadlines:[budget]}),candidate=scorecard(cases,after,{deadlines:[budget]});
  const summary=card=>card.observations.map(({cases,...rest})=>rest);
  report.groups[group]={profiles:{[ids[0]]:summary(baseline),[ids[1]]:summary(candidate)},comparison:compareScorecards(baseline,candidate)};
}
console.log(JSON.stringify(report,null,2));
