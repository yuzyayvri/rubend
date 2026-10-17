import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const root = resolve(import.meta.dirname, "..");
process.chdir(root);
mkdirSync("build", { recursive: true });
const results = [];
const env = { ...process.env, BEND_NO_TELEMETRY: "1" };

function run(name, program, args, expectedStatus = 0, includes = undefined) {
  const started = performance.now();
  const result = spawnSync(program, args, {
    cwd: root,
    env,
    encoding: "utf8",
    timeout: 180_000,
    maxBuffer: 4 * 1024 * 1024,
  });
  const output = `${result.stdout ?? ""}${result.stderr ?? ""}`;
  assert.ifError(result.error);
  assert.equal(result.status, expectedStatus, `${name}: ${output}`);
  if (includes) assert.ok(output.includes(includes), `${name}: ${output}`);
  results.push({ name, status: "pass", durationMs: Math.round(performance.now() - started), output: output.trim() });
  process.stdout.write(`PASS ${name}\n`);
  return output.trim();
}

const bendVersion = run("pinned Bend version", "bend", ["version"]);
assert.equal(bendVersion, "bend 2.0.37");
run("pinned Lean version", "lean", ["--version"], 0, "version 4.34.0");
run("Bend proof checker", "bend", ["PROOF.bend"], 0, "ALL PROOFS CHECK");
run("independent BendTT verdict", "bend", ["PROOF.bend", "--verdict"], 0, "ALL PROOFS CHECK");

for (const fixture of ["false", "open", "unsafe"]) {
  run(`reject ${fixture} proof`, "bend", [`tests/toolchain/rejected/${fixture}.bend`, "--check-only"], 1, "SOME PROOFS FAIL");
  run(`verdict rejects ${fixture} proof`, "bend", [`tests/toolchain/rejected/${fixture}.bend`, "--verdict"], 1, "SOME PROOFS FAIL");
}

const message = "Rubend: pass 54 URFDLB facelets, fast|exact, and a millisecond budget.";
run("Bend IO execution", "bend", ["src/main.bend"], 0, message);
run("native compilation", "bend", ["src/main.bend", "-o", "build/rubend-setup"]);
run("native execution", resolve("build/rubend-setup"), [], 0, message);
run("JavaScript module compilation", "bend", ["src/toolchain.bend", "-o", "build/toolchain.mjs"]);
const { default: toolchain } = await import(pathToFileURL(resolve("build/toolchain.mjs")).href);
assert.equal(toolchain.flip(false), true);
assert.equal(toolchain.flip(true), false);
results.push({ name: "generated JavaScript interop", status: "pass" });
process.stdout.write("PASS generated JavaScript interop\n");

function bendFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = `${directory}/${entry.name}`;
    return entry.isDirectory() ? bendFiles(path) : path.endsWith(".bend") ? [path] : [];
  });
}

for (const file of ["LAWS.bend", "PROOF.bend", ...bendFiles("src")]) {
  assert.doesNotMatch(readFileSync(file, "utf8"), /@unsafe|\?TODO|\?\w+|def\s+[\w.]+\?\s*\(/, file);
}
results.push({ name: "safe production Bend sources", status: "pass" });
process.stdout.write("PASS safe production Bend sources\n");

writeFileSync("build/setup-check.json", `${JSON.stringify({
  kind: "toolchain-and-proof-gate",
  solverImplemented: true,
  checkedAt: new Date().toISOString(),
  node: process.version,
  bend: bendVersion,
  sourceHashes: Object.fromEntries([
    "flake.nix", "flake.lock", "scripts/check.mjs", "LAWS.bend", "PROOF.bend",
    ...bendFiles("src"), ...bendFiles("tests/toolchain"),
  ].map((file) => [file, createHash("sha256").update(readFileSync(file)).digest("hex")])),
  results,
}, null, 2)}\n`);
process.stdout.write(`${results.length} toolchain and proof checks passed.\n`);
