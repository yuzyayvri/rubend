import assert from "node:assert/strict";
import {readFileSync, writeFileSync} from "node:fs";

const {stickers} = JSON.parse(readFileSync("tests/geometry.json", "utf8"));
const normals = [[0,1,0], [1,0,0], [0,0,1], [0,-1,0], [-1,0,0], [0,0,-1]];
const moves = ["U", "U2", "Ui", "R", "R2", "Ri", "F", "F2", "Fi", "D", "D2", "Di", "L", "L2", "Li", "B", "B2", "Bi"];
const axes = [[0,1,2], [0,2,1], [1,0,2], [1,2,0], [2,0,1], [2,1,0]];
const matrices = axes.flatMap(axis => Array.from({length:8}, (_, bits) => axis.map((column, row) => Array.from({length:3}, (_, i) => i === column ? (bits & (1 << row) ? -1 : 1) : 0))));
const key = value => JSON.stringify(value);
const transform = (matrix, vector) => matrix.map(row => row.reduce((sum, value, i) => sum + value * vector[i], 0));
const multiply = (a, b) => a.map(row => b[0].map((_, col) => row.reduce((sum, value, i) => sum + value * b[i][col], 0)));
const determinant = a => a[0][0]*(a[1][1]*a[2][2]-a[1][2]*a[2][1])-a[0][1]*(a[1][0]*a[2][2]-a[1][2]*a[2][0])+a[0][2]*(a[1][0]*a[2][1]-a[1][1]*a[2][0]);
const matrixIndex = new Map(matrices.map((matrix, i) => [key(matrix), i]));
const stickerIndex = new Map(stickers.map(s => [key([s.position, s.normal]), s.index]));
const records = matrices.map((matrix, i) => {
  const permutation = Array(54);
  for (const sticker of stickers) permutation[stickerIndex.get(key([transform(matrix, sticker.position), transform(matrix, sticker.normal)]))] = sticker.index;
  const colors = normals.map(normal => normals.findIndex(n => key(n) === key(transform(matrix, normal))));
  const parity = determinant(matrix);
  const mapped = moves.map((_, m) => colors[Math.floor(m/3)]*3 + (parity === 1 ? m%3 : 2-m%3));
  const composition = matrices.map(right => matrixIndex.get(key(multiply(matrix, right))));
  const inverse = matrixIndex.get(key(matrix[0].map((_, col) => matrix.map(row => row[col]))));
  assert.equal(new Set(permutation).size, 54);
  assert.equal(new Set(colors).size, 6);
  assert.equal(new Set(mapped).size, 18);
  assert.ok(composition.every(Number.isInteger));
  assert.ok(Number.isInteger(inverse));
  return {index:i, matrix, determinant:parity, permutation, colors, moves:mapped, composition, inverse};
});
assert.equal(matrixIndex.size, 48);
assert.equal(records.filter(r => r.determinant === 1).length, 24);
assert.deepEqual(matrices[0], [[1,0,0],[0,1,0],[0,0,1]]);
const fields = Array.from({length:54}, (_, i) => `s${i}`);
const cube = `M.Cube{${fields.join(", ")}}`;
const sym = i => `S${i}{}`;
const qualified = i => `S.${sym(i)}`;
function pairCases(body) {
  return ["  match left:", ...records.flatMap(a => [`    case ${qualified(a.index)}:`, "      match right:", ...records.flatMap(b => [`        case ${qualified(b.index)}:`, ...body(a,b).map(line => `          ${line}`)])])];
}
const bits = Array.from({length:32}, (_, i) => `b${i}`);
const word = `U32{${bits.reduceRight((tail, bit) => `WCon{${bit}, ${tail}}`, "WNil{}")}}`;
const descending = bits.toReversed();
function highBits(leaf, fallback, bit = 31, indent = "  ") {
  if (bit < 3) return leaf.map(line => indent+line);
  return [`${indent}match b${bit}:`, `${indent}  case True{}:`, `${indent}    ${fallback}`, `${indent}  case False{}:`, ...highBits(leaf, fallback, bit-1, indent+"    ")];
}
const out = ["import Base", "import ./model.bend as M", "", "type Symmetry is Data:", ...records.map(r => `  ${sym(r.index)}`), "", "def identity() -> Symmetry:", "  S0{}", "", "def index(sym: Symmetry) -> U32:", "  match sym:", ...records.flatMap(r => [`    case ${sym(r.index)}:`, `      ${r.index}`]), "", "def from_index(index: U32) -> Maybe<&2, Symmetry>:", "  match index:", ...records.flatMap(r => [`    case ${r.index}:`, `      Some{${sym(r.index)}}`]), "    case _: None{}", "", "def inverse(sym: Symmetry) -> Symmetry:", "  match sym:", ...records.flatMap(r => [`    case ${sym(r.index)}:`, `      ${sym(r.inverse)}`]), "", "def compose(left: Symmetry, right: Symmetry) -> Symmetry:", "  match left right:", ...records.flatMap(a => records.flatMap(b => [`    case ${sym(a.index)} ${sym(b.index)}:`, `      ${sym(a.composition[b.index])}`])), ""];
for (const r of records) out.push(`def color_${r.index}(value: U32) -> U32:`, ...(r.index === 0 ? ["  value"] : ["  match value:", ...r.colors.flatMap((value, i) => [`    case ${i}: ${value}`]), "    case value: value"]), "");
out.push("def known_color(sym: Symmetry, value: U32) -> U32:", "  match sym:", ...records.flatMap(r => [`    case ${sym(r.index)}:`, `      color_${r.index}(value)`]), "", `def color_bits(${descending.map(b => `${b}: Bool`).join(", ")}, sym: Symmetry, value: U32) -> U32:`, ...highBits(["match b2 b1 b0:", ...Array.from({length:8}, (_, i) => [`  case ${[2,1,0].map(bit => i & (1 << bit) ? "True{}" : "False{}").join(" ")}:`, `    ${i < 6 ? `known_color(sym, ${i})` : "value"}`]).flat()], "value"), "", "def color(sym: Symmetry, +value: U32) -> U32:", "  match value:", `    case ${word}:`, `      color_bits(${descending.join(", ")}, sym, value)`, "");
out.push("def permute(sym: Symmetry, cube: M.Cube) -> M.Cube:", "  match sym cube:", ...records.flatMap(r => [`    case ${sym(r.index)} ${cube}:`, `      M.Cube{${r.permutation.map(i => fields[i]).join(", ")}}`]), "", "def paint(+sym: Symmetry, cube: M.Cube) -> M.Cube:", "  match cube:", `    case ${cube}:`, `      M.Cube{${fields.map(f => `color(sym, ${f})`).join(", ")}}`, "", "def apply(+sym: Symmetry, cube: M.Cube) -> M.Cube:", "  paint(sym, permute(sym, cube))", "", "def map_move(sym: Symmetry, move: M.Move) -> M.Move:", "  match sym move:", ...records.flatMap(r => moves.flatMap((m, i) => [`    case ${sym(r.index)} M.${m}{}:`, `      M.${moves[r.moves[i]]}{}`])), "");

