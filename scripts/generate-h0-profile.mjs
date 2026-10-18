import assert from "node:assert/strict";
import {readFileSync,writeFileSync,mkdirSync} from "node:fs";
import {createHash} from "node:crypto";

assert.ok(process.argv.length===2||(process.argv.length===3&&process.argv[2]==="--check"));
const check=process.argv[2]==="--check",hash=s=>createHash("sha256").update(s).digest("hex");
const paths={search:"src/search.bend",portfolio:"src/portfolio.bend",main:"src/main.bend",contour:"bench/contour-target.bend"};
const originals=Object.fromEntries(Object.entries(paths).map(([n,p])=>[n,readFileSync(p,"utf8")]));
function once(source,from,to,count=1){assert.equal(source.split(from).length,count+1,"Unexpected H0 transform pattern: "+from);return source.split(from).join(to);}
function imports(source,local){return source.replace(/^import \.\/([a-z0-9-]+\.bend) as ([A-Za-z]+)$/gm,(_,file,alias)=>"import "+(local.has(file)?"./":"../")+file+" as "+alias);}
let search=imports(originals.search,new Set());
search=once(search,"import ../inverse-bound.bend as I\n","import ../inverse-bound.bend as I\nimport ../h0-bound.bend as K\n");
search=once(search,"  BlockJoint{}\n","  BlockJoint{}\n  ForwardH0{}\n  InverseH0{}\n  ForwardH0Fast{}\n  InverseH0Fast{}\n");
const geometry="def profile_words(profile: Profile) -> U32:\n  match profile:\n    case Light{}: 8388608\n    case RawJoint{}: 536870912\n    case RawInverseOne{}: 536870912\n    case RawInverseThree{}: 536870912\n    case BlockJoint{}: 268435456\n";
search=once(search,geometry,"def profile_words(profile: Profile) -> U32:\n  match profile:\n    case RawJoint{}: 536870912\n    case RawInverseThree{}: 536870912\n    case ForwardH0{}: 536870912\n    case InverseH0{}: 536870912\n    case ForwardH0Fast{}: 536870912\n    case InverseH0Fast{}: 536870912\n    case _: 0\n");
const parameters="table: Array<U32>, +parent: Frame, rest: +List<Frame>, +meta: Meta, child: C.Cubie, move: U32, nx: U32, ny: U32, nz: U32",args="table, parent, rest, meta, child, move, nx, ny, nz";
const bound=`def h0_allowed(ok: Bool, ${parameters}) -> Search:
  match ok:
    case True{}: push_child(${args})
    case False{}: Search{table, parent <> rest, meta}

def h0_result(read: Array<U32> & K.CubeBound, +parent: Frame, rest: +List<Frame>, meta: Meta, child: C.Cubie, move: U32, nx: U32, ny: U32, nz: U32) -> Search:
  match read parent:
    case Tuple{table, K.CubeBound{distance}} Node{cube, a, b, c, +left, previous, next, FullCube{}, path, length}:
      h0_allowed(U32.is_lt(distance, left), ${args})
    case Tuple{table, distance} parent: Search{table, parent <> rest, meta}

def h0_policy(${parameters.replace("child: C.Cubie","+child: C.Cubie")}) -> Search:
  match parent meta:
    case Node{cube, a, b, c, left, previous, next, FullCube{}, path, length} Meta{root, p1, ceiling, best, best_len, mode, bound, lower, nodes, status, ForwardH0{}}:
      h0_result(K.full_cube(table, child), ${args.replace("table, ","")})
    case Node{cube, a, b, c, left, previous, next, FullCube{}, path, length} Meta{root, p1, ceiling, best, best_len, mode, bound, lower, nodes, status, InverseH0{}}:
      h0_result(K.full_cube(table, child), ${args.replace("table, ","")})
    case Node{cube, a, b, c, left, previous, next, FullCube{}, path, length} Meta{root, p1, ceiling, best, best_len, mode, bound, lower, nodes, status, ForwardH0Fast{}}:
      h0_result(K.full_cube_fast(table, child), ${args.replace("table, ","")})
    case Node{cube, a, b, c, left, previous, next, FullCube{}, path, length} Meta{root, p1, ceiling, best, best_len, mode, bound, lower, nodes, status, InverseH0Fast{}}:
      h0_result(K.full_cube_fast(table, child), ${args.replace("table, ","")})
    case _ _: push_child(${args})

`;
search=once(search,"def accept_child(",bound+"def accept_child(");
search=once(search,"def accept_child(ok: Bool, "+parameters+") -> Search:\n  match ok:\n    case True{}: push_child("+args+")","def accept_child(ok: Bool, "+parameters+") -> Search:\n  match ok:\n    case True{}: h0_policy("+args+")");
const inverse="    case Node{cube, a, b, c, +left, previous, next, FullCube{}, path, length} Meta{root, p1, ceiling, best, best_len, mode, bound, lower, nodes, status, RawInverseThree{}}:\n      inverse_result(I.full_cube_three(table, child, left), parent, rest, meta, child, move, nx, ny, nz)\n";
search=once(search,inverse,inverse+inverse.replace("RawInverseThree{}","InverseH0{}")+inverse.replace("RawInverseThree{}","InverseH0Fast{}"));
const joint="    case RawJoint{}: first_joint(~raw_lookup, raw_lookup(table, ((nx * 2048 + ny) * 495 + nz : U32)), parent, rest, meta, move, nx, ny, nz)\n";
search=once(search,joint,joint+joint.replace("RawJoint{}","ForwardH0{}")+joint.replace("RawJoint{}","InverseH0{}")+joint.replace("RawJoint{}","ForwardH0Fast{}")+joint.replace("RawJoint{}","InverseH0Fast{}"));
const portfolio=imports(originals.portfolio,new Set(["search.bend"]));
let main=imports(originals.main,new Set(["search.bend","portfolio.bend"]));
main=once(main,"import ../certificate.bend as Cert\n","import ../certificate.bend as Cert\nimport ../h0-table-io.bend as A\n");
const policy=`def policy(text: String) -> IO(S.Profile):
  match text:
    case "forward": IO.pure(S.Profile, S.RawJoint{})
    case "inverse-three": IO.pure(S.Profile, S.RawInverseThree{})
    case "h0": IO.pure(S.Profile, S.ForwardH0{})
    case "combined": IO.pure(S.Profile, S.InverseH0{})
    case "h0-fast": IO.pure(S.Profile, S.ForwardH0Fast{})
    case "combined-fast": IO.pure(S.Profile, S.InverseH0Fast{})
    case _: IO.die(S.Profile, 2, "Invalid H0 policy")

def selected_profile() -> IO(S.Profile):
  do IO<S.Profile>:
    text : String <- IO.try(String, IO.get_env("RUBEND_H0_POLICY"))
    policy(text)

`;
main=once(main,"def worker(file: File)",policy+"def worker(file: File)");
main=once(main,"table : Array<U32> <- checked_table(Array.size(U32, T.generate()))","profile : S.Profile <- selected_profile()\n    table : Array<U32> <- A.table()",2);
main=once(main,"        profile : S.Profile <- selected_profile()\n    table : Array<U32> <- A.table()","        profile : S.Profile <- selected_profile()\n        table : Array<U32> <- A.table()");
main=once(main,"table, read, S.Light{})","table, read, profile)");main=once(main,"text, mode, table, S.Light{})","text, mode, table, profile)");
let contour=once(originals.contour,"import ./advanced-main.bend as A","import ../src/h0-table-io.bend as A");
for(const name of["main","search"])contour=once(contour,"import ../src/"+name+".bend as ","import ../src/h0/"+name+".bend as ");
contour=once(contour,'    case "inverse-one": S.RawInverseOne{}\n','    case "h0": S.ForwardH0{}\n    case "h0-combined": S.InverseH0{}\n    case "h0-fast": S.ForwardH0Fast{}\n    case "h0-combined-fast": S.InverseH0Fast{}\n');
contour=once(contour,"    case S.RawInverseOne{}: 1\n","    case S.ForwardH0{}: 8\n    case S.InverseH0{}: 11\n    case S.ForwardH0Fast{}: 12\n    case S.InverseH0Fast{}: 15\n");
const files={"src/h0/search.bend":search,"src/h0/portfolio.bend":portfolio,"src/h0/main.bend":main,"bench/h0-contour.bend":contour};
files["src/h0/manifest.json"]=JSON.stringify({format:"rubend-generated-h0-profile-v1",sourceHashes:Object.fromEntries(Object.entries(originals).map(([n,s])=>[paths[n],hash(s)])),outputHashes:Object.fromEntries(Object.entries(files).map(([p,s])=>[p,hash(s)])),geometry:{words:536870912,metaBase:285525248,metaWords:2892000,distanceBase:288417248,distanceWords:29391863},order:"forward/inverse/H0",defaultEngine:"Unchanged; this is an explicit private profile"},null,2)+"\n";
if(!check)mkdirSync("src/h0",{recursive:true});
for(const [path,text] of Object.entries(files)){if(check)assert.equal(readFileSync(path,"utf8"),text,"Stale H0 profile: "+path);else writeFileSync(path,text);}
console.log(JSON.stringify({passed:true,check,files:Object.keys(files)}));
