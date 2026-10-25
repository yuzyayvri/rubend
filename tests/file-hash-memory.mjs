import assert from "node:assert/strict";
import {statSync,writeFileSync} from "node:fs";
import {resolve} from "node:path";
import {pathToFileURL} from "node:url";

assert.equal(process.argv.length,5);
const modulePath=resolve(process.argv[2]),path=resolve(process.argv[3]),output=resolve(process.argv[4]),hashing=await import(pathToFileURL(modulePath));
assert.equal(statSync(path).size,1108546560);
const actual=await hashing.fileHash(path);
assert.equal(actual,"2ccfd40fdc0cf4769c58d9646f6b0ea787571ce5200b5d124c8f17dcc70f73b5");
writeFileSync(output,JSON.stringify({passed:true,modulePath,path,bytes:1108546560,sha256:actual,maximumProcessRssKiB:process.resourceUsage().maxRSS,wholeCacheBufferRequired:false})+"\n",{flag:"wx"});
console.log(JSON.stringify({passed:true,bytes:1108546560,maximumProcessRssKiB:process.resourceUsage().maxRSS}));