const proof = ["import Base", "import ./model.bend as M", "import ./symmetry48.bend as S", "import ./symmetry48-laws.bend as Laws", ""];
for (let value = 0; value < 6; value++) proof.push(`def color_composition_${value}(+left: S.Symmetry, +right: S.Symmetry) -> {S.color(S.compose(left, right), ${value}) == S.color(left, S.color(right, ${value})) : U32}:`, ...pairCases(() => ["{==}"]), "");
proof.push(`def color_composition_bits(${descending.map(b => `+${b}: Bool`).join(", ")}, +left: S.Symmetry, +right: S.Symmetry) -> {S.color(S.compose(left, right), ${word}) == S.color(left, S.color(right, ${word})) : U32}:`, ...highBits(["match b2 b1 b0:", ...Array.from({length:8}, (_, i) => [`  case ${[2,1,0].map(bit => i & (1 << bit) ? "True{}" : "False{}").join(" ")}:`, `    ${i < 6 ? `color_composition_${i}(left, right)` : "{==}"}`]).flat()], "{==}"), "", "def color_composition(+left: S.Symmetry, +right: S.Symmetry, +value: U32) -> {S.color(S.compose(left, right), value) == S.color(left, S.color(right, value)) : U32}:", "  match value:", `    case ${word}:`, `      color_composition_bits(${descending.join(", ")}, left, right)`, "", `def color_identity_bits(${descending.map(b => `+${b}: Bool`).join(", ")}) -> {S.color(S.identity(), ${word}) == ${word} : U32}:`, ...highBits(["match b2 b1 b0:", ...Array.from({length:8}, (_, i) => [`  case ${[2,1,0].map(bit => i & (1 << bit) ? "True{}" : "False{}").join(" ")}:`, "    {==}"]).flat()], "{==}"), "", "def color_identity(+value: U32) -> {S.color(S.identity(), value) == value : U32}:", "  match value:", `    case ${word}:`, `      color_identity_bits(${descending.join(", ")})`, "", "def permute_composition(+left: S.Symmetry, +right: S.Symmetry, +cube: M.Cube) -> {S.permute(S.compose(left, right), cube) == S.permute(left, S.permute(right, cube)) : M.Cube}:", ...pairCases(() => ["match cube:", `  case ${cube}:`, "    {==}"]), "", "def paint_composition(+left: S.Symmetry, +right: S.Symmetry, +cube: M.Cube) -> {S.paint(S.compose(left, right), cube) == S.paint(left, S.paint(right, cube)) : M.Cube}:", "  match cube:", `    case ${cube}:`);
for (let i = 0; i < fields.length; i++) proof.push(`      %color_composition(left, right, ${fields[i]}) : {S.paint(S.compose(left, right), cube) == M.Cube{${fields.map((f, j) => j < i ? `S.color(S.compose(left, right), ${f})` : j === i ? "_" : `S.color(left, S.color(right, ${f}))`).join(", ")}} : M.Cube}`);
proof.push("      {==}", "", "def paint_permute(+left: S.Symmetry, +right: S.Symmetry, +cube: M.Cube) -> {S.paint(left, S.permute(right, cube)) == S.permute(right, S.paint(left, cube)) : M.Cube}:", "  match right cube:", ...records.flatMap(r => [`    case ${qualified(r.index)} ${cube}:`, "      {==}"]), "", "def Laws.sym48_identity_action(cube):", "  match cube:", `    case ${cube}:`, "      {==}", "", "def Laws.sym48_composition_action(left, right, cube):", "  %paint_permute(right, left, S.permute(right, cube)) : {S.apply(S.compose(left, right), cube) == S.paint(left, _) : M.Cube}", "  %paint_composition(left, right, S.permute(left, S.permute(right, cube))) : {S.apply(S.compose(left, right), cube) == _ : M.Cube}", "  %permute_composition(left, right, cube) : {S.apply(S.compose(left, right), cube) == S.paint(S.compose(left, right), _) : M.Cube}", "  {==}", "", "def Laws.sym48_inverse_action(sym, cube):", "  match sym:", ...records.flatMap(r => [`    case ${qualified(r.index)}:`, `      %Laws.sym48_composition_action(${qualified(r.inverse)}, ${qualified(r.index)}, cube) : {_ == cube : M.Cube}`, "      Laws.sym48_identity_action(cube)"]), "", "def Laws.sym48_move_conjugacy(sym, move, cube):", "  match sym move cube:", ...records.flatMap(r => moves.flatMap(m => [`    case ${qualified(r.index)} M.${m}{} ${cube}:`, "      {==}"])), "", "def Laws.sym48_solved_fixed(sym):", "  match sym:", ...records.flatMap(r => [`    case ${qualified(r.index)}:`, "      {==}"]), "");

