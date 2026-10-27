import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import P from "../build/joint-pipeline-diagnostic.mjs";

const source=readFileSync("src/search.bend","utf8"),adapter=readFileSync("bench/joint-pipeline-diagnostic.bend","utf8"),guard=adapter.match(/  S\.root_allowed\(previous, face\).*\n/)[0].trim().replace("S.root_allowed","root_allowed");assert.ok(source.includes("child("+guard+", table,"),"Diagnostic predecessor rule drifted from Search.enumerate");
assert.equal(P.allowed(0,0),false);assert.equal(P.allowed(0,9),true);assert.equal(P.allowed(3,0),false);assert.equal(P.allowed(6,0),true);assert.equal(P.allowed(7,6),false);assert.equal(P.allowed(7,3),true);
assert.equal(P.cut_stage(1,1,1,1,1,1,1),0);for(let stage=1;stage<=6;stage++){const h=[0,0,0,0,0,0];h[stage-1]=2;assert.equal(P.cut_stage(1,...h),stage);h.fill(2,stage);assert.equal(P.cut_stage(1,...h),stage);}
const good=P.cut_stage(1,1,0,0,0,0,0),wrong=[1,0,0,0,0,0].findIndex(h=>h>=1)+1;assert.equal(good,0);assert.equal(wrong,1);assert.equal(P.proposed_forward_exclusion(0,0,0,0),false);assert.equal(P.proposed_inverse_exclusion(0,0,0,0),false);assert.equal(P.proposed_forward_exclusion(2,2,2,2),true);assert.equal(P.proposed_inverse_exclusion(2,2,2,2),true);
console.log(JSON.stringify({passed:true,predecessorSourceFence:true,allSixCutStages:true,tightBoundsPass:true,offByOneCounterexample:{correct:good,wrong},zeroGuard:true}));
