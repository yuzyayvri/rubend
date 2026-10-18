import assert from "node:assert/strict";
import {readFileSync,writeFileSync,existsSync} from "node:fs";
import {resolve} from "node:path";
import {createHash} from "node:crypto";

assert.equal(process.argv.length,5,"Expected source-config new-config new-candidate-binary");
const [source,output,binary]=process.argv.slice(2).map(p=>resolve(p)),provenance=output+".derive.json";
assert.ok(!existsSync(output)&&!existsSync(provenance),"Use fresh configuration and provenance paths");
const bytes=readFileSync(source),config=JSON.parse(bytes),hash=x=>createHash("sha256").update(x).digest("hex");
assert.equal(config.profiles.length,2);assert.equal(config.profiles[1].id,"cooperative-raw");
const metadata=JSON.parse(readFileSync(binary+".json","utf8"));assert.equal(metadata.binarySha256,hash(readFileSync(binary)));
config.profiles[1].binary=binary;config.profiles[1].buildMetadata=binary+".json";
const generated=Buffer.from(JSON.stringify(config,null,2)+"\n");writeFileSync(output,generated,{flag:"wx"});assert.deepEqual(readFileSync(output),generated);
const record={format:"rubend-control-config-derivation-v1",source,sourceSha256:hash(bytes),output,outputSha256:hash(generated),candidateSha256:metadata.binarySha256};
writeFileSync(provenance,JSON.stringify(record,null,2)+"\n",{flag:"wx"});console.log(JSON.stringify(record));
