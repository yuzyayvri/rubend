import assert from "node:assert/strict";
import {readFileSync,writeFileSync} from "node:fs";
import {resolve} from "node:path";
import {createHash} from "node:crypto";

assert.equal(process.argv.length,4,"Expected fresh experiment prefix and frozen quality configuration");
const prefix=process.argv[2];assert.match(prefix,/^[a-z0-9-]+$/);
const inherited=JSON.parse(readFileSync(process.argv[3],"utf8"));assert.equal(inherited.iterations,5);assert.equal(inherited.profiles.length,2);
const quality=structuredClone(inherited);
quality.profiles=quality.profiles.map((profile,index)=>({...profile,id:index?"owned-stacks":"persistent-control",binary:resolve("build/experiments/"+(index?"r03-owned-raw-v2":"r06-raw-v5")),buildMetadata:resolve("build/experiments/"+(index?"r03-owned-raw-v2":"r06-raw-v5")+".json")}));
const fixed={iterations:5,profiles:[{id:"persistent-control",binary:resolve("build/experiments/r03-owned-reference-timer-v1")},{id:"owned-stacks",binary:resolve("build/experiments/r03-owned-timer-v2")}],warmup:inherited.corpora.warmup.path,exact:inherited.corpora.exact.path,cache:inherited.profiles[0].cache,cacheSha256:inherited.profiles[0].cacheSha256,output:resolve("build/evidence/"+prefix+"-fixed-time-v1.json")};
const paths={fixed:resolve("build/evidence/"+prefix+"-fixed-config-v1.json"),quality:resolve("build/evidence/"+prefix+"-quality-config-v1.json")};
for(const [kind,config]of Object.entries({fixed,quality}))writeFileSync(paths[kind],JSON.stringify(config,null,2)+"\n",{flag:"wx"});
const hash=path=>createHash("sha256").update(readFileSync(path)).digest("hex");
console.log(JSON.stringify({paths,configHashes:Object.fromEntries(Object.entries(paths).map(([name,path])=>[name,hash(path)])),claimToTest:"At least ten percent repeated total-time improvement with identical fixed work, no coverage or deadline quality loss, and at most five percent first-answer p95 regression. Whole-engine RSS and initialization are separate. No speed result exists yet.",profile:"RawJoint only; the same heuristics, axis order, and move ordering.",resourcePlan:"Five alternating cohorts, CPU2, nice10,6144MiB,ten-minute cap per batch. No overlapping build, profiler, or preview.",independentReview:false}));
