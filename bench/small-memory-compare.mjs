import assert from "node:assert/strict";
import {readFileSync,writeFileSync,existsSync,statSync} from "node:fs";
import {createHash} from "node:crypto";
import {resolve} from "node:path";
import {performance} from "node:perf_hooks";
import {Engine} from "../apps/engine.mjs";
import {nativeIdentity,sampleNativeRss} from "./startup-measure.mjs";
import {apply,solved} from "../apps/model.mjs";

assert.equal(process.argv.length,6,"Expected control packed shallow-fixture output");
const [control,packed,fixture,output]=process.argv.slice(2).map(p=>resolve(p));
assert.ok(!existsSync(output),"Use a fresh output path");
const hash=b=>createHash("sha256").update(b).digest("hex");
function seal(path){
  const a=statSync(path,{bigint:true});assert.ok(a.isFile());const bytes=readFileSync(path),b=statSync(path,{bigint:true});
  for(const k of ["dev","ino","size","mtimeNs","ctimeNs"])assert.equal(a[k],b[k]);
  return {path,sha256:hash(bytes),identity:[a.dev,a.ino,a.size,a.mtimeNs,a.ctimeNs].map(String)};
}
const paths=[control,control+".json",packed,packed+".json",fixture,"bench/small-memory-compare.mjs","bench/startup-measure.mjs","apps/engine.mjs","apps/model.mjs","build/model.mjs","build/cubie.mjs","build/notation.mjs"].map(p=>resolve(p));
const seals=paths.map(seal),profiles=[{id:"control",binary:control},{id:"packed",binary:packed}];
for(const p of profiles){const meta=JSON.parse(readFileSync(p.binary+".json","utf8"));assert.equal(meta.binarySha256,seals.find(s=>s.path===p.binary).sha256);p.build=meta;}
const cases=JSON.parse(readFileSync(fixture,"utf8")).records;assert.equal(cases.length,163);
const report={format:"rubend-small-memory-comparison-v1",passed:false,seals,profiles,rounds:[],errors:[],planned:{cohorts:5,workers:10,knownOptimumJobs:1630},conditions:"Fresh generated tables, alternating worker order, no disk table cache. Native ready and after-shallow RSS are separate from native HWM and batch peak. RSS excludes host/browser. Startup includes generation and packing. Bounded runner controls aggregate resources. All shallow results replay."};
try{
  for(let round=0;round<5;round++){
    const cohort={round,workers:[],jobs:[],status:"error"};report.rounds.push(cohort);
    for(const p of round%2?[...profiles].reverse():profiles){
      assert.deepEqual(seal(p.binary),seals.find(s=>s.path===p.binary));
      const started=performance.now(),engine=new Engine({binary:p.binary}),identity=nativeIdentity(engine.child.pid),worker={profile:p.id,identity,directory:engine.directory};cohort.workers.push(worker);
      try{
        await engine.ready(30000);worker.readyMs=performance.now()-started;worker.readyMemory=sampleNativeRss(identity,"ready",started);
        assert.equal(worker.readyMemory.identityMatched,true);assert.ok(worker.readyMemory.rssKiB>0);
        const generation=engine.generation;
        for(let index=0;index<cases.length;index++){
          const item=cases[index],events=[];
          await new Promise((done,reject)=>{engine.solve({facelets:item.facelets,mode:"exact",budgetMs:1000},event=>{events.push(event);if(event.type==="error"||event.type==="invalid")reject(Error(JSON.stringify(event)));else if(event.type==="done")done();}).catch(reject);});
          const last=events.at(-1),answer=events.filter(e=>e.type==="candidate").at(-1);
          assert.notEqual(last.reason,"time_limit");assert.equal(engine.generation,generation);assert.ok(answer);
          assert.equal(last.optimal,1);assert.equal(last.lower,item.depth);assert.equal(last.length,item.depth);assert.equal(answer.length,item.depth);assert.equal(apply(item.facelets,answer.moves),solved);
          cohort.jobs.push({profile:p.id,index,facelets:item.facelets,depth:item.depth,events});
        }
        worker.afterMemory=sampleNativeRss(identity,"after-shallow",started);assert.ok(worker.afterMemory.rssKiB>0&&worker.afterMemory.identityMatched);
      }finally{
        let forced=false;const timer=setTimeout(()=>{forced=true;engine.child?.kill("SIGKILL");},1000);
        try{await engine.close();}finally{clearTimeout(timer);}
        worker.shutdown={forced,exitCode:engine.child.exitCode,signal:engine.child.signalCode,ipcRemoved:!existsSync(engine.directory)};
        assert.equal(forced,false);assert.equal(worker.shutdown.ipcRemoved,true);
        assert.notDeepEqual(nativeIdentity(engine.child.pid),identity);
      }
    }
    cohort.status="ok";
  }
  report.passed=true;
}catch(error){report.errors.push(String(error.stack??error));}
finally{
  for(const s of seals)try{assert.deepEqual(seal(s.path),s);}catch(error){report.passed=false;report.errors.push("Postflight "+String(error));}
  writeFileSync(output,JSON.stringify(report)+"\n",{flag:"wx"});
}
console.log(JSON.stringify({passed:report.passed,errors:report.errors,output,workers:report.rounds.flatMap(r=>r.workers).map(w=>({profile:w.profile,readyMs:w.readyMs,readyRssKiB:w.readyMemory?.rssKiB,afterRssKiB:w.afterMemory?.rssKiB,hwmKiB:w.afterMemory?.hwmKiB}))}));
if(!report.passed)process.exitCode=1;
