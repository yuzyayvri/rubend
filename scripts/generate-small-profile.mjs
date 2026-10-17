import assert from "node:assert/strict";
import {readFileSync,writeFileSync,mkdirSync} from "node:fs";
import {createHash} from "node:crypto";

assert.ok(process.argv.length===2||(process.argv.length===3&&process.argv[2]==="--check"));
const check=process.argv[2]==="--check",hash=s=>createHash("sha256").update(s).digest("hex");
const inputPaths={search:"src/search.bend",portfolio:"src/portfolio.bend",main:"src/main.bend",tables:"src/tables.bend",fixed:"bench/fixed-work.bend"};
const originals=Object.fromEntries(Object.entries(inputPaths).map(([n,p])=>[n,readFileSync(p,"utf8")]));
function once(source,from,to,count=1){assert.equal(source.split(from).length,count+1,"Unexpected packed transform pattern: "+from);return source.split(from).join(to);}
function imports(source,local){
  return source.replace(/^import \.\/([a-z0-9-]+\.bend) as ([A-Za-z]+)$/gm,(_,file,alias)=>"import "+(local.has(file)?"./":"../")+file+" as "+alias);
}
let search=imports(originals.search,new Set());
search=once(search,"import ../inverse-bound.bend as I\n","import ../inverse-bound.bend as I\nimport ../small-table.bend as K\n");
const geometry="def profile_words(profile: Profile) -> U32:\n  match profile:\n    case Light{}: 8388608\n    case RawJoint{}: 536870912\n    case RawInverseOne{}: 536870912\n    case RawInverseThree{}: 536870912\n    case BlockJoint{}: 268435456\n";
search=once(search,geometry,"def profile_words(profile: Profile) -> U32:\n  match profile:\n    case Light{}: 1048576\n    case _: 0\n");
const accesses=[
  ["(base + ny * second + nz : U32)","bound"],
  ["(base + nx * second + nz : U32)","bound"],
  ["(offset + c * width + column : U32)","transition"],
  ["(offset + b * width + column : U32)","transition"],
  ["(offset + a * width + column : U32)","transition"],
  ["(3955785 + b * 24 + c : U32)","bound"],
  ["(2988105 + a * 24 + c : U32)","bound"]
];
for(const [index,getter] of accesses)search=once(search,"table["+index+"]","K."+getter+"(table, "+index+")");
assert.equal(search.includes("table["),false,"Unrouted packed array access");
const portfolio=imports(originals.portfolio,new Set(["search.bend"]));
let tables=imports(originals.tables,new Set());
tables=once(tables,"import ../cubie.bend as C\n","import ../cubie.bend as C\nimport ../small-table.bend as K\n");
tables=once(tables,"table = [255 : U32^23n]","table = K.fresh()");
tables=once(tables,"table[(offset + at : U32)] <- Q.transition(kind, (at / width : U32), (at % width : U32))","table = K.set_transition(table, (offset + at : U32), Q.transition(kind, (at / width : U32), (at % width : U32)))");
tables=once(tables,"seen(table[(base + index : U32)],","seen(K.bound(table, (base + index : U32)),");
tables=once(tables,"node_depth(table[(base + index : U32)],","node_depth(K.bound(table, (base + index : U32)),");
tables=once(tables,"table[(bo + y * moves + move : U32)]","K.transition(table, (bo + y * moves + move : U32))");
tables=once(tables,"table[(ao + x * moves + move : U32)]","K.transition(table, (ao + x * moves + move : U32))");
tables=once(tables,"U32.is_eq(value, 255)","U32.is_eq(value, 15)");
tables=once(tables,"table[base] <- 0","table = K.set_bound(table, base, 0)");
const enqueue="    case True{}:\n      table[(base + index : U32)] <- (depth + 1 : U32)\n      queue[tail] <- index\n      BWork{table, queue, head, (tail + 1 : U32), x, y, move, depth}";
tables=once(tables,enqueue,"    case True{}: put_distance(U32.is_lt(depth, 14), table, queue, head, tail, x, y, move, depth, index, base)");
const put="def put_distance(allowed: Bool, table: Array<U32>, queue: Array<U32>, head: U32, +tail: U32, x: U32, y: U32, move: U32, +depth: U32, +index: U32, base: U32) -> Breadth:\n  match allowed:\n    case True{}:\n      table = K.set_bound(table, (base + index : U32), (depth + 1 : U32))\n      queue[tail] <- index\n      BWork{table, queue, head, (tail + 1 : U32), x, y, move, depth}\n    case False{}: BEnd{table, 0}\n\n";
tables=once(tables,"def enqueue(",put+"def enqueue(");
assert.equal((tables.match(/table\[/g)??[]).length,0,"Unrouted packed generator access");
let main=imports(originals.main,new Set(["search.bend","portfolio.bend","tables.bend"]));
main=once(main,"case Tuple{table, 8388608}:","case Tuple{table, 1048576}:");
let fixed=originals.fixed;
for(const name of ["main","search","portfolio","tables"])fixed=once(fixed,"import ../src/"+name+".bend as ","import ../src/small/"+name+".bend as ");
fixed=once(fixed,"import ./advanced-main.bend as A\n","");
fixed=once(fixed,"case True{}: A.table()","case True{}: IO.die(Array<U32>, 2, \"Packed profile supports only the small tier\")");
const files={"src/small/search.bend":search,"src/small/portfolio.bend":portfolio,"src/small/main.bend":main,"src/small/tables.bend":tables,"bench/small-fixed.bend":fixed};
const record={format:"rubend-generated-small-profile-v2",sourceHashes:Object.fromEntries(Object.entries(originals).map(([n,s])=>[inputPaths[n],hash(s)])),outputHashes:Object.fromEntries(Object.entries(files).map(([p,s])=>[p,hash(s)])),allowedChanges:["relative import routing","seven packed small-table reads","only Light geometry accepted at 1048576 words","worker-ready geometry 1048576","direct packed transition/BFS storage","unknown nibble 15 and fail before a distance would reach 15","fixed-work observation uses small modules and rejects the raw tier"],defaultEngine:"Original source files are not modified or imported through the generated variant."};
files["src/small/manifest.json"]=JSON.stringify(record,null,2)+"\n";
if(!check)mkdirSync("src/small",{recursive:true});
for(const [path,text] of Object.entries(files)){
  if(check)assert.equal(readFileSync(path,"utf8"),text,"Stale packed profile: "+path);
  else writeFileSync(path,text);
}
console.log(JSON.stringify({passed:true,check,files:Object.keys(files),accesses:accesses.length}));
