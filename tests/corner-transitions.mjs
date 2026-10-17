import assert from "node:assert/strict";
import {readFileSync,statSync} from "node:fs";
import {createHash} from "node:crypto";
import {puzzles} from "cubing/puzzles";
import {KPattern} from "cubing/kpuzzle";
import {cornerMap,patternData,randomCube,randomSource} from "./support.mjs";
import {apply,solved,validate,moveNames} from "../apps/model.mjs";

assert.equal(process.argv.length,4,"Expected native moves and permutation-distance files");
const paths=process.argv.slice(2),identity=p=>{const s=statSync(p,{bigint:true});assert.ok(s.isFile());return [s.dev,s.ino,s.size,s.mtimeNs,s.ctimeNs].map(String);};
const identities=paths.map(identity),[moves,distances]=paths.map(p=>readFileSync(p));
assert.equal(moves.length,765126*4);assert.equal(distances.length,40320);
const inverseMap=Array(8);cornerMap.forEach((x,i)=>inverseMap[x]=i);
const factorial=[1,1,2,6,24,120,720,5040,40320];
function unrank(rank){const available=[0,1,2,3,4,5,6,7],result=[];for(let i=7;i>=0;i--){const digit=Math.floor(rank/factorial[i]);rank%=factorial[i];result.push(available.splice(digit,1)[0]);}return result;}
function rank(xs){let rank=0;for(let i=0;i<7;i++)for(let j=i+1;j<8;j++)if(xs[i]>xs[j])rank+=factorial[7-i];return rank;}
const parity=xs=>xs.reduce((p,x,i)=>p^xs.slice(i+1).reduce((a,y)=>a^(x>y?1:0),0),0);
const pack=(xs,bits)=>xs.reduce((v,x,i)=>(v|(x<<(bits*i)))>>>0,0);
const pieces=data=>cornerMap.map(p=>inverseMap[data.CORNERS.pieces[p]]);
const twist=data=>cornerMap.slice(0,7).reduce((v,p,i)=>v+data.CORNERS.orientation[p]*3**i,0);
const fixture=(cp,co=0,odd=0)=>({$:"Cubie",cp,co,ep:odd?1985229313:1985229328,eh:47768,eo:0});
const puzzle=await puzzles["3x3x3"].kpuzzle();
let permutationTransitions=0,twistTransitions=0,jointRefinements=0;
for(let index=0;index<40320;index++){
  const permutation=unrank(index);assert.equal(rank(permutation),index);
  const pattern=new KPattern(puzzle,patternData(fixture(pack(permutation,4),0,parity(permutation))));
  for(let move=0;move<18;move++){
    const expected=rank(pieces(pattern.applyMove(moveNames[move]).patternData));
    assert.equal(moves.readUInt32LE(4*(index*18+move)),expected,"Native all-move corner permutation differs");permutationTransitions++;
  }
}
for(let index=0;index<2187;index++){
  const values=Array.from({length:7},(_,i)=>Math.floor(index/3**i)%3);values.push((3-values.reduce((a,b)=>a+b,0)%3)%3);
  const pattern=new KPattern(puzzle,patternData(fixture(1985229328,pack(values,2))));
  for(let move=0;move<18;move++){
    assert.equal(moves.readUInt32LE(4*(725760+index*18+move)),twist(pattern.applyMove(moveNames[move]).patternData),"Native corner twist differs");twistTransitions++;
  }
}
const random=randomSource("rubend-all-corner-transitions-v1");
for(let sample=0;sample<1000;sample++){
  const cube=randomCube(random),data=patternData(cube),p=rank(pieces(data)),t=twist(data),pattern=new KPattern(puzzle,data);
  for(let move=0;move<18;move++){
    const next=pattern.applyMove(moveNames[move]).patternData;
    const actual=moves.readUInt32LE(4*(p*18+move))*2187+moves.readUInt32LE(4*(725760+t*18+move));
    assert.equal(actual,rank(pieces(next))*2187+twist(next),"Joint corner projection does not commute");jointRefinements++;
  }
}
const oracle=new Uint8Array(40320).fill(255),queue=new Uint32Array(40320);oracle[0]=0;let head=0,tail=1;
while(head<tail){const state=queue[head++];for(let move=0;move<18;move++){const next=moves.readUInt32LE(4*(state*18+move));if(oracle[next]===255){oracle[next]=oracle[state]+1;assert.ok(tail<queue.length);queue[tail++]=next;}}}
assert.equal(tail,40320);assert.deepEqual(distances,Buffer.from(oracle));
const u=validate(apply(solved,[0]));assert.equal(u.co,0);assert.equal(u.eo,0);assert.equal(distances[rank(pieces(patternData(u)))],1);assert.equal(distances[0],0);
for(let i=0;i<paths.length;i++)assert.deepEqual(identity(paths[i]),identities[i],"Corner input changed");
console.log(JSON.stringify({passed:true,oracle:"cubing@0.66.0 KPuzzle plus independent JavaScript BFS",permutationTransitions,twistTransitions,jointRefinements,permutationDistances:tail,maximum:Math.max(...oracle),uCornerBound:1,solvedCornerBound:0,inputSha256:paths.map(p=>createHash("sha256").update(readFileSync(p)).digest("hex"))}));
