import assert from "node:assert/strict";
import {readFileSync,statSync} from "node:fs";
import {createHash} from "node:crypto";
import {apply,solved} from "../bench/fixed-work-model.mjs";
import {validate} from "../apps/model.mjs";
import {randomCube,randomSource} from "./support.mjs";
import Cubie from "../build/cubie.mjs";
import Symmetry from "../build/packed-symmetry.mjs";

assert.equal(process.argv.length,3,"Expected full byte corner database");
const path=process.argv[2],identity=()=>{const s=statSync(path,{bigint:true});assert.ok(s.isFile());return [s.dev,s.ino,s.size,s.mtimeNs,s.ctimeNs].map(String);};
const before=identity(),bytes=readFileSync(path);assert.equal(bytes.length,88179840);
const factorial=[1,1,2,6,24,120,720,5040];
function index(cube){
  const pieces=Array.from({length:8},(_,i)=>(cube.cp>>>(4*i))&15);let p=0,t=0;
  for(let i=0;i<7;i++){for(let j=i+1;j<8;j++)if(pieces[i]>pieces[j])p+=factorial[7-i];t+=((cube.co>>>(2*i))&3)*3**i;}
  assert.ok(p>=0&&p<40320&&t>=0&&t<2187);return p*2187+t;
}
const seen=new Set([solved]),layers=[[solved]],projected=new Map([[0,0]]);
for(let depth=1;depth<=4;depth++){
  const next=[];
  for(const state of layers[depth-1])for(let move=0;move<18;move++){
    const child=apply(state,[move]);if(seen.has(child))continue;seen.add(child);next.push(child);
    const key=index(validate(child));if(!projected.has(key))projected.set(key,depth);assert.ok(bytes[key]<=depth,"Corner estimate exceeds independent full-cube optimum");
  }
  layers.push(next);
}
assert.deepEqual(layers.map(x=>x.length),[1,18,243,3240,43239]);
for(const [key,depth] of projected)assert.equal(bytes[key],depth,"Independent shallow corner distance differs");
const histogram=new Uint32Array(256);let sum=0;
for(const value of bytes){assert.ok(value<255,"Unknown corner distance");histogram[value]++;sum+=value;}
assert.equal(histogram[0],1);assert.equal(bytes[0],0);assert.equal(sum,772819906);
const maximum=Array.from(histogram).findLastIndex(n=>n>0);assert.equal(maximum,11);
const random=randomSource("rubend-corner-invariance-v1");let invariances=0;
for(let i=0;i<1000;i++){
  const cube=randomCube(random),h=bytes[index(cube)];assert.equal(bytes[index(Cubie.inverse(cube))],h);invariances++;
  let rotated=cube;for(let axis=0;axis<3;axis++){rotated=Symmetry.rotate(rotated);assert.equal(bytes[index(rotated)],h);invariances++;}
}
const u=validate(apply(solved,[0])),superflip={...Cubie.solved(),eo:4095};assert.equal(u.co,0);assert.equal(u.eo,0);assert.equal(bytes[index(u)],1);assert.equal(bytes[index(superflip)],0);
assert.deepEqual(identity(),before,"Corner database changed during checks");
console.log(JSON.stringify({passed:true,sha256:createHash("sha256").update(bytes).digest("hex"),fullCubeBfsStates:seen.size,exactShallowCornerStates:projected.size,independentLayerCounts:layers.map(x=>x.length),histogram:Array.from(histogram.slice(0,maximum+1)),maximum,distanceSum:sum,meanDistance:sum/bytes.length,inverseAndFrameChecks:invariances,uCornerBound:1,superflipCornerBound:0,scope:"Independent facelet BFS and coordinate rank, finite inverse/frame tests. Not a universal projection or completeness proof."}));
