import assert from "node:assert/strict";
import {resolve} from "node:path";
import {pathToFileURL} from "node:url";
import {array,list} from "../apps/model.mjs";
import {randomSource} from "./support.mjs";

assert.equal(process.argv.length,3);const Q=(await import(pathToFileURL(resolve(process.argv[2])))).default,random=randomSource("rubend-u04-seed-certificate-v1"),inverse=m=>Math.floor(m/3)*3+2-m%3;let accepted=0,rejected=0;
for(let i=0;i<128;i++){const scramble=Array.from({length:1+i%20},()=>random(18)),solution=scramble.map(inverse);for(const exact of[0,1]){const good=array(Q.test_candidate(list(scramble),list(solution),exact));assert.equal(good[0],solution.length);assert.equal(good[1],0);assert.equal(good[3],exact?1:0);assert.equal(good[4],1);assert.equal(good[5],0);assert.equal(good[6],123);assert.deepEqual(good.slice(9),solution);accepted++;}}
for(const scramble of[[0],[0,3],[6,9,12]])for(const exact of[0,1]){const bad=array(Q.test_candidate(list(scramble),list([]),exact));assert.deepEqual(bad.slice(0,8),[31,0,4,exact?2:0,0,1,123,0]);rejected++;}
const seeded=array(Q.test_seed(list([0,3]),list([2,5])));assert.deepEqual(seeded.slice(0,9),[2,0,0,1,1,0,123,456,2]);assert.deepEqual(seeded.slice(9),[2,5]);console.log(JSON.stringify({passed:true,certifiedAdmissions:accepted,invalidCandidatesRejected:rejected,childLowerIgnored:true,workCountersPreserved:true,exactTaskCreatedFromSeededFirstAnswer:true}));
