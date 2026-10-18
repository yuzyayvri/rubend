import assert from "node:assert/strict";
import {readFileSync,writeFileSync,mkdirSync,mkdtempSync,rmSync} from "node:fs";
import {spawnSync} from "node:child_process";
import {tmpdir} from "node:os";
import {resolve,dirname} from "node:path";
import {createHash} from "node:crypto";

const generator=resolve("scripts/generate-corner-profile.mjs"),paths=["src/search.bend","src/portfolio.bend","src/main.bend","bench/contour-target.bend"];
const originals=Object.fromEntries(paths.map(p=>[p,readFileSync(p,"utf8")])),temporary=mkdtempSync(resolve(tmpdir(),"rubend-corner-generator-"));
const hash=s=>createHash("sha256").update(s).digest("hex"),before=Object.fromEntries(paths.map(p=>[p,hash(originals[p])]));
function reset(){for(const [p,s] of Object.entries(originals)){mkdirSync(dirname(resolve(temporary,p)),{recursive:true});writeFileSync(resolve(temporary,p),s);}}
function run(check=false){return spawnSync(process.execPath,[generator,...check?["--check"]:[]],{cwd:temporary,encoding:"utf8",maxBuffer:1048576});}
let rejected=0;
try{
  reset();assert.equal(run().status,0);assert.equal(run(true).status,0);
  for(const flag of ["--corner-first","--check-corner-first"])assert.equal(spawnSync(process.execPath,[generator,flag],{cwd:temporary,encoding:"utf8"}).status,0);
  const target=resolve(temporary,"src/corner/search.bend"),manifest=readFileSync(resolve(temporary,"src/corner/manifest.json"),"utf8");
  writeFileSync(target,readFileSync(target,"utf8")+"\n");const stale=run(true);assert.equal(stale.status,1);assert.match(stale.stderr,/Stale corner profile/);rejected++;
  for(const [path,change] of [
    ["src/search.bend",s=>s.replace("case Light{}: 8388608","case Light{}: 4194304")],
    ["src/search.bend",s=>s.replace("case True{}: push_child(table, parent, rest, meta, child, move, nx, ny, nz)","case True{}: Search{table, rest, meta}")],
    ["src/main.bend",s=>s.replaceAll("S.Light{}","S.RawJoint{}")],
    ["bench/contour-target.bend",s=>s.replace('case "inverse-one"','case "changed"')]
  ]){
    reset();const changed=change(originals[path]);assert.notEqual(changed,originals[path]);writeFileSync(resolve(temporary,path),changed);
    const r=run();assert.equal(r.status,1);assert.match(r.stderr,/Unexpected corner transform pattern/);assert.equal(readFileSync(resolve(temporary,"src/corner/manifest.json"),"utf8"),manifest);rejected++;
  }
  assert.deepEqual(Object.fromEntries(paths.map(p=>[p,hash(readFileSync(p))])),before);
  console.log(JSON.stringify({passed:true,generatedFiles:5,rejectedFixtures:rejected,defaultSourcesUnchanged:true}));
}finally{rmSync(temporary,{recursive:true,force:true});}
