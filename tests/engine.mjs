import assert from "node:assert/strict";
import { mkdirSync, writeFileSync, readFileSync,existsSync } from "node:fs";
import { performance } from "node:perf_hooks";
import { Engine } from "../apps/engine.mjs";
import { apply, solved } from "../apps/model.mjs";

const engine=new Engine(),records=[];
let peakRssKiB=0;
const monitor=setInterval(()=>{try{const s=readFileSync(`/proc/${engine.child.pid}/status`,"utf8");const m=s.match(/^VmHWM:\s+(\d+)/m);if(m)peakRssKiB=Math.max(peakRssKiB,Number(m[1]));}catch{}},10);
async function check(facelets,mode,budgetMs,expected){
  const started=performance.now(),events=[];
  await new Promise(async(resolve,reject)=>{
    try {await engine.solve({facelets,mode,budgetMs},event=>{
      events.push(event);
      if(event.type==="error"||event.type==="invalid")reject(Error(JSON.stringify(event)));
      if(event.type==="done")resolve();
    });}catch(error){reject(error);}
  });
  const candidates=events.filter(e=>e.type==="candidate");
  assert.ok(candidates.length,"No candidate");
  for(const e of candidates)assert.equal(apply(facelets,e.moves),solved);
  const last=candidates.at(-1);
  if(expected!==undefined){assert.equal(last.length,expected);assert.equal(events.at(-1).optimal,1);}
  records.push({facelets,mode,budgetMs,firstAnswerMs:candidates[0].elapsedMs,length:last.length,optimal:Boolean(events.at(-1).optimal),totalMs:Math.round(performance.now()-started),nodes:events.at(-1).nodes??events.filter(e=>e.type==="progress").at(-1)?.nodes});
}
try{
  await engine.ready();
  await check(solved,"exact",500,0);
  for(let move=0;move<18;move++)await check(apply(solved,[move]),"exact",500,1);
  await check(apply(solved,[3,0,5,2]),"exact",1000,4);
  let seed=0x52554245;
  for(let i=0;i<12;i++){
    const moves=[];
    for(let j=0;j<25;j++){seed=(Math.imul(seed,1664525)+1013904223)>>>0;moves.push(seed%18);}
    await check(apply(solved,moves),"fast",1500);
  }
  await check(apply(solved,[3,0,5,2,6,9,12]),"exact",1000);
  await engine.solve({facelets:apply(solved,[0,3,6,9,12,15,1,4,7,10,13,16]),mode:"exact",budgetMs:10000},()=>{});
  const originalPid=engine.child.pid,originalGeneration=engine.generation;
  const cancelledAt=performance.now();await engine.cancel();
  const cancellationMs=Math.round(performance.now()-cancelledAt);
  await engine.ready();
  assert.equal(engine.cooperative,true,"Current native worker must support reusable cancellation");
  assert.equal(engine.child.pid,originalPid,"Cancellation must keep the table owner");
  assert.equal(engine.generation,originalGeneration,"Cancellation must not initialize another table");
  const recoveryMs=Math.round(performance.now()-cancelledAt);
  await check(solved,"exact",500,0);
  const result={checkedAt:new Date().toISOString(),records,peakRssKiB,cancellationMs,cancelAndRecoveryMs:recoveryMs,allReturnedSolutionsVerified:true};
  mkdirSync("build/evidence",{recursive:true});writeFileSync("build/evidence/engine.json",JSON.stringify(result,null,2));
  console.log(JSON.stringify({cases:records.length,meanFastLength:records.filter(r=>r.mode==="fast").reduce((s,r)=>s+r.length,0)/12,maxFirstAnswerMs:Math.max(...records.map(r=>r.firstAnswerMs)),peakRssKiB,cancellationMs,recoveryMs}));
}finally{clearInterval(monitor);const directory=engine.directory;await engine.close();assert.equal(existsSync(directory),false,"Engine IPC directory leaked");}

const missing=new Engine({binary:"/rubend-deliberately-missing-test-binary"});
try{await assert.rejects(missing.ready(),/stopped|initialize/);}finally{const directory=missing.directory;await missing.close();assert.equal(existsSync(directory),false,"Failed startup leaked IPC");}
