import assert from "node:assert/strict";
import {readFileSync,writeFileSync,mkdirSync,existsSync} from "node:fs";
import {resolve,relative,dirname} from "node:path";
import {createHash} from "node:crypto";
import {spawnSync} from "node:child_process";
import {sourceSnapshotPath} from "./source-snapshot.mjs";

assert.ok(process.argv.length===4||process.argv.length===5,"Expected fresh portfolio-array probe directory, frozen family build.json, and optional case names");
const directory=resolve(process.argv[2]),hash=bytes=>createHash("sha256").update(bytes).digest("hex");
assert.ok(directory.startsWith(resolve("build/experiments")+"/"));assert.equal(existsSync(directory),false);mkdirSync(directory);
const sourceBuild=JSON.parse(readFileSync(process.argv[3],"utf8"));assert.equal(sourceBuild.format,"rubend-experiment-build-v1");
const snapshot=sourceSnapshotPath(sourceBuild);for(const [path,expected]of Object.entries(sourceBuild.sourceHashes)){const bytes=readFileSync(resolve(snapshot,path));assert.equal(hash(bytes),expected,"Frozen probe source changed");const target=resolve(directory,"frozen",path);mkdirSync(dirname(target),{recursive:true});writeFileSync(target,bytes,{flag:"wx"});}
const nominal=/type Tasks is Type:/.test(readFileSync(resolve(snapshot,"src/owned/portfolio.bend"),"utf8"));
const prefix=relative(directory,resolve(directory,"frozen/src"));
let shared=`import Base
import ${prefix}/owned/portfolio.bend as P
import ${prefix}/owned/search.bend as S
import ${prefix}/cubie.bend as C

def count_read(read: Array<U32> & U32, rest: U32) -> U32:
  match read:
    case Tuple{path, value}: (value + rest + 1 : U32)

def count(tasks: List<P.Task>) -> U32:
  match tasks:
    case Nil{}: 0
    case Con{P.Task{axis, S.Store{frames, path, used, cursor, fault}, meta}, rest}:
      count_read(Array.get(U32, path, 0), count(rest))

def count_task(entry: P.Task) -> U32:
  match entry:
    case P.Task{axis, S.Store{frames, path, used, cursor, fault}, meta}: count_read(Array.get(U32, path, 0), 0)

def entries(state: P.Session) -> List<P.Task>:
  match state:
    case P.Session{table, tasks, root, best, length, lower, nodes, request, status}: tasks

def schedule(entry: P.Task) -> List<P.Task>:
  match entry:
    case P.Task{axis, store, meta}: P.schedule(Nil{}, axis, store, meta)

`;
const task="P.task(0, C.solved(), S.Light{})",descriptors="[P.Descriptor{0, C.solved()}, P.Descriptor{1, C.solved()}]",initial="P.validated(C.Valid{C.solved()}, C.Valid{C.solved()}, [0 : U32*1n], C.solved(), P.Fast{}, S.Light{})";
const singleton=value=>nominal?"P.MoreTasks{"+value+", P.NoTasks{}}":"["+value+"]";
if(nominal)shared=shared.replaceAll("List<P.Task>","P.Tasks").replace("case Nil{}: 0","case P.NoTasks{}: 0").replace("case Con{P.Task{","case P.MoreTasks{P.Task{").replace("P.schedule(Nil{},","P.schedule(P.NoTasks{},");
const cases={task:{expression:singleton(task),expected:"1"},allocate:{expression:"P.allocate("+descriptors+", S.Light{})",expected:"2"},distinct:{expression:"P.allocate(P.distinct("+descriptors+", Nil{}), S.Light{})",expected:"1"},validated:{expression:"entries("+initial+")",expected:"1"},restart:{expression:"P.restart("+singleton(task)+", Nil{}, 0)",expected:"1"},schedule:{expression:"schedule("+task+")",expected:"1"},advance:{expression:"entries(P.advance("+initial+"))",expected:null}},rows=[];
cases["restart-task-list"]={expression:singleton("P.restart_task("+task+", Nil{}, 0)"),expected:"1"};
cases["restart-task-direct"]={expression:"P.restart_task("+task+", Nil{}, 0)",expected:"1",task:true};
const selected=process.argv[4]?.split(",")??Object.keys(cases);for(const name of selected)assert.ok(Object.hasOwn(cases,name));
for(const [name,variant]of Object.entries(cases)){
  if(!selected.includes(name))continue;
  const source=shared+"def main() -> IO(Unit):\n  IO.print(U32.show("+(variant.task?"count_task":"count")+"("+variant.expression+")))\n",entry=resolve(directory,name+".bend"),c=resolve(directory,name+".c"),binary=resolve(directory,name);writeFileSync(entry,source,{flag:"wx"});
  for(const output of[c,binary]){const result=spawnSync("bend",[entry,"-o",output],{encoding:"utf8",timeout:60000,maxBuffer:1048576});assert.equal(result.status,0,result.stdout+result.stderr);}
  const text=readFileSync(c,"utf8"),mode=text.match(/^#define BLK_SHR ([01])$/m);assert.ok(mode);
  const execution=spawnSync(binary,["--threads","1"],{encoding:"utf8",timeout:10000});assert.equal(execution.status,0,execution.stderr);assert.match(execution.stdout.trim(),/^\d+$/);if(variant.expected!==null)assert.equal(execution.stdout.trim(),variant.expected);
  rows.push({name,sharedArrayMode:Number(mode[1]),sourceSha256:hash(source),cSha256:hash(text),binarySha256:hash(readFileSync(binary)),nativeOutput:execution.stdout.trim()});
}
for(const [path,expected]of Object.entries(sourceBuild.sourceHashes)){assert.equal(hash(readFileSync(resolve(snapshot,path))),expected);assert.equal(hash(readFileSync(resolve(directory,"frozen",path))),expected);}
const record={format:"rubend-owned-portfolio-array-probe-v1",sourceBuild,nominal,rows,claim:"Narrow compiler-output isolation only. The one-word table is not a search profile. No solve or performance result.",independentReview:false};writeFileSync(resolve(directory,"result.json"),JSON.stringify(record,null,2)+"\n",{flag:"wx"});console.log(JSON.stringify(record));
