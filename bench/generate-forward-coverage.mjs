import assert from "node:assert/strict";
import {readFileSync,writeFileSync,mkdirSync} from "node:fs";
import {resolve} from "node:path";
import {createHash} from "node:crypto";
import {withArtifactLease} from "../scripts/artifact-lease.mjs";

withArtifactLease();assert.ok(process.argv.length===3||process.argv.length===4);const directory=resolve(process.argv[2]),check=process.argv[3]==="--check";assert.ok(directory.startsWith(resolve("build")+"/"));assert.ok(process.argv.length===3||check);const original=readFileSync("src/search.bend","utf8"),worker=readFileSync("bench/contour-target.bend","utf8"),hash=s=>createHash("sha256").update(s).digest("hex"),absolute=(text,base)=>text.replace(/^import (\.\.?\/\S+\.bend) as /gm,(_,p)=>"import "+resolve(base,p)+" as ");
function once(text,from,to){assert.equal(text.split(from).length,2,from);return text.replace(from,to);}
function change(text,name,edits){const start=text.indexOf("def "+name+"(");assert.ok(start>=0);const next=text.indexOf("\ndef ",start+1),end=next<0?text.length:next+1;let body=text.slice(start,end);for(const[from,to]of edits)body=once(body,from,to);return text.slice(0,start)+body+text.slice(end);}
let source=absolute(original,resolve("src"));
source=change(source,"first_joint",[["case Tuple{table, bound} Node{","case Tuple{table, +bound} Node{"],["U32.is_lt(bound, left), is_full_cube(phase), table","U32.is_lt(bound, left), is_full_cube(phase), U32.is_eq(bound, (left - 1 : U32)), table"]]);
source=change(source,"joint_allowed",[["ok: Bool, exact: Bool, table","ok: Bool, exact: Bool, tight: Bool, table"],["other_axes(~lookup, exact, table","other_axes(~lookup, exact, tight, table"]]);
source=change(source,"other_axes",[["exact: Bool, table","exact: Bool, tight: Bool, table"],["second_joint(~lookup, lookup(","second_joint(~lookup, tight, lookup("]]);
source=change(source,"second_joint",[["(Array<U32> & U32), read:","(Array<U32> & U32), tight: Bool, read:"],["case Tuple{table, bound} Node{","case Tuple{table, +bound} Node{"],["U32.is_lt(bound, left), table","U32.is_lt(bound, left), tight && U32.is_eq(bound, (left - 1 : U32)), table"]]);
source=change(source,"second_allowed",[["ok: Bool, table","ok: Bool, tight: Bool, table"],["last_joint(lookup(table, joint_index(R.rotate(rotated))), parent","last_joint(lookup(table, joint_index(R.rotate(rotated))), tight, parent"]]);
source=change(source,"last_joint",[["read: Array<U32> & U32, +parent","read: Array<U32> & U32, tight: Bool, +parent"],["case Tuple{table, bound} Node{","case Tuple{table, +bound} Node{"],["previous, next, phase, path, length}:","previous, next, +phase, path, length}:"],["forward_allowed(U32.is_lt(bound, left), table","forward_allowed(coverage_allowed(is_full_cube(phase) && coverage_profile(meta), left, tight, bound), table"]]);
const helpers=`def coverage_profile(meta: Meta) -> Bool:
  match meta:
    case Meta{root, p1, ceiling, best, best_len, mode, bound, lower, nodes, status, RawInverseThree{}}: True{}
    case _: False{}

def coverage_allowed(eligible: Bool, +left: U32, tight: Bool, +bound: U32) -> Bool:
  U32.is_lt(bound, left) && Bool.not(eligible && U32.is_gt(left, 1) && U32.is_le(left, 15) && tight && U32.is_eq(bound, (left - 1 : U32)))

def coverage_goal(code: U32) -> Goal:
  match code:
    case 2: FullCube{}
    case 1: Subgroup{}
    case _: Reduction{}

def coverage_decode_profile(code: U32) -> Profile:
  match code:
    case 1: RawJoint{}
    case 2: RawInverseOne{}
    case 3: RawInverseThree{}
    case 4: BlockJoint{}
    case _: Light{}

def coverage_probe(phase: U32, profile: U32, +radius: U32, a: U32, b: U32, c: U32) -> U32:
  eligible = is_full_cube(coverage_goal(phase)) && coverage_profile(Meta{C.solved(), 0, 21, Nil{}, 31, ExactContour{}, 0, 0, 0, Running{}, coverage_decode_profile(profile)})
  C.pick(coverage_allowed(eligible, (radius + 1 : U32), U32.is_eq(a, radius) && U32.is_eq(b, radius), c), 1, 0)

`;
source=once(source,"def last_joint(",helpers+"def last_joint(");
const base=absolute(worker,resolve("bench")),control=once(base,"work(20000000n,","work(200000n,"),candidate=once(control,"import "+resolve("src/search.bend")+" as S","import "+resolve(directory,"search.bend")+" as S"),badZero=change(source,"coverage_allowed",[["U32.is_gt(left, 1)","U32.is_ge(left, 1)"]]),badLast=change(source,"coverage_allowed",[["tight && U32.is_eq(bound, (left - 1 : U32))","tight && U32.is_le(bound, (left - 1 : U32))"]]);
let badScope=change(source,"last_joint",[["is_full_cube(phase) && coverage_profile(meta)","True{}"]]);badScope=change(badScope,"coverage_probe",[["is_full_cube(coverage_goal(phase)) && coverage_profile(Meta{C.solved(), 0, 21, Nil{}, 31, ExactContour{}, 0, 0, 0, Running{}, coverage_decode_profile(profile)})","{True{} : Bool}"]]);
const files={"search.bend":source,"control.bend":control,"candidate.bend":candidate,"bad-zero.bend":badZero,"bad-last.bend":badLast,"bad-scope.bend":badScope},manifest={format:"rubend-forward-coverage-generation-v1",sourceHashes:{"src/search.bend":hash(original),"bench/contour-target.bend":hash(worker),"src/inverse-bound.bend":hash(readFileSync("src/inverse-bound.bend"))},outputHashes:Object.fromEntries(Object.entries(files).map(([p,s])=>[p,hash(s)])),frameChanged:false,stackFieldsAdded:0,tableReadsAdded:0,rawInverseThreeFullCubeOnly:true,inversePolicyChanged:false,fuel:200000,productionIntegrated:false,performanceAcceptance:false};
if(!check)mkdirSync(directory);for(const[p,s]of Object.entries({...files,"manifest.json":JSON.stringify(manifest,null,2)+"\n"})){const path=resolve(directory,p);if(check)assert.equal(readFileSync(path,"utf8"),s);else writeFileSync(path,s,{flag:"wx"});}console.log(JSON.stringify({passed:true,directory,check,changedDefinitions:6,frameChanged:false,tableReadsAdded:0}));
