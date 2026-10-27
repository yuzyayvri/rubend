import assert from "node:assert/strict";
import {readFileSync,writeFileSync} from "node:fs";
import {resolve} from "node:path";
import {withArtifactLease} from "../scripts/artifact-lease.mjs";

withArtifactLease();assert.equal(process.argv.length,3);const path=resolve(process.argv[2]);assert.ok(path.startsWith(resolve("build")+"/"));let source=readFileSync("src/coordinates.bend","utf8").replace("import ./cubie.bend as C","import "+resolve("src/cubie.bend")+" as C");
const target=source.split("\n").filter(line=>line.startsWith("      slice_rank_loop(12n, "));assert.equal(target.length,1);assert.ok(target[0].endsWith(", 0, 1, 0)"));source=source.replace(target[0],target[0].replace("      slice_rank_loop(12n, ","      slice_rank(").replace(/, 0, 1, 0\)$/,")"));
const marker="def slice_mask_loop(";assert.equal(source.split(marker).length,2);source=source.replace(marker,"def slice_rank(mask: U32) -> U32:\n  match mask:\n    case U32{word}: slice_rank_loop(12n, U32{word}, 0, 1, 0)\n\n"+marker);writeFileSync(path,source,{flag:"wx"});console.log(JSON.stringify({generated:true,path,productionChanged:false}));
