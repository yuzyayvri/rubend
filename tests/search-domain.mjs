import assert from "node:assert/strict";
import {spawnSync} from "node:child_process";
import Test from "../build/search-profile-test.mjs";

assert.equal(Test.checks(),true);
assert.equal(Test.domain_checks(),true);
const rejected=spawnSync("bend",["tests/toolchain/rejected/search-goal.bend","--check-only"],{encoding:"utf8",timeout:30000});
assert.ifError(rejected.error);
assert.equal(rejected.status,1);
assert.match(rejected.stdout+rejected.stderr,/expected : S\.Goal/);
assert.match(rejected.stdout+rejected.stderr,/observed : U32/);
console.log(JSON.stringify({passed:true,nativeAndJsProfiles:true,goalStageCompletionCodecs:true,numericGoalRejected:true}));
