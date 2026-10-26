import assert from "node:assert/strict";

const policies={measure:{repetitions:512,timeoutMs:40000},profile:{repetitions:128,timeoutMs:90000},sizing:{repetitions:64,timeoutMs:40000}};
export function forwardCostWorkload(mode,input){assert.ok(Object.hasOwn(policies,mode));assert.equal(input.format,"rubend-forward-cost-input-v2");assert.ok(Array.isArray(input.cases));assert.equal(input.cases.length,8);assert.equal(input.repetitions,512);assert.equal(input.profileRepetitions,128);assert.equal(input.sizingRepetitions,64);const p=policies[mode];return{mode,...p,requests:p.repetitions*input.cases.length};}
