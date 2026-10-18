import assert from "node:assert/strict";
import {readFileSync,writeFileSync,mkdirSync,mkdtempSync,rmSync} from "node:fs";
import {spawnSync} from "node:child_process";
import {tmpdir} from "node:os";
import {resolve,dirname} from "node:path";
import {createHash} from "node:crypto";

const generator=resolve("scripts/generate-segmented-profile.mjs"),paths=["src/search.bend","src/portfolio.bend","src/main.bend","src/inverse-bound.bend","bench/fixed-work.bend"],originals=Object.fromEntries(paths.map(p=>[p,readFileSync(p,"utf8")])),directory=mkdtempSync(resolve(tmpdir(),"rubend-segmented-generator-"));
const hash=s=>createHash("sha256").update(s).digest("hex"),before=Object.fromEntries(paths.map(p=>[p,hash(originals[p])]));
function reset(){for(const [p,s] of Object.entries(originals)){mkdirSync(dirname(resolve(directory,p)),{recursive:true});writeFileSync(resolve(directory,p),s);}}
function run(check=false){return spawnSync(process.execPath,[generator,...check?["--check"]:[]],{cwd:directory,encoding:"utf8",maxBuffer:1048576});}
try{
  reset();const good=run();assert.equal(good.status,0,good.stderr);assert.equal(run(true).status,0);const target=resolve(directory,"src/segmented/search.bend"),manifest=readFileSync(resolve(directory,"src/segmented/manifest.json"),"utf8");
  writeFileSync(target,readFileSync(target,"utf8")+"\n");assert.equal(run(true).status,1);let rejected=1;
  for(const [path,from,to] of[["src/search.bend","case Light{}: 8388608","case Light{}: 4194304"],["src/search.bend","U32.is_eq(profile_words(profile), words)","True{}"],["src/main.bend","checked_table(Array.size(U32, T.generate()))","broken()"],["bench/fixed-work.bend","case False{}: H.checked_table","case False{}: Changed.checked_table"]]){reset();assert.ok(originals[path].includes(from));writeFileSync(resolve(directory,path),originals[path].replaceAll(from,to));const r=run();assert.equal(r.status,1);assert.match(r.stderr,/Unexpected segmented transform pattern/);assert.equal(readFileSync(resolve(directory,"src/segmented/manifest.json"),"utf8"),manifest);rejected++;}
  assert.deepEqual(Object.fromEntries(paths.map(p=>[p,hash(readFileSync(p))])),before);console.log(JSON.stringify({passed:true,generatedFiles:6,rejectedFixtures:rejected,defaultSourcesUnchanged:true}));
}finally{rmSync(directory,{recursive:true,force:true});}
