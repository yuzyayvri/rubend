import assert from "node:assert/strict";
import {cpSync,mkdirSync,readFileSync,writeFileSync,existsSync} from "node:fs";
import {createHash} from "node:crypto";
import {resolve,join} from "node:path";

const output=resolve(process.argv[2]??"build/startup-variants");
assert.ok(output.startsWith(resolve("build")+"/"),"Frozen source output must remain below build");
assert.ok(!existsSync(output),"Refusing to replace an existing frozen snapshot");
const original=readFileSync("src/joint-cache.bend","utf8"),needle="case True{}: 65536";
assert.equal(original.split(needle).length,2);
const records=[];
for(const words of [16384,65536,262144]){
  const directory=join(output,`legacy-${words}`);mkdirSync(directory,{recursive:true});
  cpSync("src",join(directory,"src"),{recursive:true});cpSync("bench",join(directory,"bench"),{recursive:true});cpSync("tests",join(directory,"tests"),{recursive:true});
  const source=original.replace(needle,`case True{}: ${words}`).replaceAll("limit(U32.is_gt(remaining, 65536), remaining)",`limit(U32.is_gt(remaining, ${words}), remaining)`);
  writeFileSync(join(directory,"src/joint-cache.bend"),source);
  records.push({transport:"legacy",words,chunks:Math.ceil(277136640/words),fuel:65536,loaderSha256:createHash("sha256").update(source).digest("hex"),entries:["bench/advanced-legacy-shift.bend","bench/advanced-legacy-direct.bend"]});
}
assert.equal(original.split("case True{}: 262144").length,2);
assert.equal(original.split("word_limit(U32.is_gt(remaining, 262144), remaining)").length,2);
for(const words of [65536,262144]){
  const directory=join(output,`word-${words}`);mkdirSync(directory,{recursive:true});
  cpSync("src",join(directory,"src"),{recursive:true});cpSync("bench",join(directory,"bench"),{recursive:true});cpSync("tests",join(directory,"tests"),{recursive:true});
  const source=original.replace("case True{}: 262144",`case True{}: ${words}`).replace("word_limit(U32.is_gt(remaining, 262144), remaining)",`word_limit(U32.is_gt(remaining, ${words}), remaining)`);
  writeFileSync(join(directory,"src/joint-cache.bend"),source);
  records.push({transport:"word",words,chunks:Math.ceil(277136640/words),fuel:8192,loaderSha256:createHash("sha256").update(source).digest("hex"),entries:["bench/advanced-main.bend"]});
}
writeFileSync(join(output,"variants.json"),JSON.stringify({format:"rubend-frozen-startup-variants-v1",records},null,2)+"\n");
console.log(JSON.stringify({output,records}));
