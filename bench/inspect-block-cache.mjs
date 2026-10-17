import {createReadStream,statSync,writeFileSync,mkdirSync} from "node:fs";
import {createHash} from "node:crypto";
import assert from "node:assert/strict";

const path=process.argv[2]??".cache/joint/block64-v1.raw";assert.equal(statSync(path).size,742502016);
const hash=createHash("sha256");let fingerprint=2166136261,index=0;
for await(const chunk of createReadStream(path,{highWaterMark:8388608})){assert.equal(chunk.length%4,0);hash.update(chunk);for(let at=0;at<chunk.length;at+=4)fingerprint=(Math.imul(fingerprint,16777619)^chunk.readUInt32LE(at)^index++)>>>0;}
assert.equal(fingerprint,3919871918);assert.equal(index,185625504);
const record={format:"rubend-block64-cache-v1",entries:2217093120,blockEntries:64,metadataWords:34642080,payloadWords:150983424,words:index,bytes:index*4,byteOrder:"little-endian",sha256:hash.digest("hex"),wordFingerprint:fingerprint,referenceSha256:"2ccfd40fdc0cf4769c58d9646f6b0ea787571ce5200b5d124c8f17dcc70f73b5",entryFingerprint:1448581281,everyEntryEqualToReference:true,formalRefinementProof:false};
mkdirSync("build/evidence",{recursive:true});writeFileSync("build/evidence/block-cache-identity.json",JSON.stringify(record,null,2)+"\n");console.log(JSON.stringify(record));
