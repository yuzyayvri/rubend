import assert from "node:assert/strict";
import {readFileSync,writeFileSync,mkdirSync} from "node:fs";
import {resolve,relative} from "node:path";
import {createHash} from "node:crypto";
import {withArtifactLease} from "../scripts/artifact-lease.mjs";

withArtifactLease();assert.equal(process.argv.length,3);const directory=resolve(process.argv[2]);assert.ok(directory.startsWith(resolve("build")+"/"));mkdirSync(directory,{recursive:true});const original=readFileSync("src/search.bend","utf8"),order=readFileSync("bench/phase2-move-order.bend","utf8"),hash=x=>createHash("sha256").update(x).digest("hex"),sources={};
function save(name,source){const path=resolve(directory,name);writeFileSync(path,source,{flag:"wx"});sources[path]=hash(source);}
function replaceOnce(source,from,to){assert.equal(source.split(from).length,2,from);return source.replace(from,to);}
const bit="U32.or(word, U32.shln(1, U32.to_nat((bucket(score, radius) * 10 + column : U32))))",helpers={base:order,omit:replaceOnce(order,bit,"pick(U32.is_eq(column, 9), word, "+bit+")"),duplicate:replaceOnce(order,"Selected{column, U32.xor(word, U32.shln(1, U32.to_nat((bucket * 10 + column : U32))))}","Selected{column, word}")};for(const[name,source]of Object.entries(helpers))save("order-"+name+".bend",source);
const imports=original.replace(/^import (\.[^\s]+\.bend) as (\w+)$/gm,(_,path,alias)=>{const p=relative(directory,resolve("src",path));return "import "+(p.startsWith(".")?p:"./"+p)+" as "+alias;}),start=imports.indexOf("def enumerate("),end=imports.indexOf("\ndef phase2_depth(",start);assert.ok(start>0&&end>start);const plain=imports.slice(start,end).replace("def enumerate(","def enumerate_plain("),selected=`
def ordered_choice(choice: O.Choice, table: Array<U32>, frame: Frame, rest: +List<Frame>, meta: Meta) -> Search:
  match choice frame:
    case O.Selected{+column, remaining} Node{cube, a, b, c, left, +previous, next, +phase, path, length}:
      +move = Q.phase2_move(column)
      +face = (move / 3 : U32)
      child(root_allowed(previous, face) && U32.is_ne(face, previous) && (U32.is_ne(((face + 3) % 6 : U32), previous) || U32.is_lt(previous, face)), table, Node{cube, a, b, c, left, previous, remaining, phase, path, length}, rest, meta, move, column)
    case _ _: Search{table, rest, meta}

def ordered_ready(read: Array<U32> & U32, frame: Frame, rest: +List<Frame>, meta: Meta) -> Search:
  match read:
    case Tuple{table, +word}: ordered_choice(O.take(word), table, frame, rest, meta)

def enumerate(+ok: Bool, table: Array<U32>, +frame: Frame, rest: +List<Frame>, meta: Meta) -> Search:
  match ok frame:
    case True{} Node{cube, +a, +b, +c, +left, previous, +next, Subgroup{}, path, length}:
      ordered_ready(O.cursor(U32.is_eq(next, 0), table, a, b, c, left, next), Node{cube, a, b, c, left, previous, next, Subgroup{}, path, length}, rest, meta)
    case _ _: enumerate_plain(ok, table, frame, rest, meta)

def order_active(phase: Goal, +next: U32) -> Bool:
  match phase:
    case Subgroup{}: O.active(next)
    case _: U32.is_lt(next, 18)
`;
let search=imports.slice(0,start)+plain+selected+imports.slice(end);search=replaceOnce(search,"U32.is_lt(next, C.pick(is_subgroup(phase), 10, 18))","order_active(phase, next)");search="import ./order-base.bend as O\n"+search;save("search-base.bend",search);const goal=replaceOnce(search,"case True{} Node{cube, +a, +b, +c, +left, previous, +next, Subgroup{}, path, length}:\n      ordered_ready", "case True{} Node{cube, +a, +b, +c, +left, previous, +next, +leaked, path, length}:\n      ordered_ready").replace("Node{cube, a, b, c, left, previous, next, Subgroup{}, path, length}, rest, meta)\n    case _ _: enumerate_plain", "Node{cube, a, b, c, left, previous, next, leaked, path, length}, rest, meta)\n    case _ _: enumerate_plain");assert.notEqual(goal,search);save("search-goal.bend",goal);
const checkTemplate=readFileSync("bench/phase2-move-check.bend.in","utf8");function rewritten(source){return source.replace(/^import (\.[^\s]+\.bend) as (\w+)$/gm,(line,path,alias)=>{if(path==="./SEARCH.bend")return line;const p=relative(directory,resolve("bench",path));return "import "+(p.startsWith(".")?p:"./"+p)+" as "+alias;});}
for(const variant of["base","goal"]){let checks=rewritten(checkTemplate).replace("import ./SEARCH.bend as B","import ./search-"+variant+".bend as B");checks=checks.replace("__SCANNERS__",["A","B"].map(alias=>readFileSync("bench/phase2-move-scan.bend.in","utf8").replaceAll("MODULE",alias).replaceAll("PREFIX",alias.toLowerCase())).join("\n"));save("check-"+variant+".bend",checks);}
writeFileSync(resolve(directory,"manifest.json"),JSON.stringify({passed:true,format:"rubend-phase2-move-generation-v1",searchSourceSha256:hash(original),orderSourceSha256:hash(order),sources,frameLayoutChanged:false,newPruning:false,newDomainLaw:false,productionIntegrated:false})+"\n",{flag:"wx"});console.log(JSON.stringify({generated:true,sources:Object.keys(sources).length,productionIntegrated:false}));
