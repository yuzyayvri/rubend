import assert from "node:assert/strict";
import {readFileSync,writeFileSync} from "node:fs";
import {createHash} from "node:crypto";

const {records}=JSON.parse(readFileSync("tests/symmetry48-data.json","utf8"));
const {permutations}=JSON.parse(readFileSync("tests/geometry.json","utf8"));
const slots=[[5,10],[7,19],[3,37],[1,46],[32,16],[28,25],[30,43],[34,52],[23,12],[21,41],[50,39],[48,14]];
const colors=slots.map(s=>s.map(i=>Math.floor(i/9))),slice=[1,0,1,0,1,0,1,0,2,2,2,2];
const lookup=new Map(slots.flatMap((s,p)=>s.map(i=>[i,p]))),piece=new Map(colors.map((cs,i)=>[cs.toSorted((a,b)=>a-b).join(","),i]));
const masks=n=>Array.from({length:2**n},(_,i)=>i).filter(mask=>mask.toString(2).replaceAll("0","").length===4);
const es=masks(12),ms=masks(8),words=new Uint32Array(34650),wordIndex=new Map();
for(let i=0;i<34650;i++){
  let word=0,j=0;for(let p=0;p<12;p++){const e=(es[Math.floor(i/70)]>>>p)&1,label=e?2:((ms[i%70]>>>j++)&1)?0:1;word|=label<<(2*p);}
  words[i]=word;wordIndex.set(word,i);
}
assert.equal(wordIndex.size,34650);
const moveMaps=permutations.flatMap(q=>{let p=Array.from({length:54},(_,i)=>i);return Array.from({length:3},()=>{p=q.map(i=>p[i]);return slots.map(s=>{const a=lookup.get(p[s[0]]),b=lookup.get(p[s[1]]);assert.equal(a,b);return a;});});});
const symMaps=records.map(r=>{
  const positions=slots.map(s=>{const a=lookup.get(r.permutation[s[0]]),b=lookup.get(r.permutation[s[1]]);assert.equal(a,b);return a;});
  const mapping=Array(3);for(let i=0;i<12;i++){const value=slice[piece.get(colors[i].map(c=>r.colors[c]).toSorted((a,b)=>a-b).join(","))];if(mapping[slice[i]]!==undefined)assert.equal(mapping[slice[i]],value);mapping[slice[i]]=value;}
  assert.equal(new Set(mapping).size,3);return {positions,mapping};
});
const expected=new Uint32Array(4194304).fill(4294967295);
for(let i=0;i<34650;i++){
  const word=words[i];expected[i]=word;
  for(let move=0;move<18;move++){let target=0;for(let p=0;p<12;p++)target|=((word>>>(2*moveMaps[move][p]))&3)<<(2*p);const next=wordIndex.get(target);assert.notEqual(next,undefined);expected[65536+i*18+move]=next;}
  for(let sym=0;sym<48;sym++){let target=0;const{positions,mapping}=symMaps[sym];for(let p=0;p<12;p++)target|=mapping[(word>>>(2*positions[p]))&3]<<(2*p);const next=wordIndex.get(target);assert.notEqual(next,undefined);expected[1048576+i*48+sym]=next;}
}
const path=process.argv[2]??"build/evidence/h0-edges-v1.raw",bytes=readFileSync(path);assert.equal(bytes.length,16777216);
for(let i=0;i<expected.length;i++)assert.equal(bytes.readUInt32LE(i*4),expected[i],"edge payload word "+i);
const solvedWord=slice.reduce((word,label,p)=>word|(label<<(2*p)),0),goal=wordIndex.get(solvedWord);assert.equal(goal,34629);
const report={passed:true,placements:34650,moveEntries:623700,symmetryEntries:1663200,physicalWordsCompared:4194304,goal,payloadSha256:createHash("sha256").update(bytes).digest("hex"),oracle:"Independent two-sticker geometry and slice-label actions",independentReview:false};
writeFileSync("build/evidence/h0-edge-oracle.json",JSON.stringify(report,null,2)+"\n");console.log(JSON.stringify(report));
