import assert from "node:assert/strict";
import {readFileSync} from "node:fs";

const plan = readFileSync("docs/architecture/PROOF-PLAN.md", "utf8").split("## Proposed full-symmetry laws")[1];
const statements = plan.match(/```bend\n([\s\S]*?)\n```/)[1];
const laws = readFileSync("src/symmetry48-laws.bend", "utf8");
assert.equal(laws.slice(laws.indexOf("law ")).trim(), statements.trim(), "Executable symmetry laws differ from the five approved statements");
assert.equal((statements.match(/^law /gm) ?? []).length, 5);
assert.match(readFileSync("LAWS.bend", "utf8"), /import \.\/src\/symmetry48-laws\.bend as Symmetry48Laws/);
assert.match(readFileSync("PROOF.bend", "utf8"), /import \.\/src\/symmetry48-proof\.bend as Symmetry48Proof/);
console.log("The five executable symmetry laws exactly match the approved statements.");
