import assert from "node:assert/strict";

export function prefixValues(values,depth=4){
  assert.ok(Number.isInteger(depth)&&depth>=0&&depth<=4,"Invalid prefix depth");const limit=18**depth,out=[];let current=values;
  for(;;){assert.ok(current&&typeof current==="object","Malformed prefix list");if(current.$==="Nil")return out;assert.equal(current.$,"Con","Malformed prefix list");assert.ok(out.length<limit,"Prefix list limit exceeded");assert.ok(Number.isInteger(current.head)&&current.head>=0&&current.head<limit,"Invalid prefix code");out.push(current.head);current=current.tail;}
}
