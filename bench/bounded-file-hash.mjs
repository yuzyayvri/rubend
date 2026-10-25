import assert from "node:assert/strict";
import {openSync,readSync,closeSync,fstatSync,statSync} from "node:fs";
import {createHash} from "node:crypto";

const identity=s=>[s.dev,s.ino,s.size,s.mtimeNs,s.ctimeNs];
export function fileHash(path){
  const descriptor=openSync(path,"r");
  try{
    const before=fstatSync(descriptor,{bigint:true}),buffer=Buffer.allocUnsafe(262144),digest=createHash("sha256");
    assert.ok(before.size<=BigInt(Number.MAX_SAFE_INTEGER));
    let bytes=0;
    for(;;){const count=readSync(descriptor,buffer,0,buffer.length,null);if(count===0)break;digest.update(buffer.subarray(0,count));bytes+=count;}
    assert.equal(BigInt(bytes),before.size);assert.deepEqual(identity(fstatSync(descriptor,{bigint:true})),identity(before));assert.deepEqual(identity(statSync(path,{bigint:true})),identity(before));
    return digest.digest("hex");
  }finally{closeSync(descriptor);}
}
