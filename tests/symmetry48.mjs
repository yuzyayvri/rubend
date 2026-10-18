import assert from "node:assert/strict";
import {readFileSync, writeFileSync, mkdirSync} from "node:fs";
import {puzzles} from "cubing/puzzles";
import {KPattern} from "cubing/kpuzzle";
import S from "../build/symmetry48.mjs";
import M from "../build/model.mjs";
import C from "../build/cubie.mjs";
import {decode, encode, moveNames} from "../apps/model.mjs";
import {randomCube, randomSource, faceletsOf, patternData} from "./support.mjs";

const {stickers} = JSON.parse(readFileSync("tests/geometry.json", "utf8"));
const fixture = JSON.parse(readFileSync("tests/symmetry48-data.json", "utf8"));
const normals = [[0,1,0],[1,0,0],[0,0,1],[0,-1,0],[-1,0,0],[0,0,-1]];
const key = (position, normal) => `${position}/${normal}`;
const index = new Map(stickers.map(s => [key(s.position, s.normal), s.index]));
const generators = [([x,y,z]) => [x,-z,y], ([x,y,z]) => [z,y,-x], ([x,y,z]) => [-x,y,z]];
function action(transform) {
  const permutation = Array(54);
  for (const s of stickers) permutation[index.get(key(transform(s.position), transform(s.normal)))] = s.index;
  const colors = normals.map(n => normals.findIndex(m => m.every((v,i) => v === transform(n)[i])));
  return {permutation, colors};
}
const combine = (left, right) => ({permutation:left.permutation.map(i => right.permutation[i]), colors:right.colors.map(i => left.colors[i])});
const actionKey = a => a.permutation.join(",");
const identity = action(p => p), group = [identity], known = new Map([[actionKey(identity), identity]]);
for (let i = 0; i < group.length; i++) for (const transform of generators) {
  const candidate = combine(action(transform), group[i]), k = actionKey(candidate);
  if (!known.has(k)) {known.set(k, candidate); group.push(candidate);}
}
assert.equal(group.length, 48);
const records = fixture.records;
assert.equal(records.length, 48);
assert.equal(new Set(records.map(actionKey)).size, 48);
for (const r of records) assert.deepEqual({permutation:r.permutation, colors:r.colors}, known.get(actionKey(r)));
const makeCube = values => Object.fromEntries([["$", "Cube"], ...values.map((value,i) => [`s${i}`,value])]);
const values = cube => Array.from({length:54}, (_,i) => cube[`s${i}`]);
const equalCube = (actual, expected) => assert.deepEqual(values(actual), values(expected));
const oracle = (a, cube) => makeCube(a.permutation.map(i => cube[`s${i}`] < 6 ? a.colors[cube[`s${i}`]] : cube[`s${i}`]));
const symmetry = i => S.from_index(i).value;
const mappedMove = (s, m) => M.index({$:S.map_move(s, {$:`model.${M.from_index(m).$}`}).$.split(".").at(-1)});
const palette = [0,1,2,3,4,5,6,7,255,65535,2147483648,4294967295];
const raw = [makeCube(Array.from({length:54}, (_,i) => i+6)), makeCube(Array.from({length:54}, (_,i) => palette[i%palette.length])), ...Array.from({length:6}, (_,c) => makeCube(Array(54).fill(c)))];
assert.deepEqual(S.from_index(48), {$:"None"});
assert.deepEqual(S.from_index(4294967295), {$:"None"});
assert.equal(S.index(S.identity()), 0);
const byPermutation = new Map(records.map(r => [actionKey(r), r.index]));
let compositionChecks = 0, conjugacyChecks = 0;
for (const r of records) {
  const s = symmetry(r.index);
  assert.equal(S.index(s), r.index);
  assert.equal(S.index(S.inverse(s)), r.inverse);
  equalCube(S.apply(s, M.solved()), M.solved());
  for (const cube of raw) {
    equalCube(S.apply(s, cube), oracle(known.get(actionKey(r)), cube));
    equalCube(S.apply(S.inverse(s), S.apply(s, cube)), cube);
    for (let m = 0; m < 18; m++) {
      const mapped = mappedMove(s, m);
      assert.equal(mapped, r.moves[m]);
      equalCube(S.apply(s, M.turn(M.from_index(m), cube)), M.turn(M.from_index(mapped), S.apply(s, cube)));
      conjugacyChecks++;
    }
  }
  for (const b of records) {
    const expected = byPermutation.get(actionKey(combine(r,b)));
    assert.equal(S.index(S.compose(s, symmetry(b.index))), expected);
    for (const cube of raw) {
      equalCube(S.apply(S.compose(s, symmetry(b.index)), cube), S.apply(s, S.apply(symmetry(b.index), cube)));
      compositionChecks++;
    }
  }
}
const puzzle = await puzzles["3x3x3"].kpuzzle(), random = randomSource("rubend-symmetry48-v1");
let legalChecks = 0;
for (let i = 0; i < 32; i++) {
  const cube = decode(faceletsOf(randomCube(random)));
  for (const r of records) {
    const transformed = S.apply(symmetry(r.index), cube), validated = C.validate(transformed);
    assert.equal(validated.$, "Valid");
    assert.equal(faceletsOf(validated.cube), encode(transformed));
    const pattern = new KPattern(puzzle, patternData(validated.cube));
    for (let m = 0; m < 18; m++) {
      const mapped = mappedMove(symmetry(r.index), m);
      const moved = C.validate(S.apply(symmetry(r.index), M.turn(M.from_index(m), cube)));
      assert.equal(moved.$, "Valid");
      assert.deepEqual(patternData(moved.cube), pattern.applyAlg(moveNames[mapped]).patternData);
      legalChecks++;
    }
  }
}
const reflection = records.find(r => r.determinant === -1 && r.moves[0]%3 === 2);
assert.throws(() => equalCube(S.apply(symmetry(reflection.index), M.turn(M.from_index(0), raw[0])), M.turn(M.from_index(reflection.moves[0]-2), S.apply(symmetry(reflection.index), raw[0]))), assert.AssertionError);
const colored = raw[1], renamed = records.find(r => r.colors.some((c,i) => c !== i));
assert.throws(() => equalCube(S.apply(symmetry(renamed.index), colored), makeCube(renamed.permutation.map(i => values(colored)[i]))), assert.AssertionError);
const noncommuting = records.flatMap(a => records.map(b => [a,b])).find(([a,b]) => a.composition[b.index] !== b.composition[a.index]);
assert.throws(() => equalCube(S.apply(S.compose(symmetry(noncommuting[0].index),symmetry(noncommuting[1].index)),raw[0]), S.apply(S.compose(symmetry(noncommuting[1].index),symmetry(noncommuting[0].index)),raw[0])), assert.AssertionError);
mkdirSync("build/evidence", {recursive:true});
const report = {format:"rubend-symmetry48-check-v1", passed:true, symmetries:48, proper:24, improper:24, rawCubes:raw.length, compositionChecks, conjugacyChecks, independentLegalMoveChecks:legalChecks, rejectedMutations:["reflection-quarter-turn-sense", "missing-color-action", "reversed-composition"], oracle:"independent generator closure and cubing@0.66.0 KPuzzle", independentReview:false};
writeFileSync("build/evidence/symmetry48.json", JSON.stringify(report,null,2)+"\n");
console.log(JSON.stringify(report));
