import {createHash} from "node:crypto";
import {readFileSync,readdirSync,writeFileSync} from "node:fs";
import {resolve} from "node:path";
import {fileURLToPath} from "node:url";

export const digest=path=>createHash("sha256").update(readFileSync(path)).digest("hex");
const files=directory=>readdirSync(directory,{withFileTypes:true}).flatMap(entry=>entry.isDirectory()?files(`${directory}/${entry.name}`):[`${directory}/${entry.name}`]);
export function inputs(){return Object.fromEntries([...files("src"),...files("apps"),...files("scripts"),"LAWS.bend","PROOF.bend","flake.nix","flake.lock","package.json","package-lock.json"].sort().map(path=>[path,digest(path)]));}
export function manifest(toolchain,sourceHashes){
  const artifacts=Object.fromEntries(["model","cubie","notation","coordinates","symmetry","packed-symmetry"].map(name=>[`${name}.mjs`,digest(`build/${name}.mjs`)]));
  const record={format:"rubend-build-v1",sourceHashes,toolchain,artifacts,nativeSha256:digest("build/rubend")};
  writeFileSync("build/manifest.json",`${JSON.stringify(record,null,2)}\n`);return record;
}
if(process.argv[1]&&fileURLToPath(import.meta.url)===resolve(process.argv[1])&&process.argv[2]==="seal"){
  const path=process.argv[3],record=JSON.parse(readFileSync(path,"utf8"));record.nativeSha256=digest(process.argv[4]);writeFileSync(path,`${JSON.stringify(record,null,2)}\n`);
}
