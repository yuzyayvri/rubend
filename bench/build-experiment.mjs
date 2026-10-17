import {spawnSync} from "node:child_process";
import {readFileSync,writeFileSync,mkdirSync} from "node:fs";
import {resolve,dirname,relative} from "node:path";
import {createHash} from "node:crypto";

const [entry,output]=process.argv.slice(2);
if(!entry||!output)throw Error("Usage: node bench/build-experiment.mjs ENTRY.bend OUTPUT");
const sources={};
function visit(path){path=resolve(path);if(sources[path])return;const text=readFileSync(path,"utf8");sources[path]=text;for(const match of text.matchAll(/^import (\.[^\s]+\.bend)(?: as [^\s]+)?$/gm))visit(resolve(dirname(path),match[1]));for(const match of text.matchAll(/^\s+import "(\.[^"\n]+\.(?:c|js))"$/gm))visit(resolve(dirname(path),match[1]));}
visit(entry);const hashes=()=>Object.fromEntries(Object.keys(sources).sort().map(path=>[relative(process.cwd(),path),createHash("sha256").update(readFileSync(path)).digest("hex")]));
const before=hashes(),version=spawnSync("bend",["version"],{encoding:"utf8"});
mkdirSync(dirname(output),{recursive:true});
const built=spawnSync("bend",[entry,"-o",output],{stdio:"inherit"});if(built.status!==0)process.exit(built.status??1);
if(JSON.stringify(before)!==JSON.stringify(hashes()))throw Error("Compilation inputs changed.");
const binarySha256=createHash("sha256").update(readFileSync(output)).digest("hex");
writeFileSync(`${output}.json`,JSON.stringify({format:"rubend-experiment-build-v1",entry,sourceHashes:before,binarySha256,bend:version.stdout.trim(),flakeLockSha256:createHash("sha256").update(readFileSync("flake.lock")).digest("hex")},null,2)+"\n");
const snapshot=resolve(".cache/experiment-sources",binarySha256);mkdirSync(snapshot,{recursive:true});for(const [path,text] of Object.entries(sources)){const destination=resolve(snapshot,relative(process.cwd(),path));mkdirSync(dirname(destination),{recursive:true});writeFileSync(destination,text);}
