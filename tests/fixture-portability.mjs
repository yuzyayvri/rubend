import assert from "node:assert/strict";
import {readdirSync,readFileSync} from "node:fs";

let checked=0;
for(const name of readdirSync("tests/fixtures")){
  if(!name.endsWith(".mjs"))continue;
  const path="tests/fixtures/"+name,source=readFileSync(path,"utf8");
  if(!source.startsWith("#!"))continue;
  assert.equal(source.split("\n")[0],"#!/usr/bin/env node",path+" must use Node from the pinned development environment, not a machine-specific store path");checked++;
}
assert.ok(checked>=5);
console.log(JSON.stringify({passed:true,portableNodeFixtures:checked}));
