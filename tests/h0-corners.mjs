import assert from "node:assert/strict";
import {execFileSync} from "node:child_process";
import {writeFileSync} from "node:fs";
import H from "../build/h0-corners.mjs";
import C from "../build/cubie.mjs";
import S from "../build/symmetry48.mjs";
import {decode} from "../apps/model.mjs";
import {randomCube,randomSource,faceletsOf} from "./support.mjs";

const bitCount = n => n.toString(2).replaceAll("0","").length;
const masks = Array.from({length:256},(_,i) => i).filter(mask => bitCount(mask) === 4);
assert.equal(masks.length,70);
assert.equal(H.size(),153090);
const keys = new Set();
const tetrads = [[0,2,5,7],[1,3,4,6]];
const pack = (values,bits) => values.reduce((word,value,i) => (word | (value << (bits*i))) >>> 0,0);
const parity = values => values.reduce((result,x,i) => result ^ values.slice(i+1).reduce((p,y) => p ^ Number(x>y),0),0);
const hash = (previous,value) => Math.imul(previous ^ value,16777619) >>> 0;
let fingerprint = 2166136261;
for (let index = 0; index < H.size(); index++) {
  const result = H.from_index(index);
  assert.equal(result.$,"Some");
  const coordinate = result.value, mask = masks[index%70], twist = Math.floor(index/70);
  assert.equal(coordinate.separation,mask);
  assert.equal(coordinate.twist,twist);
  assert.equal(H.index(coordinate),index);
  const key = twist*128+(mask&127);
  assert.equal(H.sparse_key(coordinate),key);
  assert.ok(!keys.has(key)); keys.add(key);
  const used = [0,0], pieces = Array.from({length:8},(_,p) => {const t=(mask>>>p)&1;return tetrads[t][used[t]++];});
  const orientations = Array.from({length:7},(_,p) => Math.floor(twist/3**p)%3);
  orientations.push((3-orientations.reduce((a,b) => a+b,0)%3)%3);
  const expected = {cp:pack(pieces,4),co:pack(orientations,2),ep:parity(pieces) ? 1985229313 : 1985229328,eh:47768,eo:0};
  const actual = H.representative(coordinate);
  for (const field of ["cp","co","ep","eh","eo"]) {assert.equal(actual[field],expected[field]);fingerprint=hash(fingerprint,expected[field]);}
  assert.equal(H.index(H.project(actual)),index);
}
assert.deepEqual(H.from_index(153090),{$:"None"});
assert.deepEqual(H.from_index(4294967295),{$:"None"});
assert.equal(H.index(H.goal()),23);
assert.notEqual(H.index(H.project(C.turn(0,C.solved()))),23);
assert.equal(H.index(H.project({...C.solved(),eo:4095})),23);
for (let sym = 0; sym < 48; sym++) {
  const transformed = H.reference_transform({$:"symmetry48.S"+sym},H.goal());
  assert.equal(transformed.$,"Some");
  assert.equal(H.index(transformed.value),23);
}
const random = randomSource("rubend-h0-corner-codec-v1");
const moveNames = ["U","U2","Ui","R","R2","Ri","F","F2","Fi","D","D2","Di","L","L2","Li","B","B2","Bi"];
let transitionChecks = 0, symmetryChecks = 0;
for (let i = 0; i < 1000; i++) {
  const cube = randomCube(random), coordinate = H.project(cube);
  for (let move = 0; move < 18; move++) {
    assert.equal(H.index(H.transition({$:"model."+moveNames[move]},coordinate)),H.index(H.project(C.turn(move,cube))));
    transitionChecks++;
  }
  if (i < 128) for (let sym = 0; sym < 48; sym++) {
    const actual = H.reference_transform({$:"symmetry48.S"+sym},coordinate);
    assert.equal(actual.$,"Some");
    const full = C.validate(S.apply(S.from_index(sym).value,decode(faceletsOf(cube))));
    assert.equal(full.$,"Valid");
    assert.equal(H.index(actual.value),H.index(H.project(full.cube)));
    symmetryChecks++;
  }
}
const native = JSON.parse(execFileSync(process.argv[2] ?? "build/h0-corners-test",["--threads","1"],{encoding:"utf8",timeout:120000,maxBuffer:1048576}));
assert.deepEqual(native,{visited:H.size(),fingerprint,goal:23});
const report = {passed:true,coordinates:H.size(),separations:70,orientationRanks:2187,representatives:H.size(),nativeRepresentativesValidated:native.visited,sparseKeys:keys.size,fingerprint,goal:23,independentTransitionChecks:transitionChecks,referenceSymmetryChecks:symmetryChecks,targetSymmetryChecks:48,uIsNotGoal:true,superflipCornerIsGoal:true,universalProjectionProof:false,quotientBuilt:false,independentReview:false};
writeFileSync("build/evidence/h0-corners.json",JSON.stringify(report,null,2)+"\n");
console.log(JSON.stringify(report));
