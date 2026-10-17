import assert from "node:assert/strict";
import {mkdirSync,writeFileSync} from "node:fs";
import Block from "../build/block-table.mjs";

const pack=values=>values.reduce((word,x,i)=>(word|(x<<(4*i)))>>>0,0);
let wordCases=0;
for(let base=0;base<=12;base++)for(let pattern=0;pattern<65536;pattern++){
  const low=Array.from({length:8},(_,i)=>base+((pattern>>>(2*i))&3)),high=low.map(x=>base+3-(x-base));
  const a=pack(low),b=pack(high),expected=(pattern|((pattern^65535)<<16))>>>0;
  assert.equal(Block.squash(a,base),pattern);assert.equal(Block.narrow(a,b,base),expected);
  assert.equal(Block.extrema(8,a,15,0),Math.min(...low)|(Math.max(...low)<<4));
  for(let local=0;local<16;local++)assert.equal(Block.value({$:"Tuple",fst:[],snd:expected},base,local).snd,local<8?low[local]:high[local-8]);
  wordCases++;
}
const blocks=1024,values=Array.from({length:blocks*64},(_,i)=>{switch(Math.floor(i/64)%5){case 0:return 0;case 1:return 8+i%4;case 2:return i%13;case 3:return 12;default:return (Math.imul(i,2654435761)>>>0)%13;}}),source=Array.from({length:values.length/8},(_,i)=>pack(values.slice(i*8,i*8+8))),output=Array(16384).fill(0);
const result=Block.build(blocks,{$:"Build",source,output,cursor:0,valid:true},blocks,0,output.length);assert.equal(result.valid,true);
let cursor=0;
for(let b=0;b<blocks;b++){
  const group=values.slice(b*64,b*64+64),minimum=Math.min(...group),wide=Math.max(...group)-minimum>3;
  assert.equal(result.output[b],((cursor/4)*32|(wide?16:minimum))>>>0);cursor+=wide?8:4;
}
assert.equal(result.cursor,cursor);
const shifted=Array(32768).fill(0);for(let i=0;i<blocks+cursor;i++)shifted[i+37]=result.output[i];
for(let i=0;i<values.length;i++)assert.equal(Block.get_at(shifted,37,i,blocks).snd,values[i]);
const bad=Block.build(1,{$:"Build",source:Array(8).fill(0xdddddddd),output:Array(32).fill(77),cursor:0,valid:true},1,0,32);assert.equal(bad.valid,false);assert.equal(bad.output[0],77);
const small=Block.build(1,{$:"Build",source:Array(8).fill(0),output:Array(32).fill(77),cursor:0,valid:true},1,0,0);assert.equal(small.valid,false);assert.equal(small.output[0],77);
const record={passed:true,wordCases,decodedFields:wordCases*16,fixtureEntries:values.length,fixtureBlocks:blocks,nonzeroBase:37,capacityRejected:true,invalidDistanceRejected:true};
mkdirSync("build/evidence",{recursive:true});writeFileSync("build/evidence/block-table-unit.json",JSON.stringify(record,null,2)+"\n");console.log(JSON.stringify(record));
