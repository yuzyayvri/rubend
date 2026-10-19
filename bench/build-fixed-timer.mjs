import assert from "node:assert/strict";
import {readFileSync,writeFileSync,mkdirSync,existsSync} from "node:fs";
import {resolve,dirname,isAbsolute} from "node:path";
import {createHash} from "node:crypto";
import {spawnSync} from "node:child_process";
import {fileURLToPath} from "node:url";
import {sourceSnapshotPath} from "./source-snapshot.mjs";
import {withArtifactLease} from "../scripts/artifact-lease.mjs";

withArtifactLease();

assert.equal(process.argv.length,4,"Expected source-build.json output");
const hash=bytes=>createHash("sha256").update(bytes).digest("hex");
const metadata=JSON.parse(readFileSync(process.argv[2],"utf8")),output=resolve(process.argv[3]),directory=output+"-sources";
assert.equal(metadata.format,"rubend-experiment-build-v1");
const segmented=metadata.entry==="bench/segmented-fixed.bend";
const owned=metadata.entry==="bench/owned-fixed.bend";
assert.ok(Object.hasOwn(metadata.sourceHashes,segmented?"bench/segmented-fixed.bend":owned?"bench/owned-fixed.bend":"bench/fixed-work.bend"),"Fixed timer requires a frozen fixed-work source graph");
const version=spawnSync("bend",["version"],{encoding:"utf8"});
assert.equal(version.status,0);assert.equal(version.stdout.trim(),metadata.bend);
assert.equal(hash(readFileSync("flake.lock")),metadata.flakeLockSha256);
assert.ok(!existsSync(output)&&!existsSync(output+".json")&&!existsSync(directory),"Use a fresh output path");
const snapshot=sourceSnapshotPath(metadata);
for(const [name,expected] of Object.entries(metadata.sourceHashes)){
  assert.ok(!isAbsolute(name)&&!name.split("/").includes(".."));
  const bytes=readFileSync(resolve(snapshot,name));assert.equal(hash(bytes),expected,"Frozen source mismatch");
  const target=resolve(directory,name);mkdirSync(dirname(target),{recursive:true});writeFileSync(target,bytes,{flag:"wx"});
}
const search=readFileSync(resolve(directory,segmented?"src/segmented/search.bend":owned?"src/owned/search.bend":"src/search.bend"),"utf8"),typed=search.includes("type Goal is Data:");
assert.equal(search.includes("type Profile is Data:"),typed,"Unsupported partial contract revision");
const templatePath=fileURLToPath(new URL("./fixed-timer.bend.in",import.meta.url)),template=readFileSync(templatePath,"utf8");
const replacements={
  INITIALIZER_BODY:typed?"P.initialize(table, original, root, P.request_mode(U32.is_eq(request, 2)), S.RawJoint{})":"P.initialize(table, original, root, request)",
  COMPLETION_TYPE:typed?"S.Completion":"U32",
  OPTIMAL_BODY:typed?"S.is_optimal(status)":"U32.is_eq(status, 1)"
};
let source=template;
for(const [name,value] of Object.entries(replacements)){assert.equal(source.split(name).length,2);source=source.replace(name,value);}
if(segmented){
  assert.equal(typed,true);source=source.replace("import Base\n","import Base\nimport ../src/segmented-table.bend as Store\n").replaceAll("Array<U32>","Store.Table").replace("import ./fixed-work.bend as F","import ./segmented-fixed.bend as F");
  for(const name of["main","search","portfolio"])source=source.replace("import ../src/"+name+".bend as ","import ../src/segmented/"+name+".bend as ");
}
if(owned){
  assert.equal(typed,true);source=source.replace("import ./fixed-work.bend as F","import ./owned-fixed.bend as F");
  for(const name of["main","search","portfolio"])source=source.replace("import ../src/"+name+".bend as ","import ../src/owned/"+name+".bend as ");
  assert.equal(source.split("        F.snapshot(").length,2);source=source.replace("        F.snapshot(","        entries : P.Tasks <- F.snapshot(");
}
const entry=resolve(directory,"bench/fixed-timer.bend");
writeFileSync(entry,source,{flag:"wx"});
const built=spawnSync("bend",[entry,"-o",output],{stdio:"inherit"});assert.equal(built.status,0);
const sourceHashes={};
for(const name of Object.keys(metadata.sourceHashes))sourceHashes[name]=hash(readFileSync(resolve(directory,name)));
assert.deepEqual(sourceHashes,metadata.sourceHashes,"Frozen sources changed");
assert.equal(readFileSync(entry,"utf8"),source);
const clang=spawnSync("clang",["--version"],{encoding:"utf8"});assert.equal(clang.status,0);
const record={format:"rubend-fixed-timer-build-v1",sourceBuild:metadata,sourceHashes,binarySha256:hash(readFileSync(output)),templateSha256:hash(Buffer.from(template)),entrySha256:hash(Buffer.from(source)),typed,storage:segmented?"segmented":"contiguous",continuations:owned?"owned":"persistent",selectedProfile:"Raw joint only, through frozen fixed-work loader",fixedSlices:500,clock:"Native monotonic milliseconds around initialization and fixed portfolio work only. Host separately records process CPU ticks including output.",node:process.version,bend:version.stdout.trim(),clang:clang.stdout.split("\n")[0]};
writeFileSync(output+".json",JSON.stringify(record,null,2)+"\n",{flag:"wx"});
console.log(JSON.stringify({passed:true,output,binarySha256:record.binarySha256,typed,fixedSlices:500}));
