import assert from "node:assert/strict";
import {createHash} from "node:crypto";

export const checkpointHash=value=>createHash("sha256").update(JSON.stringify(value)).digest("hex");
const patterns=[[0,2,4,6,8,10],[1,3,5,7,9,11]],sizes=[24,528,10560];
export function decodeCheckpointPacket(value,count){
  assert.ok(Number.isInteger(count)&&count>=1&&count<=3,"Only tiny packet counts are admitted");
  const limit=sizes[count-1]+5,out=[];let current=value;
  for(let i=0;i<limit;i++){
    assert.equal(current?.$,"Con","Truncated checkpoint list");
    assert.ok(Number.isInteger(current.head)&&current.head>=0&&current.head<=0xffffffff,"Checkpoint list contains a non-U32 value");
    out.push(current.head);current=current.tail;
  }
  assert.equal(current?.$,"Nil","Checkpoint list exceeds its exact geometry or has an invalid tail");
  return out;
}
export function admitCheckpoint(record,identity){
  assert.deepEqual(Object.keys(record).sort(),["format","identity","packet","parentSha256","sha256"].sort(),"Checkpoint schema mismatch");
  const {sha256,...payload}=record;assert.equal(sha256,checkpointHash(payload),"Checkpoint digest mismatch");
  assert.equal(record.format,"rubend-edge-checkpoint-v1");assert.deepEqual(record.identity,identity,"Checkpoint identity mismatch");
  assert.ok(typeof record.parentSha256==="string"&&/^[a-f0-9]{64}$/.test(record.parentSha256));
  assert.ok(Number.isInteger(identity.count)&&identity.count>=1&&identity.count<=3,"Only tiny pilots are admitted");
  assert.ok(Number.isInteger(identity.pattern)&&identity.pattern>=0&&identity.pattern<2);
  assert.deepEqual(identity.labels,patterns[identity.pattern].slice(0,identity.count));
  assert.equal(identity.size,sizes[identity.count-1]);assert.match(identity.moduleSha256,/^[a-f0-9]{64}$/);
  assert.ok(Number.isInteger(identity.goal)&&identity.goal>=0&&identity.goal<identity.size);
  const packet=record.packet;assert.ok(Array.isArray(packet));assert.equal(packet.length,identity.size+5,"Checkpoint value count mismatch");
  assert.ok(packet.every(v=>Number.isInteger(v)&&v>=0&&v<=0xffffffff));
  const [tag,depth,reached,expanded,bad,...values]=packet;
  assert.equal(tag,0,"Only active layer boundaries may be resumed");assert.equal(bad,0);assert.ok(depth<=32);
  assert.ok(values.every(v=>v===255||v<=depth),"Checkpoint distance exceeds its layer");
  assert.equal(values[identity.goal],0);assert.equal(values.filter(v=>v===0).length,1);
  assert.equal(reached,values.filter(v=>v!==255).length,"Checkpoint reached counter mismatch");
  assert.equal(expanded,values.filter(v=>v<depth).length,"Checkpoint expanded counter mismatch");
  return {depth,reached,expanded,values};
}
export function makeCheckpoint(identity,packet,parentSha256){
  const payload={format:"rubend-edge-checkpoint-v1",identity,packet,parentSha256},record={...payload,sha256:checkpointHash(payload)};
  admitCheckpoint(record,identity);return record;
}
