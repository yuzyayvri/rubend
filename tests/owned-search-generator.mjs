import assert from "node:assert/strict";
import {readFileSync,writeFileSync,mkdirSync,mkdtempSync,rmSync} from "node:fs";
import {spawnSync} from "node:child_process";
import {tmpdir} from "node:os";
import {resolve,dirname} from "node:path";
import {createHash} from "node:crypto";

const generator=resolve("scripts/generate-owned-search.mjs"),paths=["src/search.bend","bench/owned-continuation.bend","src/portfolio.bend","src/main.bend","bench/advanced-main.bend","bench/fixed-work.bend"],sources=Object.fromEntries(paths.map(path=>[path,readFileSync(path,"utf8")]));
const directory=mkdtempSync(resolve(tmpdir(),"rubend-owned-generator-")),hash=text=>createHash("sha256").update(text).digest("hex"),before=Object.fromEntries(paths.map(path=>[path,hash(sources[path])]));
const reset=()=>{for(const [path,text]of Object.entries(sources)){const target=resolve(directory,path);mkdirSync(dirname(target),{recursive:true});writeFileSync(target,text);}};
const run=(check=false)=>spawnSync(process.execPath,[generator,...check?["--check"]:[]],{cwd:directory,encoding:"utf8",timeout:10000,maxBuffer:1048576});
try{
  reset();const generated=run();assert.equal(generated.status,0,generated.stderr);assert.equal(run(true).status,0);
  const outputs=["src/owned/search.bend","src/owned/portfolio.bend","src/owned/main.bend","bench/owned-advanced.bend","bench/owned-fixed.bend","src/owned/manifest.json"],seal=()=>Object.fromEntries(outputs.map(path=>[path,hash(readFileSync(resolve(directory,path)))]));
  const original=seal(),target=resolve(directory,outputs[0]);writeFileSync(target,readFileSync(target,"utf8")+"\n");const stale=run(true);assert.equal(stale.status,1);assert.match(stale.stderr,/Stale owned search/);assert.equal(run().status,0);assert.deepEqual(seal(),original);
  const mutations=[
    ["src/search.bend","path: +List<U32>, length: U32}","path: +List<U32>, length: U32, extra: U32}",/AssertionError/],
    ["src/portfolio.bend","distinct([task(0, root, profile)","distinct([task(6, root, profile)",/Owned transform anchor changed/],
    ["src/main.bend","  match fuel active state:","  match active fuel state:",/Owned transform anchor changed/],
    ["bench/fixed-work.bend","import ./advanced-main.bend as A","import ./changed-main.bend as A",/Owned transform anchor changed/]
  ];
  for(const [path,from,to,message]of mutations){reset();assert.ok(sources[path].includes(from));writeFileSync(resolve(directory,path),sources[path].replaceAll(from,to));const result=run();assert.equal(result.status,1,result.stdout+result.stderr);assert.match(result.stderr,message);assert.deepEqual(seal(),original,"Rejected transformation wrote outputs");}
  assert.deepEqual(Object.fromEntries(paths.map(path=>[path,hash(readFileSync(path))])),before);
  console.log(JSON.stringify({passed:true,generatedFiles:outputs.length,rejectedFixtures:mutations.length+1,rejectedTransformsDoNotWrite:true,defaultSourcesUnchanged:true}));
}finally{rmSync(directory,{recursive:true,force:true});}
