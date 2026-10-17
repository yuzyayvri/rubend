import {readFileSync,writeFileSync} from "node:fs";
import assert from "node:assert/strict";

const {stickers}=JSON.parse(readFileSync("tests/geometry.json","utf8"));
const corners=[[8,9,20],[6,18,38],[0,36,47],[2,45,11],[29,26,15],[27,44,24],[33,53,42],[35,17,51]],edges=[[5,10],[7,19],[3,37],[1,46],[32,16],[28,25],[30,43],[34,52],[23,12],[21,41],[50,39],[48,14]];
const normals=[[0,1,0],[1,0,0],[0,0,1],[0,-1,0],[-1,0,0],[0,0,-1]],rotate=p=>[p[1],p[2],p[0]],key=(p,n)=>`${p}/${n}`;
const byGeometry=new Map(stickers.map(s=>[key(s.position,s.normal),s.index]));
const target=stickers.map(s=>byGeometry.get(key(rotate(s.position),rotate(s.normal))));
const colorMap=normals.map(n=>normals.findIndex(m=>m.every((v,i)=>v===rotate(n)[i])));
const packed=(xs,bits)=>xs.reduce((word,x,i)=>(word|(x<<(i*bits)))>>>0,0);
const word=(xs,bits)=>`(${xs.map((x,i)=>i?`(${x} << ${bits*i}n : U32)`:x).join(" .|. ")} : U32)`;
const output=["import Base","import ./cubie.bend as C",""];
const expressions=[];
for(const [name,slots,bits,orientationBits] of [["corner",corners,4,2],["edge",edges,4,1]]){
  const n=slots.length,o=slots[0].length,positions=slots.map(s=>slots.findIndex(t=>t.includes(target[s[0]])));
  const locals=slots.map((s,p)=>slots.map((piece,k)=>Array.from({length:o},(_,twist)=>{
    const facelets=Array(54).fill(null);s.forEach((index,side)=>facelets[target[index]]=colorMap[Math.floor(piece[(side-twist+o)%o]/9)]);
    const values=slots[positions[p]].map(i=>facelets[i]);
    for(let next=0;next<n;next++)for(let t=0;t<o;t++)if(values.every((v,i)=>v===Math.floor(slots[next][(i-t+o)%o]/9)))return [next,t];
    throw Error("Unmatched rotated local cubie");
  })));
  const pieces=Array.from({length:n},(_,k)=>locals[0][k][0][0]);
  const posDelta=Array.from({length:n},(_,p)=>locals[p][0][0][1]);
  const pieceDelta=Array.from({length:n},(_,k)=>(locals[0][k][0][1]-posDelta[0]+o)%o);
  for(let p=0;p<n;p++)for(let k=0;k<n;k++)for(let t=0;t<o;t++)assert.deepEqual(locals[p][k][t],[pieces[k],(t+posDelta[p]+pieceDelta[k])%o]);
  const pieceFn=name==="corner"?`C.nib(${packed(pieces,bits)}, piece)`:`C.nib(C.pick(U32.is_lt(piece, 8), ${packed(pieces.slice(0,8),bits)}, ${packed(pieces.slice(8),bits)}), (piece % 8 : U32))`;
  output.push(`def ${name}_piece(+piece: U32) -> U32:`,`  ${pieceFn}`,"",`def ${name}_delta(piece: U32) -> U32:`,`  (((${packed(pieceDelta,orientationBits)} >> U32.to_nat((piece * ${orientationBits} : U32))) .&. ${o===3?3:1}) : U32)`,"");
  const ids=Array(n),ori=Array(n);
  for(let p=0;p<n;p++){
    const piece=`C.nib(${name==="corner"?"cp":p<8?"ep":"eh"}, ${p%8})`;
    ids[positions[p]]=`${name}_piece(${piece})`;
    const before=`((${name==="corner"?"co":"eo"} >> ${p*orientationBits}n) .&. ${o===3?3:1} : U32)`;
    ori[positions[p]]=o===3?`((${before} + ${name}_delta(${piece}) + ${posDelta[p]}) % 3 : U32)`:`(${before} .^. ${name}_delta(${piece}) .^. ${posDelta[p]} : U32)`;
  }
  if(name==="corner")expressions.push(word(ids,4),word(ori,2));else expressions.push(word(ids.slice(0,8),4),word(ids.slice(8),4),word(ori,1));
}
output.push("def rotate(cube: C.Cubie) -> C.Cubie:","  match cube:","    case C.Cubie{+cp, +co, +ep, +eh, +eo}:",`      C.Cubie{${expressions.join(", ")}}`,"");
const text=output.join("\n");if(process.argv.includes("--check"))assert.equal(readFileSync("src/packed-symmetry.bend","utf8"),text);else writeFileSync("src/packed-symmetry.bend",text);
