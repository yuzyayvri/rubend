import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {createHash} from "node:crypto";
import {resolve} from "node:path";
import {fileURLToPath} from "node:url";

const hash=bytes=>createHash("sha256").update(bytes).digest("hex");
export function inspectChild(text){
  const matches=text.split(/(?=^INLINE Term spin_)/m).filter(part=>part.startsWith("INLINE Term")&&part.slice(0,part.indexOf("\n}\n")+3).includes("u32 _child_10 = r32;"));
  assert.equal(matches.length,1,"Expected one emitted child-admission function");
  const end=matches[0].indexOf("\n}\n");assert.ok(end>0,"Missing emitted function terminator");
  const body=matches[0].slice(0,end+3),header=body.split("\n")[0];
  for(let field=10;field<15;field++)assert.ok(body.includes(`u32 _child_${field} = r${field+22};`),"Child register mapping changed");
  return {header,arrayLocationArguments:(header.match(/u64 q\d+/g)??[]).length,sealSites:(body.match(/rfc_seal\(/g)??[]).length,bodySha256:hash(body),bytes:Buffer.byteLength(body)};
}

if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  assert.equal(process.argv.length,5,"Expected reference.c previous.c candidate.c");
  const rows=process.argv.slice(2).map(path=>{const bytes=readFileSync(path),text=bytes.toString("utf8"),modes=[...text.matchAll(/^#define BLK_SHR ([01])$/gm)];assert.equal(modes.length,1,"Expected one global array-mode flag");return {path,sha256:hash(bytes),sharedArrayMode:Number(modes[0][1]),childAdmission:inspectChild(text)};});
  console.log(JSON.stringify({format:"rubend-control-ownership-inspection-v2",rows,candidateMatchesPreviousChildBody:rows[1].childAdmission.bodySha256===rows[2].childAdmission.bodySha256,candidateRestoresReferenceArrayMode:rows[0].sharedArrayMode===rows[2].sharedArrayMode,candidateRestoresReferenceLocationCount:rows[0].childAdmission.arrayLocationArguments===rows[2].childAdmission.arrayLocationArguments,claim:"Source-correlated emitted-C inspection only. Shared-array mode restoration is not a measured speed result."},null,2));
}
