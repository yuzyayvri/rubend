import {readFileSync, writeFileSync} from "node:fs";
import {spawnSync} from "node:child_process";
import assert from "node:assert/strict";

const left = Number(process.argv[2] ?? 1);
assert.ok(Number.isInteger(left) && left >= 0 && left < 48);
const {records} = JSON.parse(readFileSync("tests/symmetry48-data.json", "utf8"));
const structural = process.argv[3] === "--structural";
const path = `build/evidence/sym48-color-cost-${left}${structural ? "-structural-bits" : ""}.bend`;
const word = `U32{${Array.from({length:32}, (_,i) => `b${i}`).reduceRight((tail, bit) => `WCon{${bit}, ${tail}}`, "WNil{}")}}`;
const descending = Array.from({length:32}, (_,i) => `b${31-i}`);
function high(bit = 31, indent = "  ") {
  if (bit < 3) return [`${indent}match b2 b1 b0:`, ...Array.from({length:8}, (_,i) => [`${indent}  case ${[2,1,0].map(b => i & (1 << b) ? "True{}" : "False{}").join(" ")}:`, ...(i >= 6 ? [`${indent}    {==}`] : [`${indent}    match right:`, ...records.flatMap(r => [`${indent}      case S.S${r.index}{}:`, `${indent}        {==}`])])]).flat()];
  return [`${indent}match b${bit}:`, `${indent}  case True{}:`, `${indent}    {==}`, `${indent}  case False{}:`, ...high(bit-1, indent+"    ")];
}
const source = ["import Base", "import ../../src/symmetry48.bend as S", "", ...(structural ? [`def color_composition_bits(${descending.map(b => `+${b}: Bool`).join(", ")}, +right: S.Symmetry) -> {S.color(S.compose(S.S${left}{}, right), ${word}) == S.color(S.S${left}{}, S.color(right, ${word})) : U32}:`, ...high(), ""] : []), `def color_composition(+right: S.Symmetry, +value: U32) -> {S.color(S.compose(S.S${left}{}, right), value) == S.color(S.S${left}{}, S.color(right, value)) : U32}:`, ...(structural ? ["  match value:", `    case ${word}:`, `      color_composition_bits(${descending.join(", ")}, right)`] : ["  match right:", ...records.flatMap(r => [`    case S.S${r.index}{}:`, "      match value:", ...[0,1,2,3,4,5,"value"].flatMap(v => [`        case ${v}:`, "          {==}"])])]), ""].join("\n");
writeFileSync(path, source, {flag:"wx"});
const result = spawnSync("bend", [path, "--check-only"], {stdio:"inherit"});
process.exitCode = result.status ?? 1;
