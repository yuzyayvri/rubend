import { readFileSync, writeFileSync } from "node:fs";

const { permutations } = JSON.parse(readFileSync("tests/geometry.json", "utf8"));
const corners = [[8,9,20],[6,18,38],[0,36,47],[2,45,11],[29,26,15],[27,44,24],[33,53,42],[35,17,51]];
const edges = [[5,10],[7,19],[3,37],[1,46],[32,16],[28,25],[30,43],[34,52],[23,12],[21,41],[50,39],[48,14]];
const colors = pos => pos.map(i => Math.floor(i / 9));
const moveNames = ["U","R","F","D","L","B"].flatMap(n => [n, `${n}2`, `${n}i`]);
const tables = [];
const find = (slots, vals) => {
  for(let p=0;p<slots.length;p++) for(let o=0;o<slots[p].length;o++) {
    const cs=colors(slots[p]);
    if(vals.every((v,i)=>v===cs[(i-o+cs.length)%cs.length])) return [p,o];
  }
  throw Error("invalid cubie in generated move");
};
for (const q of permutations) for(let p=1;p<=3;p++) {
  let perm=Array.from({length:54},(_,i)=>i);
  for(let j=0;j<p;j++) perm=q.map(i=>perm[i]);
  tables.push({c:corners.map(s=>find(corners,s.map(i=>Math.floor(perm[i]/9)))), e:edges.map(s=>find(edges,s.map(i=>Math.floor(perm[i]/9))))});
}
const out=["import Base", "import ./model.bend as Model", "", "type Cubie is Data:", "  Cubie{cp: U32, co: U32, ep: U32, eh: U32, eo: U32}", "", "type Validation is Data:", "  Valid{cube: Cubie}", "  Invalid{code: U32}", "", "def pick(side: Bool, a: U32, b: U32) -> U32:", "  match side:", "    case True{}:", "      a", "    case False{}:", "      b", "", "def nib(+word: U32, index: U32) -> U32:", "  ((word >> U32.to_nat((index * 4 : U32))) .&. 15 : U32)", "", "def bit(+word: U32, index: U32) -> U32:", "  ((word >> U32.to_nat(index)) .&. 1 : U32)", "", "def solved() -> Cubie:", "  Cubie{1985229328, 0, 1985229328, 47768, 0}", ""];
const word = (values, bits=4) => values.map((v,i)=>i?`(${v} << ${i*bits}n : U32)`:v).join(" .|. ");
const nib = (p) => `((cp >> ${p*4}n) .&. 15 : U32)`;
const enib = p => `((${p<8?"ep":"eh"} >> ${(p%8)*4}n) .&. 15 : U32)`;
out.push("def turn(move: U32, cube: Cubie) -> Cubie:", "  match move cube:");
tables.forEach((t,m)=>{
  const cs=t.c.map(([p])=>nib(p));
  const co=t.c.map(([p,o])=>o?`((((co >> ${2*p}n) .&. 3) + ${o}) % 3 : U32)`:`((co >> ${2*p}n) .&. 3 : U32)`);
  const es=t.e.map(([p])=>enib(p));
  const eo=t.e.map(([p,o])=>`(((eo >> ${p}n) .&. 1) .^. ${o} : U32)`);
  out.push(`    case ${m} Cubie{+cp, +co, +ep, +eh, +eo}:`, `      Cubie{(${word(cs)} : U32), (${word(co,2)} : U32), (${word(es.slice(0,8))} : U32), (${word(es.slice(8))} : U32), (${word(eo,1)} : U32)}`);
});
out.push("    case _ cube:", "      cube", "");
for (const [name,slots] of [["corner",corners],["edge",edges]]) {
  const n=slots[0].length;
  out.push(`def find_${name}(${["a","b","c"].slice(0,n).map(x=>`${x}: U32`).join(", ")}) -> U32:`, `  match ${["a","b","c"].slice(0,n).join(" ")}:`);
  slots.forEach((s,p)=>{
    const cs=colors(s);
    for(let o=0;o<n;o++) out.push(`    case ${cs.map((_,i)=>cs[(i-o+n)%n]).join(" ")}:`, `      ${p+16*o}`);
  });
  out.push(`    case ${Array(n).fill("_").join(" ")}:`, "      255", "");
}
out.push("def parity_pairs(fuel: Nat, +lo: U32, +hi: U32, +i: U32, +j: U32, acc: U32) -> U32:", "  match fuel:", "    case 0n:", "      acc", "    case 1n+p:", "      parity_pairs(p, lo, hi, i, (j + 1 : U32), (acc .^. pick(U32.is_gt(nib(pick(U32.is_lt(i, 8), lo, hi), (i % 8 : U32)), nib(pick(U32.is_lt(j, 8), lo, hi), (j % 8 : U32))), 1, 0) : U32))", "", "def parity(fuel: Nat, +lo: U32, +hi: U32, +n: U32, +i: U32, acc: U32) -> U32:", "  match fuel:", "    case 0n:", "      acc", "    case 1n+p:", "      parity(p, lo, hi, n, (i + 1 : U32), parity_pairs(U32.to_nat((n - i - 1 : U32)), lo, hi, i, (i + 1 : U32), acc))", "");
const cvars=Array.from({length:8},(_,i)=>`c${i}`), evars=Array.from({length:12},(_,i)=>`e${i}`);
const all=[...cvars,...evars];
const ors=vs=>vs.map(v=>`(1 << U32.to_nat((${v} .&. 15 : U32)) : U32)`).join(" .|. ");
const sum=vs=>vs.map(v=>`(${v} >> 4n : U32)`).join(" + ");
out.push(`def validate_codes(centers: Bool, ${all.map(v=>`+${v}: U32`).join(", ")}) -> Validation:`, "  match centers:", "    case False{}:", "      Invalid{1}", "    case True{}:", `      validate_pieces(${cvars.map(v=>`U32.is_lt(${v}, 48)`).concat(evars.map(v=>`U32.is_lt(${v}, 32)`)).join(" && ")} && U32.is_eq((${ors(cvars)} : U32), 255) && U32.is_eq((${ors(evars)} : U32), 4095), ((${sum(cvars)}) % 3 : U32), ((${sum(evars)}) % 2 : U32), Cubie{(${word(cvars.map(v=>`(${v} .&. 15 : U32)`))} : U32), (${word(cvars.map(v=>`(${v} >> 4n : U32)`),2)} : U32), (${word(evars.slice(0,8).map(v=>`(${v} .&. 15 : U32)`))} : U32), (${word(evars.slice(8).map(v=>`(${v} .&. 15 : U32)`))} : U32), (${word(evars.map(v=>`(${v} >> 4n : U32)`),1)} : U32)})`, "");
const final = ["def validate_parity(ok: Bool, cube: Cubie) -> Validation:","  match ok:","    case True{}:","      Valid{cube}","    case False{}:","      Invalid{5}","", "def validate_orientation(twist: U32, flip: U32, cube: Cubie) -> Validation:", "  match twist flip cube:", "    case 0 0 Cubie{+cp, co, +ep, +eh, eo}:", "      validate_parity(U32.is_eq(parity(8n, cp, 0, 8, 0, 0), parity(12n, ep, eh, 12, 0, 0)), Cubie{cp, co, ep, eh, eo})", "    case 0 _ _:", "      Invalid{4}", "    case _ _ _:", "      Invalid{3}", "", "def validate_pieces(ok: Bool, twist: U32, flip: U32, cube: Cubie) -> Validation:","  match ok:","    case True{}:","      validate_orientation(twist, flip, cube)","    case False{}:","      Invalid{2}",""];
const insertion=out.findIndex(s=>s.startsWith("def validate_codes")); out.splice(insertion,0,...final);
const fields=Array.from({length:54},(_,i)=>`s${i}`);
out.push("def validate(cube: Model.Cube) -> Validation:", "  match cube:", `    case Model.Cube{${fields.map(v=>`+${v}`).join(", ")}}:`, `      validate_codes(${[4,13,22,31,40,49].map((i,f)=>`U32.is_eq(s${i}, ${f})`).join(" && ")}, ${corners.map(s=>`find_corner(${s.map(i=>fields[i]).join(", ")})`).concat(edges.map(s=>`find_edge(${s.map(i=>fields[i]).join(", ")})`)).join(", ")})`, "");
for(const [name,slots] of [["corner",corners],["edge",edges]]) {
  out.push(`def ${name}_color(piece: U32, side: U32) -> U32:`,"  match piece side:");
  slots.forEach((s,p)=>colors(s).forEach((v,i)=>out.push(`    case ${p} ${i}:`,`      ${v}`)));
  out.push("    case _ _:","      255","");
}
const faceletExpressions=fields.map((_,i)=>String(Math.floor(i/9)));
corners.forEach((slots,p)=>slots.forEach((index,local)=>faceletExpressions[index]=`corner_color(nib(cp, ${p}), ((${local+3} - ((co >> ${2*p}n) .&. 3)) % 3 : U32))`));
edges.forEach((slots,p)=>slots.forEach((index,local)=>faceletExpressions[index]=`edge_color(nib(${p<8?"ep":"eh"}, ${p%8}), (${local} .^. bit(eo, ${p}) : U32))`));
out.push("def to_facelets(cube: Cubie) -> Model.Cube:","  match cube:","    case Cubie{+cp, +co, +ep, +eh, +eo}:",`      Model.Cube{${faceletExpressions.join(", ")}}`,"");
out.push("def corner_position(+cp: U32, +piece: U32) -> U32:",`  (${Array.from({length:8},(_,i)=>`pick(U32.is_eq(nib(cp, ${i}), piece), ${i}, 0)`).join(" + ")} : U32)`,"", "def edge_position(+ep: U32, +eh: U32, +piece: U32) -> U32:",`  (${Array.from({length:12},(_,i)=>`pick(U32.is_eq(nib(${i<8?"ep":"eh"}, ${i%8}), piece), ${i}, 0)`).join(" + ")} : U32)`,"");
const icp=Array.from({length:8},(_,i)=>`corner_position(cp, ${i})`),iep=Array.from({length:12},(_,i)=>`edge_position(ep, eh, ${i})`);
out.push("def inverse(cube: Cubie) -> Cubie:","  match cube:","    case Cubie{+cp, +co, +ep, +eh, +eo}:",`      Cubie{(${word(icp)} : U32), (${word(icp.map(p=>`((3 - ((co >> U32.to_nat((${p} * 2 : U32))) .&. 3)) % 3 : U32)`),2)} : U32), (${word(iep.slice(0,8))} : U32), (${word(iep.slice(8))} : U32), (${word(iep.map(p=>`bit(eo, ${p})`),1)} : U32)}`,"");
const text=out.join("\n");
if(process.argv.includes("--check")) { if(readFileSync("src/cubie.bend","utf8")!==text) throw Error("stale cubie source"); }
else writeFileSync("src/cubie.bend",text);
