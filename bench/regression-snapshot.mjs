import assert from "node:assert/strict";
import {cpSync,existsSync,readdirSync,realpathSync,statSync} from "node:fs";
import {resolve,relative,dirname,sep} from "node:path";
import {execFileSync} from "node:child_process";
import {fileHash} from "./bounded-file-hash.mjs";

export function snapshotTarget(root,destination){const base=realpathSync(root),path=resolve(destination);assert.match(relative(base,path),/^build\/experiments\/u07-regression-[a-z0-9-]+\/snapshot$/);assert.equal(existsSync(path),false,"Snapshot destination already exists");assert.equal(realpathSync(dirname(path)),dirname(path),"Snapshot parent contains a symlink");return path;}
export function dependencyFiles(root){
  const base=realpathSync(root),walk=directory=>readdirSync(directory,{withFileTypes:true}).flatMap(e=>{const path=resolve(directory,e.name);if(e.isDirectory())return walk(path);const target=realpathSync(path);assert.ok(target.startsWith(base+sep),"Dependency link escapes copied tree");assert.equal(statSync(path).isFile(),true);return[relative(base,path)];});return walk(base).sort();
}
export function copyDependencies(source,destination){assert.equal(existsSync(destination),false,"Dependency copy already exists");const files=dependencyFiles(source),hashes=Object.fromEntries(files.map(p=>[p,fileHash(resolve(source,p))]));cpSync(source,destination,{recursive:true,verbatimSymlinks:true,force:false,errorOnExist:true});assert.deepEqual(dependencyFiles(destination),files);for(const[p,h]of Object.entries(hashes)){assert.equal(fileHash(resolve(source,p)),h);assert.equal(fileHash(resolve(destination,p)),h);}return hashes;}
export function createRegressionSnapshot(root,destination,revision){
  const base=realpathSync(root),path=snapshotTarget(base,destination),git=args=>execFileSync("git",args,{cwd:base,encoding:"utf8",timeout:60000,maxBuffer:8*1024*1024}).trim();assert.match(revision,/^[a-f0-9]{40}$/);assert.equal(git(["rev-parse","HEAD"]),revision);assert.equal(git(["status","--porcelain","--untracked-files=no"]),"");
  const files=git(["ls-files","-z"]).split("\0").filter(Boolean),sourceHashes=Object.fromEntries(files.map(p=>[p,fileHash(resolve(base,p))]));git(["clone","--shared","--no-hardlinks","--no-checkout","--quiet",base,path]);git(["-C",path,"checkout","--detach","--quiet",revision]);
  for(const[p,h]of Object.entries(sourceHashes)){assert.equal(fileHash(resolve(base,p)),h);assert.equal(fileHash(resolve(path,p)),h);}const dependencyHashes=copyDependencies(resolve(base,"node_modules"),resolve(path,"node_modules"));
  return{passed:true,revision,directory:path,sourceHashes,dependencyHashes,sourceFiles:files.length,dependencyFiles:Object.keys(dependencyHashes).length,trackedSourceCopies:true,dependencyCopies:true,originalBuildAndCacheNotCopied:true,newCommitCreated:false,sharedGitObjectsReadOnly:true,resourceEnforcementRequired:true};
}
