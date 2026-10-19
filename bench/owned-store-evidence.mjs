import assert from "node:assert/strict";
import {readFileSync,writeFileSync,mkdirSync,existsSync} from "node:fs";
import {resolve,relative,dirname} from "node:path";
import {spawnSync} from "node:child_process";
import {createHash} from "node:crypto";

assert.equal(process.argv.length,3,"Expected fresh owned-store evidence directory");
const directory=resolve(process.argv[2]),hash=bytes=>createHash("sha256").update(bytes).digest("hex");
assert.ok(directory.startsWith(resolve("build/experiments")+"/"));assert.equal(existsSync(directory),false);mkdirSync(directory);
const source=readFileSync("bench/owned-continuation.bend","utf8"),test=readFileSync("tests/owned-continuation.bend","utf8");
const once=(text,from,to)=>{assert.equal(text.split(from).length,2,"Mutation anchor changed");return text.replace(from,to);};
const variants=[
  {name:"plain",source},
  {name:"wrapping-frame",field:"frameCapacity",source:once(source,"push_room(U32.is_lt(used, 64), frame,","push_room(True{}, frame,")},
  {name:"wrapping-path",field:"pathCapacity",source:once(source,"move_room(U32.is_lt(index, 32), index,","move_room(True{}, index,")},
  {name:"stale-prefix",field:"resetPrefix",source:once(source,"push(frame, Store{frames, path, 0, 0, fault})","push(frame, Store{frames, path, 0, cursor, fault})")},
  {name:"missing-slot",field:"corrupt",source:once(source,"case EmptySlot{} store: Broken{failed(store, CorruptSlot{})}","case EmptySlot{} store: Vacant{store}")},
  {name:"unsupported-depth",field:"rootDepth",source:once(source,"U32.is_le(left, 30) &&","True{} &&")}
];
const start=source.indexOf("def reset("),end=source.indexOf("\ndef fresh(",start);assert.ok(start>0&&end>start);
const reset=source.slice(start,end),changed=once(reset,"case store: store","case Store{frames, path, used, cursor, fault}: reset_valid(root_valid(frame), frame, Store{frames, path, used, cursor, Healthy{}})");
variants.push({name:"cleared-failure",field:"sticky",source:source.slice(0,start)+changed+source.slice(end)});
const rows=[];
for(const variant of variants){
  const base=resolve(directory,variant.name),module=resolve(base,"bench/owned-continuation.bend"),entry=resolve(base,"tests/owned-continuation.bend"),binary=resolve(base,"test");
  for(const path of[module,entry])mkdirSync(dirname(path),{recursive:true});
  const route=(text,path)=>text.replaceAll("import ../src/","import "+relative(dirname(path),resolve("src"))+"/");
  const library=route(variant.source,module),fixture=route(test,entry);writeFileSync(module,library,{flag:"wx"});writeFileSync(entry,fixture,{flag:"wx"});
  const build=spawnSync(process.execPath,["bench/build-experiment.mjs",relative(process.cwd(),entry),binary],{encoding:"utf8",timeout:120000,maxBuffer:1048576});assert.equal(build.status,0,build.stdout+build.stderr);
  const result=spawnSync(binary,["--threads","1"],{encoding:"utf8",timeout:10000,maxBuffer:1048576});assert.ifError(result.error);
  const observed=JSON.parse(result.stdout.trim());
  if(variant.field){assert.equal(result.status,2,variant.name+": "+result.stderr);assert.equal(observed[variant.field],0,variant.name+" did not break its intended invariant");assert.match(result.stderr,/Owned continuation invariants failed/);}
  else{assert.equal(result.status,0,result.stderr);assert.equal(Object.keys(observed).length,12);for(const value of Object.values(observed))assert.equal(value,1);}
  rows.push({name:variant.name,field:variant.field??null,exitCode:result.status,observed,stderr:result.stderr,sourceSha256:hash(library),testSha256:hash(fixture),build:JSON.parse(readFileSync(binary+".json","utf8"))});
}
assert.equal(hash(readFileSync("bench/owned-continuation.bend")),hash(source));assert.equal(hash(readFileSync("tests/owned-continuation.bend")),hash(test));
const record={format:"rubend-owned-store-evidence-v1",passed:true,rows,positiveChecks:12,rejectedMutations:6,sourceHashes:{"bench/owned-continuation.bend":hash(source),"tests/owned-continuation.bend":hash(test)},claim:"Owned-store boundary and mutation checks only. Search integration, complete snapshot equivalence, speed, and memory remain unmeasured. No universal refinement law is claimed.",independentReview:false};
writeFileSync(resolve(directory,"result.json"),JSON.stringify(record,null,2)+"\n",{flag:"wx"});console.log(JSON.stringify({passed:true,positiveChecks:12,rejectedMutations:6,result:resolve(directory,"result.json")}));
