import assert from "node:assert/strict";
import {writeFileSync} from "node:fs";
import {resolve} from "node:path";
import {solved} from "../apps/model.mjs";
import {runColdCase} from "../bench/cold-run.mjs";

assert.equal(process.argv.length,3);const item={id:"fixture-solved",facelets:solved,scramble:[]},rows=[];
for(const[fixtureMode,budgetMs]of[["partial",1500],["late",150],["hang",150],["malformed",1500],["wrong-job",1500],["unterminated",1500]])rows.push(await runColdCase({solver:"fixture",item,budgetMs,fixtureMode,stopGraceMs:150}));
let passed=false;try{assert.equal(rows[0].status,"timeout");assert.equal(rows[0].coverageByDeadline,true);assert.equal(rows[0].retainedAnswer.length,0);assert.equal(rows[0].forced,false);assert.equal(rows[1].status,"timeout");assert.equal(rows[1].coverageByDeadline,false);assert.equal(rows[1].retainedAnswer.length,0);assert.ok(rows[1].retainedAnswer.atMs>rows[1].budgetMs);assert.equal(rows[1].forced,false);assert.equal(rows[2].status,"timeout");assert.equal(rows[2].forced,true);for(const row of rows.slice(3,5)){assert.equal(row.status,"error");assert.equal(row.coverageByDeadline,false);assert.equal(row.childClosed,true);}assert.equal(rows[5].status,"ok");assert.equal(rows[5].coverageByDeadline,true);assert.equal(rows[5].forced,false);assert.ok(rows.every(r=>r.lifecycle==="closed"));passed=true;}finally{writeFileSync(resolve(process.argv[2]),JSON.stringify({passed,format:"rubend-cold-lifecycle-controls-v1",rows,partialRetained:passed,lateNotCredited:passed,malformedAndWrongJobRejected:passed,forcedDeadlineBounded:passed,performanceAcceptance:false},null,2)+"\n",{flag:"wx"});}console.log(JSON.stringify({passed,processControls:rows.length,performanceAcceptance:false}));
