import assert from "node:assert/strict";
import {readFileSync,writeFileSync,mkdtempSync,rmSync} from "node:fs";
import {spawnSync} from "node:child_process";
import {join} from "node:path";
import {createHash} from "node:crypto";
import {apply,solved,validate} from "../apps/model.mjs";
import Cubie from "../build/cubie.mjs";
import {faceletsOf} from "./support.mjs";
import {loadCorpus} from "../bench/corpus.mjs";

const binary=process.argv[2];assert.ok(binary);
const hash=b=>createHash("sha256").update(b).digest("hex"),meta=readFileSync("build/evidence/h0-meta-v1.raw"),distance=readFileSync("build/evidence/h0-table-v1.raw");
assert.equal(hash(meta),"b6f6a7b08bcddf7f06fd9edbd28622d504ee15e5fde9b1b6880a881032811438");assert.equal(hash(distance),"9353ed8327ddb3121587674439cba73be9390dcc8984eae9629af93fbd8f1085");
function choose(n,k){if(k>n)return 0;let x=1;for(let i=1;i<=k;i++)x=x*(n-i+1)/i;return x;}
function rank(mask){let chosen=0,result=0;for(let i=0;i<mask.length;i++)if(mask[i])result+=choose(i,++chosen);return result;}
function expected(facelets){
  const c=validate(facelets),cp=Array.from({length:8},(_,i)=>(c.cp>>>(i*4))&15),ep=Array.from({length:12},(_,i)=>((i<8?c.ep:c.eh)>>>((i%8)*4))&15);
  const separation=cp.map(p=>(p^(p>>>2))&1),twist=Array.from({length:7},(_,i)=>((c.co>>>(2*i))&3)*3**i).reduce((a,b)=>a+b,0);
  const sparse=twist*128+separation.slice(0,7).reduce((v,b,i)=>v+(b<<i),0),eMask=ep.map(p=>p>=8),mMask=ep.filter(p=>p<8).map(p=>p%2===1),edge=rank(eMask)*70+rank(mMask),packed=meta.readUInt32LE(sparse*4),canonical=meta.readUInt32LE((1228800+edge*48+(packed>>>16))*4),index=(packed&65535)*34650+canonical;
  return {sparse,edge,distance:distance[index]};
}
const seen=new Set([solved]),layers=[[solved]],items=[{id:"depth0-0",facelets:solved,depth:0}];
for(let depth=1;depth<=4;depth++){const layer=[];for(const state of layers[depth-1])for(let move=0;move<18;move++){const next=apply(state,[move]);if(!seen.has(next)){seen.add(next);layer.push(next);items.push({id:"depth"+depth+"-"+layer.length,facelets:next,depth});}}layers.push(layer);}
assert.deepEqual(layers.map(x=>x.length),[1,18,243,3240,43239]);
items.push(...loadCorpus("pilot"),...loadCorpus("development"));
const superflip=faceletsOf({...Cubie.solved(),eo:4095});items.push({id:"superflip",facelets:superflip,expected:0},{id:"subgroup-U",facelets:apply(solved,[0]),expected:1});
const directory=mkdtempSync("build/h0-bound-input-");
try{
  const path=join(directory,"cubes.txt");writeFileSync(path,items.map(x=>x.facelets).join("\n")+"\n");
  const r=spawnSync(binary,["--threads","1","--",path,"build/evidence/h0-meta-v1.raw","build/evidence/h0-table-v1.raw"],{encoding:"utf8",timeout:180000,maxBuffer:16777216});
  assert.ifError(r.error);assert.equal(r.status,0,r.stdout.slice(-1000)+r.stderr);const values=r.stdout.trim().split("\n").map(x=>JSON.parse(x));assert.equal(values.length,items.length);
  const records=items.map((item,i)=>{const want=expected(item.facelets),actual=values[i];assert.deepEqual(actual,want,item.id);assert.ok(actual.distance>=0&&actual.distance<=12);if(item.depth!==undefined)assert.ok(actual.distance<=item.depth,"Inadmissible shallow bound "+item.id);if(item.expected!==undefined)assert.equal(actual.distance,item.expected);return {...item,...actual};});
  const report={passed:true,checked:records.length,shallow:seen.size,uniform:1128,layerCounts:layers.map(x=>x.length),records,inputHashes:{meta:hash(meta),distance:hash(distance),query:hash(readFileSync(binary))},independentReview:false};
  writeFileSync("build/evidence/h0-bound-oracle.json",JSON.stringify(report)+"\n");console.log(JSON.stringify({passed:true,checked:records.length,allShallowBoundsAdmissible:true,superflipZero:true,subgroupUIsNotFullCubeGoal:true}));
}finally{rmSync(directory,{recursive:true,force:true});}
