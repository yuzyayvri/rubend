import assert from "node:assert/strict";
import {statSync} from "node:fs";
import {execFileSync} from "node:child_process";
import {gitSourceTree} from "../bench/git-source-tree.mjs";

const oid="a".repeat(40),entry=(path,bytes=3,mode="100644",type="blob",object=oid)=>mode+" "+type+" "+object+" "+bytes+"\t"+path+"\0",limits={maximumFileBytes:10,maximumTrackedBytesPerSource:15};
assert.deepEqual(gitSourceTree(entry("src/a.c")+entry("tool",4,"100755"),limits),{files:[{path:"src/a.c",mode:"100644",gitObject:oid,bytes:3},{path:"tool",mode:"100755",gitObject:oid,bytes:4}],trackedBytes:7});
const bad=[entry("/abs"),entry("../up"),entry("a/../up"),entry("a//b"),entry("./a"),entry(""),entry("a",11),entry("a","NaN"),entry("a","-1"),entry("link",3,"120000"),entry("module",3,"160000","commit"),entry("a",3,"100644","blob","x".repeat(40)),entry("a")+entry("a"),entry("a",8)+entry("b",8),entry("a").slice(0,-1),"bad\0"];for(const text of bad)assert.throws(()=>gitSourceTree(text,limits));
const path="bench/bounded-file-hash.mjs",text=execFileSync("git",["ls-tree","-rlz","--full-tree","HEAD","--",path],{encoding:"utf8"}),actual=gitSourceTree(text,{maximumFileBytes:1048576,maximumTrackedBytesPerSource:1048576});assert.equal(actual.files.length,1);assert.equal(actual.files[0].path,path);assert.equal(actual.files[0].bytes,statSync(path).size);assert.equal(actual.files[0].gitObject,execFileSync("git",["hash-object",path],{encoding:"utf8"}).trim());console.log(JSON.stringify({passed:true,validRows:2,rejectedTrees:bad.length,actualGitWireAndBlobIdentity:true,noCloneBuildOrSolve:true}));
