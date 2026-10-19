import assert from "node:assert/strict";
import T from "../build/owned-continuation-test.mjs";

const {$:tag,...checks}=T.checks();assert.equal(tag,"Checks");
assert.equal(Object.keys(checks).length,12);
for(const [name,value]of Object.entries(checks))assert.equal(value,true,name);
console.log(JSON.stringify({passed:true,backend:"generated JavaScript",checks:Object.keys(checks).length,allFrameFields:true,wrapGuardsAndStickyFailures:true,composition:"One compiled entrypoint preserves module-relative constructor tags"}));
