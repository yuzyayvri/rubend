import assert from "node:assert/strict";
import {readFileSync,openSync,readSync,closeSync,statSync,writeFileSync,existsSync} from "node:fs";
import {createHash} from "node:crypto";
import Cubie from "../build/cubie.mjs";
import Q from "../build/coordinates.mjs";
import R from "../build/packed-symmetry.mjs";
import {validate} from "../apps/model.mjs";
import {apply,solved} from "../bench/fixed-work-model.mjs";

const [joint,corner,output]=process.argv.slice(2);assert.equal(process.argv.length,5);assert.equal(existsSync(output),false);
const paths=[joint,corner],identity=p=>{const s=statSync(p,{bigint:true});return [s.dev,s.ino,s.size,s.mtimeNs,s.ctimeNs].map(String);},before=paths.map(identity),fds=paths.map(p=>openSync(p,"r")),word=Buffer.alloc(4),byte=Buffer.alloc(1),records=[];
const source=readFileSync("bench/corpora/half-turn-v1.json"),cases=JSON.parse(source).cases;assert.equal(cases.length,16);
const jointIndex=cube=>(Q.encode({$:"Twist"},cube)*2048+Q.encode({$:"Flip"},cube))*495+Q.encode({$:"Slice"},cube);
function jointBound(cube){const index=jointIndex(cube);assert.ok(index>=0&&index<2217093120);assert.equal(readSync(fds[0],word,0,4,4*Math.floor(index/8)),4);return (word.readUInt32LE()>>>(4*(index%8)))&15;}
function cornerIndex(cube){const xs=Array.from({length:8},(_,i)=>(cube.cp>>>(4*i))&15),factorial=[1,1,2,6,24,120,720,5040];let p=0,t=0;for(let i=0;i<7;i++){for(let j=i+1;j<8;j++)if(xs[i]>xs[j])p+=factorial[7-i];t+=((cube.co>>>(2*i))&3)*3**i;}return p*2187+t;}
try{
  for(const item of cases){
    assert.ok(item.moves.every(m=>m%3===1));assert.equal(apply(solved,item.moves),item.facelets);assert.notEqual(item.facelets,solved);
    const cube=validate(item.facelets),inverse=Cubie.inverse(cube),forwardBounds=[],inverseBounds=[];
    let a=cube,b=inverse;for(let axis=0;axis<3;axis++){forwardBounds.push(jointBound(a));inverseBounds.push(jointBound(b));a=R.rotate(a);b=R.rotate(b);}
    assert.deepEqual(forwardBounds,[0,0,0]);assert.deepEqual(inverseBounds,[0,0,0]);
    const index=cornerIndex(cube);assert.equal(readSync(fds[1],byte,0,1,index),1);assert.ok(byte[0]>0&&byte[0]<=11);
    assert.equal(index,Q.encode({$:"Corners"},cube)*2187+Q.encode({$:"Twist"},cube));
    records.push({id:item.id,facelets:item.facelets,forwardBounds,inverseBounds,cornerBound:byte[0]});
  }
  paths.forEach((p,i)=>assert.deepEqual(identity(p),before[i]));
  const report={passed:true,cases:16,sourceSha256:createHash("sha256").update(source).digest("hex"),independentFaceletReplay:true,independentCornerRank:true,records,claim:"All six raw joint reduction estimates are zero on these actual unsolved half-turn cases; their corner bound is positive. This is not a speed measurement."};
  writeFileSync(output,JSON.stringify(report,null,2)+"\n",{flag:"wx"});console.log(JSON.stringify({passed:true,cases:16,output}));
}finally{fds.forEach(closeSync);}
