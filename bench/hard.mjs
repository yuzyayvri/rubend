import assert from "node:assert/strict";
import {mkdirSync,writeFileSync} from "node:fs";
import Cubie from "../build/cubie.mjs";
import {Engine} from "../apps/engine.mjs";
import {faceletsOf} from "../tests/support.mjs";

const cube=Cubie.solved();cube.eo=4095;
const engine=new Engine(),events=[];
try{
  await engine.ready();
  await new Promise(async(resolve,reject)=>{try{await engine.solve({facelets:faceletsOf(cube),mode:"fast",budgetMs:2000},event=>{events.push(event);if(event.type==="error")reject(Error(event.message));if(event.type==="done")resolve();});}catch(e){reject(e);}});
  const candidates=events.filter(e=>e.type==="candidate");
  for(const event of candidates){assert.ok(event.length>=20);if(event.optimal)assert.equal(event.length,20);}
  const result={position:"superflip",knownOptimalHTM:20,budgetMs:2000,firstAnswerMs:candidates[0]?.elapsedMs??null,length:candidates.at(-1)?.length??null,optimal:Boolean(events.at(-1).optimal),source:"https://www.cube20.org/",note:"A hard-tail measurement; a timeout is not an invalid-cube result."};
  mkdirSync("build/evidence",{recursive:true});writeFileSync("build/evidence/hard.json",JSON.stringify(result,null,2));console.log(JSON.stringify(result));
}finally{await engine.close();}
