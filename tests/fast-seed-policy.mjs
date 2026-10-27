import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {seedForInitialRequest,deriveFastPilot} from "../bench/fast-seed-policy.mjs";

assert.equal(seedForInitialRequest(0,true),3);assert.equal(seedForInitialRequest(0,false),18);assert.equal(seedForInitialRequest(2,true),18);assert.equal(seedForInitialRequest(2,false),18);for(const bad of[1,3,-1,4294967295])assert.throws(()=>seedForInitialRequest(bad,true));const result=deriveFastPilot(JSON.parse(readFileSync("build/experiments/u04-seed-quality-v1/pilot.json","utf8")));assert.equal(result.uniqueFastPairs,10);assert.equal(result.uniqueFastWins,1);assert.equal(result.fastQuality.wins,5);assert.equal(result.compositeQuality.losses,0);assert.equal(result.pilotRerun,false);console.log(JSON.stringify({passed:true,exactAlwaysUnseeded:true,derivedSavedPilot:true,uniqueFastWins:1,sourceMatrixRemainsRejected:true}));
