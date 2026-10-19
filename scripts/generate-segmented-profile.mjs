import assert from "node:assert/strict";
import {readFileSync,writeFileSync,mkdirSync} from "node:fs";
import {createHash} from "node:crypto";

assert.ok(process.argv.length===2||(process.argv.length===3&&process.argv[2]==="--check"));
const check=process.argv[2]==="--check",hash=s=>createHash("sha256").update(s).digest("hex");
const paths={search:"src/search.bend",portfolio:"src/portfolio.bend",main:"src/main.bend",inverse:"src/inverse-bound.bend",fixed:"bench/fixed-work.bend"},originals=Object.fromEntries(Object.entries(paths).map(([n,p])=>[n,readFileSync(p,"utf8")]));
function once(source,from,to,count=1){assert.equal(source.split(from).length,count+1,"Unexpected segmented transform pattern: "+from);return source.split(from).join(to);}
function imports(source,local){return source.replace(/^import \.\/([a-z0-9-]+\.bend) as ([A-Za-z]+)$/gm,(_,file,alias)=>"import "+(file==="joint-table.bend"?"../segmented-joint.bend":(local.has(file)?"./":"../")+file)+" as "+alias);}
function owner(source){return once(source,"import Base\n","import Base\nimport ../segmented-table.bend as Store\n").replaceAll("Array<U32>","Store.Table").replaceAll("Array.size(U32, table)","Store.size(table)");}
let search=imports(originals.search,new Set(["inverse-bound.bend"]));
search=once(search,"import ../block-table.bend as B\n","");
search=once(search,"def block_lookup(table: Array<U32>, index: U32) -> Array<U32> & U32:\n  B.get_at(table, 8388608, index, 34642080)\n\n","");
search=once(search,"    case BlockJoint{}: first_joint(~block_lookup, block_lookup(table, ((nx * 2048 + ny) * 495 + nz : U32)), parent, rest, meta, move, nx, ny, nz)\n","");
search=once(search,"    case Light{}: push(True{}, table, parent, rest, meta, move, nx, ny, nz)","    case _: push(True{}, table, parent, rest, meta, move, nx, ny, nz)");
const geometry="def profile_words(profile: Profile) -> U32:\n  match profile:\n    case Light{}: 8388608\n    case RawJoint{}: 536870912\n    case RawInverseOne{}: 536870912\n    case RawInverseThree{}: 536870912\n    case BlockJoint{}: 268435456\n";
search=once(search,geometry,"def profile_words(profile: Profile) -> U32:\n  match profile:\n    case RawJoint{}: 293601280\n    case RawInverseOne{}: 293601280\n    case RawInverseThree{}: 293601280\n    case _: 0\n");
search=once(search,"def profile_matches(profile: Profile, words: U32) -> Bool:\n  U32.is_eq(profile_words(profile), words)","def profile_matches(+profile: Profile, words: U32) -> Bool:\n  U32.is_gt(profile_words(profile), 0) && U32.is_eq(profile_words(profile), words)");
search=owner(search);let reads=0;search=search.replace(/table\[([^\n\[\]]+)\]/g,(_,index)=>{reads++;return "Store.get(table, "+index+")";});assert.equal(reads,7);assert.ok(!search.includes("table["));
const inverse=owner(imports(originals.inverse,new Set()));
const portfolio=owner(imports(originals.portfolio,new Set(["search.bend"])));
let main=imports(originals.main,new Set(["search.bend","portfolio.bend"]));
main=once(main,"import ../tables.bend as T\n","");main=once(main,"import ../certificate.bend as Cert\n","import ../certificate.bend as Cert\nimport ../segmented-table-io.bend as A\n");
const checked="def checked_table(read: Array<U32> & U32) -> IO(Array<U32>):\n  match read:\n    case Tuple{table, 8388608}:\n      IO.pure(Array<U32>, table)\n    case _:\n      IO.die(Array<U32>, 2, \"Lookup table generation was incomplete\")\n\n";
main=once(main,checked,"");main=once(main,"checked_table(Array.size(U32, T.generate()))","A.table()",2);
const policy=`def policy(text: String) -> IO(S.Profile):
  match text:
    case "forward": IO.pure(S.Profile, S.RawJoint{})
    case "inverse-one": IO.pure(S.Profile, S.RawInverseOne{})
    case "inverse-three": IO.pure(S.Profile, S.RawInverseThree{})
    case _: IO.die(S.Profile, 2, "Invalid segmented policy")

def selected_profile() -> IO(S.Profile):
  do IO<S.Profile>:
    text : String <- IO.try(String, IO.get_env("RUBEND_SEGMENTED_POLICY"))
    policy(text)

`;
main=once(main,"def worker(file: File)",policy+"def worker(file: File)");
main=once(main,"table : Array<U32> <- A.table()","profile : S.Profile <- selected_profile()\n    table : Array<U32> <- A.table()",2);
main=once(main,"        profile : S.Profile <- selected_profile()\n    table : Array<U32> <- A.table()","        profile : S.Profile <- selected_profile()\n        table : Array<U32> <- A.table()");
main=once(main,"table, read, S.Light{}, control)","table, read, profile, control)");main=once(main,"text, mode, table, S.Light{})","text, mode, table, profile)");main=owner(main);
let fixed=originals.fixed;
for(const name of["main","search","portfolio"])fixed=once(fixed,"import ../src/"+name+".bend as ","import ../src/segmented/"+name+".bend as ");
fixed=once(fixed,"import ../src/tables.bend as T\n","");fixed=once(fixed,"import ./advanced-main.bend as A","import ../src/segmented-table-io.bend as A");
fixed=once(fixed,"case False{}: H.checked_table(Array.size(U32, T.generate()))","case False{}: IO.die(Array<U32>, 2, \"Segmented profile supports only raw tables\")");
fixed=once(fixed,"import Base\n","import Base\nimport ../src/segmented-table.bend as Store\n").replaceAll("Array<U32>","Store.Table");
const files={"src/segmented/search.bend":search,"src/segmented/inverse-bound.bend":inverse,"src/segmented/portfolio.bend":portfolio,"src/segmented/main.bend":main,"bench/segmented-fixed.bend":fixed};
files["src/segmented/manifest.json"]=JSON.stringify({format:"rubend-generated-segmented-profile-v1",sourceHashes:Object.fromEntries(Object.entries(originals).map(([n,s])=>[paths[n],hash(s)])),outputHashes:Object.fromEntries(Object.entries(files).map(([p,s])=>[p,hash(s)])),geometry:{physicalWords:293601280,logicalWords:285525248,prefixWords:8388608,lowerWords:268435456,upperWords:16777216},semantics:"Raw words and search algorithm unchanged. Owner and reads are segmented. Unavailable profiles reject initialization.",defaultEngine:"Unchanged; isolated hypothesis only"},null,2)+"\n";
if(!check)mkdirSync("src/segmented",{recursive:true});for(const [path,text] of Object.entries(files)){if(check)assert.equal(readFileSync(path,"utf8"),text,"Stale segmented profile: "+path);else writeFileSync(path,text);}
console.log(JSON.stringify({passed:true,check,reads,files:Object.keys(files)}));
