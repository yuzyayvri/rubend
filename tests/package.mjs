import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {createHash} from "node:crypto";
import {resolve} from "node:path";

const root=resolve(process.argv[2]??"build"),manifest=JSON.parse(readFileSync(resolve(root,"manifest.json"),"utf8"));
const hash=path=>createHash("sha256").update(readFileSync(path)).digest("hex");
assert.equal(manifest.format,"rubend-build-v1");
assert.equal(hash(resolve(root,"rubend")),manifest.nativeSha256);
for(const [file,digest] of Object.entries(manifest.artifacts)){
  assert.match(file,/^[a-z-]+\.mjs$/);assert.equal(hash(resolve(root,file)),digest,file);
}
assert.ok(Object.keys(manifest.sourceHashes).length>20);
assert.equal(manifest.toolchain.bend,"bend 2.0.37");
console.log("Package: native binary, generated modules, and source/toolchain manifest agree.");
