import assert from "node:assert/strict";
import {readFileSync,writeFileSync,mkdirSync} from "node:fs";
import {resolve} from "node:path";
import {createHash} from "node:crypto";
import {withArtifactLease} from "../scripts/artifact-lease.mjs";
import {text,same,simplify,parse,u32,extensionality} from "./packed-bit-compiler.mjs";

withArtifactLease();assert.equal(process.argv.length,3);const directory=resolve(process.argv[2]);assert.ok(directory.startsWith(resolve("build")+"/"));mkdirSync(directory,{recursive:true});
const hash=x=>createHash("sha256").update(x).digest("hex"),manifest=JSON.parse(readFileSync("bench/piece-cells.manifest.json","utf8"));for(const[p,h]of Object.entries(manifest.sourceHashes))assert.equal(hash(readFileSync(p)),h);
const imports=["import Base","import "+resolve("src/cubie.bend")+" as C","import "+resolve("src/model.bend")+" as M","import "+resolve("bench/piece-cells.bend")+" as P"],extract=[...imports,"import "+resolve("bench/packed-bit-logic.bend")+" as L","",...extensionality()],bits=Array.from({length:32},(_,i)=>"word"+i),projections=[];
extract.push("def twist_get(+word: U32, position: U32) -> U32:","  ((word >> U32.to_nat((position * 2 : U32))) .&. 3 : U32)","");
for(const [kind,width,count]of [["nib",4,8],["twist",2,8],["bit",1,12]])for(let i=0;i<count;i++){
  const offset=width*i,mask=2**width-1,raw=parse("((word >> "+offset+"n) .&. "+mask+" : U32)",["word"]),expected=bits.map((_,j)=>j<width?bits[offset+j]:false),proofs=raw.map((n,j)=>{const p=simplify(n);assert.ok(same(p.value,expected[j]));return p.proof;}),actual=(kind==="twist"?"twist_get":"C."+kind)+"(word, "+i+")";
  extract.push("def expected_"+kind+"_"+i+"(word: U32) -> U32:","  match word:","    case "+u32(bits.map(b=>"+"+b))+": "+u32(expected.map(text)),"","def "+kind+"_"+i+"(+word: U32) -> {"+actual+" == expected_"+kind+"_"+i+"(word) : U32}:","  match word:","    case "+u32(bits.map(b=>"+"+b))+":","      bits_ext("+[...raw.map(text),...expected.map(text),...proofs].join(", ")+")","");projections.push({kind,width,position:i});
}
const kinds=manifest.kinds.map((k,i)=>({...k,prefix:i?"E":"C",size:i?2:3,count:i?12:8,pieceBits:i?4:3,orientationBits:i?1:2})),fields=kinds.flatMap(k=>Array.from({length:k.count},(_,i)=>({name:k.prefix.toLowerCase()+i,kind:k,i}))),pattern=fields.map(f=>"+"+f.name).join(", "),lines=[...imports,"import ./extractors.bend as E",""];
for(const k of kinds)for(const family of["piece","orientation"]){
  const stem=k.name.toLowerCase()+"_"+family,width=k[family+"Bits"],states=Array.from({length:24},(_,i)=>({name:k.prefix+Math.floor(i/k.size)+i%k.size,value:family==="piece"?Math.floor(i/k.size):i%k.size}));
  lines.push("def "+stem+"(state: P."+k.name+") -> U32:","  match state:",...states.map(s=>"    case P."+s.name+"{}: "+s.value),"");
  for(let bit=0;bit<width;bit++)lines.push("def "+stem+"_b"+bit+"(state: P."+k.name+") -> Bool:","  match state:",...states.map(s=>"    case P."+s.name+"{}: "+text(Boolean((s.value>>>bit)&1))),"");
  lines.push("def "+stem+"_word(+state: P."+k.name+") -> U32:","  "+u32(Array.from({length:32},(_,bit)=>bit<width?stem+"_b"+bit+"(state)":"False{}")),"","def "+stem+"_word_correct(+state: P."+k.name+") -> {"+stem+"_word(state) == "+stem+"(state) : U32}:","  match state:",...states.map(s=>"    case P."+s.name+"{}: {==}"),"");
}
const layouts=[{name:"cp",family:"piece",kind:kinds[0],width:4,start:0,count:8,extract:"nib"},{name:"co",family:"orientation",kind:kinds[0],width:2,start:0,count:8,extract:"twist"},{name:"ep",family:"piece",kind:kinds[1],width:4,start:0,count:8,extract:"nib"},{name:"eh",family:"piece",kind:kinds[1],width:4,start:8,count:4,extract:"nib"},{name:"eo",family:"orientation",kind:kinds[1],width:1,start:0,count:12,extract:"bit"}];
for(const layout of layouts){
  const {name,kind,family,width,start,count}=layout,stem=kind.name.toLowerCase()+"_"+family;
  lines.push("def pack_"+name+"(cells: P.PieceCells) -> U32:","  match cells:","    case P.PieceCells{"+pattern+"}:","      "+u32(Array.from({length:32},(_,bit)=>{const position=Math.floor(bit/width),offset=bit%width;return position<count&&offset<kind[family+"Bits"]?stem+"_b"+offset+"("+kind.prefix.toLowerCase()+(start+position)+")":"False{}";})),"","def "+name+"_word(cube: C.Cubie) -> U32:","  match cube:","    case C.Cubie{cp, co, ep, eh, eo}: "+name,"");
}
lines.push("def pack(+cells: P.PieceCells) -> C.Cubie:","  C.Cubie{"+layouts.map(l=>"pack_"+l.name+"(cells)").join(", ")+"}","");
for(const f of fields)lines.push("def cell_"+f.name+"(cells: P.PieceCells) -> P."+f.kind.name+":","  match cells:","    case P.PieceCells{"+fields.map(f=>f.name).join(", ")+"}: "+f.name,"");
for(const layout of layouts)for(let local=0;local<layout.count;local++){
  const global=layout.start+local,cell=layout.kind.prefix.toLowerCase()+global,stem=layout.kind.name.toLowerCase()+"_"+layout.family,name=stem+"_"+global,field=layout.name+"_word(pack(cells))",actual=(layout.extract==="twist"?"E.twist_get":"C."+layout.extract)+"("+field+", "+local+")";
  lines.push("def "+name+"(+cells: P.PieceCells) -> {"+actual+" == "+stem+"(cell_"+cell+"(cells)) : U32}:","  match cells:","    case P.PieceCells{"+pattern+"}:","      Equal.trans(U32, "+actual+", "+stem+"_word("+cell+"), "+stem+"("+cell+"), E."+layout.extract+"_"+local+"("+field+"), "+stem+"_word_correct("+cell+"))","");
}
for(const k of kinds){
  const lower=k.name.toLowerCase(),color="C."+lower+"_color",formula=k.size===3?"((3 + side - orientation : U32) % 3 : U32)":"(side .^. orientation : U32)";
  lines.push("def "+lower+"_color_from(+side: U32, piece: U32, orientation: U32) -> U32:","  "+color+"(piece, "+formula+")","");
  for(let side=0;side<k.size;side++)lines.push("def "+lower+"_color_"+side+"(+state: P."+k.name+") -> {"+lower+"_color_from("+side+", "+lower+"_piece(state), "+lower+"_orientation(state)) == P."+lower+"_color"+side+"(state) : U32}:","  match state:",...Array.from({length:24},(_,i)=>"    case P."+k.prefix+Math.floor(i/k.size)+i%k.size+"{}: {==}"),"");
  const call=(p,o)=>lower+"_color_from(side, "+p+", "+o+")";
  lines.push("def "+lower+"_color_cong(+side: U32, +a: U32, +b: U32, +c: U32, +d: U32, ep: {a == c : U32}, eo: {b == d : U32}) -> {"+call("a","b")+" == "+call("c","d")+" : U32}:","  Equal.trans(U32, "+call("a","b")+", "+call("c","b")+", "+call("c","d")+", Equal.cong(U32, U32, piece => "+call("piece","b")+", a, c, ep), Equal.cong(U32, U32, orientation => "+call("c","orientation")+", b, d, eo))","");
}
const actual=[],expected=[],proofs=[];
for(let at=0;at<54;at++){
  const f=fields.find(f=>f.kind.slots[f.i].includes(at));if(!f){actual.push(String(Math.floor(at/9)));expected.push(String(Math.floor(at/9)));proofs.push("{==}");continue;}
  const lower=f.kind.name.toLowerCase(),side=f.kind.slots[f.i].indexOf(at),pieceLayout=f.kind.name==="Corner"?"cp":f.i<8?"ep":"eh",position=f.kind.name==="Corner"?f.i:f.i%8,cp="C.nib("+pieceLayout+"_word(pack(cells)), "+position+")",co=f.kind.name==="Corner"?"E.twist_get(co_word(pack(cells)), "+f.i+")":"C.bit(eo_word(pack(cells)), "+f.i+")",left=lower+"_color_from("+side+", "+cp+", "+co+")",middle=lower+"_color_from("+side+", "+lower+"_piece("+f.name+"), "+lower+"_orientation("+f.name+"))",right="P."+lower+"_color"+side+"("+f.name+")";
  actual.push(left);expected.push(right);proofs.push("Equal.trans(U32, "+left+", "+middle+", "+right+", "+lower+"_color_cong("+side+", "+cp+", "+co+", "+lower+"_piece("+f.name+"), "+lower+"_orientation("+f.name+"), "+lower+"_piece_"+f.i+"(cells), "+lower+"_orientation_"+f.i+"(cells)), "+lower+"_color_"+side+"("+f.name+"))");
}
lines.push("def view_refinement(+cells: P.PieceCells) -> {C.to_facelets(pack(cells)) == P.to_facelets(cells) : M.Cube}:","  match cells:","    case P.PieceCells{"+pattern+"}:","      P.cube_ext("+[...actual,...expected,...proofs].join(", ")+")","");
const params=fields.map(f=>f.name+": U32").join(", "),testCells="P.PieceCells{"+fields.map(f=>"P."+f.kind.name.toLowerCase()+"_test_at("+f.name+")").join(", ")+"}";
lines.push("def packed_words(cube: C.Cubie) -> +List<U32>:","  match cube:","    case C.Cubie{cp, co, ep, eh, eo}: [cp, co, ep, eh, eo]","","def test_pack("+params+") -> +List<U32>:","  packed_words(pack("+testCells+"))","","def test_view("+params+") -> M.Cube:","  C.to_facelets(pack("+testCells+"))","","def test_reference_view("+params+") -> M.Cube:","  P.to_facelets("+testCells+")","");
const files={"extractors.bend":extract.join("\n"),"packing.bend":lines.join("\n")};for(const[p,s]of Object.entries(files))writeFileSync(resolve(directory,p),s,{flag:"wx"});writeFileSync(resolve(directory,"manifest.json"),JSON.stringify({format:"rubend-typed-packing-v1",sourceHashes:Object.fromEntries(["src/cubie.bend","bench/piece-cells.bend","bench/piece-cells.manifest.json","bench/packed-bit-compiler.mjs","bench/packed-bit-logic.bend"].map(p=>[p,hash(readFileSync(p))])),artifacts:Object.fromEntries(Object.entries(files).map(([p,s])=>[p,hash(s)])),projections,componentEqualities:40,viewRefinementStatement:true,moveRefinementProved:false,inverseProved:false},null,2)+"\n",{flag:"wx"});console.log(JSON.stringify({passed:true,directory,extractors:projections.length,components:40,bytes:Object.values(files).reduce((n,s)=>n+s.length,0)}));
