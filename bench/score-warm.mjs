import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {gunzipSync} from "node:zlib";
import {createHash} from "node:crypto";
import {scorecard,compareScorecards} from "./scorecard.mjs";

const direct=process.argv.length===4&&process.argv[2]==="--report";
assert.ok(process.argv.length===3||direct,"Expected resource record, or --report complete-warm-report");
const path=process.argv[direct?3:2],bytes=readFileSync(path),input=JSON.parse((path.endsWith(".gz")?gunzipSync(bytes):bytes).toString("utf8"));
if(!direct){assert.equal(input.exitCode,0);assert.equal(input.stoppedFor,null);}
const data=direct?input:JSON.parse(input.stdout);
assert.equal(data.format,"rubend-warm-comparison-v1");
assert.equal(data.passed,true);assert.equal(data.counts.errors,0);
const ids=data.config.profiles.map(p=>p.id);
assert.equal(ids.length,2);assert.notEqual(ids[0],ids[1]);
const hash=x=>createHash("sha256").update(x).digest("hex");
const report={format:"rubend-warm-scorecard-v1",inputSha256:hash(bytes),resourceValidation:direct?"Complete warm report only. Inspect its separate resource receipt; no resource enforcement claim is made by this mode.":"Input resource receipt passed exit and stop checks.",sourceHashes:Object.fromEntries(["score-warm.mjs","scorecard.mjs"].map(name=>[name,hash(readFileSync(new URL(name,import.meta.url)))])),groups:{}};
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
