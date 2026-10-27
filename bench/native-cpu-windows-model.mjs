import assert from "node:assert/strict";
import {stampNs,deltaNs} from "./process-cpu-model.mjs";
import {apply,solved} from "./fixed-work-model.mjs";

export function inspectNativeCpuWindows(measured,cases,enabled){
  assert.equal(measured.commandSucceeded,true);assert.equal(measured.measurementAvailable,true);assert.ok(Number.isSafeInteger(measured.usage.totalCpuMs)&&measured.usage.totalCpuMs>=0);const records=measured.stdout.trim().split("\n").map(s=>JSON.parse(s));let cursor=0,last=0n,total=0n,replays=0;const windows=[],snapshots=[];
  function window(phase,id){const r=records[cursor++];assert.deepEqual(Object.keys(r).sort(),["type","phase","id","enabled","before","after","wallMs"].sort());assert.equal(r.type,"cpu-window");assert.equal(r.phase,phase);assert.equal(r.id,id);assert.equal(r.enabled,Number(enabled));assert.ok(Number.isSafeInteger(r.wallMs)&&r.wallMs>=0);const before=stampNs(r.before),after=stampNs(r.after);assert.ok(before>=last,"CPU windows overlap or regress");const duration=deltaNs(r.before,r.after);last=after;assert.ok(duration<=BigInt(Number.MAX_SAFE_INTEGER));if(enabled){assert.ok(after>0n,"Enabled CPU clock is unavailable");assert.ok(Number(duration)/1e6<=r.wallMs+30,"Single-lane CPU exceeds wall window beyond quantization");total+=duration;}else{assert.equal(before,0n);assert.equal(after,0n);}const result={phase,id,available:enabled,cpuNanoseconds:enabled?String(duration):null,cpuMs:enabled?Number(duration)/1e6:null,wallMs:r.wallMs};windows.push(result);return result;}
  assert.deepEqual(records[cursor++],{type:"initialized",capacity:8388608});window("initialization","init");
  for(const c of cases){const candidate=records[cursor]?.type==="candidate"?records[cursor++]:null,s=records[cursor++];assert.equal(s.type,"snapshot");assert.equal(s.id,c.id);assert.equal(s.request,c.request);assert.equal(s.slice,c.slices);for(const k of["nodes","length","lower","status"])assert.ok(Number.isSafeInteger(s[k])&&s[k]>=0,k);assert.ok(s.status<=3);assert.ok(s.lower<=s.length&&s.length<=31);assert.ok(s.nodes<=c.slices*60000);assert.ok(Array.isArray(s.state)&&s.state.length===3);assert.equal(Boolean(candidate),s.length<31);assert.ok(Array.isArray(s.moves));assert.equal(s.moves.length,s.length<31?s.length:0);if(candidate){assert.equal(candidate.length,s.length);assert.equal(candidate.nodes,s.nodes);assert.equal(candidate.lower,s.lower);assert.equal(candidate.optimal,Number(s.status===1));assert.deepEqual(candidate.moves,s.moves);assert.equal(apply(c.facelets,s.moves),solved);replays++;}if(s.status===1)assert.equal(s.length,s.lower);if(c.knownOptimum!==undefined){assert.equal(s.status,1);assert.equal(s.length,c.knownOptimum);}snapshots.push(s);window("request",c.id);}
  assert.equal(cursor,records.length,"Unexpected CPU-window output");const sum=enabled?Number(total)/1e6:null,whole=measured.usage.totalCpuMs;if(enabled){assert.ok(sum<=whole+30,"Disjoint native windows exceed whole-command CPU");assert.ok(whole<=sum+100,"Unmeasured command CPU exceeds calibration allowance");}return{windows,snapshots,replays,wholeCommandCpuMs:whole,measuredWindowCpuMs:sum,unmeasuredCpuDifferenceMs:enabled?whole-sum:null,wholeCommandQuantizationAllowanceMs:30,unmeasuredStartupAndOutputAllowanceMs:100,disabledCpuIsUnavailable:!enabled,scope:"Initialization includes generated ordinary Light tables and capacity output. Each request includes facelet parsing, validation, portfolio initialization, fixed work and final certificate/snapshot output. Excludes request-file read, post-window records and process teardown. Not first-answer or pure Search.run CPU."};
}

export function nativeCpuWindowFaults(measured,cases){
  const mutate=(name,edit,selection=cases)=>{const copy=structuredClone(measured),rows=copy.stdout.trim().split("\n").map(s=>JSON.parse(s));edit(copy,rows);copy.stdout=rows.map(r=>JSON.stringify(r)).join("\n")+"\n";assert.throws(()=>inspectNativeCpuWindows(copy,selection,true),name);return name;};
  return[
    mutate("missing-whole-command-cpu",x=>{x.measurementAvailable=false;}),
    mutate("wall-as-cpu",(_,r)=>{r[1].before=[0,0];r[1].after=[100000,0];}),
    mutate("backwards-window",(_,r)=>{r[1].before=[1,0];r[1].after=[0,0];}),
    mutate("missing-window",(_,r)=>{r.splice(1,1);}),
    mutate("duplicate-window",(_,r)=>{r.splice(2,0,structuredClone(r[1]));}),
    mutate("wrong-request-identity",(_,r)=>{r.find(x=>x.type==="cpu-window"&&x.phase==="request").id="wrong";}),
    mutate("disabled-clock-as-measured-zero",(_,r)=>{for(const x of r.filter(x=>x.type==="cpu-window")){x.enabled=0;x.before=[0,0];x.after=[0,0];}}),
    mutate("wrong-table-capacity",(_,r)=>{r[0].capacity/=2;}),
    mutate("unconsumed-search",(_,r)=>{r.find(x=>x.type==="snapshot").nodes=4294967295;}),
    mutate("invalid-answer-replay",(_,r)=>{const candidate=r.find(x=>x.type==="candidate"),snapshot=r.find(x=>x.type==="snapshot");for(const x of[candidate,snapshot]){x.moves=[0];x.length=1;x.lower=1;}}),
  ];
}
