import assert from "node:assert/strict";
import {readFileSync,readdirSync} from "node:fs";
import {performance} from "node:perf_hooks";
import {Engine} from "../apps/engine.mjs";

const decimal=value=>{assert.match(value??"",/^\d+$/);return value;};
export function parseStat(text,pid){
  assert.ok(Number.isSafeInteger(pid)&&pid>0);assert.ok(text.startsWith(pid+" ("));
  const close=text.lastIndexOf(")");assert.ok(close>0);const fields=text.slice(close+2).trim().split(/\s+/);
  return{pid,startTicks:decimal(fields[19]),minorFaults:decimal(fields[7]),majorFaults:decimal(fields[9])};
}
export function parseSchedstat(text){
  const fields=text.trim().split(/\s+/);assert.equal(fields.length,3);
  return{cpuNs:decimal(fields[0]),waitNs:decimal(fields[1]),slices:decimal(fields[2])};
}
function switches(text){
  return{voluntary:decimal(text.match(/^voluntary_ctxt_switches:\s+(\d+)/m)?.[1]),involuntary:decimal(text.match(/^nonvoluntary_ctxt_switches:\s+(\d+)/m)?.[1])};
}
export function sampleOwner(pid){
  const beginMs=performance.now();
  try{
    const root="/proc/"+pid,identity=parseStat(readFileSync(root+"/stat","utf8"),pid);
    const threads=readdirSync(root+"/task").map(Number).sort((a,b)=>a-b).map(tid=>{
      const path=root+"/task/"+tid;return{...parseStat(readFileSync(path+"/stat","utf8"),tid),...parseSchedstat(readFileSync(path+"/schedstat","utf8")),...switches(readFileSync(path+"/status","utf8"))};
    });
    const after=parseStat(readFileSync(root+"/stat","utf8"),pid);assert.equal(after.startTicks,identity.startTicks);
    return{available:true,beginMs,endMs:performance.now(),...identity,threads};
  }catch(error){return{available:false,pid,beginMs,endMs:performance.now(),reason:String(error.message)};}
}
export function counterDelta(before,after,schedulerWaitEnabled){
  if(!before.available||!after.available)return{available:false,reason:"counter-unavailable"};
  if(before.pid!==after.pid||before.startTicks!==after.startTicks)return{available:false,reason:"owner-changed"};
  if(before.threads.length!==after.threads.length)return{available:false,reason:"thread-set-changed"};
  const totals={cpuNs:0n,waitNs:0n,slices:0n,voluntary:0n,involuntary:0n};
  for(const a of before.threads){
    const b=after.threads.find(t=>t.pid===a.pid&&t.startTicks===a.startTicks);if(!b)return{available:false,reason:"thread-set-changed"};
    for(const key of Object.keys(totals)){const difference=BigInt(b[key])-BigInt(a[key]);if(difference<0n)return{available:false,reason:"counter-regressed"};totals[key]+=difference;}
  }
  const faults={};for(const key of["minorFaults","majorFaults"]){const delta=BigInt(after[key])-BigInt(before[key]);if(delta<0n)return{available:false,reason:"counter-regressed"};faults[key]=String(delta);}
  return{available:true,cpuUntilObservationMs:Number(totals.cpuNs)/1e6,runqueueWaitMs:schedulerWaitEnabled?Number(totals.waitNs)/1e6:null,schedulerWaitEnabled,slices:String(totals.slices),voluntarySwitches:String(totals.voluntary),involuntarySwitches:String(totals.involuntary),...faults};
}
export class LatencyProbeEngine extends Engine {
  constructor(options,context,sink){super(options);this.probeContext=context;this.probeSink=sink;try{this.schedulerWaitEnabled=readFileSync("/proc/sys/kernel/sched_schedstats","utf8").trim()==="1";}catch{this.schedulerWaitEnabled=false;}}
  solve(input,onEvent,options){
    if(input.group==="warmup")return super.solve(input,onEvent,options);
    const before=sampleOwner(this.child.pid),hostBefore=process.cpuUsage(),loopBefore=performance.eventLoopUtilization();
    const row={...this.probeContext,id:input.id,group:input.group,mode:input.mode,facelets:input.facelets,pid:this.child.pid,generation:this.generation,before,first:null};this.probeSink.push(row);
    return super.solve(input,event=>{
      if(event.type==="candidate"&&!row.first){
        const observedMs=performance.now(),job=this.job,hostCpu=process.cpuUsage(hostBefore),eventLoop=performance.eventLoopUtilization(loopBefore),after=sampleOwner(row.pid);
        row.first={roundedMs:event.elapsedMs,observedMs,jobStartedMs:job?.started??null,arrivalMs:job?observedMs-job.started:null,commandStartAfterProbeMs:job?job.started-before.endMs:null,hostCpuUs:hostCpu,eventLoop,after,counters:counterDelta(before,after,this.schedulerWaitEnabled),moves:[...event.moves],length:event.length,nodes:event.nodes,lower:event.lower};
      }
      onEvent(event);
    },options);
  }
}
const distribution=values=>{if(!values.length)return null;const a=[...values].sort((a,b)=>a-b),mid=Math.floor(a.length/2);return{count:a.length,minimum:a[0],median:a.length%2?a[mid]:(a[mid-1]+a[mid])/2,p95:a[Math.ceil(a.length*.95)-1],maximum:a.at(-1)};};
export function summarizeLatencyTrace(rows,original){
  assert.ok(rows.length>0);assert.ok(rows.every(r=>r.first&&Number.isFinite(r.first.arrivalMs)&&r.first.arrivalMs>=0));
  const originalRows=original.rounds.flatMap(r=>r.jobs).filter(j=>j.group!=="warmup");assert.equal(rows.length,originalRows.length);
  const key=r=>JSON.stringify([r.group,r.id]);const prefix=r=>JSON.stringify([r.moves,r.length,r.nodes]);
  let mismatches=0;for(const row of rows){const matching=originalRows.filter(j=>key(j)===key(row));assert.ok(matching.length);assert.ok(matching.every(j=>j.facelets===row.facelets));if(!matching.some(j=>prefix(j.first)===prefix(row.first)))mismatches++;}
  const groups={};
  for(const group of["fast","exact","superflip"]){
    const selected=rows.filter(r=>r.group===group),profiles=[...new Set(selected.map(r=>r.profile))];assert.equal(profiles.length,2);
    groups[group]=Object.fromEntries(profiles.map(profile=>{
      const own=selected.filter(r=>r.profile===profile),cases=[...new Set(own.map(r=>r.id))];
      return[profile,{roundedMs:distribution(own.map(r=>r.first.roundedMs)),arrivalMs:distribution(own.map(r=>r.first.arrivalMs)),cases:cases.map(id=>{
        const a=own.filter(r=>r.id===id),c=a.map(r=>r.first.counters).filter(c=>c.available);
        return{id,samples:a.length,prefixes:new Set(a.map(r=>prefix(r.first))).size,arrivalMs:distribution(a.map(r=>r.first.arrivalMs)),nativeCpuUntilObservationMs:distribution(c.map(c=>c.cpuUntilObservationMs)),runqueueWaitMs:distribution(c.filter(c=>c.runqueueWaitMs!==null).map(c=>c.runqueueWaitMs)),minorFaults:c.map(c=>c.minorFaults),majorFaults:c.map(c=>c.majorFaults),voluntarySwitches:c.map(c=>c.voluntarySwitches),involuntarySwitches:c.map(c=>c.involuntarySwitches)};
      })}];
    }));
  }
  return{format:"rubend-u00-latency-attribution-v1",samples:rows.length,firstPrefixesMatchingOriginal:mismatches===0,prefixMismatches:mismatches,counterUnavailable:rows.filter(r=>!r.first.counters.available).length,schedulerWaitAccountingAvailable:rows.every(r=>r.first.counters.schedulerWaitEnabled===true),groups,claim:"Instrumented observation only. Native CPU extends until host observation, not native candidate emission. Counter reads bracket the interval and can include later search work. No release speed, noise-gate clearance, or causal scheduler attribution is claimed."};
}
