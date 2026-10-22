import assert from "node:assert/strict";
import {summarizeCost,costSpec} from "../bench/axis-search-cost.mjs";

const rows=Array.from({length:5},(_,round)=>["a","b"].flatMap(side=>Array.from({length:4},(_,id)=>({round,side,id,nativeMs:100,nodes:1000,result:{id,nodes:1000}})))).flat();
assert.equal(summarizeCost(rows).withinFivePercent,true);
const noisy=structuredClone(rows);noisy.find(r=>r.round===3&&r.side==="b").nativeMs=200;assert.equal(summarizeCost(noisy).withinFivePercent,false);
const short=rows.map(r=>({...r,nativeMs:1}));assert.equal(summarizeCost(short).allCohortsAtLeast100ms,false);
const wrong=structuredClone(rows);wrong[0].result.nodes++;assert.throws(()=>summarizeCost(wrong));
assert.throws(()=>summarizeCost(rows.slice(1)));
const missing=structuredClone(rows);missing[0].side="missing";assert.throws(()=>summarizeCost(missing));
assert.equal(costSpec().fuel,1000000);const spec=costSpec("bench/axis-search-confirm-v1.json");assert.equal(spec.split,"development");assert.equal(spec.fuel,5000000);assert.equal(spec.profileFuel,20000000);
console.log(JSON.stringify({passed:true,costControls:5,specChecks:true}));
