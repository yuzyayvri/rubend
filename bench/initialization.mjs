import {spawnSync} from "node:child_process";
import {writeFileSync,mkdirSync} from "node:fs";
import {solved} from "../apps/model.mjs";
import assert from "node:assert/strict";

const binaries={previous:"/nix/store/s311kgxih8099dfipjscl3p6jsfwhzqq-rubend-0.0.0/share/rubend/build/rubend",current:"build/rubend"},records=[];
for(let iteration=0;iteration<7;iteration++)for(const [version,binary] of Object.entries(binaries)){
  const started=performance.now(),result=spawnSync(binary,[solved,"fast","50","--threads","1"],{encoding:"utf8",timeout:10000});
  assert.equal(result.status,0,result.stderr);assert.ok(result.stdout.includes('"length":0'));
  records.push({iteration,version,elapsedMs:Math.round(performance.now()-started)});
}
const summary=Object.fromEntries(Object.keys(binaries).map(version=>{const values=records.filter(r=>r.version===version).map(r=>r.elapsedMs).sort((a,b)=>a-b);return [version,{medianMs:values[3],minimumMs:values[0],maximumMs:values.at(-1)}];}));
mkdirSync("build/evidence",{recursive:true});writeFileSync("build/evidence/initialization.json",JSON.stringify({binaries,conditions:"One low-priority core; includes process startup, table generation, and solved input",records,summary},null,2)+"\n");console.log(JSON.stringify(summary));
