import assert from "node:assert/strict";
import {faceletsToNissy} from "../bench/facelets-nissy.mjs";
import {apply,solved} from "../bench/fixed-work-model.mjs";

assert.equal(faceletsToNissy(solved),"ABCDEFGH=ABCDEFGHIJKL=A");assert.equal(faceletsToNissy(apply(solved,[3])),"WBCVEILH=ABCDIFGLHJKE=A");for(let m=0;m<18;m++)assert.match(faceletsToNissy(apply(solved,[m])),/^[A-Za-f]{8}=[A-Za-f]{12}=A$/);for(const f of["",solved.slice(1),"U".repeat(54)])assert.throws(()=>faceletsToNissy(f));console.log(JSON.stringify({passed:true,solvedAndPinnedRConstant:true,faceTurns:18,malformedRejected:3,nativeFullConventionProbePending:true}));
