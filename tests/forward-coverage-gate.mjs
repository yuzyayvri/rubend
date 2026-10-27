import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {resolve} from "node:path";
import {pathToFileURL} from "node:url";

assert.equal(process.argv.length,3);const X=(await import(pathToFileURL(resolve(process.argv[2])))).default;let triples=0,scopeCases=0;
for(let r=0;r<15;r++)for(let a=0;a<16;a++)for(let b=0;b<16;b++)for(let c=0;c<16;c++){const expected=Number(c<=r&&!(r>0&&a===r&&b===r&&c===r)),actual=X.coverage_probe(2,3,r,a,b,c);assert.equal(actual,expected,JSON.stringify({r,a,b,c,actual,expected}));triples++;}
for(let phase=0;phase<3;phase++)for(let profile=0;profile<5;profile++)for(let r=0;r<16;r++){const actual=X.coverage_probe(phase,profile,r,r,r,r),expected=Number(!(phase===2&&profile===3&&r>0&&r<15));assert.equal(actual,expected,JSON.stringify({phase,profile,r,actual,expected}));scopeCases++;}
const rows=JSON.parse(readFileSync("build/experiments/u02-inference-information-v1/query-results.json","utf8")).rows;let cuts=0;for(const row of rows){const actual=X.coverage_probe(2,3,row.radius,...row.forward),expected=Number(!row.information.hypotheticalWholeEntryCut);assert.equal(actual,expected);cuts+=1-actual;}assert.equal(rows.length,52584);assert.equal(cuts,13213);console.log(JSON.stringify({passed:true,classifierTriples:triples,scopeCases,actualSavedEntries:rows.length,forwardCuts:cuts,actualGeneratedGateChecked:true,performanceAcceptance:false}));
