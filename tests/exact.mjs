import assert from "node:assert/strict";
import {mkdirSync,writeFileSync} from "node:fs";
import {Engine} from "../apps/engine.mjs";
import {apply,solved} from "../apps/model.mjs";

const seen=new Set([solved]),layers=[[solved]];
for(let depth=1;depth<=4;depth++){
  const layer=[];
  for(const state of layers[depth-1])for(let m=0;m<18;m++){
    const next=apply(state,[m]);if(!seen.has(next)){seen.add(next);layer.push(next);}
  }
  layers.push(layer);
}
assert.deepEqual(layers.map(xs=>xs.length),[1,18,243,3240,43239]);
const engine=new Engine(),records=[];
try{
  await engine.ready();
  for(let depth=0;depth<=4;depth++){
    const samples=layers[depth].filter((_,i)=>i%Math.max(1,Math.floor(layers[depth].length/48))===0).slice(0,48);
    for(const facelets of samples){
      const events=[];
      await new Promise(async(resolve,reject)=>{try{await engine.solve({facelets,mode:"exact",budgetMs:1000},event=>{events.push(event);if(event.type==="error")reject(Error(event.message));if(event.type==="done")resolve();});}catch(e){reject(e);}});
      const last=events.filter(e=>e.type==="candidate").at(-1),done=events.at(-1);
      assert.ok(last,`Missing depth-${depth} answer`);assert.equal(last.length,depth);assert.equal(done.optimal,1);assert.equal(done.lower,depth);assert.equal(apply(facelets,last.moves),solved);
      records.push({depth,facelets,firstMs:events.find(e=>e.type==="candidate").elapsedMs,length:last.length,lower:done.lower});
    }
  }
  mkdirSync("build/evidence",{recursive:true});writeFileSync("build/evidence/exact.json",JSON.stringify({checkedAt:new Date().toISOString(),breadthFirstLayerCounts:layers.map(xs=>xs.length),cases:records.length,records,passed:true},null,2));
  console.log(`Exact: ${seen.size} breadth-first states and ${records.length} native optimum comparisons passed.`);
}finally{await engine.close();}
