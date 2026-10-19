import assert from "node:assert/strict";
import {readFileSync,writeFileSync,statSync} from "node:fs";
import {resolve} from "node:path";
import {createHash} from "node:crypto";

assert.equal(process.argv.length,5,"Expected frozen quality configuration, H0 contour configuration, and fresh prefix");
const quality=JSON.parse(readFileSync(process.argv[2],"utf8")),table=JSON.parse(readFileSync(process.argv[3],"utf8")),prefix=process.argv[4];assert.match(prefix,/^[a-z0-9-]+$/);assert.equal(quality.iterations,5);assert.equal(quality.profiles.length,2);
for(const profile of quality.profiles){assert.equal(profile.cache,table.cache);assert.equal(profile.cacheSha256,table.cacheSha256);}
assert.equal(statSync(table.h0Meta).size,11568000);assert.equal(statSync(table.h0Cache).size,117567452);
const base=quality.profiles[0];quality.profiles=[{...base,id:"inverse-three",binary:resolve("build/experiments/r04-h0-inverse-application-v1"),buildMetadata:resolve("build/experiments/r04-h0-inverse-application-v1.json"),env:{RUBEND_JOINT_CACHE:table.cache}},{...base,id:"inverse-h0",binary:resolve("build/experiments/r04-h0-application-v1"),buildMetadata:resolve("build/experiments/r04-h0-application-v1.json"),env:{RUBEND_JOINT_CACHE:table.cache,RUBEND_H0_META_CACHE:table.h0Meta,RUBEND_H0_CACHE:table.h0Cache,RUBEND_H0_POLICY:"combined"},additionalCaches:[{env:"RUBEND_H0_META_CACHE",path:table.h0Meta,bytes:11568000,sha256:table.h0MetaSha256},{env:"RUBEND_H0_CACHE",path:table.h0Cache,bytes:117567452,sha256:table.h0Sha256}]}];
const output=resolve("build/evidence/"+prefix+"-config-v1.json");writeFileSync(output,JSON.stringify(quality,null,2)+"\n",{flag:"wx"});
console.log(JSON.stringify({output,sha256:createHash("sha256").update(readFileSync(output)).digest("hex"),claimToTest:"Application coverage, deadline lengths and lower bounds must not regress, first-answer p95 may worsen by at most five percent, and startup/RSS are separate. Prior direct-contour marginal CPU missed ten percent. No promotion or large-factor claim.",resourcePlan:"Five alternating fresh cohorts, CPU2,nice10,6144MiB,600seconds; no concurrent builds, profiles, or previews.",additionalData:"Existing audited metadata and complete H0 distances only. No new table generation.",independentReview:false}));
