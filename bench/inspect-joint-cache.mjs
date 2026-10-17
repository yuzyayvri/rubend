import {createReadStream,statSync,writeFileSync,mkdirSync} from "node:fs";
import {createHash} from "node:crypto";
import {resolve} from "node:path";
import assert from "node:assert/strict";

const path=resolve(process.argv[2]??".cache/joint/phase1-v1.raw"),size=statSync(path).size;
assert.equal(size,1108546560);
const hash=createHash("sha256");let fingerprint=2166136261,index=0;
for await(const chunk of createReadStream(path,{highWaterMark:8388608})){
  assert.equal(chunk.length%4,0);hash.update(chunk);
  for(let at=0;at<chunk.length;at+=4)fingerprint=(Math.imul(fingerprint,16777619)^chunk.readUInt32LE(at)^index++)>>>0;
}
const record={format:"rubend-joint-cache-v1",bytes:size,words:index,byteOrder:"little-endian",entries:2217093120,coordinate:"(twist * 2048 + flip) * 495 + slice",bitsPerEntry:4,unknown:15,maximum:12,sha256:hash.digest("hex"),wordFingerprint:fingerprint,auditedEntryFingerprint:1448581281,audit:"joint-full-cache-v1.json",formalAdmissibilityProof:false};
mkdirSync("build/evidence",{recursive:true});writeFileSync("build/evidence/joint-cache-identity.json",JSON.stringify(record,null,2)+"\n");console.log(JSON.stringify(record));
