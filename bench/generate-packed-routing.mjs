import assert from "node:assert/strict";
import {readFileSync,writeFileSync,mkdirSync} from "node:fs";
import {resolve} from "node:path";
import {createHash} from "node:crypto";
import {withArtifactLease} from "../scripts/artifact-lease.mjs";

withArtifactLease();
const [out,countText]=process.argv.slice(2);assert.equal(process.argv.length,4);const count=Number(countText);assert.ok([1,18].includes(count));const directory=resolve(out);assert.ok(directory.startsWith(resolve("build")+"/"));mkdirSync(directory,{recursive:true});
const cubie=readFileSync("src/cubie.bend","utf8"),manifest=JSON.parse(readFileSync("bench/piece-cells.manifest.json","utf8")),names=[..."URFDLB"].flatMap(f=>[f,f+"2",f+"i"]),hash=x=>createHash("sha256").update(x).digest("hex");
for(const[p,h]of Object.entries(manifest.sourceHashes))assert.equal(hash(readFileSync(p)),h,"Stale piece-cell manifest");
const model=readFileSync("src/model.bend","utf8"),slots=manifest.kinds[0].slots,reference=names.map((name,move)=>{
  const m=model.match(new RegExp("def turn_"+name+"\\(cube: Cube\\) -> Cube:\\n  match cube:\\n    case Cube\\{[^}]+\\}:\\n      Cube\\{([^}]+)\\}"));assert.ok(m);const p=m[1].split(", ").map(s=>Number(s.slice(1)));assert.deepEqual([...p].sort((a,b)=>a-b),Array.from({length:54},(_,i)=>i));
  const map=slots.map(target=>{const moved=target.map(at=>p[at]),source=slots.findIndex(s=>s.every(at=>moved.includes(at)));assert.ok(source>=0);return source;});assert.deepEqual(map,manifest.kinds[0].maps[move].map(m=>m.source));return map;
});
const text=n=>typeof n==="boolean"?(n?"True{}":"False{}"):typeof n==="string"?n:n[0]==="not"?"Bool.not("+text(n[1])+")":"Bool."+n[0]+"("+text(n[1])+", "+text(n[2])+")",same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
function simplify(n){
  if(!Array.isArray(n))return{value:n,proof:"{==}"};
  assert.notEqual(n[0],"not","Unexpected nested negation in routing input");const [op,rawA,rawB]=n,a=simplify(rawA),b=simplify(rawB),middle=[op,a.value,b.value];let value=middle,step="{==}";
  if(typeof a.value==="boolean")value=op==="and"?(a.value?b.value:false):op==="or"?(a.value?true:b.value):(a.value?["not",b.value]:b.value);
  else if(typeof b.value==="boolean"){value=op==="and"?(b.value?a.value:false):op==="or"?(b.value?true:a.value):(b.value?["not",a.value]:a.value);step="L."+op+"_"+b.value+"("+text(a.value)+")";}
  const children=a.proof==="{==}"&&b.proof==="{==}"?"{==}":"L."+op+"_cong("+[text(rawA),text(rawB),text(a.value),text(b.value),a.proof,b.proof].join(", ")+")";
  return{value,proof:children==="{==}"?step:step==="{==}"?children:"Equal.trans(Bool, "+text(n)+", "+text(middle)+", "+text(value)+", "+children+", "+step+")"};
}
function parse(source){
  const tokens=source.match(/\.\|\.|\.&\.|\.\^\.|<<|>>|[():]|\d+n?|[A-Za-z_][A-Za-z_0-9]*/g);assert.equal(tokens.join(""),source.replace(/\s/g,""),"Unsupported packing syntax");let at=0;
  const precedence={".|.":1,".^.":2,".&.":3,"<<":4,">>":4};
  function expression(min=0){
    let node;const token=tokens[at++];
    if(token==="("){node=expression();if(tokens[at]===":"){at++;assert.equal(tokens[at++],"U32");}assert.equal(tokens[at++],")");}
    else if(/^\d+n?$/.test(token))node={literal:Number(token.replace("n","")),bits:Array.from({length:32},(_,i)=>Boolean((Number(token.replace("n",""))>>>i)&1))};
    else{assert.ok(["cp","co","ep","eh","eo"].includes(token));node={bits:Array.from({length:32},(_,i)=>token+i)};}
    while(precedence[tokens[at]]>=min){const op=tokens[at++],right=expression(precedence[op]+1);
      if(op==="<<"||op===">>"){assert.ok(Number.isInteger(right.literal)&&right.literal>=0);const shift=right.literal;node={bits:Array.from({length:32},(_,i)=>{const sourceIndex=op==="<<"?i-shift:i+shift;return sourceIndex<0||sourceIndex>=32?false:node.bits[sourceIndex];})};}
      else{const name={".|.":"or",".&.":"and",".^.":"xor"}[op];node={bits:node.bits.map((bit,i)=>[name,bit,right.bits[i]])};}
    }
    return node;
  }
  const result=expression();assert.equal(at,tokens.length);return result.bits;
}
function fields(move){const begin=cubie.indexOf("    case "+move+" Cubie{");assert.ok(begin>=0);const start=cubie.indexOf("\n      Cubie{",begin)+13;assert.ok(start>begin);let depth=0,from=start;const result=[];for(let i=start;i<cubie.length;i++){const c=cubie[i];if(c==="(")depth++;if(c===")")depth--;if((c===","&&depth===0)||c==="}"){result.push(cubie.slice(from,i).trim());from=i+1;if(c==="}")break;}}assert.equal(result.length,5);return result;}
const word=xs=>xs.reduceRight((tail,bit)=>"WCon{"+bit+", "+tail+"}","WNil{}"),u32=xs=>"U32{"+word(xs)+"}",a=Array.from({length:32},(_,i)=>"a"+i),b=Array.from({length:32},(_,i)=>"b"+i),bits=Array.from({length:32},(_,i)=>"cp"+i),lines=["import Base","import "+resolve("src/cubie.bend")+" as C","import "+resolve("bench/packed-bit-logic.bend")+" as L",""];
lines.push("def bits_ext("+[...a.map(v=>"+"+v+": Bool"),...b.map(v=>"+"+v+": Bool"),...a.map((v,i)=>"e"+i+": {"+v+" == b"+i+" : Bool}")].join(", ")+") -> {"+u32(a)+" == "+u32(b)+" : U32}:");for(let i=0;i<32;i++)lines.push("  %e"+i+" : {"+u32(a)+" == "+u32(b.map((v,j)=>j<i?a[j]:j===i?"_":v))+" : U32}");lines.push("  {==}","","def corner_word(cube: C.Cubie) -> U32:","  match cube:","    case C.Cubie{cp, co, ep, eh, eo}: cp","");
const statements=[];
for(let move=0;move<count;move++){
  const raw=fields(move)[0],rawBits=parse(raw),expected=bits.map((_,i)=>"cp"+(4*reference[move][Math.floor(i/4)]+i%4)),proofs=rawBits.map((n,i)=>{const p=simplify(n);assert.ok(same(p.value,expected[i]),"Reference routing disagreement "+move+" bit "+i);return p.proof;}),name=names[move],pattern="C.Cubie{"+u32(bits.map(v=>"+"+v))+", co, ep, eh, eo}";
  lines.push("def expected_cp_"+name+"(cube: C.Cubie) -> U32:","  match cube:","    case "+pattern+": "+u32(expected),"","def cp_route_"+name+"(+cube: C.Cubie) -> {corner_word(C.turn("+move+", cube)) == expected_cp_"+name+"(cube) : U32}:","  match cube:","    case "+pattern+":","      bits_ext("+[...rawBits.map(text),...expected,...proofs].join(", ")+")","");statements.push({move,name,sourceIndices:manifest.kinds[0].maps[move].map(m=>m.source)});
}
lines.push("def test_corner(move: U32, cp: U32) -> U32:","  corner_word(C.turn(move, C.Cubie{cp, 0, 0, 0, 0}))","");
const generated=lines.join("\n"),path=resolve(directory,"corner-routing.bend");writeFileSync(path,generated,{flag:"wx"});writeFileSync(resolve(directory,"manifest.json"),JSON.stringify({format:"rubend-packed-corner-routing-v1",statements,sourceHashes:{"src/cubie.bend":hash(cubie),"bench/piece-cells.manifest.json":hash(readFileSync("bench/piece-cells.manifest.json")),"bench/packed-bit-logic.bend":hash(readFileSync("bench/packed-bit-logic.bend"))},outputSha256:hash(generated),scope:"Universal corner-permutation word routing only. Orientation, other fields, packed inverse and loaded bounds remain unproved."},null,2)+"\n",{flag:"wx"});console.log(JSON.stringify({passed:true,count,path,bytes:generated.length}));
