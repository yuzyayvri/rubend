import assert from "node:assert/strict";
import {checkMessage} from "../scripts/commit-policy.mjs";

for(const text of["fix: sign commits","fix: sign commits\n","fix: sign commits\n\n"])checkMessage(text);
for(const text of["","\n","subject\nbody","subject\n\nbody","subject\r\nbody"])assert.throws(()=>checkMessage(text),/one subject line/);
console.log(JSON.stringify({passed:true,acceptedSubjects:3,rejectedBodies:5}));
