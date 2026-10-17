import {readFileSync,writeFileSync,mkdirSync} from "node:fs";
import {Engine} from "../apps/engine.mjs";

const input=JSON.parse(readFileSync("build/evidence/compare-rubend-uniform-holdout-v1-32-1000.json","utf8"));
const engine=new Engine(),records=[];
try{
  await engine.ready();
  for(const item of input.records.slice(0,3)){
    const events=[];
    await new Promise(async(resolve,reject)=>{try{await engine.solve({facelets:item.facelets,mode:"exact",budgetMs:2000},event=>{events.push(event);if(event.type==="error")reject(Error(event.message));if(event.type==="done")resolve();});}catch(e){reject(e);}});
    const candidate=events.filter(e=>e.type==="candidate").at(-1),done=events.at(-1);
    records.push({id:item.id,facelets:item.facelets,budgetMs:2000,length:candidate?.length??null,lower:done.lower,optimal:Boolean(done.optimal),nodes:done.nodes??events.filter(e=>e.type==="progress").at(-1)?.nodes??0});
  }
  mkdirSync("build/evidence",{recursive:true});writeFileSync("build/evidence/exact-profile.json",JSON.stringify({checkedAt:new Date().toISOString(),purpose:"Bounded diagnosis, not a competitive exact-solver benchmark",records},null,2));console.log(JSON.stringify(records));
}finally{await engine.close();}
