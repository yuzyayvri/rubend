import { createHash } from "node:crypto";
import Cubie from "../build/cubie.mjs";
import { encode } from "../apps/model.mjs";

export const cornerMap=[0,3,2,1,4,5,6,7],edgeMap=[1,0,3,2,5,4,7,6,8,9,11,10];
export const nib=(word,i)=>(word>>>(4*i))&15;
export function randomSource(seed){
  let counter=0;
  return limit=>{
    const ceiling=Math.floor(4294967296/limit)*limit;
    for(;;){const value=createHash("sha256").update(`${seed}:${counter++}`).digest().readUInt32LE();if(value<ceiling)return value%limit;}
  };
}
const parity=xs=>xs.reduce((p,x,i)=>p^xs.slice(i+1).reduce((v,y)=>v^(x>y?1:0),0),0);
const pack=(xs,bits)=>xs.reduce((value,x,i)=>(value|(x<<(i*bits)))>>>0,0);
function shuffled(n,random){const xs=Array.from({length:n},(_,i)=>i);for(let i=n-1;i>0;i--){const j=random(i+1);[xs[i],xs[j]]=[xs[j],xs[i]];}return xs;}
export function randomCube(random){
  const corners=shuffled(8,random),edges=shuffled(12,random);
  if(parity(corners)!==parity(edges))[edges[0],edges[1]]=[edges[1],edges[0]];
  const twists=Array.from({length:7},()=>random(3));twists.push((3-twists.reduce((a,b)=>a+b,0)%3)%3);
  const flips=Array.from({length:11},()=>random(2));flips.push(flips.reduce((a,b)=>a^b,0));
  return {$:"Cubie",cp:pack(corners,4),co:pack(twists,2),ep:pack(edges.slice(0,8),4),eh:pack(edges.slice(8),4),eo:pack(flips,1)};
}
export function randomSubgroupCube(random){
  const corners=shuffled(8,random),low=shuffled(8,random),high=shuffled(4,random).map(x=>x+8);
  if(parity(corners)!==(parity(low)^parity(high)))[low[0],low[1]]=[low[1],low[0]];
  return {$:"Cubie",cp:pack(corners,4),co:0,ep:pack(low,4),eh:pack(high,4),eo:0};
}
export const faceletsOf=cube=>encode(Cubie.to_facelets(cube));
export function patternData(cube){
  const data={CORNERS:{pieces:Array(8),orientation:Array(8)},EDGES:{pieces:Array(12),orientation:Array(12)},CENTERS:{pieces:[0,1,2,3,4,5],orientation:[0,0,0,0,0,0],orientationMod:[1,1,1,1,1,1]}};
  for(let i=0;i<8;i++){data.CORNERS.pieces[cornerMap[i]]=cornerMap[nib(cube.cp,i)];data.CORNERS.orientation[cornerMap[i]]=(cube.co>>>(2*i))&3;}
  for(let i=0;i<12;i++){data.EDGES.pieces[edgeMap[i]]=edgeMap[nib(i<8?cube.ep:cube.eh,i%8)];data.EDGES.orientation[edgeMap[i]]=(cube.eo>>>i)&1;}
  return data;
}
