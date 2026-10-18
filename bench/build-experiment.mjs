import {spawnSync} from "node:child_process";
import {readFileSync,writeFileSync,mkdirSync,existsSync,statSync} from "node:fs";
import {resolve,dirname,relative} from "node:path";
import {createHash} from "node:crypto";
import {saveSourceSnapshot} from "./source-snapshot.mjs";
import {withArtifactLease} from "../scripts/artifact-lease.mjs";

withArtifactLease();

const [entry,output]=process.argv.slice(2);
if(!entry||!output)throw Error("Usage: node bench/build-experiment.mjs ENTRY.bend OUTPUT");
if(existsSync(output)||existsSync(output+".json"))throw Error("Use a fresh output path; experiment artifacts are preserved.");
const sources={},identities={},hash=x=>createHash("sha256").update(x).digest("hex");
const identity=path=>{const s=statSync(path,{bigint:true});return[s.dev,s.ino,s.size,s.mtimeNs,s.ctimeNs].map(String);};
function visit(path){path=resolve(path);if(sources[path])return;const name=relative(process.cwd(),path);if(name.startsWith(".."))throw Error("Experiment source outside project");const before=identity(path),text=readFileSync(path,"utf8");if(JSON.stringify(before)!==JSON.stringify(identity(path)))throw Error("Compilation input changed while reading");sources[path]=text;identities[path]=before;for(const match of text.matchAll(/^import (\.[^\s]+\.bend)(?: as [^\s]+)?$/gm))visit(resolve(dirname(path),match[1]));for(const match of text.matchAll(/^\s+import "(\.[^"\n]+\.(?:c|js))"$/gm))visit(resolve(dirname(path),match[1]));}
visit(entry);const names=Object.keys(sources).sort(),before=Object.fromEntries(names.map(path=>[relative(process.cwd(),path),hash(sources[path])]));
function verify(){for(const path of names)if(hash(readFileSync(path))!==before[relative(process.cwd(),path)]||JSON.stringify(identity(path))!==JSON.stringify(identities[path]))throw Error("Compilation inputs changed.");}
verify();const version=spawnSync("bend",["version"],{encoding:"utf8"});if(version.status!==0)throw Error("Bend version failed");
mkdirSync(dirname(output),{recursive:true});
const built=spawnSync("bend",[entry,"-o",output],{stdio:"inherit"});if(built.status!==0)process.exit(built.status??1);
verify();const binarySha256=hash(readFileSync(output));
const saved=saveSourceSnapshot(binarySha256,before,Object.fromEntries(names.map(path=>[relative(process.cwd(),path),sources[path]])));
writeFileSync(`${output}.json`,JSON.stringify({format:"rubend-experiment-build-v1",entry,sourceHashes:before,binarySha256,bend:version.stdout.trim(),flakeLockSha256:hash(readFileSync("flake.lock")),...saved},null,2)+"\n",{flag:"wx"});
