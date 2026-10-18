import assert from "node:assert/strict";
import {readFileSync,writeFileSync} from "node:fs";
import {createHash} from "node:crypto";

const {records} = JSON.parse(readFileSync("tests/symmetry48-data.json","utf8"));
const slots = [[8,9,20],[6,18,38],[0,36,47],[2,45,11],[29,26,15],[27,44,24],[33,53,42],[35,17,51]];
const colors = slots.map(s => s.map(i => Math.floor(i/9)));
const tetrads = [[0,2,5,7],[1,3,4,6]], classOf = [0,1,0,1,1,0,1,0];
const masks = Array.from({length:256},(_,i) => i).filter(mask => mask.toString(2).replaceAll("0","").length === 4);
const maskRank = new Map(masks.map((mask,i) => [mask,i]));
const pieceCodes = new Map();
for (let p=0;p<8;p++) for (let o=0;o<3;o++) pieceCodes.set(colors[p].map((_,i) => colors[p][(i-o+3)%3]).join(","),[p,o]);
const slotOf = new Map(slots.flatMap((s,p) => s.map((index,o) => [index,[p,o]])));
const actions = records.map(r => slots.map(s => s.map(index => slotOf.get(r.permutation[index]))));
const pieces = masks.map(mask => {const used=[0,0];return Array.from({length:8},(_,i) => {const t=(mask>>>i)&1;return tetrads[t][used[t]++];});});
const twists = Array.from({length:2187},(_,t) => {const values=Array.from({length:7},(_,i) => Math.floor(t/3**i)%3);return [...values,(3-values.reduce((a,b) => a+b,0)%3)%3];});
function transform(index,sym) {
  const cp = pieces[index%70], co = twists[Math.floor(index/70)], r = records[sym];
  let mask=0,twist=0;
  for (let pos=0;pos<8;pos++) {
    const cs = actions[sym][pos].map(([p,k]) => r.colors[colors[cp[p]][(k-co[p]+3)%3]]);
    const [piece,orientation] = pieceCodes.get(cs.join(","));
    mask |= classOf[piece]<<pos;
    if (pos<7) twist += orientation*3**pos;
  }
  return twist*70+maskRank.get(mask);
}
const expected = new Uint32Array(1048576).fill(4294967295), sizes=[];
let classes=0;
for (let rep=0;rep<153090;rep++) {
  if (expected[rep]!==4294967295) continue;
  let lo=0,hi=0,visited=0;
  for (let sym=0;sym<48;sym++) {
    const target = transform(rep,sym);
    assert.ok(Number.isInteger(target) && target>=0 && target<153090);
    if (expected[target]===4294967295) {expected[target]=(classes|(records[sym].inverse<<16))>>>0;visited++;}
    else assert.equal(expected[target]&65535,classes);
    if (target===rep) {if (sym<32)lo=(lo|(1<<sym))>>>0;else hi=(hi|(1<<(sym-32)))>>>0;}
  }
  expected[262144+classes]=rep;expected[524288+classes]=lo;expected[786432+classes]=hi;expected[200000+classes]=visited;
  sizes.push(visited);classes++;
}
assert.equal(classes,3393);
const path=process.argv[2]??"build/evidence/h0-classes-v1.raw", bytes=readFileSync(path);
assert.equal(bytes.length,4194304);
for(let i=0;i<expected.length;i++) assert.equal(bytes.readUInt32LE(i*4),expected[i],"class payload word "+i);
const histogram=Object.fromEntries([...new Set(sizes)].sort((a,b)=>a-b).map(size=>[size,sizes.filter(value=>value===size).length]));
const report={passed:true,classes,rawStates:153090,physicalWordsCompared:expected.length,orbitSizes:histogram,payloadSha256:createHash("sha256").update(bytes).digest("hex"),oracle:"Independent JavaScript corner-color geometry and orbit enumeration; not a product generator",independentReview:false};
writeFileSync("build/evidence/h0-class-oracle.json",JSON.stringify(report,null,2)+"\n");
console.log(JSON.stringify(report));
