import { writeFileSync, readFileSync, mkdirSync } from "node:fs";

const names = ["U", "R", "F", "D", "L", "B"];
const normals = [[0, 1, 0], [1, 0, 0], [0, 0, 1], [0, -1, 0], [-1, 0, 0], [0, 0, -1]];
const right = [[1, 0, 0], [0, 0, -1], [1, 0, 0], [1, 0, 0], [0, 0, 1], [-1, 0, 0]];
const down = [[0, 0, 1], [0, -1, 0], [0, -1, 0], [0, 0, -1], [0, -1, 0], [0, -1, 0]];
const dot = (a, b) => a.reduce((s, x, i) => s + x * b[i], 0);
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const rotate = (p, n) => cross(p, n).map((x, i) => x + n[i] * dot(p, n));
const stickers = names.flatMap((face, f) => Array.from({ length: 9 }, (_, s) => ({
  index: f * 9 + s,
  face,
  normal: normals[f],
  position: normals[f].map((x, i) => x + (s % 3 - 1) * right[f][i] + (Math.floor(s / 3) - 1) * down[f][i]),
})));
const key = (p, n) => `${p.join(",")}/${n.join(",")}`;
const ids = new Map(stickers.map(s => [key(s.position, s.normal), s.index]));
const permutations = normals.map(n => {
  const perm = Array.from({ length: 54 }, (_, i) => i);
  for (const s of stickers) if (dot(s.position, n) === 1) perm[ids.get(key(rotate(s.position, n), rotate(s.normal, n)))] = s.index;
  return perm;
});
const moveNames = names.flatMap(n => [n, `${n}2`, `${n}i`]);
const fields = Array.from({ length: 54 }, (_, i) => `s${i}`);
const pattern = `Cube{${fields.join(", ")}}`;
const inverse = i => Math.floor(i / 3) * 3 + (2 - i % 3);
const lines = ["import Base", "", "type Move is Data:", ...moveNames.map(n => `  ${n}{}`), "", "type Cube is Data:", `  Cube{${fields.map(n => `${n}: U32`).join(", ")}}`, "", "def solved() -> Cube:", `  Cube{${fields.map((_, i) => Math.floor(i / 9)).join(", ")}}`, ""];
for (let f = 0; f < 6; f++) for (let power = 1; power <= 3; power++) {
  let perm = Array.from({ length: 54 }, (_, i) => i);
  for (let p = 0; p < power; p++) perm = permutations[f].map(i => perm[i]);
  lines.push(`def turn_${moveNames[f * 3 + power - 1]}(cube: Cube) -> Cube:`, "  match cube:", `    case ${pattern}:`, `      Cube{${perm.map(i => fields[i]).join(", ")}}`, "");
}
lines.push("def turn(move: Move, cube: Cube) -> Cube:", "  match move:", ...moveNames.flatMap(n => [`    case ${n}{}:`, `      turn_${n}(cube)`]), "", "def inverse(move: Move) -> Move:", "  match move:", ...moveNames.flatMap((n, i) => [`    case ${n}{}:`, `      ${moveNames[inverse(i)]}{}`]), "", "def index(move: Move) -> U32:", "  match move:", ...moveNames.flatMap((n, i) => [`    case ${n}{}:`, `      ${i}`]), "", "def from_index(index: U32) -> Move:", "  match index:", ...moveNames.flatMap((n, i) => [`    case ${i}:`, `      ${n}{}`]), "    case _:", "      U{}", "", "def show_move(move: Move) -> String:", "  match move:", ...moveNames.flatMap(n => [`    case ${n}{}:`, `      "${n.replace("i", "'")}"`]), "", "def to_list(cube: Cube) -> +List<U32>:", "  match cube:", `    case ${pattern}:`, `      [${fields.join(", ")}]`, "", "def from_list(values: +List<U32>) -> Maybe<&2, Cube>:", "  match values:", `    case ${fields.reduceRight((tail, f) => `Con{${f}, ${tail}}`, "Nil{}")}:`, `      Some{${pattern}}`, "    case _:", "      None{}", "", "def is_solved(cube: Cube) -> Bool:", "  match cube:", `    case ${pattern}:`, `      ${fields.map((f, i) => `U32.is_eq(${f}, ${Math.floor(i / 9)})`).join(" && ")}`, "", "def replay(moves: +List<Move>, cube: Cube) -> Cube:", "  match moves:", "    case Nil{}:", "      cube", "    case Con{move, rest}:", "      replay(rest, turn(move, cube))", "");
const laws = ["import Base", "import ./model.bend as Model", "", "law turn_inverse:", "  for move: Model.Move", "  for +cube: Model.Cube", "  {Model.turn(Model.inverse(move), Model.turn(move, cube)) == cube : Model.Cube}", "", "law turn_four:", "  for +move: Model.Move", "  for +cube: Model.Cube", "  {Model.turn(move, Model.turn(move, Model.turn(move, Model.turn(move, cube)))) == cube : Model.Cube}", "", "law inverse_involution:", "  for +move: Model.Move", "  {Model.inverse(Model.inverse(move)) == move : Model.Move}", "", "law replay_append:", "  for +a: +List<Model.Move>", "  for +b: +List<Model.Move>", "  for +cube: Model.Cube", "  {Model.replay(List.append(&2, Model.Move, a, b), cube) == Model.replay(b, Model.replay(a, cube)) : Model.Cube}", ""];
const proofs = ["import Base", "import ./model.bend as Model", "import ./model-laws.bend as Laws", ""];
for (const law of ["turn_inverse", "turn_four"]) proofs.push(`def Laws.${law}(move, cube):`, "  match move cube:", ...moveNames.flatMap(n => [`    case Model.${n}{} Model.${pattern}:`, "      {==}"]), "");
proofs.push("def Laws.inverse_involution(move):", "  match move:", ...moveNames.flatMap(n => [`    case Model.${n}{}:`, "      {==}"]), "", "def Laws.replay_append(a, b, cube):", "  match a:", "    case Nil{}:", "      {==}", "    case Con{move, rest}:", "      Laws.replay_append(rest, b, Model.turn(move, cube))", "");
mkdirSync("src", { recursive: true });
for (const [path, text] of [["src/model.bend", lines.join("\n")], ["src/model-laws.bend", laws.join("\n")], ["src/model-proof.bend", proofs.join("\n")], ["tests/geometry.json", JSON.stringify({ names, stickers, permutations }, null, 2) + "\n"]]) {
  if (process.argv.includes("--check")) {
    if (readFileSync(path, "utf8") !== text) throw Error(`Stale generated source: ${path}`);
  } else writeFileSync(path, text);
}
