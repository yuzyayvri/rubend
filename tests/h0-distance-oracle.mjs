import assert from "node:assert/strict";
import {readFileSync,writeFileSync} from "node:fs";

const classBytes=readFileSync(process.argv[2]??"build/evidence/h0-classes-v1.raw");
assert.equal(classBytes.length,4194304);
const get=index=>classBytes.readUInt32LE(index*4);
const {permutations}=JSON.parse(readFileSync("tests/geometry.json","utf8"));
const slots=[[8,9,20],[6,18,38],[0,36,47],[2,45,11],[29,26,15],[27,44,24],[33,53,42],[35,17,51]];
const colors=slots.map(s=>s.map(i=>Math.floor(i/9))),tetrads=[[0,2,5,7],[1,3,4,6]],classOf=[0,1,0,1,1,0,1,0];
const masks=Array.from({length:256},(_,i)=>i).filter(mask=>mask.toString(2).replaceAll("0","").length===4),maskRank=new Map(masks.map((m,i)=>[m,i]));
const codes=new Map();for(let p=0;p<8;p++)for(let o=0;o<3;o++)codes.set(colors[p].map((_,i)=>colors[p][(i-o+3)%3]).join(","),[p,o]);
const lookup=new Map(slots.flatMap((s,p)=>s.map((index,o)=>[index,[p,o]])));
const moves=permutations.flatMap(q=>{let p=Array.from({length:54},(_,i)=>i);return Array.from({length:3},()=>{p=q.map(i=>p[i]);return slots.map(s=>s.map(i=>lookup.get(p[i])));});});
function transition(separation,twist,move){
  const mask=masks[separation],used=[0,0],cp=Array.from({length:8},(_,i)=>{const t=(mask>>>i)&1;return tetrads[t][used[t]++];});
  const co=Array.from({length:7},(_,i)=>Math.floor(twist/3**i)%3);co.push((3-co.reduce((a,b)=>a+b,0)%3)%3);
  let targetMask=0,targetTwist=0;
  for(let pos=0;pos<8;pos++){
    const cs=moves[move][pos].map(([p,k])=>colors[cp[p]][(k-co[p]+3)%3]),[piece,orientation]=codes.get(cs.join(","));
    targetMask|=classOf[piece]<<pos;if(pos<7)targetTwist+=orientation*3**pos;
  }
  return targetTwist*70+maskRank.get(targetMask);
}
const matrix=new Uint32Array(40626);
for(let twist=0;twist<2187;twist++)for(let move=0;move<18;move++)matrix[twist*18+move]=Math.floor(transition(0,twist,move)/70);
for(let sep=0;sep<70;sep++)for(let move=0;move<18;move++)matrix[39366+sep*18+move]=transition(sep,0,move)%70;
const next=(raw,move)=>matrix[Math.floor(raw/70)*18+move]*70+matrix[39366+(raw%70)*18+move];
function bfs(size,goal,child){
  const distance=new Uint32Array(size).fill(4294967295),queue=new Uint32Array(size);distance[goal]=0;queue[0]=goal;let tail=1;
  for(let head=0;head<tail;head++){const node=queue[head];for(let move=0;move<18;move++){const target=child(node,move);assert.ok(target>=0&&target<size);if(distance[target]===4294967295){distance[target]=distance[node]+1;queue[tail++]=target;}}}
  assert.equal(tail,size);return distance;
}
const raw=bfs(153090,23,next),goalClass=get(23)&65535;
const reduced=bfs(3393,goalClass,(id,move)=>get(next(get(262144+id),move))&65535);
for(let i=0;i<raw.length;i++)assert.equal(raw[i],reduced[get(i)&65535]);
const report={passed:true,rawStates:153090,classes:3393,goalClass,maximum:raw.reduce((a,b)=>Math.max(a,b),0),distanceSum:raw.reduce((a,b)=>a+b,0),transitionEntries:matrix.length,edges:153090*18,independentReview:false};
if(process.argv[3]){
  const bytes=readFileSync(process.argv[3]);assert.equal(bytes.length,4194304);
  for(let i=0;i<raw.length;i++)assert.equal(bytes.readUInt32LE((300000+i)*4),raw[i],"raw distance "+i);
  for(let i=0;i<reduced.length;i++)assert.equal(bytes.readUInt32LE((600000+i)*4),reduced[i],"class distance "+i);
  for(let i=0;i<matrix.length;i++)assert.equal(bytes.readUInt32LE((800000+i)*4),matrix[i],"component transition "+i);
  for(let i=0;i<1048576;i++)if(!(i>=300000&&i<453090)&&!(i>=600000&&i<603393)&&!(i>=800000&&i<840626))assert.equal(bytes.readUInt32LE(i*4),get(i),"unchanged class word "+i);
  report.nativeRawDistancesCompared=raw.length;report.nativeClassDistancesCompared=reduced.length;
  report.physicalWordsCompared=1048576;
}
writeFileSync("build/evidence/h0-distance-oracle.json",JSON.stringify(report,null,2)+"\n");
console.log(JSON.stringify(report));
