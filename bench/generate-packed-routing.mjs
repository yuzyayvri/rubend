import assert from "node:assert/strict";
import {readFileSync,writeFileSync,mkdirSync} from "node:fs";
import {resolve} from "node:path";
import {createHash} from "node:crypto";
import {withArtifactLease} from "../scripts/artifact-lease.mjs";
import {text,same,simplify,parse,u32,extensionality} from "./packed-bit-compiler.mjs";

withArtifactLease();
const [out,countText,selection="cp"]=process.argv.slice(2);assert.ok(process.argv.length===4||process.argv.length===5);assert.ok(["cp","all"].includes(selection));const count=Number(countText);assert.ok([1,18].includes(count));const directory=resolve(out);assert.ok(directory.startsWith(resolve("build")+"/"));mkdirSync(directory,{recursive:true});
const cubie=readFileSync("src/cubie.bend","utf8"),manifest=JSON.parse(readFileSync("bench/piece-cells.manifest.json","utf8")),names=[..."URFDLB"].flatMap(f=>[f,f+"2",f+"i"]),hash=x=>createHash("sha256").update(x).digest("hex");
for(const[p,h]of Object.entries(manifest.sourceHashes))assert.equal(hash(readFileSync(p)),h,"Stale piece-cell manifest");
const model=readFileSync("src/model.bend","utf8"),reference=manifest.kinds.map(kind=>names.map((name,move)=>{
  const slots=kind.slots;
  const m=model.match(new RegExp("def turn_"+name+"\\(cube: Cube\\) -> Cube:\\n  match cube:\\n    case Cube\\{[^}]+\\}:\\n      Cube\\{([^}]+)\\}"));assert.ok(m);const p=m[1].split(", ").map(s=>Number(s.slice(1)));assert.deepEqual([...p].sort((a,b)=>a-b),Array.from({length:54},(_,i)=>i));
  const map=slots.map(target=>{const moved=target.map(at=>p[at]),source=slots.findIndex(s=>s.every(at=>moved.includes(at)));assert.ok(source>=0);const order=moved.map(at=>slots[source].indexOf(at));assert.ok(order.every((n,i)=>n===(order[0]+i)%target.length));return{source,rotations:(target.length-order[0])%target.length};});assert.deepEqual(map,kind.maps[move]);return map;
}));
function fields(move){const begin=cubie.indexOf("    case "+move+" Cubie{");assert.ok(begin>=0);const start=cubie.indexOf("\n      Cubie{",begin)+13;assert.ok(start>begin);let depth=0,from=start;const result=[];for(let i=start;i<cubie.length;i++){const c=cubie[i];if(c==="(")depth++;if(c===")")depth--;if((c===","&&depth===0)||c==="}"){result.push(cubie.slice(from,i).trim());from=i+1;if(c==="}")break;}}assert.equal(result.length,5);return result;}
const lines=["import Base","import "+resolve("src/cubie.bend")+" as C","import "+resolve("bench/packed-bit-logic.bend")+" as L",""];
const registry=[{name:"cp",projection:"corner_word",index:0,inputs:["cp"]},{name:"ep",projection:"edge_low_word",index:2,inputs:["ep","eh"]},{name:"eh",projection:"edge_high_word",index:3,inputs:["ep","eh"]},{name:"eo",projection:"edge_orientation_word",index:4,inputs:["eo"]}],selected=selection==="cp"?registry.slice(0,1):registry;
lines.push(...extensionality());
for(const field of selected)lines.push("def "+field.projection+"(cube: C.Cubie) -> U32:","  match cube:","    case C.Cubie{cp, co, ep, eh, eo}: "+field.name,"");
const statements=[];
for(const field of selected)for(let move=0;move<count;move++){
  const expected=Array.from({length:32},(_,bit)=>{
    if(field.name==="cp")return "cp"+(4*reference[0][move][Math.floor(bit/4)].source+bit%4);
    if(field.name==="eo"){if(bit>=12)return false;const map=reference[1][move][bit],value="eo"+map.source;return map.rotations?["not",value]:value;}
    if(field.name==="eh"&&bit>=16)return false;const destination=(field.name==="eh"?8:0)+Math.floor(bit/4),source=reference[1][move][destination].source;return(source<8?"ep":"eh")+(4*(source%8)+bit%4);
  });
  const rawBits=parse(fields(move)[field.index]),proofs=rawBits.map((n,i)=>{const p=simplify(n);assert.ok(same(p.value,expected[i]),"Reference routing disagreement "+field.name+" "+move+" bit "+i);return p.proof;}),name=names[move],pattern="C.Cubie{"+["cp","co","ep","eh","eo"].map(f=>field.inputs.includes(f)?u32(Array.from({length:32},(_,i)=>"+"+f+i)):f).join(", ")+"}";
  lines.push("def expected_"+field.name+"_"+name+"(cube: C.Cubie) -> U32:","  match cube:","    case "+pattern+": "+u32(expected.map(text)),"","def "+field.name+"_route_"+name+"(+cube: C.Cubie) -> {"+field.projection+"(C.turn("+move+", cube)) == expected_"+field.name+"_"+name+"(cube) : U32}:","  match cube:","    case "+pattern+":","      bits_ext("+[...rawBits.map(text),...expected.map(text),...proofs].join(", ")+")","");statements.push({field:field.name,move,name,inputs:field.inputs,outputBits:expected});
}
lines.push("def test_corner(move: U32, cp: U32) -> U32:","  corner_word(C.turn(move, C.Cubie{cp, 0, 0, 0, 0}))","");
lines.push("def selected_words(cube: C.Cubie) -> +List<U32>:","  match cube:","    case C.Cubie{cp, co, ep, eh, eo}: [cp, ep, eh, eo]","","def test_fields(move: U32, cp: U32, co: U32, ep: U32, eh: U32, eo: U32) -> +List<U32>:","  selected_words(C.turn(move, C.Cubie{cp, co, ep, eh, eo}))","");
const generated=lines.join("\n"),file=selection==="cp"?"corner-routing.bend":"packed-routing.bend",path=resolve(directory,file);writeFileSync(path,generated,{flag:"wx"});writeFileSync(resolve(directory,"manifest.json"),JSON.stringify({format:"rubend-packed-routing-v2",file,selectedFields:selected.map(f=>f.name),statements,sourceHashes:{"src/cubie.bend":hash(cubie),"src/model.bend":hash(model),"bench/piece-cells.manifest.json":hash(readFileSync("bench/piece-cells.manifest.json")),"bench/packed-bit-logic.bend":hash(readFileSync("bench/packed-bit-logic.bend"))},outputSha256:hash(generated),scope:"Universal routing of the selected packed words. Corner orientation, full packed refinement, packed inverse and loaded bounds remain open."},null,2)+"\n",{flag:"wx"});console.log(JSON.stringify({passed:true,count,selected:selection,path,bytes:generated.length}));
