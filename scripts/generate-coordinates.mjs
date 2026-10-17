import { readFileSync, writeFileSync } from "node:fs";

const out=["import Base","import ./cubie.bend as C","", "type Kind is Data:", "  Twist{}", "  Flip{}", "  Slice{}", "  Corners{}", "  Edges{}", "  Middle{}", ""];
const pick="C.pick";
out.push("def factorial(n: U32) -> U32:","  match n:", ...[1,1,2,6,24,120,720,5040,40320].flatMap((v,i)=>[`    case ${i}:`,`      ${v}`]),"    case _:","      1","");
const choose=(n,k)=>k>n?0:k===0?1:Array.from({length:k},(_,i)=>(n-i)/(i+1)).reduce((a,b)=>a*b,1);
out.push("def choose(n: U32, k: U32) -> U32:","  match n k:");
for(let n=0;n<12;n++) for(let k=0;k<=4;k++)out.push(`    case ${n} ${k}:`,`      ${Math.round(choose(n,k))}`);
out.push("    case _ _:","      0","");
for(const n of [4,8]) {
 const terms=[];
 for(let i=0;i<n-1;i++) for(let j=i+1;j<n;j++) terms.push(`(${pick}(U32.is_gt(C.nib(word, ${i}), C.nib(word, ${j})), ${[1,1,2,6,24,120,720,5040][n-i-1]}, 0))`);
 out.push(`def rank${n}(+word: U32) -> U32:`,`  (${terms.join(" + ")} : U32)`,"");
}
out.push("def unrank_loop(fuel: Nat, +rank: U32, +available: U32, +index: U32, word: U32) -> U32:","  match fuel:","    case 0n:","      word","    case 1n+p:","      +factor = factorial(Nat.to_u32(p))","      +digit = (rank / factor : U32)","      +shift = U32.to_nat((digit * 4 : U32))","      +mask = ((1 << shift) - 1 : U32)","      value = ((available >> shift) .&. 15 : U32)","      unrank_loop(p, (rank % factor : U32), ((available .&. mask) .|. ((available >> 4n) .&. U32.not(mask)) : U32), (index + 1 : U32), (word .|. (value << U32.to_nat((index * 4 : U32))) : U32))","", "def unrank8(rank: U32) -> U32:","  unrank_loop(8n, rank, 1985229328, 0, 0)","", "def unrank4(rank: U32) -> U32:","  unrank_loop(4n, rank, 12816, 0, 0)","");
out.push("def slice_rank_loop(fuel: Nat, +mask: U32, +i: U32, +k: U32, acc: U32) -> U32:","  match fuel:","    case 0n:","      (494 - acc : U32)","    case 1n+p:","      +flag = C.bit(mask, i)","      slice_rank_loop(p, mask, (i + 1 : U32), (k + flag : U32), (acc + flag * choose(i, k) : U32))","", "def slice_mask_loop(fuel: Nat, +rank: U32, +k: U32, mask: U32) -> U32:","  match fuel:","    case 0n:","      mask","    case 1n+p:","      +i = Nat.to_u32(p)","      +v = choose(i, k)","      +flag = C.pick(U32.is_gt(k, 0) && U32.is_le(v, rank), 1, 0)","      slice_mask_loop(p, (rank - flag * v : U32), (k - flag : U32), (mask .|. (flag << p) : U32))","", "def slice_mask(rank: U32) -> U32:","  slice_mask_loop(12n, (494 - rank : U32), 4, 0)","");
const pack=(vs,bits)=>`(${vs.map((v,i)=>i?`(${v} << ${i*bits}n : U32)`:v).join(" .|. ")} : U32)`;
const pop=i=>i?`(${Array.from({length:i},(_,j)=>`C.bit(mask, ${j})`).join(" + ")} : U32)`:"0";
const es=Array.from({length:12},(_,i)=>`C.pick(U32.is_eq(C.bit(mask, ${i}), 1), (8 + ${pop(i)} : U32), (${i} - ${pop(i)} : U32))`);
out.push("def slice_cube(+mask: U32) -> C.Cubie:",`  C.Cubie{1985229328, 0, ${pack(es.slice(0,8),4)}, ${pack(es.slice(8),4)}, 0}`,"");
const twist=Array.from({length:7},(_,i)=>`((rank / ${3**i}) % 3 : U32)`);
const cs=[...twist,`((3 - ((${twist.join(" + ")}) % 3)) % 3 : U32)`];
const flipParity=Array.from({length:11},(_,i)=>`C.bit(rank, ${i})`).join(" .^. ");
out.push("def decode(kind: Kind, +rank: U32) -> C.Cubie:","  match kind:","    case Twist{}:",`      C.Cubie{1985229328, ${pack(cs,2)}, 1985229328, 47768, 0}`,"    case Flip{}:",`      C.Cubie{1985229328, 0, 1985229328, 47768, (rank .|. ((${flipParity}) << 11n) : U32)}`,"    case Slice{}:","      slice_cube(slice_mask(rank))","    case Corners{}:","      C.Cubie{unrank8(rank), 0, 1985229328, 47768, 0}","    case Edges{}:","      C.Cubie{1985229328, 0, unrank8(rank), 47768, 0}","    case Middle{}:","      C.Cubie{1985229328, 0, 1985229328, (unrank4(rank) + 34952 : U32), 0}","");
const mask=pack(Array.from({length:12},(_,i)=>`${pick}(U32.is_ge(C.nib(${i<8?"ep":"eh"}, ${i%8}), 8), 1, 0)`),1);
out.push("def encode(kind: Kind, cube: C.Cubie) -> U32:","  match kind cube:","    case Twist{} C.Cubie{cp, +co, ep, eh, eo}:",`      (${Array.from({length:7},(_,i)=>`(((co >> ${2*i}n) .&. 3) * ${3**i})`).join(" + ")} : U32)`,"    case Flip{} C.Cubie{cp, co, ep, eh, eo}:","      (eo .&. 2047 : U32)","    case Slice{} C.Cubie{cp, co, +ep, +eh, eo}:",`      slice_rank_loop(12n, ${mask}, 0, 1, 0)`,"    case Corners{} C.Cubie{cp, co, ep, eh, eo}:","      rank8(cp)","    case Edges{} C.Cubie{cp, co, ep, eh, eo}:","      rank8(ep)","    case Middle{} C.Cubie{cp, co, ep, eh, eo}:","      rank4(eh)","");
const kinds=["Twist","Flip","Slice","Corners","Edges","Middle"],sizes=[2187,2048,495,40320,40320,24], counts=[18,18,18,10,10,10];
for(const [fn,values] of [["size",sizes],["moves",counts]])out.push(`def ${fn}(kind: Kind) -> U32:`,"  match kind:",...kinds.flatMap((k,i)=>[`    case ${k}{}:`,`      ${values[i]}`]),"");
let offset=0; const offsets=sizes.map((n,i)=>{const v=offset;offset+=n*counts[i];return v;});
out.push("def offset(kind: Kind) -> U32:","  match kind:",...kinds.flatMap((k,i)=>[`    case ${k}{}:`,`      ${offsets[i]}`]),"", "def phase2_move(index: U32) -> U32:","  match index:",...[0,1,2,4,7,9,10,11,13,16].flatMap((v,i)=>[`    case ${i}:`,`      ${v}`]),"    case _:","      16", "", "def transition(+kind: Kind, +index: U32, +move: U32) -> U32:","  encode(kind, C.turn(C.pick(U32.is_eq(moves(kind), 18), move, phase2_move(move)), decode(kind, index)))","");
const text=out.join("\n").replace(/\bKind\b/g,"Coord").replaceAll("Nat.to_u32", "U32.from_nat").replaceAll("(fuel: Nat,", "(+fuel: Nat,");
if(process.argv.includes("--check")){if(readFileSync("src/coordinates.bend","utf8")!==text)throw Error("stale coordinates");}else writeFileSync("src/coordinates.bend",text);
writeFileSync("build/layout.json",JSON.stringify({kinds,sizes,counts,offsets,transitionSize:offset},null,2));
