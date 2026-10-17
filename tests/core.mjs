import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import { puzzles } from "cubing/puzzles";
import Model from "../build/model.mjs";
import Cubie from "../build/cubie.mjs";
import Coord from "../build/coordinates.mjs";
import { apply, solved, validate, decode, parse, moveNames } from "../apps/model.mjs";
import {randomCube,randomSource,faceletsOf,randomSubgroupCube} from "./support.mjs";
import Symmetry from "../build/symmetry.mjs";
import PackedSymmetry from "../build/packed-symmetry.mjs";
import {array,list,encode} from "../apps/model.mjs";

const cornerMap=[0,3,2,1,4,5,6,7], edgeMap=[1,0,3,2,5,4,7,6,8,9,11,10];
const nib = (word, i) => (word >>> (4*i)) & 15;
function compare(cube, pattern) {
  const {cp,co,ep,eh,eo}=cube;
  const data=pattern.patternData;
  for(let i=0;i<8;i++) {
    assert.equal(cornerMap[nib(cp,i)],data.CORNERS.pieces[cornerMap[i]]);
    assert.equal((co >>> (2*i)) & 3,data.CORNERS.orientation[cornerMap[i]]);
  }
  for(let i=0;i<12;i++) {
    assert.equal(edgeMap[nib(i<8?ep:eh,i%8)],data.EDGES.pieces[edgeMap[i]]);
    assert.equal((eo >>> i)&1,data.EDGES.orientation[edgeMap[i]]);
  }
}
const kpuzzle=await puzzles["3x3x3"].kpuzzle();
let pattern=kpuzzle.defaultPattern(), facelets=solved, cube=Cubie.solved();
let seed=0x52554245;
const random=()=>{ seed=(Math.imul(seed,1664525)+1013904223)>>>0; return seed; };
for(let i=0;i<10000;i++) {
  const move=random()%18;
  pattern=pattern.applyAlg(moveNames[move]);
  facelets=apply(facelets,[move]);
  cube=Cubie.turn(move,cube);
  assert.deepEqual(validate(facelets),cube);
  compare(cube,pattern);
}
const uniform=randomSource("rubend-uniform-core-v1");
for(let i=0;i<1000;i++){
  const arbitrary=randomCube(uniform),text=faceletsOf(arbitrary);
  assert.deepEqual(validate(text),arbitrary);
  assert.equal(faceletsOf(validate(text)),text);
  assert.deepEqual(Cubie.inverse(Cubie.inverse(arbitrary)),arbitrary);
  let rotated=decode(text);
  let packedRotated=arbitrary;
  for(let axis=0;axis<3;axis++){
    assert.ok(validate(encode(rotated)));
    rotated=Symmetry.rotate(rotated);
    packedRotated=PackedSymmetry.rotate(packedRotated);
    assert.equal(faceletsOf(packedRotated),encode(rotated));
    for(let move=0;move<18;move++)assert.equal(faceletsOf(PackedSymmetry.rotate(Cubie.turn(move,arbitrary))),faceletsOf(Cubie.turn(Symmetry.rotate_index(move),PackedSymmetry.rotate(arbitrary))));
  }
  assert.equal(encode(rotated),text);
  for(let move=0;move<18;move++)assert.equal(faceletsOf(Cubie.turn(move,arbitrary)),apply(text,[move]));
}
for(let view=0;view<6;view++){
  const moves=Array.from({length:25},(_,i)=>uniform(18));
  assert.deepEqual(array(Symmetry.to_global(view,Symmetry.to_local(view,list(moves)))),moves);
  const state=apply(solved,moves),local=Symmetry.view(view%3,decode(state));
  const localCube=view>=3?Cubie.inverse(validate(encode(local))):validate(encode(local));
  const solution=moves.slice().reverse().map(m=>Math.floor(m/3)*3+2-m%3);
  const localSolution=array(Symmetry.to_local(view,list(solution.slice().reverse()))).reverse();
  assert.equal(apply(faceletsOf(localCube),localSolution),solved);
}
for(let i=0;i<1000;i++){
  const cube=randomSubgroupCube(uniform),original=decode(faceletsOf(cube));
  for(const transform of [Symmetry.ud,Symmetry.flip]){
    const moved=validate(encode(transform(original)));
    assert.equal(moved.co,0);assert.equal(moved.eo,0);assert.equal(Coord.encode({$:"Slice"},moved),0);
  }
}
for(let i=0;i<18;i++) assert.deepEqual(parse(moveNames[i]),[i]);
assert.deepEqual(parse("RUR′U' F2\nD"),[3,0,5,2,7,9]);
for(const text of ["r", "R3", "R2'", "R''", "x", "U w", "2R", "hello"]) assert.throws(()=>parse(text));
assert.deepEqual(parse(""),[]);
for(const name of ["Twist","Flip","Slice","Corners","Edges","Middle"]) {
  const kind={$:name}, count=Coord.size(kind);
  for(let i=0;i<count;i++) assert.equal(Coord.encode(kind,Coord.decode(kind,i)),i,`${name} ${i}`);
}
const set=(text, changes)=>{const a=[...text];for(const [i,c]of changes)a[i]=c;return a.join("");};
assert.throws(()=>validate(set(solved,[[5,"R"],[10,"U"]])),/flipped/);
assert.throws(()=>validate(set(solved,[[8,"R"],[9,"F"],[20,"U"]])),/twisted/);
assert.throws(()=>validate(set(solved,[[10,"F"],[19,"R"]])),/parity/);
assert.throws(()=>validate(set(solved,[[4,"R"]])),/center/);
assert.throws(()=>validate(solved.slice(1)));
assert.throws(()=>validate("U".repeat(54)));
for(let m=0;m<18;m++) assert.equal(apply(apply(solved,[m]),[Math.floor(m/3)*3+2-m%3]),solved);
assert.equal(Model.is_solved(decode(solved)),true);
mkdirSync("build/evidence",{recursive:true});
writeFileSync("build/evidence/core.json",JSON.stringify({checkedAt:new Date().toISOString(),independentOracle:"cubing@0.66.0 KPuzzle",randomTransitions:10000,arbitraryLegalStates:1000,arbitraryStateTransitions:18000,inverseRoundtrips:1000,frameRoundtrips:1000,packedFrameComparisons:3000,packedFrameConjugationChecks:54000,portfolioPathMappings:6,subgroupFrameChecks:2000,coordinateRoundtrips:85394,invalidFamilies:6,notation:true,passed:true},null,2));
console.log("Core: 10,000 independent transitions, 1,000 arbitrary legal states, 18,000 refinement transitions, all coordinates, invalid states, and notation passed.");
