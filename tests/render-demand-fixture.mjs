import assert from "node:assert/strict";
import {readFileSync} from "node:fs";

const page=readFileSync("bench/render-demand-page.mjs","utf8"),server=readFileSync("bench/u06-demand-checks.mjs","utf8"),ids=[...page.matchAll(/document\.getElementById\("([a-z-]+)"\)/g)].map(m=>m[1]);
for(const id of new Set(ids))assert.ok(server.includes('id="'+id+'"'),"Missing browser fixture target: "+id);
assert.ok(server.includes('"/progress"'));assert.ok(server.includes('"progress-"'));assert.ok(page.includes('"rubend-render-progress-v1"'));
console.log(JSON.stringify({passed:true,fixtureTargets:new Set(ids).size,incrementalProgressContract:true}));
