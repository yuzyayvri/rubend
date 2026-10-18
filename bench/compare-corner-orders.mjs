import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {gunzipSync} from "node:zlib";
import {createHash} from "node:crypto";

assert.equal(process.argv.length,4,"Expected late and corner-first contour reports");
const paths=process.argv.slice(2),bytes=paths.map(p=>readFileSync(p)),data=bytes.map((b,i)=>JSON.parse((paths[i].endsWith(".gz")?gunzipSync(b):b).toString("utf8"))),[late,early]=data;
for(const r of data){assert.equal(r.format,"rubend-contour-comparison-v1");assert.equal(r.passed,true);assert.deepEqual(r.errors,[]);assert.equal(r.rounds.length,5);}
for(const key of ["count","target","split","stratum","cacheSha256","cornerSha256"])assert.equal(late.config[key],early.config[key]);
const earlier=new Map(early.seals.map(s=>[s.path,s.sha256]));let commonInputs=0;
for(const s of late.seals)if(earlier.has(s.path)){assert.equal(s.sha256,earlier.get(s.path),"Shared input content changed across order experiments");commonInputs++;}
let pairs=0;
for(let round=0;round<5;round++){
  const a=late.rounds[round],b=early.rounds[round];assert.equal(a.status,"ok");assert.equal(b.status,"ok");assert.equal(a.jobs.length,b.jobs.length);
  const jobs=new Map(b.jobs.map(j=>[j.profile+":"+j.id,j]));assert.equal(jobs.size,b.jobs.length);
  for(const j of a.jobs){const other=jobs.get(j.profile+":"+j.id);assert.ok(other);for(const key of ["id","facelets","profile","target","complete","depth","lower","length","optimal","nodes","moves"])assert.deepEqual(j[key],other[key],"Order changed terminal metadata or work: "+key);pairs++;}
}
console.log(JSON.stringify({format:"rubend-corner-order-semantics-v1",passed:true,inputSha256:bytes.map(b=>createHash("sha256").update(b).digest("hex")),pairedJobs:pairs,commonInputContentsVerified:commonInputs,terminalMetadataMovesAndWorkEqual:true,claim:"Semantic equality across the two measured order variants. This does not report a direct timing ratio between separate binaries or runs."},null,2));
