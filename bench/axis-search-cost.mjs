import assert from "node:assert/strict";
import {readFileSync,writeFileSync,existsSync,createReadStream} from "node:fs";
import {resolve} from "node:path";
import {fileURLToPath} from "node:url";
import {createHash} from "node:crypto";
import {performance} from "node:perf_hooks";
import {Engine} from "../apps/engine.mjs";
import {loadCorpus} from "./corpus.mjs";
import {parseCpu} from "./fixed-time-compare.mjs";
import {apply,solved} from "../apps/model.mjs";

export function summarizeCost(rows){
  assert.equal(rows.length,40);
  const median=xs=>{const s=[...xs].sort((a,b)=>a-b);return(s[(s.length-1)>>1]+s[s.length>>1])/2;};
  const ratios=[];
  for(let round=0;round<5;round++){
    const group=rows.filter(r=>r.round===round);assert.equal(group.length,8);
    const sum=side=>group.filter(r=>r.side===side).reduce((n,r)=>{assert.ok(r.nativeMs>=0&&r.nodes>0);return n+r.nativeMs;},0);
    const a=sum("a"),b=sum("b");assert.ok(a>0&&b>0);ratios.push({a,b,ratio:b/a});
    const control=group.filter(r=>r.side==="a"),candidate=group.filter(r=>r.side==="b");assert.equal(control.length,4);assert.equal(candidate.length,4);
    for(const item of control){const other=candidate.find(x=>x.id===item.id);assert.ok(other);assert.deepEqual(other.result,item.result);}
  }
  const values=ratios.map(x=>x.ratio);
  return{ratios,medianRatio:median(values),minimumRatio:Math.min(...values),maximumRatio:Math.max(...values),allCohortsAtLeast100ms:ratios.every(x=>x.a>=100&&x.b>=100),withinFivePercent:values.every(x=>Math.abs(x-1)<=0.05)};
}

if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  assert.equal(process.argv.length,4);
  const directory=resolve(process.argv[2]),output=resolve(process.argv[3]),cache=resolve(".cache/joint/phase1-v1.raw"),cacheSha256="2ccfd40fdc0cf4769c58d9646f6b0ea787571ce5200b5d124c8f17dcc70f73b5";
  async function seal(){const h=createHash("sha256");for await(const chunk of createReadStream(cache))h.update(chunk);assert.equal(h.digest("hex"),cacheSha256);}
  await seal();
  const cases=loadCorpus("pilot").slice(0,4),rows=[],report={format:"rubend-axis-search-cost-v1",passed:false,cacheSha256,cacheCondition:"Warm file pages from preflight digest; fresh worker per side and cohort",cases,rows,workers:[],errors:[],fuel:1000000,target:20,releaseHoldoutOpened:false,performanceAcceptance:false,productionIntegrated:false,independentReview:false};
  Object.assign(process.env,{RUBEND_JOINT_CACHE:cache,RUBEND_CONTOUR_PROFILE:"inverse-three",RUBEND_CONTOUR_TARGET:"20"});
  const cpu=pid=>parseCpu(readFileSync("/proc/"+pid+"/stat","utf8"),pid),rss=pid=>Number(readFileSync("/proc/"+pid+"/status","utf8").match(/^VmRSS:\s+(\d+)/m)?.[1]??0);
  try{
    for(const experiment of ["aa","ab"]){
      if(experiment==="ab"&&!(report.aa.withinFivePercent&&report.aa.allCohortsAtLeast100ms)){report.abSkipped="Fresh native A/A failed the five-percent or duration gate";break;}
      for(let round=0;round<5;round++)for(const side of round%2?["b","a"]:["a","b"]){
        const label=experiment==="ab"&&side==="b"?"candidate":"control",binary=resolve(directory,label),started=performance.now(),engine=new Engine({binary,eventProtocol:"fixed-work"});
        const worker={experiment,round,side,label,binary,pid:engine.child.pid,peakRssKiB:0};report.workers.push(worker);
        const timer=setInterval(()=>{try{worker.peakRssKiB=Math.max(worker.peakRssKiB,rss(engine.child.pid));}catch{}},20);
        try{
          await engine.ready(120000);worker.readyMs=performance.now()-started;worker.readyRssKiB=rss(engine.child.pid);
          for(const item of round%2?[...cases].reverse():cases){
            const before=cpu(engine.child.pid),events=[],start=performance.now();
            await new Promise((done,reject)=>{engine.solve({facelets:item.facelets,mode:"exact",budgetMs:30000},e=>{events.push(e);if(["error","invalid"].includes(e.type))reject(Error(JSON.stringify(e)));else if(e.type==="done")done();}).catch(reject);});
            const hostMs=performance.now()-start,after=cpu(engine.child.pid);assert.equal(after.startTicks,before.startTicks);
            assert.ok(events.every(e=>["candidate","measurement","done"].includes(e.type)));
            const terminal=events.filter(e=>e.type==="done"),measure=events.filter(e=>e.type==="measurement");assert.equal(terminal.length,1);assert.equal(measure.length,1);
            const d=terminal[0],m=measure[0];assert.ok([0,1].includes(m.status));assert.equal(m.target,20);assert.equal(m.profile,3);assert.equal(d.lower,m.bound);assert.ok(Number.isInteger(d.nodes)&&d.nodes>0&&d.nodes<=1000000);assert.equal(d.optimal,m.status===1?1:0);assert.ok(Number.isSafeInteger(m.nativeMs)&&m.nativeMs>=0);
            assert.ok(d.lower>=0&&d.lower<=d.length&&d.length<=31);
            const complete=d.lower>=20||d.optimal===1;if(!complete)assert.equal(d.nodes,1000000);
            const candidates=events.filter(e=>e.type==="candidate");
            if(d.length<31){assert.equal(candidates.length,1);assert.equal(m.moves.length,d.length);assert.equal(apply(item.facelets,m.moves),solved);assert.deepEqual(candidates[0].moves,m.moves);}else{assert.equal(candidates.length,0);assert.deepEqual(m.moves,[]);assert.equal(d.optimal,0);}
            const result={length:d.length,lower:d.lower,nodes:d.nodes,optimal:d.optimal,moves:m.moves,status:m.status};
            rows.push({experiment,round,side,label,id:item.id,nativeMs:m.nativeMs,hostMs,cpuTicks:after.ticks-before.ticks,nodes:d.nodes,complete,result});
          }
        }finally{
          clearInterval(timer);let forced=false;const t=setTimeout(()=>{forced=true;engine.child.kill("SIGKILL");},1000);try{await engine.close();}finally{clearTimeout(t);}
          worker.shutdown={forced,ipcRemoved:!existsSync(engine.directory)};assert.equal(forced,false);assert.equal(worker.shutdown.ipcRemoved,true);
        }
      }
      report[experiment]=summarizeCost(rows.filter(r=>r.experiment===experiment));
    }
    report.passed=true;
  }catch(e){report.errors.push(String(e.stack??e));}
  finally{
    try{await seal();}catch(e){report.passed=false;report.errors.push(String(e));}
    writeFileSync(output,JSON.stringify(report)+"\n",{flag:"wx"});
  }
  console.log(JSON.stringify({passed:report.passed,aa:report.aa,ab:report.ab,abSkipped:report.abSkipped,errors:report.errors,performanceAcceptance:false}));if(!report.passed)process.exitCode=1;
}
