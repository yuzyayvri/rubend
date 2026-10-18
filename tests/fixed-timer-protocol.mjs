import assert from "node:assert/strict";
import {Engine} from "../apps/engine.mjs";
import {solved} from "../apps/model.mjs";

assert.equal(process.argv.length,3);
const engine=new Engine({binary:process.argv[2],eventProtocol:"fixed-work"}),events=[];
try{
  await engine.ready(120000);
  await new Promise((done,reject)=>{engine.solve({facelets:solved,mode:"exact",budgetMs:500},event=>{events.push(event);if(["invalid","error"].includes(event.type))reject(Error(JSON.stringify(event)));if(event.type==="done")done();}).catch(reject);});
  assert.equal(events.filter(e=>e.type==="snapshot").length,1);assert.equal(events.filter(e=>e.type==="measurement").length,1);
  assert.equal(events.at(-1).optimal,1);assert.equal(events.at(-1).length,0);assert.equal(events.at(-1).lower,0);
  assert.equal(events.find(e=>e.type==="snapshot").slice,500);assert.equal(events.find(e=>e.type==="measurement").slices,500);
  console.log(JSON.stringify({passed:true,realFrozenTimer:true,privateEventsDelivered:true,solvedOptimum:0}));
}finally{await engine.close();}
