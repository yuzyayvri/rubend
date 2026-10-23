import assert from "node:assert/strict";
import {readFileSync,writeFileSync} from "node:fs";
import {createHash} from "node:crypto";

assert.ok(process.argv.length===2||(process.argv.length===3&&process.argv[2]==="--check"));
const check=process.argv[2]==="--check",model=readFileSync("src/model.bend","utf8"),cubie=readFileSync("src/cubie.bend","utf8"),hash=x=>createHash("sha256").update(x).digest("hex");
const moves=[..."URFDLB"].flatMap(f=>[f,f+"2",f+"i"]),permutations=moves.map(name=>{const m=model.match(new RegExp("def turn_"+name+"\\(cube: Cube\\) -> Cube:\\n  match cube:\\n    case Cube\\{[^}]+\\}:\\n      Cube\\{([^}]+)\\}"));assert.ok(m);return m[1].split(", ").map(s=>Number(s.slice(1)));});
const validation=cubie.slice(cubie.indexOf("def validate(cube:"),cubie.indexOf("def corner_color("));
const kinds=[{name:"Corner",prefix:"C",count:8,size:3},{name:"Edge",prefix:"E",count:12,size:2}];
for(const k of kinds){
  k.slots=[...validation.matchAll(new RegExp("find_"+k.name.toLowerCase()+"\\((s\\d+(?:, s\\d+)+)\\)","g"))].map(m=>m[1].split(", ").map(s=>Number(s.slice(1))));assert.equal(k.slots.length,k.count);assert.ok(k.slots.every(s=>s.length===k.size));
  const start=cubie.indexOf("def "+k.name.toLowerCase()+"_color("),end=cubie.indexOf("\ndef ",start+1),body=cubie.slice(start,end);
  k.colors=Array.from({length:k.count},()=>Array(k.size));
  for(const m of body.matchAll(/case (\d+) (\d+):\n      (\d+)/g))k.colors[Number(m[1])][Number(m[2])]=Number(m[3]);
  assert.equal(k.colors.flat().length,k.count*k.size);
  assert.ok(k.colors.every(p=>p.every(c=>Number.isInteger(c)&&c>=0&&c<6)));
  k.states=Array.from({length:k.count*k.size},(_,i)=>({name:k.prefix+Math.floor(i/k.size)+i%k.size,piece:Math.floor(i/k.size),orientation:i%k.size}));
  k.encoded=k.states.map(s=>Array.from({length:k.size},(_,i)=>k.colors[s.piece][(i-s.orientation+k.size)%k.size]));assert.equal(new Set(k.encoded.map(c=>c.join(","))).size,24);
  k.maps=permutations.map(p=>k.slots.map(slots=>{
    const taken=slots.map(s=>p[s]),source=k.slots.findIndex(s=>s.every(x=>taken.includes(x)));assert.ok(source>=0);
    const order=taken.map(s=>k.slots[source].indexOf(s));assert.ok(order.every((n,i)=>n===(order[0]+i)%k.size),"Noncyclic piece transport");
    return{source,rotations:(k.size-order[0])%k.size};
  }));
}
const allSlots=kinds.flatMap(k=>k.slots.flat());assert.equal(new Set(allSlots).size,48);assert.deepEqual(Array.from({length:54},(_,i)=>i).filter(i=>!allSlots.includes(i)),[4,13,22,31,40,49]);
for(const p of permutations){assert.deepEqual([...p].sort((a,b)=>a-b),Array.from({length:54},(_,i)=>i));for(const i of[4,13,22,31,40,49])assert.equal(p[i],i);}
const lines=["import Base","import ../src/model.bend as M",""];
for(const k of kinds){
  const lower=k.name.toLowerCase(),colorType=k.name+"Colors",vars=Array.from({length:k.size},(_,i)=>"a"+i),rotateState=s=>k.states[s.piece*k.size+(s.orientation+1)%k.size].name;
  lines.push("type "+k.name+" is Data:",...k.states.map(s=>"  "+s.name+"{}"),"","type "+colorType+" is Data:","  "+colorType+"{"+vars.map(v=>v+": U32").join(", ")+"}","","def "+lower+"_encode(state: "+k.name+") -> "+colorType+":","  match state:",...k.states.map((s,i)=>"    case "+s.name+"{}: "+colorType+"{"+k.encoded[i].join(", ")+"}"),"");
  lines.push("def "+lower+"_decode(colors: "+colorType+") -> Maybe<&2, "+k.name+">:","  match colors:",...k.states.map((s,i)=>"    case "+colorType+"{"+k.encoded[i].join(", ")+"}: Some{"+s.name+"{}}"),"    case _: None{}","");
  lines.push("def "+lower+"_recover(colors: "+colorType+") -> "+k.name+":","  match colors:",...k.states.map((s,i)=>"    case "+colorType+"{"+k.encoded[i].join(", ")+"}: "+s.name+"{}"),"    case _: "+k.states[0].name+"{}","");
  for(const [name,ret]of [["decode_encoded","{ "+lower+"_decode("+lower+"_encode(state)) == Some{state} : Maybe<&2, "+k.name+">}"],["roundtrip","{"+lower+"_recover("+lower+"_encode(state)) == state : "+k.name+"}"]])lines.push("def "+lower+"_"+name+"(+state: "+k.name+") -> "+ret+":","  match state:",...k.states.map(s=>"    case "+s.name+"{}: {==}"),"");
  lines.push("def "+lower+"_injective(+a: "+k.name+", +b: "+k.name+", evidence: {"+lower+"_encode(a) == "+lower+"_encode(b) : "+colorType+"}) -> {a == b : "+k.name+"}:","  Equal.trans("+k.name+", a, "+lower+"_recover("+lower+"_encode(a)), b, Equal.sym("+k.name+", "+lower+"_recover("+lower+"_encode(a)), a, "+lower+"_roundtrip(a)), Equal.trans("+k.name+", "+lower+"_recover("+lower+"_encode(a)), "+lower+"_recover("+lower+"_encode(b)), b, Equal.cong("+colorType+", "+k.name+", "+lower+"_recover, "+lower+"_encode(a), "+lower+"_encode(b), evidence), "+lower+"_roundtrip(b)))","");
  lines.push("def "+lower+"_rotate(state: "+k.name+") -> "+k.name+":","  match state:",...k.states.map(s=>"    case "+s.name+"{}: "+rotateState(s)+"{}"),"","def "+lower+"_colors_rotate(colors: "+colorType+") -> "+colorType+":","  match colors:","    case "+colorType+"{"+vars.join(", ")+"}: "+colorType+"{"+[vars.at(-1),...vars.slice(0,-1)].join(", ")+"}","","def "+lower+"_encode_rotate(+state: "+k.name+") -> {"+lower+"_encode("+lower+"_rotate(state)) == "+lower+"_colors_rotate("+lower+"_encode(state)) : "+colorType+"}:","  match state:",...k.states.map(s=>"    case "+s.name+"{}: {==}"),"");
  let cycle="state";for(let i=0;i<k.size;i++)cycle=lower+"_rotate("+cycle+")";
  lines.push("def "+lower+"_cycle(+state: "+k.name+") -> {"+cycle+" == state : "+k.name+"}:","  match state:",...k.states.map(s=>"    case "+s.name+"{}: {==}"),"","def "+lower+"_index(state: "+k.name+") -> U32:","  match state:",...k.states.map((s,i)=>"    case "+s.name+"{}: "+i),"","def "+lower+"_test_at(index: U32) -> "+k.name+":","  match index:",...k.states.slice(0,-1).map((s,i)=>"    case "+i+": "+s.name+"{}"),"    case _: "+k.states.at(-1).name+"{}","");
  for(let i=0;i<k.size;i++)lines.push("def "+lower+"_color"+i+"_read(colors: "+colorType+") -> U32:","  match colors:","    case "+colorType+"{"+vars.join(", ")+"}: "+vars[i],"","def "+lower+"_color"+i+"(state: "+k.name+") -> U32:","  "+lower+"_color"+i+"_read("+lower+"_encode(state))","");
}
const fields=kinds.flatMap(k=>Array.from({length:k.count},(_,i)=>({name:k.prefix.toLowerCase()+i,kind:k,i}))),pattern=fields.map(f=>f.name).join(", ");
lines.push("type PieceCells is Data:","  PieceCells{"+fields.map(f=>f.name+": "+f.kind.name).join(", ")+"}","","def turn(move: M.Move, cells: PieceCells) -> PieceCells:","  match move cells:");
for(const [m,name]of moves.entries())lines.push("    case M."+name+"{} PieceCells{"+pattern+"}:","      PieceCells{"+fields.map(f=>{const map=f.kind.maps[m][f.i];let value=f.kind.prefix.toLowerCase()+map.source;for(let r=0;r<map.rotations;r++)value=f.kind.name.toLowerCase()+"_rotate("+value+")";return value;}).join(", ")+"}");
const facelets=Array.from({length:54},(_,i)=>{const f=fields.find(f=>f.kind.slots[f.i].includes(i));return f?f.kind.name.toLowerCase()+"_color"+f.kind.slots[f.i].indexOf(i)+"("+f.name+")":String(Math.floor(i/9));});
lines.push("","def to_facelets(cells: PieceCells) -> M.Cube:","  match cells:","    case PieceCells{"+fields.map(f=>"+"+f.name).join(", ")+"}:","      M.Cube{"+facelets.join(", ")+"}","","def indices(cells: PieceCells) -> +List<U32>:","  match cells:","    case PieceCells{"+pattern+"}:","      ["+fields.map(f=>f.kind.name.toLowerCase()+"_index("+f.name+")").join(", ")+"]","");
const params=fields.map(f=>f.name+": U32").join(", "),initial="PieceCells{"+fields.map(f=>f.kind.name.toLowerCase()+"_test_at("+f.name+")").join(", ")+"}";
lines.push("def test_facelets("+params+") -> M.Cube:","  to_facelets("+initial+")","","def test_turn(move: U32, "+params+") -> M.Cube:","  to_facelets(turn(M.from_index(move), "+initial+"))","","def test_indices(move: U32, "+params+") -> +List<U32>:","  indices(turn(M.from_index(move), "+initial+"))","");
lines.push("def solved_cells() -> PieceCells:","  PieceCells{"+fields.map(f=>f.kind.prefix+f.i+"0{}").join(", ")+"}","","def solved_refinement() -> {to_facelets(solved_cells()) == M.solved() : M.Cube}:","  {==}","");
const labels=Array.from({length:54},(_,i)=>"a"+i),others=Array.from({length:54},(_,i)=>"b"+i),cube=xs=>"M.Cube{"+xs.join(", ")+"}";
lines.push("def cube_ext("+[...labels.map(v=>"+"+v+": U32"),...others.map(v=>"+"+v+": U32"),...labels.map((v,i)=>"e"+i+": {"+v+" == b"+i+" : U32}")].join(", ")+") -> {"+cube(labels)+" == "+cube(others)+" : M.Cube}:");
for(let i=0;i<54;i++)lines.push("  %e"+i+" : {"+cube(labels)+" == "+cube(others.map((v,j)=>j<i?labels[j]:j===i?"_":v))+" : M.Cube}");
lines.push("  {==}","");
for(const k of kinds)for(let rotations=1;rotations<k.size;rotations++)for(let side=0;side<k.size;side++){
  let rotated="state";for(let i=0;i<rotations;i++)rotated=k.name.toLowerCase()+"_rotate("+rotated+")";
  const lower=k.name.toLowerCase();lines.push("def "+lower+"_project_"+rotations+"_"+side+"(+state: "+k.name+") -> {"+lower+"_color"+side+"("+rotated+") == "+lower+"_color"+((side-rotations+k.size)%k.size)+"(state) : U32}:","  match state:",...k.states.map(s=>"    case "+s.name+"{}: {==}"),"");
}
lines.push("def move_refinement(+move: M.Move, +cells: PieceCells) -> {to_facelets(turn(move, cells)) == M.turn(move, to_facelets(cells)) : M.Cube}:","  match move cells:");
for(const [m,name]of moves.entries()){
  const left=Array.from({length:54},(_,at)=>{
    const f=fields.find(f=>f.kind.slots[f.i].includes(at));if(!f)return String(Math.floor(at/9));const map=f.kind.maps[m][f.i];let value=f.kind.prefix.toLowerCase()+map.source;for(let i=0;i<map.rotations;i++)value=f.kind.name.toLowerCase()+"_rotate("+value+")";return f.kind.name.toLowerCase()+"_color"+f.kind.slots[f.i].indexOf(at)+"("+value+")";
  });
  const proofs=Array.from({length:54},(_,at)=>{const f=fields.find(f=>f.kind.slots[f.i].includes(at));if(!f)return"{==}";const map=f.kind.maps[m][f.i];return map.rotations?f.kind.name.toLowerCase()+"_project_"+map.rotations+"_"+f.kind.slots[f.i].indexOf(at)+"("+f.kind.prefix.toLowerCase()+map.source+")":"{==}";});
  lines.push("    case M."+name+"{} PieceCells{"+fields.map(f=>"+"+f.name).join(", ")+"}:","      cube_ext("+[...left,...permutations[m].map(at=>facelets[at]),...proofs].join(", ")+")");
}
lines.push("","def replay(word: +List<M.Move>, cells: PieceCells) -> PieceCells:","  match word:","    case Nil{}: cells","    case Con{move, rest}: replay(rest, turn(move, cells))","","def replay_refinement(+word: +List<M.Move>, +cells: PieceCells) -> {to_facelets(replay(word, cells)) == M.replay(word, to_facelets(cells)) : M.Cube}:","  match word:","    case Nil{}: {==}","    case Con{+move, +rest}:","      Equal.trans(M.Cube, to_facelets(replay(rest, turn(move, cells))), M.replay(rest, to_facelets(turn(move, cells))), M.replay(rest, M.turn(move, to_facelets(cells))), replay_refinement(rest, turn(move, cells)), Equal.cong(M.Cube, M.Cube, view => M.replay(rest, view), to_facelets(turn(move, cells)), M.turn(move, to_facelets(cells)), move_refinement(move, cells)))","");
const text=lines.join("\n"),path="bench/piece-cells.bend",manifest=JSON.stringify({format:"rubend-piece-cells-v1",sourceHashes:{"src/model.bend":hash(model),"src/cubie.bend":hash(cubie)},outputSha256:hash(text),kinds:kinds.map(({name,slots,colors,maps})=>({name,slots,colors,maps})),scope:"Finite cell codecs and rotation identities, whole-state one-move and word refinement statements. Verification receipts determine their checked status. Inverse reconstruction and packed correspondence remain open."},null,2)+"\n";
if(check){assert.equal(readFileSync(path,"utf8"),text);assert.equal(readFileSync("bench/piece-cells.manifest.json","utf8"),manifest);}else{writeFileSync(path,text);writeFileSync("bench/piece-cells.manifest.json",manifest);}
console.log(JSON.stringify({passed:true,check,cells:20,statesPerKind:24,wholeStateRefinementStatement:true}));
