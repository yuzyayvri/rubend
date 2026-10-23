import assert from "node:assert/strict";
import {readFileSync,writeFileSync} from "node:fs";
import {createHash} from "node:crypto";

assert.ok(process.argv.length===2||(process.argv.length===3&&process.argv[2]==="--check"));
const check=process.argv[2]==="--check",manifest=JSON.parse(readFileSync("bench/piece-cells.manifest.json","utf8")),hash=x=>createHash("sha256").update(x).digest("hex"),kinds=manifest.kinds.map((k,i)=>({...k,prefix:i?"E":"C",size:i?2:3,count:i?12:8})),moves=[..."URFDLB"].flatMap(f=>[f,f+"2",f+"i"]),fields=kinds.flatMap(k=>Array.from({length:k.count},(_,i)=>({name:k.prefix.toLowerCase()+i,kind:k,i}))),pattern=fields.map(f=>"+"+f.name).join(", "),lines=["import Base","import ../src/model.bend as M","import ./piece-cells.bend as P",""];
assert.equal(hash(readFileSync("bench/piece-cells.bend")),manifest.outputSha256);
const rotated=(k,term,n)=>{for(let i=0;i<n;i++)term="P."+k.name.toLowerCase()+"_rotate("+term+")";return term;};
for(const k of kinds){
  const lower=k.name.toLowerCase();lines.push("def "+lower+"_substitute(+root: P.PieceCells, state: P."+k.name+") -> P."+k.name+":","  match root state:");
  for(let piece=0;piece<k.count;piece++)for(let orientation=0;orientation<k.size;orientation++)lines.push("    case P.PieceCells{"+pattern+"} P."+k.prefix+piece+orientation+"{}: "+rotated(k,k.prefix.toLowerCase()+piece,orientation));
  lines.push("","def "+lower+"_substitute_rotate(+root: P.PieceCells, +state: P."+k.name+") -> {"+lower+"_substitute(root, P."+lower+"_rotate(state)) == P."+lower+"_rotate("+lower+"_substitute(root, state)) : P."+k.name+"}:","  match root state:");
  for(let piece=0;piece<k.count;piece++)for(let orientation=0;orientation<k.size;orientation++)lines.push("    case P.PieceCells{"+pattern+"} P."+k.prefix+piece+orientation+"{}: "+(orientation<k.size-1?"{==}":"Equal.sym(P."+k.name+", "+rotated(k,k.prefix.toLowerCase()+piece,k.size)+", "+k.prefix.toLowerCase()+piece+", P."+lower+"_cycle("+k.prefix.toLowerCase()+piece+"))"));
  lines.push("");
  if(k.size===3)lines.push("def corner_substitute_rotate2(+root: P.PieceCells, +state: P.Corner) -> {corner_substitute(root, P.corner_rotate(P.corner_rotate(state))) == P.corner_rotate(P.corner_rotate(corner_substitute(root, state))) : P.Corner}:","  Equal.trans(P.Corner, corner_substitute(root, P.corner_rotate(P.corner_rotate(state))), P.corner_rotate(corner_substitute(root, P.corner_rotate(state))), P.corner_rotate(P.corner_rotate(corner_substitute(root, state))), corner_substitute_rotate(root, P.corner_rotate(state)), Equal.cong(P.Corner, P.Corner, P.corner_rotate, corner_substitute(root, P.corner_rotate(state)), P.corner_rotate(corner_substitute(root, state)), corner_substitute_rotate(root, state)))","");
}
const substitute=(k,state)=>k.name.toLowerCase()+"_substitute(root, "+state+")";
lines.push("def compose(+root: P.PieceCells, cells: P.PieceCells) -> P.PieceCells:","  match cells:","    case P.PieceCells{"+pattern+"}:","      P.PieceCells{"+fields.map(f=>substitute(f.kind,f.name)).join(", ")+"}","","def compose_identity(+root: P.PieceCells) -> {compose(root, P.solved_cells()) == root : P.PieceCells}:","  match root:","    case P.PieceCells{"+pattern+"}: {==}","","def compose_turn(+root: P.PieceCells, +move: M.Move, +cells: P.PieceCells) -> {compose(root, P.turn(move, cells)) == P.turn(move, compose(root, cells)) : P.PieceCells}:","  match move cells:");
for(const [m,name]of moves.entries()){
  const left=fields.map(f=>{const map=f.kind.maps[m][f.i];return substitute(f.kind,rotated(f.kind,f.kind.prefix.toLowerCase()+map.source,map.rotations));}),right=fields.map(f=>{const map=f.kind.maps[m][f.i];return rotated(f.kind,substitute(f.kind,f.kind.prefix.toLowerCase()+map.source),map.rotations);}),proofs=fields.map(f=>{const map=f.kind.maps[m][f.i];return map.rotations?f.kind.name.toLowerCase()+"_substitute_rotate"+(map.rotations===2?"2":"")+"(root, "+f.kind.prefix.toLowerCase()+map.source+")":"{==}";});
  lines.push("    case M."+name+"{} P.PieceCells{"+pattern+"}:","      P.cells_ext("+[...left,...right,...proofs].join(", ")+")");
}
lines.push("","def compose_word(+root: P.PieceCells, +word: +List<M.Move>, +cells: P.PieceCells) -> {compose(root, P.replay(word, cells)) == P.replay(word, compose(root, cells)) : P.PieceCells}:","  match word:","    case Nil{}: {==}","    case Con{+move, +rest}:","      Equal.trans(P.PieceCells, compose(root, P.replay(rest, P.turn(move, cells))), P.replay(rest, compose(root, P.turn(move, cells))), P.replay(rest, P.turn(move, compose(root, cells))), compose_word(root, rest, P.turn(move, cells)), Equal.cong(P.PieceCells, P.PieceCells, state => P.replay(rest, state), compose(root, P.turn(move, cells)), P.turn(move, compose(root, cells)), compose_turn(root, move, cells)))","");
const text=lines.join("\n"),path="bench/piece-cell-composition.bend";
if(check)assert.equal(readFileSync(path,"utf8"),text);else writeFileSync(path,text);
console.log(JSON.stringify({passed:true,check,moves:18,statement:"Cell substitution identity and equivariance; state inversion is not assumed"}));
