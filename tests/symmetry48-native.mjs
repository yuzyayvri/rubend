import assert from "node:assert/strict";
import {execFileSync} from "node:child_process";
import {readFileSync, writeFileSync} from "node:fs";

const {records} = JSON.parse(readFileSync("tests/symmetry48-data.json", "utf8"));
const palette = [0,1,2,3,4,5,6,7,255,65535,2147483648,4294967295];
const raw = [Array.from({length:54}, (_,i) => i+6), Array.from({length:54}, (_,i) => palette[i%palette.length]), ...Array.from({length:6}, (_,c) => Array(54).fill(c))];
const rows = execFileSync(process.argv[2] ?? "build/symmetry48-native-test", ["--threads", "1"], {encoding:"utf8", timeout:30000, maxBuffer:1048576}).trim().split("\n").map(JSON.parse);
assert.equal(rows.length, 48);
for (const [i, row] of rows.entries()) {
  const r = records[i];
  assert.deepEqual(row, {sym:i, inverse:r.inverse, compositions:r.composition, moves:r.moves, cubes:raw.map(values => r.permutation.map(p => values[p] < 6 ? r.colors[values[p]] : values[p]))});
}
const report = {passed:true, nativeRows:48, arbitraryCubeActions:48*8, nativeCompositionIds:48*48, nativeMoveIds:48*18, nativeValues:48*8*54, independentReview:false};
writeFileSync("build/evidence/symmetry48-native.json", JSON.stringify(report,null,2)+"\n");
console.log(JSON.stringify(report));
