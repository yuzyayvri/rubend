import assert from "node:assert/strict";
import {mkdtempSync, readFileSync, writeFileSync, copyFileSync, rmSync} from "node:fs";
import {tmpdir} from "node:os";
import {join} from "node:path";
import {spawnSync} from "node:child_process";

const {records} = JSON.parse(readFileSync("tests/symmetry48-data.json", "utf8"));
const reflection = records.find(r => r.determinant === -1 && r.moves[0] === 2);
const original = readFileSync("src/symmetry48.bend", "utf8");
const mutations = [
  {name:"reflection-turn-sense", before:`case S${reflection.index}{} M.U{}:\n      M.Ui{}`, after:`case S${reflection.index}{} M.U{}:\n      M.U{}`, location:"Laws.sym48_move_conjugacy"},
  {name:"out-of-palette-color", before:"case True{}:\n      value", after:"case True{}:\n      0", location:"color_composition_bits"},
];
const results = [];
for (const mutation of mutations) {
  assert.equal(original.split(mutation.before).length, 2, mutation.name);
  const directory = mkdtempSync(join(tmpdir(), "rubend-sym48-proof-"));
  try {
    for (const name of ["model", "symmetry48", "symmetry48-laws", "symmetry48-proof"]) copyFileSync(`src/${name}.bend`, join(directory, `${name}.bend`));
    writeFileSync(join(directory,"symmetry48.bend"), original.replace(mutation.before,mutation.after));
    const r = spawnSync("bend", [join(directory,"symmetry48-proof.bend"),"--check-only"], {encoding:"utf8",timeout:120000,maxBuffer:1048576});
    assert.ifError(r.error);
    const output = `${r.stdout}${r.stderr}`;
    assert.equal(r.status, 1, output);
    assert.match(output, /SOME PROOFS FAIL/);
    assert.ok(output.includes(`Location: ${mutation.location}`), output);
    results.push({name:mutation.name,status:r.status,output});
  } finally {rmSync(directory,{recursive:true,force:true});}
}
writeFileSync("build/evidence/symmetry48-proof-negative.json", JSON.stringify({passed:true,results,independentReview:false},null,2)+"\n");
console.log(JSON.stringify({passed:true,rejectedMutations:results.map(r => r.name)}));
