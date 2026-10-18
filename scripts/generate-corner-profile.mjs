import assert from "node:assert/strict";
import {readFileSync,writeFileSync,mkdirSync} from "node:fs";
import {createHash} from "node:crypto";

assert.ok(process.argv.length===2||(process.argv.length===3&&["--check","--corner-first","--check-corner-first"].includes(process.argv[2])));
const check=["--check","--check-corner-first"].includes(process.argv[2]),first=["--corner-first","--check-corner-first"].includes(process.argv[2]),directory=first?"corner-first":"corner",hash=s=>createHash("sha256").update(s).digest("hex");
const inputPaths={search:"src/search.bend",portfolio:"src/portfolio.bend",main:"src/main.bend",contour:"bench/contour-target.bend"};
const originals=Object.fromEntries(Object.entries(inputPaths).map(([n,p])=>[n,readFileSync(p,"utf8")]));
function once(source,from,to,count=1){assert.equal(source.split(from).length,count+1,"Unexpected corner transform pattern: "+from);return source.split(from).join(to);}
function imports(source,local){return source.replace(/^import \.\/([a-z0-9-]+\.bend) as ([A-Za-z]+)$/gm,(_,file,alias)=>"import "+(local.has(file)?"./":"../")+file+" as "+alias);}
let search=imports(originals.search,new Set());
search=once(search,"import ../inverse-bound.bend as I\n","import ../inverse-bound.bend as I\nimport ../corner-bound.bend as K\n");
search=once(search,"  BlockJoint{}\n","  BlockJoint{}\n  ForwardCorner{}\n  InverseCorner{}\n");
const geometry="def profile_words(profile: Profile) -> U32:\n  match profile:\n    case Light{}: 8388608\n    case RawJoint{}: 536870912\n    case RawInverseOne{}: 536870912\n    case RawInverseThree{}: 536870912\n    case BlockJoint{}: 268435456\n";
search=once(search,geometry,"def profile_words(profile: Profile) -> U32:\n  match profile:\n    case RawJoint{}: 536870912\n    case RawInverseThree{}: 536870912\n    case ForwardCorner{}: 536870912\n    case InverseCorner{}: 536870912\n    case _: 0\n");
const parameters="table: Array<U32>, +parent: Frame, rest: +List<Frame>, +meta: Meta, child: C.Cubie, move: U32, nx: U32, ny: U32, nz: U32";
const args="table, parent, rest, meta, child, move, nx, ny, nz";
const result=`def corner_allowed(ok: Bool, ${parameters}) -> Search:
  match ok:
    case True{}: push_child(${args})
    case False{}: Search{table, parent <> rest, meta}

def corner_result(read: Array<U32> & K.CubeBound, +parent: Frame, rest: +List<Frame>, meta: Meta, child: C.Cubie, move: U32, nx: U32, ny: U32, nz: U32) -> Search:
  match read parent:
    case Tuple{table, K.CubeBound{distance}} Node{cube, a, b, c, +left, previous, next, FullCube{}, path, length}:
      corner_allowed(U32.is_lt(distance, left), table, parent, rest, meta, child, move, nx, ny, nz)
    case Tuple{table, distance} parent: Search{table, parent <> rest, meta}

def corner_policy(${parameters.replace("child: C.Cubie","+child: C.Cubie")}) -> Search:
  match parent meta:
    case Node{cube, a, b, c, left, previous, next, FullCube{}, path, length} Meta{root, p1, ceiling, best, best_len, mode, bound, lower, nodes, status, ForwardCorner{}}:
      corner_result(K.full_cube(table, child), ${args.replace("table, ","")})
    case Node{cube, a, b, c, left, previous, next, FullCube{}, path, length} Meta{root, p1, ceiling, best, best_len, mode, bound, lower, nodes, status, InverseCorner{}}:
      corner_result(K.full_cube(table, child), ${args.replace("table, ","")})
    case _ _: push_child(${args})

`;
search=once(search,"def accept_child(",result+"def accept_child(");
search=once(search,"def accept_child(ok: Bool, "+parameters+") -> Search:\n  match ok:\n    case True{}: push_child("+args+")","def accept_child(ok: Bool, "+parameters+") -> Search:\n  match ok:\n    case True{}: corner_policy("+args+")");
const inverse="    case Node{cube, a, b, c, +left, previous, next, FullCube{}, path, length} Meta{root, p1, ceiling, best, best_len, mode, bound, lower, nodes, status, RawInverseThree{}}:\n      inverse_result(I.full_cube_three(table, child, left), parent, rest, meta, child, move, nx, ny, nz)\n";
search=once(search,inverse,inverse+inverse.replace("RawInverseThree{}","InverseCorner{}"));
if(first){
  const late="    case Node{cube, a, b, c, left, previous, next, FullCube{}, path, length} Meta{root, p1, ceiling, best, best_len, mode, bound, lower, nodes, status, InverseCorner{}}:\n      corner_result(K.full_cube(table, child), parent, rest, meta, child, move, nx, ny, nz)\n";
  search=once(search,late,"");
  search=once(search,inverse.replace("RawInverseThree{}","InverseCorner{}"),inverse.replace("RawInverseThree{}","InverseCorner{}").replace("inverse_result(I.full_cube_three(table, child, left)","corner_first_result(K.full_cube(table, child)"));
  const early=`def corner_first_allowed(ok: Bool, ${parameters.replace("child: C.Cubie","+child: C.Cubie")}) -> Search:
  match ok parent:
    case True{} Node{cube, a, b, c, +left, previous, next, FullCube{}, path, length}:
      inverse_result(I.full_cube_three(table, child, left), parent, rest, meta, child, move, nx, ny, nz)
    case _ parent: Search{table, parent <> rest, meta}

def corner_first_result(read: Array<U32> & K.CubeBound, +parent: Frame, rest: +List<Frame>, meta: Meta, child: C.Cubie, move: U32, nx: U32, ny: U32, nz: U32) -> Search:
  match read parent:
    case Tuple{table, K.CubeBound{distance}} Node{cube, a, b, c, +left, previous, next, FullCube{}, path, length}:
      corner_first_allowed(U32.is_lt(distance, left), table, parent, rest, meta, child, move, nx, ny, nz)
    case Tuple{table, distance} parent: Search{table, parent <> rest, meta}

`;
  search=once(search,"def inverse_policy(",early+"def inverse_policy(");
}
const joint="    case RawJoint{}: first_joint(~raw_lookup, raw_lookup(table, ((nx * 2048 + ny) * 495 + nz : U32)), parent, rest, meta, move, nx, ny, nz)\n";
search=once(search,joint,joint+joint.replace("RawJoint{}","ForwardCorner{}")+joint.replace("RawJoint{}","InverseCorner{}"));
const portfolio=imports(originals.portfolio,new Set(["search.bend"]));
let main=imports(originals.main,new Set(["search.bend","portfolio.bend"]));
main=once(main,"import ../certificate.bend as Cert\n","import ../certificate.bend as Cert\nimport ../corner-table-io.bend as A\n");
const policy=`def policy(text: String) -> IO(S.Profile):
  match text:
    case "forward": IO.pure(S.Profile, S.RawJoint{})
    case "inverse-three": IO.pure(S.Profile, S.RawInverseThree{})
    case "corner": IO.pure(S.Profile, S.ForwardCorner{})
    case "combined": IO.pure(S.Profile, S.InverseCorner{})
    case _: IO.die(S.Profile, 2, "Invalid corner policy")

def selected_profile() -> IO(S.Profile):
  do IO<S.Profile>:
    text : String <- IO.try(String, IO.get_env("RUBEND_CORNER_POLICY"))
    policy(text)

`;
main=once(main,"def worker(file: File)",policy+"def worker(file: File)");
main=once(main,"table : Array<U32> <- checked_table(Array.size(U32, T.generate()))","profile : S.Profile <- selected_profile()\n    table : Array<U32> <- A.table()",2);
main=once(main,"        profile : S.Profile <- selected_profile()\n    table : Array<U32> <- A.table()","        profile : S.Profile <- selected_profile()\n        table : Array<U32> <- A.table()");
main=once(main,"table, read, S.Light{}, control)","table, read, profile, control)");
main=once(main,"text, mode, table, S.Light{})","text, mode, table, profile)");
let contour=originals.contour;
contour=once(contour,"import ./advanced-main.bend as A","import ../src/corner-table-io.bend as A");
for(const name of ["main","search"])contour=once(contour,"import ../src/"+name+".bend as ","import ../src/"+directory+"/"+name+".bend as ");
contour=once(contour,'    case "inverse-one": S.RawInverseOne{}\n','    case "corner": S.ForwardCorner{}\n    case "combined": S.InverseCorner{}\n');
contour=once(contour,"    case S.RawInverseOne{}: 1\n","    case S.ForwardCorner{}: 4\n    case S.InverseCorner{}: 7\n");
const files={["src/"+directory+"/search.bend"]:search,["src/"+directory+"/portfolio.bend"]:portfolio,["src/"+directory+"/main.bend"]:main,["bench/"+directory+"-contour.bend"]:contour};
const record={format:"rubend-generated-corner-profile-v1",sourceHashes:Object.fromEntries(Object.entries(originals).map(([n,s])=>[inputPaths[n],hash(s)])),outputHashes:Object.fromEntries(Object.entries(files).map(([p,s])=>[p,hash(s)])),policies:{forward:"three forward joint axes", "inverse-three":"forward and three inverse axes",corner:"forward axes and corner bound",combined:"forward and inverse axes and corner bound"},combinedOrder:first?"forward/corner/inverse":"forward/inverse/corner",geometry:{words:536870912,cornerBase:285525248,cornerWords:22044960},defaultEngine:"Original sources remain unchanged. Only explicit private profiles may use the loaded corner payload."};
files["src/"+directory+"/manifest.json"]=JSON.stringify(record,null,2)+"\n";
if(!check)mkdirSync("src/"+directory,{recursive:true});
for(const [path,text] of Object.entries(files)){if(check)assert.equal(readFileSync(path,"utf8"),text,"Stale corner profile: "+path);else writeFileSync(path,text);}
console.log(JSON.stringify({passed:true,check,files:Object.keys(files)}));
