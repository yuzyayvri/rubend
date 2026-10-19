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
  return {header,borrowedLocations:(header.match(/u64 q\d+/g)??[]).length,sealSites:(body.match(/rfc_seal\(/g)??[]).length,bodySha256:hash(body),bytes:Buffer.byteLength(body)};
}

if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  assert.equal(process.argv.length,5,"Expected reference.c previous.c candidate.c");
  const rows=process.argv.slice(2).map(path=>{const bytes=readFileSync(path);return {path,sha256:hash(bytes),childAdmission:inspectChild(bytes.toString("utf8"))};});
  console.log(JSON.stringify({format:"rubend-control-ownership-inspection-v1",rows,candidateMatchesPreviousChildBody:rows[1].childAdmission.bodySha256===rows[2].childAdmission.bodySha256,candidateRestoresReferenceBorrowCount:rows[0].childAdmission.borrowedLocations===rows[2].childAdmission.borrowedLocations,claim:"Source-correlated emitted-C inspection only. Borrow arguments are not a proven performance cause."},null,2));
}