const identityAt = proof.indexOf("def Laws.sym48_identity_action(cube):");
proof.splice(identityAt+3, 1, ...fields.map((field, i) => `      %color_identity(${field}) : {S.apply(S.identity(), cube) == M.Cube{${fields.map((f, j) => j < i ? `S.color(S.identity(), ${f})` : j === i ? "_" : f).join(", ")}} : M.Cube}`), "      {==}");
const palette = [0,1,2,3,4,5,6,7,255,65535,2147483648,4294967295];
const raw = [fields.map((_,i) => i+6), fields.map((_,i) => palette[i%palette.length]), ...Array.from({length:6}, (_,c) => fields.map(() => c))];
const native = ["import Base", "import ../src/model.bend as M", "import ../src/symmetry48.bend as S", "", "def json_tail(values: +List<U32>) -> String:", "  match values:", "    case Nil{}: \"\"", "    case Con{head, tail}: \",\" ++ U32.show(head) ++ json_tail(tail)", "", "def json_values(values: +List<U32>) -> String:", "  match values:", "    case Nil{}: \"[]\"", "    case Con{head, tail}: \"[\" ++ U32.show(head) ++ json_tail(tail) ++ \"]\"", "", "def composition_index(+left: S.Symmetry, right: Maybe<&2, S.Symmetry>) -> U32:", "  match right:", "    case Some{right}: S.index(S.compose(left, right))", "    case None{}: 255", "", "def compositions(fuel: Nat, +sym: S.Symmetry, +index: U32) -> +List<U32>:", "  match fuel:", "    case 0n: Nil{}", "    case 1n+p: composition_index(sym, S.from_index(index)) <> compositions(p, sym, (index + 1 : U32))", ""];
native.push("def mapped(fuel: Nat, +sym: S.Symmetry, index: U32) -> +List<U32>:", "  match fuel:", "    case 0n: Nil{}", "    case 1n+p: M.index(S.map_move(sym, M.from_index(index))) <> mapped(p, sym, (index + 1 : U32))", "", "def emit(selected: Maybe<&2, S.Symmetry>) -> IO(Unit):", "  match selected:", "    case None{}: IO.die(Unit, 2, \"invalid symmetry\")", "    case Some{+sym}:", "      IO.print(\"{\\\"sym\\\":\" ++ U32.show(S.index(sym)) ++ \",\\\"inverse\\\":\" ++ U32.show(S.index(S.inverse(sym))) ++ \",\\\"compositions\\\":\" ++ json_values(compositions(48n, sym, 0)) ++ \",\\\"moves\\\":\" ++ json_values(mapped(18n, sym, 0)) ++ \",\\\"cubes\\\":[\" ++ " + raw.map(v => `json_values(M.to_list(S.apply(sym, M.Cube{${v.join(", ")}})))`).join(" ++ \",\" ++ ") + " ++ \"]}\")", "", "def rows(fuel: Nat, index: U32) -> IO(Unit):", "  match fuel:", "    case 0n: IO.pure(Unit, Unit{})", "    case 1n+p:", "      do IO<Unit>:", "        emit(S.from_index(index))", "        rows(p, (index + 1 : U32))", "", "def main() -> IO(Unit):", "  rows(48n, 0)", "");
for (const name of ["mapped", "rows"]) {
  const at = native.findIndex(line => line.startsWith(`def ${name}(`));
  native[at] = native[at].replace("index: U32", "+index: U32");
}
for (const [path, text] of [["src/symmetry48.bend", out.join("\n")], ["src/symmetry48-proof.bend", proof.join("\n")], ["tests/symmetry48-data.json", JSON.stringify({format:"rubend-symmetry48-v1", records})+"\n"], ["tests/symmetry48-native.bend", native.join("\n")]]) {
  if (process.argv.includes("--check")) assert.equal(readFileSync(path, "utf8"), text, `Stale generated source: ${path}`);
  else writeFileSync(path, text);
}
