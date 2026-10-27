import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {createHash} from "node:crypto";
import {isAbsolute} from "node:path";
import {fileHash} from "./reference-provenance.mjs";

export const binaryCheckpointHash=value=>createHash("sha256").update(JSON.stringify(value)).digest("hex");
const labels=[[0,2,4,6],[1,3,5,7]],goals=[1776,19216];
export function admitBinaryCheckpoint(record,identity,expectedHash){
  assert.deepEqual(Object.keys(record).sort(),["format","identity","payload","counters","parentSha256","sha256"].sort());assert.equal(record.format,"rubend-edge-binary-checkpoint-v1");const{sha256,...body}=record;assert.match(expectedHash,/^[a-f0-9]{64}$/);assert.equal(sha256,expectedHash,"Checkpoint does not match the caller's pinned identity");assert.equal(binaryCheckpointHash(body),sha256,"Checkpoint manifest digest mismatch");assert.deepEqual(record.identity,identity);assert.deepEqual(Object.keys(identity).sort(),["pattern","count","labels","size","capacity","goal","adapterSha256","binarySha256","referenceSha256"].sort());assert.ok(Number.isInteger(identity.pattern)&&identity.pattern>=0&&identity.pattern<2);assert.equal(identity.count,4);assert.deepEqual(identity.labels,labels[identity.pattern]);assert.equal(identity.goal,goals[identity.pattern]);assert.equal(identity.size,190080);assert.equal(identity.capacity,262144);for(const k of["adapterSha256","binarySha256","referenceSha256"])assert.match(identity[k],/^[a-f0-9]{64}$/);assert.match(record.parentSha256,/^[a-f0-9]{64}$/);
  const p=record.payload;assert.deepEqual(Object.keys(p).sort(),["path","bytes","sha256","encoding"].sort());assert.ok(isAbsolute(p.path));assert.equal(p.bytes,760320);assert.equal(p.encoding,"u32le");assert.equal(fileHash(p.path),p.sha256);const raw=readFileSync(p.path);assert.equal(raw.byteLength,p.bytes);const values=new Uint32Array(190080);for(let i=0;i<values.length;i++)values[i]=raw.readUInt32LE(i*4);
  const c=record.counters;assert.deepEqual(Object.keys(c).sort(),["tag","depth","reached","expanded","bad"].sort());for(const v of Object.values(c))assert.ok(Number.isInteger(v)&&v>=0&&v<=0xffffffff);assert.equal(c.tag,0,"Only active layers are resumable");assert.equal(c.bad,0);assert.ok(c.depth<=32);assert.ok(values.every(v=>v===255||v<=c.depth));assert.equal(values[identity.goal],0);assert.equal(values.filter(v=>v===0).length,1);assert.equal(c.reached,values.filter(v=>v!==255).length);assert.equal(c.expanded,values.filter(v=>v<c.depth).length);return{values,...c};
}
export function makeBinaryCheckpoint(identity,payload,counters,parentSha256){
  const body={format:"rubend-edge-binary-checkpoint-v1",identity,payload,counters,parentSha256},record={...body,sha256:binaryCheckpointHash(body)};admitBinaryCheckpoint(record,identity,record.sha256);return record;
}
