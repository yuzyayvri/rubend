import assert from "node:assert/strict";
import {solveRecord} from "../apps/export.mjs";
import {apply,solved} from "../apps/model.mjs";

const solution={origin:apply(solved,[3,0,5,2]),moves:[0,3,2,5],lower:4,optimal:true};
const record=solveRecord(solution,{mode:"exact",budgetMs:1000});
assert.equal(record.htm,4);assert.deepEqual(record.moves,["U","R","U'","R'"]);assert.equal(record.searchOptimal,true);assert.equal(record.replayCertified,true);
assert.deepEqual(JSON.parse(JSON.stringify(record)),record);
assert.throws(()=>solveRecord({...solution,moves:[0]}),/unverified/);
assert.throws(()=>solveRecord({...solution,lower:3}),/bound mismatch/);
assert.throws(()=>solveRecord({...solution,lower:5}),/Invalid solution bound/);
console.log("Export: validated solution records and rejection of false claims passed.");
