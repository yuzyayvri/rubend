import assert from "node:assert/strict";
import {BlockLayouts} from "../bench/block-layout.mjs";

for(const pattern of [i=>i%13,i=>8+i%4,i=>Math.floor(i/64)%13,i=>i%251===0?0:10]){
  const values=Array.from({length:8192},(_,i)=>pattern(i)),bytes=Buffer.alloc(values.length/2);
  for(let i=0;i<values.length;i+=2)bytes[i/2]=values[i]|(values[i+1]<<4);
  const layouts=new BlockLayouts();for(let at=0;at<bytes.length;at+=48)layouts.feed(bytes.subarray(at,at+48));
  assert.equal(layouts.count,values.length);
  for(const record of layouts.finish()){
    const ranges=[];for(let at=0;at<values.length;at+=record.block){const block=values.slice(at,at+record.block);ranges.push(Math.max(...block)-Math.min(...block));}
    assert.equal(record.narrow,ranges.filter(r=>r<=3).length);assert.equal(record.wide,ranges.filter(r=>r>3).length);
    assert.equal(record.payloadWords,ranges.reduce((sum,r)=>sum+record.block/(r>3?8:16),0));
    assert.deepEqual(record.rangeHistogram,Array.from({length:16},(_,range)=>ranges.filter(r=>r===range).length));
  }
}
assert.throws(()=>new BlockLayouts().feed(Buffer.alloc(15)));
assert.throws(()=>new BlockLayouts().feed(Buffer.alloc(16,255)));
console.log("Block layout: independent range counts, chunk boundaries, and malformed inputs pass.");
