import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {createHash} from "node:crypto";

assert.equal(process.argv.length,3,"Expected emitted runtime C");
const bytes=readFileSync(process.argv[2]),match=bytes.toString("utf8").match(/^#define BLK_SHR ([01])$/m);assert.ok(match,"Missing array-mode compiler flag");
assert.equal(Number(match[1]),0,"Runtime control must not enable shared-array mode for the owned search tables");
console.log(JSON.stringify({passed:true,sharedArrayMode:0,cSha256:createHash("sha256").update(bytes).digest("hex")}));
