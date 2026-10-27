import assert from "node:assert/strict";

const ready={type:"ready",goal:2,profile:3};
export function partitionBlocks(records,jobs,allowIncomplete=false){
  assert.deepEqual(records[0],ready);const expected=new Map(jobs.map(j=>[j.id,j])),seen=new Set(),blocks=[];let at=1,refusal=null,incomplete=null;
  try{while(at<records.length){const start=records[at++];assert.equal(start.type,"started");const job=expected.get(start.id);assert.ok(job,"Unassigned partition job");assert.equal(start.scope,job.scope);assert.equal(seen.has(job.id),false,"Repeated job within one attempt");const frames=[start];if(records[at]?.type==="candidate")frames.push(records[at++]);if(at===records.length){incomplete=frames;break;}const end=records[at++];assert.equal(end.type,"result");assert.equal(end.id,job.id);assert.equal(end.scope,job.scope);frames.push(end);seen.add(job.id);blocks.push({jobId:job.id,frames});}}catch(error){if(!allowIncomplete)throw error;refusal=String(error);}
  const complete=refusal===null&&incomplete===null&&seen.size===jobs.length;if(!allowIncomplete)assert.equal(complete,true,"Attempt lacks assigned results");return{ready:structuredClone(records[0]),blocks,complete,refusal,incomplete};
}

export class PartitionCollector{
  #ids;#reference;#accepted=new Map();#ready=null;#duplicates=0;
  constructor(jobs,reference,checkpoint=null){assert.ok(jobs.length>0);this.#ids=jobs.map(j=>j.id);assert.equal(new Set(this.#ids).size,this.#ids.length);this.#reference=new Map(structuredClone(reference.blocks).map(b=>[b.jobId,b.frames]));for(const id of this.#ids)assert.ok(this.#reference.has(id));if(checkpoint!==null){assert.equal(checkpoint.format,"rubend-partition-checkpoint-v1");if(checkpoint.ready!==null)this.observeReady(checkpoint.ready);for(const block of checkpoint.blocks)this.admit(block);}}
  observeReady(value){assert.deepEqual(value,ready);if(this.#ready===null)this.#ready=structuredClone(value);else assert.deepEqual(value,this.#ready);}
  admit(block){assert.notEqual(this.#ready,null,"No verified worker readiness");assert.ok(this.#ids.includes(block.jobId),"Unrequired job cannot supply a receipt");assert.deepEqual(block.frames,this.#reference.get(block.jobId),"Partition receipt differs from verified source-bound result");if(this.#accepted.has(block.jobId)){assert.deepEqual(this.#accepted.get(block.jobId),block.frames);this.#duplicates++;return"repeated";}this.#accepted.set(block.jobId,structuredClone(block.frames));return"applied";}
  remaining(){return this.#ids.filter(id=>!this.#accepted.has(id));}
  status(){return{state:this.#ready===null?"awaiting-ready":this.remaining().length?"incomplete":"complete-accounting",required:this.#ids.length,accepted:this.#accepted.size,remaining:this.remaining(),identicalRetries:this.#duplicates};}
  checkpoint(){return{format:"rubend-partition-checkpoint-v1",ready:structuredClone(this.#ready),blocks:[...this.#accepted].map(([jobId,frames])=>({jobId,frames:structuredClone(frames)}))};}
  transcript(){assert.notEqual(this.#ready,null);assert.equal(this.remaining().length,0,"Required jobs still missing");return[structuredClone(this.#ready),...this.#ids.flatMap(id=>structuredClone(this.#accepted.get(id)))];}
}
