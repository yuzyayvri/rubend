import assert from "node:assert/strict";

export function gitSourceTree(text,{maximumFileBytes,maximumTrackedBytesPerSource}){
  assert.equal(typeof text,"string");for(const n of[maximumFileBytes,maximumTrackedBytesPerSource])assert.ok(Number.isSafeInteger(n)&&n>0);assert.ok(text.endsWith("\0"));const rows=[],seen=new Set();let bytes=0;
  for(const line of text.slice(0,-1).split("\0")){const tab=line.indexOf("\t");assert.ok(tab>0);const fields=line.slice(0,tab).trim().split(/\s+/);assert.equal(fields.length,4);const[mode,type,gitObject,size]=fields,path=line.slice(tab+1);assert.equal(type,"blob");assert.ok(["100644","100755"].includes(mode));assert.match(gitObject,/^[a-f0-9]{40}$/);assert.match(size,/^(0|[1-9][0-9]*)$/);const count=Number(size);assert.ok(Number.isSafeInteger(count)&&count<=maximumFileBytes);assert.ok(path.length>0&&!path.startsWith("/")&&path.split("/").every(p=>p!==""&&p!=="."&&p!==".."));assert.equal(seen.has(path),false);seen.add(path);bytes+=count;assert.ok(Number.isSafeInteger(bytes)&&bytes<=maximumTrackedBytesPerSource);rows.push({path,mode,gitObject,bytes:count});assert.ok(rows.length<=10000);}
  return{files:rows,trackedBytes:bytes};
}
