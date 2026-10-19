import assert from "node:assert/strict";
import {readFileSync,writeFileSync,mkdirSync,existsSync} from "node:fs";
import {createHash} from "node:crypto";
import {withArtifactLease} from "./artifact-lease.mjs";

withArtifactLease();
assert.ok(process.argv.length===2||(process.argv.length===3&&process.argv[2]==="--check"));
const check=process.argv[2]==="--check",hash=text=>createHash("sha256").update(text).digest("hex");
const source=readFileSync("src/search.bend","utf8"),store=readFileSync("bench/owned-continuation.bend","utf8");
const once=(text,from,to)=>{assert.equal(text.split(from).length,2,"Owned transform anchor changed: "+from);return text.replace(from,to);};
function fields(text,start){
  let braces=1,parens=0,squares=0,quoted=false,escaped=false,at=start+1,begin=at;const result=[];
  for(;at<text.length;at++){
    const c=text[at];
    if(quoted){if(escaped)escaped=false;else if(c==="\\")escaped=true;else if(c==='"')quoted=false;continue;}
    if(c==='"'){quoted=true;continue;}
    if(c==="{")braces++;else if(c==="}"){braces--;if(braces===0){result.push(text.slice(begin,at).trim());return {end:at+1,fields:result};}}
    else if(c==="(")parens++;else if(c===")")parens--;else if(c==="[")squares++;else if(c==="]")squares--;
    else if(c===","&&braces===1&&parens===0&&squares===0){result.push(text.slice(begin,at).trim());begin=at+1;}
  }
  throw Error("Unclosed owned constructor");
}
function constructors(text,names,transform){
  const pattern=new RegExp("\\b("+names.join("|")+")\\{","g");let result="",previous=0,match;
  while((match=pattern.exec(text))){const parsed=fields(text,pattern.lastIndex-1),replacement=transform(match[1],parsed.fields);result+=text.slice(previous,match.index)+match[1]+"{"+replacement.join(", ")+"}";previous=parsed.end;pattern.lastIndex=parsed.end;}
  return result+text.slice(previous);
}
function definition(text,name){const start=text.indexOf("def "+name+"(");assert.ok(start>=0,"Missing definition "+name);const after=text.indexOf("\ndef ",start+1);return {start,end:after<0?text.length:after+1,text:text.slice(start,after<0?text.length:after+1)};}
function replaceDef(text,name,replacement){const d=definition(text,name);return text.slice(0,d.start)+replacement.trim()+"\n\n"+text.slice(d.end);}
let search=constructors(source,["Node","Retry"],(name,parts)=>{assert.equal(parts.length,name==="Node"?10:8);parts.splice(name==="Node"?8:6,1);return parts;});
search=search.replaceAll("+List<Frame>","Store");
search=once(search,"  ProfileMismatch{}\n","  ProfileMismatch{}\n  ContinuationFailure{fault: Fault}\n");
search=once(search,"    case ProfileMismatch{}: 5\n","    case ProfileMismatch{}: 5\n    case ContinuationFailure{fault}: 6\n");
for(const name of["phase2_depth","phase2_bound","phase2","leaf","node_goal"]){const d=definition(search,name),changed=d.text.replaceAll("path: +List<U32>, ","").replaceAll(", path, ",", ");assert.ok(!/\bpath\b/.test(changed),"Unrouted path in "+name);search=search.slice(0,d.start)+changed+search.slice(d.end);}
let storage=store.slice(store.indexOf("type Slot is Data:"));
for(const name of [...store.matchAll(/^def ([a-z_]+)\(/gm)].map(match=>match[1]))storage=storage.replaceAll(new RegExp("\\b"+name+"(?=\\()","g"),"store_"+name);
search=once(search,"type Search is Type:\n",storage+"\n\ntype Search is Type:\n");
const failure=`def storage_checked(state: Search) -> Search:
  match state:
    case Search{table, Store{frames, path, used, cursor, Healthy{}}, meta}:
      Search{table, Store{frames, path, used, cursor, Healthy{}}, meta}
    case Search{table, Store{frames, path, used, cursor, +fault}, Meta{root, p1, ceiling, best, length, mode, bound, lower, nodes, status, profile}}:
      Search{table, Store{frames, path, used, cursor, fault}, Meta{root, p1, ceiling, best, length, mode, bound, lower, nodes, ContinuationFailure{fault}, profile}}

def store_empty() -> Store:
  Store{[EmptySlot{} : Slot*64n], [0 : U32*32n], 0, 0, Healthy{}}

`;
search=once(search,"def maximum(",failure+"def maximum(");
search=replaceDef(search,"record",`def record_prefix(read: Prefix, table: Array<U32>, +meta: Meta, +length: U32) -> Search:
  match read meta:
    case Prefix{rest, path} Meta{+root, p1, ceiling, best, best_len, FirstThenExact{}, bound, lower, nodes, status, +profile}:
      storage_checked(Search{table, store_reset(root_frame(root, 0, FullCube{}), rest), Meta{root, p1, ceiling, path, length, ExactContour{}, 0, 0, nodes, Running{}, profile}})
    case Prefix{rest, path} Meta{+root, p1, ceiling, best, best_len, +mode, bound, lower, nodes, status, +profile}:
      Search{table, rest, Meta{root, p1, ceiling, path, length, mode, bound, C.pick(is_exact(mode), length, lower), nodes, completion(is_exact(mode)), profile}}
    case Unreadable{rest} meta: storage_checked(Search{table, rest, meta})

def record(table: Array<U32>, rest: Store, meta: Meta, +length: U32) -> Search:
  record_prefix(store_read_prefix(length, rest), table, meta, length)`);
search=replaceDef(search,"maybe_record",`def maybe_record(better: Bool, table: Array<U32>, rest: Store, meta: Meta, length: U32) -> Search:
  match better:
    case True{}: record(table, rest, meta, length)
    case False{}: Search{table, rest, meta}`);
search=replaceDef(search,"push_child",`def push_child(table: Array<U32>, parent: Frame, rest: Store, meta: Meta, child: C.Cubie, +move: U32, nx: U32, ny: U32, nz: U32) -> Search:
  match parent:
    case Node{cube, a, b, c, +left, previous, next, +phase, +length}:
      Search{table, store_push(Node{child, nx, ny, nz, (left - 1 : U32), (move / 3 : U32), 0, phase, (length + 1 : U32)}, store_push(Node{cube, a, b, c, left, previous, next, phase, length}, store_write_move(length, move, rest))), meta}
    case parent: Search{table, store_push(parent, rest), meta}`);
search=replaceDef(search,"next_root",`def next_root(done: Bool, table: Array<U32>, stack: Store, +meta: Meta) -> Search:
  match done meta:
    case True{} Meta{root, p1, ceiling, best, best_len, mode, bound, lower, nodes, status, +profile}:
      Search{table, stack, Meta{root, p1, ceiling, best, best_len, mode, bound, C.pick(is_exact(mode), best_len, lower), nodes, finished(is_exact(mode)), profile}}
    case False{} Meta{+root, +p1, +ceiling, best, best_len, +mode, +bound, +lower, nodes, status, +profile}:
      +next_p1 = C.pick(U32.is_lt(p1, 12), (p1 + 1 : U32), 0)
      +next_ceiling = C.pick(U32.is_lt(p1, 12), ceiling, (ceiling + 1 : U32))
      +exact = is_exact(mode)
      +next_bound = (bound + 1 : U32)
      storage_checked(Search{table, store_reset(root_frame(root, C.pick(exact, next_bound, next_p1), next_goal(exact)), stack), Meta{root, next_p1, next_ceiling, best, best_len, mode, next_bound, C.pick(exact, next_bound, lower), nodes, Running{}, profile}})`);
search=replaceDef(search,"next",`def next_popped(result: Pop, table: Array<U32>, +meta: Meta) -> Search:
  match result meta:
    case Vacant{stack} Meta{root, p1, +ceiling, best, +best_len, +mode, +bound, lower, nodes, status, +profile}:
      next_root((is_exact(mode) && U32.is_ge((bound + 1 : U32), best_len)) || (is_improving(mode) && U32.is_ge(ceiling, 31)), table, stack, Meta{root, p1, ceiling, best, best_len, mode, bound, lower, nodes, status, profile})
    case Popped{rest, Node{+cube, +a, +b, +c, left, previous, next, +phase, length}} meta:
      node_goal((is_subgroup(phase) && U32.is_eq(a, 0) && U32.is_eq(b, 0) && U32.is_eq(c, 0)) || (Bool.not(is_subgroup(phase)) && solved(cube)), table, Node{cube, a, b, c, left, previous, next, phase, length}, rest, meta)
    case Popped{rest, Retry{cube, a, b, c, +depth, previous, +length}} Meta{root, p1, +ceiling, best, +best_len, mode, bound, lower, nodes, status, +profile}:
      retry(U32.is_le(depth, C.pick(U32.is_eq(best_len, 31) && U32.is_le(ceiling, 24), 12, 18)) && U32.is_le((depth + length : U32), ceiling) && U32.is_lt((depth + length : U32), best_len), table, Retry{cube, a, b, c, depth, previous, length}, rest, Meta{root, p1, ceiling, best, best_len, mode, bound, lower, nodes, status, profile})
    case Broken{stack} meta: storage_checked(Search{table, stack, meta})

def next(table: Array<U32>, stack: Store, meta: Meta) -> Search:
  next_popped(store_pop(stack), table, meta)`);
search=replaceDef(search,"advance",`def advance_raw(state: Search) -> Search:
  match state:
    case Search{table, stack, Meta{root, p1, ceiling, best, best_len, mode, bound, lower, nodes, status, +profile}}:
      next(table, stack, Meta{root, p1, ceiling, best, best_len, mode, bound, lower, (nodes + 1 : U32), status, profile})

def advance(state: Search) -> Search:
  storage_checked(advance_raw(state))`);
search=replaceDef(search,"run",`def run(fuel: Nat, state: Search) -> Search:
  match fuel state:
    case 0n state: storage_checked(state)
    case 1n+p Search{table, stack, Meta{root, p1, ceiling, best, best_len, mode, bound, lower, nodes, Running{}, +profile}}:
      run(p, advance_raw(Search{table, stack, Meta{root, p1, ceiling, best, best_len, mode, bound, lower, nodes, Running{}, profile}}))
    case _ state: storage_checked(state)`);
search=replaceDef(search,"initialize_checked",`def initialize_checked(accepted: Bool, table: Array<U32>, +root: C.Cubie, +request: Stage, profile: Profile) -> Search:
  match accepted:
    case True{}: storage_checked(Search{table, store_fresh(root_frame(root, 0, next_goal(is_exact(request)))), Meta{root, 0, 21, Nil{}, 31, request, 0, 0, 0, Running{}, profile}})
    case False{}: Search{table, store_empty(), Meta{root, 0, 21, Nil{}, 31, request, 0, 0, 0, ProfileMismatch{}, profile}}`);
search=constructors(search,["Search"],(name,parts)=>{assert.equal(parts.length,3);if(!parts[1].includes(" <> "))return parts;const sequence=parts[1].split(" <> "),tail=sequence.pop();assert.equal(tail,"rest","Unrouted owned root continuation");parts[1]=sequence.reduceRight((rest,frame)=>"store_push("+frame+", "+rest+")",tail);return parts;});
search=search.replace(/^import \.\/([a-z0-9-]+\.bend) as ([A-Za-z]+)$/gm,(_,file,alias)=>"import ../"+file+" as "+alias);
assert.ok(!search.includes("+List<Frame>"));
const record={format:"rubend-generated-owned-search-v1",sourceHashes:{"src/search.bend":hash(source),"bench/owned-continuation.bend":hash(store)},outputHashes:{"src/owned/search.bend":hash(search)},scope:"Isolated owned search only. Portfolio/runtime/observer integration and performance remain pending.",defaultEngine:"Unchanged",capacities:{frames:64,path:32}};
const files={"src/owned/search.bend":search,"src/owned/manifest.json":JSON.stringify(record,null,2)+"\n"};
if(!check)mkdirSync("src/owned",{recursive:true});
for(const [path,text]of Object.entries(files)){if(check)assert.equal(readFileSync(path,"utf8"),text,"Stale owned search: "+path);else{if(existsSync(path)&&!existsSync("src/owned/manifest.json"))throw Error("Refusing an unrecognized owned-search target");writeFileSync(path,text);}}
console.log(JSON.stringify({passed:true,check,files:Object.keys(files),scope:record.scope}));
