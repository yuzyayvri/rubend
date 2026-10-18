import { spawnSync } from "node:child_process";
import { mkdirSync, copyFileSync } from "node:fs";
import { build } from "esbuild";
import {fileURLToPath} from "node:url";
import assert from "node:assert/strict";
import {inputs,manifest} from "./manifest.mjs";
import {withArtifactLease} from "./artifact-lease.mjs";

process.chdir(fileURLToPath(new URL("..", import.meta.url)));
withArtifactLease();
mkdirSync("build", { recursive: true });
const sourceHashes=inputs();
function run(program, args) {
  const result = spawnSync(program, args, { stdio: "inherit", env: { ...process.env, BEND_NO_TELEMETRY: "1" } });
  if(result.status !== 0) process.exit(result.status ?? 1);
}
for(const script of ["generate-model", "generate-cubie", "generate-coordinates", "generate-symmetry", "generate-symmetry48", "generate-packed-symmetry", "generate-pruning-laws", "generate-small-profile", "generate-corner-profile"]) run(process.execPath, [`scripts/${script}.mjs`, "--check"]);
run(process.execPath,["scripts/generate-corner-profile.mjs","--check-corner-first"]);
run(process.execPath,["scripts/generate-h0-profile.mjs","--check"]);
run(process.execPath,["scripts/generate-segmented-profile.mjs","--check"]);
run("bend", ["PROOF.bend", "--verdict"]);
for(const name of ["model", "cubie", "notation", "symmetry", "packed-symmetry", "coordinates"]) run("bend", [`src/${name}.bend`, "-o", `build/${name}.mjs`]);
run("bend", ["src/main.bend", "-o", "build/rubend"]);
if(!process.argv.includes("--engine-only")) {
  mkdirSync("build/web", { recursive: true });
  await build({ entryPoints: ["apps/web/main.mjs", "apps/web/worker.mjs"], bundle: true, format: "esm", outdir: "build/web", minify: true, sourcemap: true, target: "es2022" });
  for(const file of ["index.html", "style.css"]) copyFileSync(`apps/web/${file}`, `build/web/${file}`);
}
assert.deepEqual(inputs(),sourceHashes,"Sources changed during the build; rebuild before using these artifacts.");
const bend=spawnSync("bend",["version"],{encoding:"utf8",env:{...process.env,BEND_NO_TELEMETRY:"1"}});
const clang=spawnSync("clang",["--version"],{encoding:"utf8"});
manifest({bend:bend.stdout.trim(),clang:clang.stdout.split("\n")[0],node:process.version,platform:`${process.platform}-${process.arch}`},sourceHashes);
process.stdout.write("Rubend build ready.\n");
