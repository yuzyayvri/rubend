import Model from "../build/model.mjs";
import Cubie from "../build/cubie.mjs";
import Notation from "../build/notation.mjs";

export const faces = "URFDLB";
export const moveNames = [...faces].flatMap(face => [face, `${face}2`, `${face}'`]);
export const solved = faces.split("").map(face => face.repeat(9)).join("");
export const validationMessages = {
  1: "The six center stickers must be U, R, F, D, L, B in that order.",
  2: "A corner or edge is missing, duplicated, or has impossible colors.",
  3: "A corner is twisted. This position cannot be reached by turning faces.",
  4: "An edge is flipped. This position cannot be reached by turning faces.",
  5: "The corner and edge permutations have different parity.",
  6: "Enter exactly 54 facelets in URFDLB order, using U, R, F, D, L, B.",
};
export function list(values) {
  return values.reduceRight((tail, head) => ({ $: "Con", head, tail }), { $: "Nil" });
}
export function array(values) {
  const out = [];
  for(let current = values; current.$ === "Con"; current = current.tail) {
    if(out.length > 10000) throw Error("List limit exceeded");
    out.push(current.head);
  }
  return out;
}
export function decode(text) {
  if(typeof text !== "string" || !/^[URFDLB]{54}$/.test(text)) throw Error(validationMessages[6]);
  const parsed = Model.from_list(list([...text].map(c => faces.indexOf(c))));
  if(parsed.$ !== "Some") throw Error(validationMessages[6]);
  return parsed.value;
}
export function encode(cube) {
  return Array.from({ length: 54 }, (_, i) => faces[cube[`s${i}`]]).join("");
}
export function validate(text) {
  const cube = decode(text);
  const result = Cubie.validate(cube);
  if(result.$ !== "Valid") throw Error(validationMessages[result.code] ?? "Invalid cube");
  return result.cube;
}
export function parse(text) {
  if(typeof text !== "string" || text.length > 4096) throw Error("Move text is too long.");
  const result = Notation.parse(text);
  if(result.$ !== "Parsed") throw Error(`Unsupported move at character ${result.offset}. Use U R F D L B, with 2 or '.`);
  return array(result.moves);
}
export function apply(text, moves) {
  if(!Array.isArray(moves) || moves.length > 10000 || moves.some(m => !Number.isInteger(m) || m < 0 || m >= 18)) throw Error("Invalid move list");
  return encode(Model.replay(list(moves.map(m => Model.from_index(m))), decode(text)));
}
export function inverse(move) {
  return Model.index(Model.inverse(Model.from_index(move)));
}
export function isSolved(text) {
  return Model.is_solved(decode(text));
}
