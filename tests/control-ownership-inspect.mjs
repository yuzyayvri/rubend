import assert from "node:assert/strict";
import {inspectChild} from "../bench/control-ownership-inspect.mjs";

const body="INLINE Term spin_27(Env e, THR Term* o, Term r0, u64 q0) {\n"+Array.from({length:5},(_,i)=>`  u32 _child_${i+10} = r${i+32};`).join("\n")+"\n  rfc_seal(e, r0);\n}\n";
const observed=inspectChild(body);
assert.equal(observed.borrowedLocations,1);assert.equal(observed.sealSites,1);
assert.notEqual(inspectChild(body.replace("u64 q0", "u64 q0, u64 q1")).bodySha256,observed.bodySha256);
assert.equal(inspectChild(body.replace("u64 q0", "u64 q0, u64 q1")).borrowedLocations,2);
assert.equal(inspectChild(body.replace("  rfc_seal(e, r0);", "")).sealSites,0);
assert.throws(()=>inspectChild(""),/Expected one emitted/);
assert.throws(()=>inspectChild(body+body),/Expected one emitted/);
assert.throws(()=>inspectChild(body.replace("_child_11 = r33", "_child_11 = r34")),/register mapping/);
assert.throws(()=>inspectChild(body.replace("\n}\n", "")),/Expected one emitted|terminator/);
console.log(JSON.stringify({passed:true,borrowCount:true,sealCount:true,changedBody:true,missingAmbiguousAndChangedMappingRejected:true}));
