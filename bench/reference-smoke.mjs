import assert from "node:assert/strict";
import {spawnSync} from "node:child_process";
import {readFileSync,writeFileSync,mkdirSync,statSync} from "node:fs";
import {createHash} from "node:crypto";
import {resolve} from "node:path";
import {apply,parse,solved,moveNames} from "../apps/model.mjs";

const root=resolve(".cache/nissy-reference"),binary=resolve(root,"run"),table=resolve(root,"tables/h48h0");
assert.equal(statSync(table).size,31683944,"Generate and validate the pinned h0 cache explicitly first.");
const binarySha256=createHash("sha256").update(readFileSync(binary)).digest("hex"),tableSha256=createHash("sha256").update(readFileSync(table)).digest("hex");
const heldout=JSON.parse(readFileSync("docs/verification/portfolio-v1/comparison.json","utf8"));
const cases=[{id:"solved",facelets:solved,scramble:[]},...Array.from({length:18},(_,id)=>({id:`single-${id}`,facelets:apply(solved,[id]),scramble:[id]})),...[[3,0,7,11],[0,3,6,9,12,15],[3,0,7,11,12,17,4,8]].map((scramble,i)=>({id:`walk-${i}`,facelets:apply(solved,scramble),scramble})),...heldout.records.slice(0,3).map(item=>({id:`uniform-${item.id}`,facelets:item.facelets,scramble:item.reference.moves.slice().reverse().map(m=>Math.floor(m/3)*3+2-m%3)}))];
const records=[];
for(const item of cases){
  assert.equal(apply(solved,item.scramble),item.facelets);
  const start=performance.now(),result=spawnSync(binary,["solve_scramble","-solver","h48h0","-moves",item.scramble.map(m=>moveNames[m]).join(" "),"-t","1"],{cwd:root,encoding:"utf8",timeout:5000,maxBuffer:1048576});
  const output=result.stdout.trim(),complete=result.status===0&&!result.error;
  const moves=complete?parse(output):null;
  if(complete)assert.equal(apply(item.facelets,moves),solved);
  if(item.id.startsWith("single-"))assert.equal(moves?.length,1);
  if(item.id==="solved")assert.equal(moves?.length,0);
  records.push({id:item.id,facelets:item.facelets,scramble:item.scramble,elapsedMs:Math.round(performance.now()-start),complete,length:moves?.length??null,moves,exitCode:result.status,signal:result.signal,error:result.error?.code??null,stderr:result.stderr.slice(-4000)});
  console.log(JSON.stringify({id:item.id,...records.at(-1),facelets:undefined,scramble:undefined,stderr:undefined}));
}
mkdirSync("build/evidence",{recursive:true});writeFileSync("build/evidence/reference-smoke.json",JSON.stringify({reference:"Nissy H48 h0",revision:"1f7e8e937d0e71e7eb3b5deab38b34d0a0159d88",patch:"docs/research/NISSY-REFERENCE.md",binarySha256,tableSha256,conditions:"One low-priority core; 5-second per-process deadline includes table load. Not a matched warm anytime comparison. Every returned path replayed independently through Rubend's Bend model.",records},null,2)+"\n");
