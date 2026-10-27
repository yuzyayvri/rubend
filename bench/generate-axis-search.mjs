import assert from "node:assert/strict";
import {readFileSync,writeFileSync,mkdirSync} from "node:fs";
import {resolve} from "node:path";
import {createHash} from "node:crypto";
import {withArtifactLease} from "../scripts/artifact-lease.mjs";

withArtifactLease();
assert.ok(process.argv.length===3||process.argv.length===4);
const directory=resolve(process.argv[2]),check=process.argv[3]==="--check";
assert.ok(directory.startsWith(resolve("build")+"/"));
assert.ok(process.argv.length===3||check);
const hash=s=>createHash("sha256").update(s).digest("hex");
const source=readFileSync("src/search.bend","utf8"),worker=readFileSync("bench/contour-target.bend","utf8");
function absolute(text,base){return text.replace(/^import (\.\.?\/\S+\.bend) as /gm,(_,p)=>"import "+resolve(base,p)+" as ");}
function definition(text,name){const start=text.indexOf("def "+name+"(");assert.ok(start>=0);const after=text.indexOf("\ndef ",start+1);return {start,end:after<0?text.length:after+1};}
function replace(text,name,value){const {start,end}=definition(text,name);return text.slice(0,start)+value.trim()+"\n\n"+text.slice(end);}
function extend(text){
  let at=0,count=0,result="";
  const re=/\bNode\{/g;let m;
  while((m=re.exec(text))){
    let end=re.lastIndex,depth=1,paren=0,fields=1;
    for(;end<text.length;end++){
      const c=text[end];if(c==="{")depth++;if(c==="}"){if(--depth===0)break;}
      if(c==="(")paren++;if(c===")")paren--;
      if(c===","&&depth===1&&paren===0)fields++;
    }
    assert.equal(fields,10,"Unexpected Node shape");assert.ok(end<text.length);
    const body=text.slice(re.lastIndex,end),extra=body.includes("cube: C.Cubie")?"d: U32, e: U32, f: U32, g: U32, h: U32, i: U32":"d, e, f, g, h, i";
    result+=text.slice(at,end)+", "+extra+"}";at=end+1;re.lastIndex=at;count++;
  }
  assert.equal(count,43,"Search constructor inventory changed");
  return result+text.slice(at);
}
let search=absolute(extend(source),resolve("src"));
search=search.replace("import Base\n","import Base\nimport "+resolve("bench/axis-coordinates.bend")+" as A\n");
search=replace(search,"root_frame",`def root_ranked(axes: A.ForwardAxes, +root: C.Cubie, +depth: U32, +phase: Goal, previous: U32) -> Frame:
  match axes:
    case A.ForwardAxes{A.Triple{a, b, c}, A.Triple{d, e, f}, A.Triple{g, h, i}}:
      Node{root, a, b, c, depth, previous, 0, phase, Nil{}, 0, d, e, f, g, h, i}

def root_frame(+root: C.Cubie, +depth: U32, +phase: Goal) -> Frame:
  +view = C.to_facelets(root)
  previous = root_mask(fixed(root, C.validate(Y.ud(view))), fixed(root, C.validate(Y.flip(view))))
  root_ranked(A.all_axes(root), root, depth, phase, previous)`);
search=search.replace("Node{child, nx, ny, nz, (left - 1 : U32), (move / 3 : U32), 0, phase, move <> path, (length + 1 : U32), d, e, f, g, h, i}","Node{child, nx, ny, nz, (left - 1 : U32), (move / 3 : U32), 0, phase, move <> path, (length + 1 : U32), 0, 0, 0, 0, 0, 0}");
search=search.replace("Node{cube, a, b, c, depth, previous, 0, Subgroup{}, path, length, d, e, f, g, h, i}","Node{cube, a, b, c, depth, previous, 0, Subgroup{}, path, length, 0, 0, 0, 0, 0, 0}");
const args="child: C.Cubie, +move: U32, nx: U32, ny: U32, nz: U32, d: U32, e: U32, f: U32, g: U32, h: U32, i: U32";
const values="child, move, nx, ny, nz, d, e, f, g, h, i";
const cached=`def cache_accept(ok: Bool, table: Array<U32>, +parent: Frame, rest: +List<Frame>, +meta: Meta, ${args}) -> Search:
  match ok parent:
    case True{} Node{cube, a, b, c, +left, previous, next, +phase, +path, +length, pd, pe, pf, pg, ph, pi}:
      Search{table, Node{child, nx, ny, nz, (left - 1 : U32), (move / 3 : U32), 0, phase, move <> path, (length + 1 : U32), d, e, f, g, h, i} <> parent <> rest, meta}
    case _ parent: Search{table, parent <> rest, meta}

def cache_inverse_result(read: Array<U32> & I.CubeBound, +parent: Frame, rest: +List<Frame>, +meta: Meta, ${args}) -> Search:
  match read parent:
    case Tuple{table, I.CubeBound{bound}} Node{cube, a, b, c, +left, previous, next, phase, path, length, pd, pe, pf, pg, ph, pi}:
      cache_accept(U32.is_lt(bound, left), table, parent, rest, meta, ${values})
    case Tuple{table, bound} parent: cache_accept(True{}, table, parent, rest, meta, ${values})

def cache_inverse(table: Array<U32>, +parent: Frame, rest: +List<Frame>, +meta: Meta, +child: C.Cubie, +move: U32, nx: U32, ny: U32, nz: U32, d: U32, e: U32, f: U32, g: U32, h: U32, i: U32) -> Search:
  match parent meta:
    case Node{cube, a, b, c, left, previous, next, FullCube{}, path, length, pd, pe, pf, pg, ph, pi} Meta{root, p1, ceiling, best, best_len, mode, bound, lower, nodes, status, RawInverseOne{}}:
      cache_inverse_result(I.full_cube_one(table, child), parent, rest, meta, ${values})
    case Node{cube, a, b, c, +left, previous, next, FullCube{}, path, length, pd, pe, pf, pg, ph, pi} Meta{root, p1, ceiling, best, best_len, mode, bound, lower, nodes, status, RawInverseThree{}}:
      cache_inverse_result(I.full_cube_three(table, child, left), parent, rest, meta, ${values})
    case _ _: cache_accept(True{}, table, parent, rest, meta, ${values})

def cache_rl_allowed(ok: Bool, table: Array<U32>, parent: Frame, rest: +List<Frame>, meta: Meta, ${args}) -> Search:
  match ok:
    case True{}: cache_inverse(table, parent, rest, meta, ${values})
    case False{}: Search{table, parent <> rest, meta}

def cache_rl_bound(read: Array<U32> & U32, +parent: Frame, rest: +List<Frame>, +meta: Meta, ${args}) -> Search:
  match read parent:
    case Tuple{table, bound} Node{cube, a, b, c, +left, previous, next, phase, path, length, pd, pe, pf, pg, ph, pi}:
      cache_rl_allowed(U32.is_lt(bound, left), table, parent, rest, meta, ${values})
    case Tuple{table, bound} parent: Search{table, parent <> rest, meta}

def cache_rl(read: Array<U32> & A.Triple, parent: Frame, rest: +List<Frame>, meta: Meta, child: C.Cubie, +move: U32, nx: U32, ny: U32, nz: U32, d: U32, e: U32, f: U32) -> Search:
  match read:
    case Tuple{table, A.Triple{+g, +h, +i}}:
      cache_rl_bound(raw_lookup(table, ((g * 2048 + h) * 495 + i : U32)), parent, rest, meta, ${values})

def cache_fb_allowed(ok: Bool, table: Array<U32>, parent: Frame, rest: +List<Frame>, meta: Meta, child: C.Cubie, +move: U32, nx: U32, ny: U32, nz: U32, d: U32, e: U32, f: U32, g: U32, h: U32, i: U32) -> Search:
  match ok:
    case True{}: cache_rl(A.advance(table, A.Triple{g, h, i}, Y.rotate_index(Y.rotate_index(move))), parent, rest, meta, child, move, nx, ny, nz, d, e, f)
    case False{}: Search{table, parent <> rest, meta}

def cache_fb_bound(read: Array<U32> & U32, +parent: Frame, rest: +List<Frame>, +meta: Meta, ${args}) -> Search:
  match read parent:
    case Tuple{table, bound} Node{cube, a, b, c, +left, previous, next, phase, path, length, pd, pe, pf, pg, ph, pi}:
      cache_fb_allowed(U32.is_lt(bound, left), table, parent, rest, meta, ${values})
    case Tuple{table, bound} parent: Search{table, parent <> rest, meta}

def cache_fb(read: Array<U32> & A.Triple, parent: Frame, rest: +List<Frame>, meta: Meta, child: C.Cubie, +move: U32, nx: U32, ny: U32, nz: U32, g: U32, h: U32, i: U32) -> Search:
  match read:
    case Tuple{table, A.Triple{+d, +e, +f}}:
      cache_fb_bound(raw_lookup(table, ((d * 2048 + e) * 495 + f : U32)), parent, rest, meta, ${values})

def other_axes(~lookup: Array<U32> -> U32 -> (Array<U32> & U32), exact: Bool, table: Array<U32>, +parent: Frame, rest: +List<Frame>, +meta: Meta, +move: U32, +nx: U32, +ny: U32, +nz: U32) -> Search:
  match exact parent meta:
    case True{} Node{+cube, a, b, c, left, previous, next, phase, path, length, d, e, f, g, h, i} Meta{root, p1, ceiling, best, best_len, mode, bound, lower, nodes, status, BlockJoint{}}:
      +child = C.turn(move, cube)
      +rotated = R.rotate(child)
      second_joint(~lookup, lookup(table, joint_index(rotated)), parent, rest, meta, child, move, nx, ny, nz, rotated)
    case True{} Node{+cube, a, b, c, left, previous, next, phase, path, length, d, e, f, g, h, i} meta:
      cache_fb(A.advance(table, A.Triple{d, e, f}, Y.rotate_index(move)), parent, rest, meta, C.turn(move, cube), move, nx, ny, nz, g, h, i)
    case _ parent meta: push(True{}, table, parent, rest, meta, move, nx, ny, nz)`;
search=replace(search,"other_axes",cached);
const auditHelpers=`def cache_frame_valid(frame: Frame) -> Bool:
  match frame:
    case Node{+cube, a, b, c, left, previous, next, FullCube{}, path, length, d, e, f, g, h, i}:
      A.same(A.ForwardAxes{A.Triple{a, b, c}, A.Triple{d, e, f}, A.Triple{g, h, i}}, A.all_axes(cube))
    case _: True{}

def cache_top_valid(stack: +List<Frame>) -> Bool:
  match stack:
    case Nil{}: True{}
    case Con{frame, rest}: cache_frame_valid(frame)

def cache_checked(ok: Bool, state: Search) -> Search:
  match ok state:
    case True{} state: unchecked_advance(state)
    case False{} Search{table, stack, Meta{root, p1, ceiling, best, best_len, mode, bound, lower, nodes, status, profile}}:
      Search{table, stack, Meta{root, p1, ceiling, best, best_len, mode, bound, lower, nodes, ProfileMismatch{}, profile}}

def advance(state: Search) -> Search:
  match state:
    case Search{table, +stack, meta}: cache_checked(cache_top_valid(stack), Search{table, stack, meta})
`;
const runDef=definition(search,"run");
const audited=search.slice(0,runDef.start).replace("def advance(","def unchecked_advance(")+auditHelpers+"\n"+search.slice(runDef.start);
const fixed=readFileSync("bench/fixed-work.bend","utf8");
let serializers=["numbers","cube","frame","frames","meta"].map(name=>{const d=definition(fixed,name);return fixed.slice(d.start,d.end);}).join("\n");
const baseline=absolute(worker,resolve("bench"));
function instrument(text,extended){
  const helpers=extended?serializers.replace("phase, path, length}","phase, path, length, d, e, f, g, h, i}"):serializers;
  const d=definition(text,"finish");text=text.slice(0,d.start)+helpers+"\n"+text.slice(d.start);
  text=text.replace("work(20000000n,", "work(4096n,");
  text=text.replace("+nodes, +status, profile}}:","+nodes, +status, +profile}}:");
  const marker="        H.emit(";
  assert.equal(text.split(marker).length,2);
  return text.replace(marker,'        IO.print("{\\"type\\":\\"snapshot\\",\\"state\\":[" ++ meta(S.Meta{root, p1, ceiling, best, length, mode, bound, lower, nodes, status, profile}) ++ ",[" ++ String.join(frames(stack), ",") ++ "]]}")\n'+marker);
}
const contour=baseline.replace("import "+resolve("src/search.bend")+" as S","import "+resolve(directory,"search.bend")+" as S");
const auditContour=baseline.replace("import "+resolve("src/search.bend")+" as S","import "+resolve(directory,"audit-search.bend")+" as S");
const files={"search.bend":search,"audit-search.bend":audited,"contour.bend":contour,"control-check.bend":instrument(baseline,false),"candidate-check.bend":instrument(contour,true),"audit-check.bend":instrument(auditContour,true)};
const manifest={format:"rubend-axis-search-generation-v1",sourceHashes:{"src/search.bend":hash(source),"bench/contour-target.bend":hash(worker),"bench/fixed-work.bend":hash(fixed),"bench/axis-coordinates.bend":hash(readFileSync("bench/axis-coordinates.bend"))},outputHashes:Object.fromEntries(Object.entries(files).map(([p,s])=>[p,hash(s)])),nodeFields:16,checkFuel:4096,productionIntegrated:false,performanceClaim:false};
mkdirSync(directory,{recursive:true});
for(const [p,s]of Object.entries({...files,"manifest.json":JSON.stringify(manifest,null,2)+"\n"})){
  const path=resolve(directory,p);if(check)assert.equal(readFileSync(path,"utf8"),s);else writeFileSync(path,s);
}
console.log(JSON.stringify({passed:true,directory,nodeFields:16,check}));
