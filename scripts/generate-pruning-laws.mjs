import {readFileSync,writeFileSync} from "node:fs";

const faces=["U","R","F","D","L","B"],powers=["One","Two","Three"],moves=["","2","i"];
const out=["import Base","import ./model.bend as M","", "type Face is Data:",...faces.map(f=>`  Face${f}{}`),"", "type Power is Data:",...powers.map(p=>`  ${p}{}`),"", "def move(face: Face, power: Power) -> M.Move:","  match face power:"];
for(const f of faces)for(let p=0;p<3;p++)out.push(`    case Face${f}{} ${powers[p]}{}:`,`      M.${f}${moves[p]}{}`);
out.push("", "def opposite(face: Face) -> Face:","  match face:",...faces.flatMap((f,i)=>[`    case Face${f}{}:`,`      Face${faces[(i+3)%6]}{}`]),"", "def combined(face: Face, p: Power, q: Power, cube: M.Cube) -> M.Cube:","  match p q:");
for(let p=0;p<3;p++)for(let q=0;q<3;q++){const sum=(p+q+2)%4;out.push(`    case ${powers[p]}{} ${powers[q]}{}:`,sum===0?"      cube":`      M.turn(move(face, ${powers[sum-1]}{}), cube)`);}
out.push("", "law same_face_reduces:","  for +face: Face","  for +p: Power","  for +q: Power","  for +cube: M.Cube","  {M.turn(move(face, q), M.turn(move(face, p), cube)) == combined(face, p, q, cube) : M.Cube}","", "def same_face_reduces(face, p, q, cube):","  match face p q cube:");
const fields=Array.from({length:54},(_,i)=>`s${i}`).join(", ");
for(const f of faces)for(const p of powers)for(const q of powers)out.push(`    case Face${f}{} ${p}{} ${q}{} M.Cube{${fields}}:`,"      {==}");
out.push("", "law opposite_commutes:","  for +face: Face","  for +p: Power","  for +q: Power","  for +cube: M.Cube","  {M.turn(move(opposite(face), q), M.turn(move(face, p), cube)) == M.turn(move(face, p), M.turn(move(opposite(face), q), cube)) : M.Cube}","", "def opposite_commutes(face, p, q, cube):","  match face p q cube:");
for(const f of faces)for(const p of powers)for(const q of powers)out.push(`    case Face${f}{} ${p}{} ${q}{} M.Cube{${fields}}:`,"      {==}");
out.push("", "law move_codec_roundtrip:","  for +m: M.Move","  {M.from_index(M.index(m)) == m : M.Move}","", "def move_codec_roundtrip(m):","  match m:");
for(const f of faces)for(const suffix of moves)out.push(`    case M.${f}${suffix}{}:`,"      {==}");
out.push("");
const text=out.join("\n");
if(process.argv.includes("--check")){if(readFileSync("src/pruning-laws.bend","utf8")!==text)throw Error("stale pruning law source");}else writeFileSync("src/pruning-laws.bend",text);
