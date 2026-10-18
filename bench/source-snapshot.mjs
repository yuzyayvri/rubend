import assert from "node:assert/strict";
import {existsSync,readFileSync,writeFileSync,mkdirSync,mkdtempSync,renameSync,rmSync,chmodSync} from "node:fs";
import {resolve,dirname,isAbsolute} from "node:path";
import {createHash} from "node:crypto";

const hash=x=>createHash("sha256").update(x).digest("hex");
function safe(path){assert.ok(typeof path==="string"&&path.length&&!isAbsolute(path)&&!path.split(/[\\/]/).includes(".."),"Invalid frozen source path");}
export function sourceSnapshotPath(metadata){
  assert.match(metadata.binarySha256,/^[0-9a-f]{64}$/);
  const path=metadata.sourceSnapshot??".cache/experiment-sources/"+metadata.binarySha256;safe(path);
  assert.ok(path.startsWith(".cache/experiment-sources/"),"Invalid snapshot location");return resolve(path);
}
export function saveSourceSnapshot(binarySha256,sourceHashes,contents){
  assert.match(binarySha256,/^[0-9a-f]{64}$/);
  const names=Object.keys(sourceHashes).sort(),canonical=Object.fromEntries(names.map(p=>[p,sourceHashes[p]]));
  for(const name of names){safe(name);assert.equal(hash(contents[name]),canonical[name],"Captured source differs from manifest");}
  const sourceManifestSha256=hash(JSON.stringify(canonical)),sourceSnapshot=".cache/experiment-sources/"+binarySha256+"/"+sourceManifestSha256,target=resolve(sourceSnapshot);
  const verify=()=>{for(const name of names)assert.equal(hash(readFileSync(resolve(target,name))),canonical[name],"Immutable source snapshot conflict: "+name);};
  if(existsSync(target)){verify();return{sourceSnapshot,sourceManifestSha256};}
  mkdirSync(dirname(target),{recursive:true});const pending=mkdtempSync(resolve(dirname(target),".pending-"));
  try{
    for(const name of names){const path=resolve(pending,name);mkdirSync(dirname(path),{recursive:true});writeFileSync(path,contents[name],{flag:"wx"});chmodSync(path,0o444);}
    try{renameSync(pending,target);}catch(error){if(!["EEXIST","ENOTEMPTY"].includes(error.code))throw error;}
    verify();
  }finally{if(existsSync(pending))rmSync(pending,{recursive:true,force:true});}
  return{sourceSnapshot,sourceManifestSha256};
}
