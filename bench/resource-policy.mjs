import assert from "node:assert/strict";

export function cpuList(text){
  assert.equal(typeof text,"string");assert.ok(text.length);
  const ids=new Set();
  for(const part of text.split(",")){
    assert.match(part,/^\d+(?:-\d+)?$/,"Invalid CPU list");
    const [first,last=first]=part.split("-").map(Number);
    assert.ok(Number.isSafeInteger(first)&&Number.isSafeInteger(last)&&first>=0&&last>=first&&last<65536);
    for(let id=first;id<=last;id++)ids.add(id);
  }
  return ids;
}

export function admission({memoryMiB,seconds,cpus},availableBytes,allowed){
  assert.ok(Number.isInteger(memoryMiB)&&memoryMiB>=128&&memoryMiB<=16384,"Memory ceiling must be 128 to 16384 MiB");
  assert.ok(Number.isInteger(seconds)&&seconds>=1&&seconds<=1800,"Wall ceiling must be 1 to 1800 seconds");
  assert.ok(Array.isArray(cpus)&&cpus.length>=1&&cpus.length<=4,"At most four CPU lanes");
  assert.equal(new Set(cpus).size,cpus.length,"Duplicate CPU lane");
  assert.ok(cpus.every(id=>Number.isInteger(id)&&allowed.has(id)),"CPU lane is not allowed");
  assert.ok(Number.isSafeInteger(availableBytes)&&availableBytes>=0);
  const reserveMiB=8192;
  assert.ok(availableBytes>=(memoryMiB+reserveMiB)*1048576,"Insufficient headroom for the ceiling plus 8 GiB desktop reserve");
  return {memoryMiB,seconds,cpus,reserveMiB,memoryPressureStopMiB:4096,nice:10,policy:"rubend-local-headroom-v2"};
}
