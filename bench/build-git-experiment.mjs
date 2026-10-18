import assert from "node:assert/strict";
import {execFileSync,spawnSync} from "node:child_process";
import {existsSync,mkdirSync,writeFileSync,readFileSync,chmodSync} from "node:fs";
import {resolve,relative,dirname,posix} from "node:path";
import {createHash} from "node:crypto";
import {withArtifactLease} from "../scripts/artifact-lease.mjs";

withArtifactLease();
assert.equal(process.argv.length,5,"Expected commit entry.bend fresh-output");
const [commit,entry,output]=process.argv.slice(2),target=resolve(output),directory=target+"-git-sources";
assert.match(commit,/^[0-9a-f]{7,40}$/);assert.match(entry,/^(src|bench)\/[a-z0-9/-]+\.bend$/);
assert.ok(target.startsWith(resolve("build/experiments")+"/"));
for(const path of[target,target+".json",target+".git.json",directory])assert.equal(existsSync(path),false,"Fresh Git experiment path required");
const revision=execFileSync("git",["rev-parse","--verify",commit+"^{commit}"],{encoding:"utf8"}).trim();assert.match(revision,/^[0-9a-f]{40}$/);
const files=new Map(),hash=bytes=>createHash("sha256").update(bytes).digest("hex");
function visit(name){
  assert.ok(!name.startsWith("/")&&!name.split("/").includes(".."));if(files.has(name))return;
  const bytes=execFileSync("git",["show",revision+":"+name],{maxBuffer:16777216});files.set(name,bytes);
  const text=bytes.toString("utf8");
  for(const match of text.matchAll(/^import (\.[^\s]+\.bend)(?: as [^\s]+)?$/gm))visit(posix.normalize(posix.join(posix.dirname(name),match[1])));
  for(const match of text.matchAll(/^\s+import "(\.[^"\n]+\.(?:c|js))"$/gm))visit(posix.normalize(posix.join(posix.dirname(name),match[1])));
}
visit(entry);mkdirSync(dirname(directory),{recursive:true});mkdirSync(directory);
for(const [name,bytes]of files){const path=resolve(directory,name);mkdirSync(dirname(path),{recursive:true});writeFileSync(path,bytes,{flag:"wx"});chmodSync(path,0o444);}
const built=spawnSync(process.execPath,["bench/build-experiment.mjs",relative(process.cwd(),resolve(directory,entry)),output],{stdio:"inherit"});assert.equal(built.status,0);
const metadata=JSON.parse(readFileSync(target+".json","utf8")),record={format:"rubend-git-experiment-v1",revision,entry,binarySha256:metadata.binarySha256,originalSourceHashes:Object.fromEntries([...files].map(([name,bytes])=>[name,hash(bytes)]))};
for(const [name,bytes]of files)assert.equal(hash(readFileSync(resolve(directory,name))),hash(bytes));
writeFileSync(target+".git.json",JSON.stringify(record,null,2)+"\n",{flag:"wx"});console.log(JSON.stringify({passed:true,revision,files:files.size,target}));
