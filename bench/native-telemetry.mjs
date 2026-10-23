import assert from "node:assert/strict";

export function nativeTelemetry(stat,sched,status){
  const end=stat.lastIndexOf(")"),pid=Number(stat.slice(0,stat.indexOf(" ")));assert.ok(end>0&&Number.isSafeInteger(pid)&&pid>0);
  const f=stat.slice(end+2).trim().split(/\s+/),s=sched.trim().split(/\s+/).map(Number);
  assert.ok(f.length>=37&&s.length===3&&s.every(n=>Number.isSafeInteger(n)&&n>=0));
  const number=i=>{const n=Number(f[i]);assert.ok(Number.isSafeInteger(n)&&n>=0);return n;};
  const counter=name=>{const m=status.match(new RegExp("^"+name+":\\s+(\\d+)$","m"));assert.ok(m,"Missing process counter "+name);return Number(m[1]);};
  return{pid,startTicks:number(19),minorFaults:number(7),majorFaults:number(9),cpuTicks:number(11)+number(12),processor:number(36),runtimeNs:s[0],waitNs:s[1],slices:s[2],voluntary:counter("voluntary_ctxt_switches"),involuntary:counter("nonvoluntary_ctxt_switches")};
}

export function telemetryDelta(a,b){
  assert.equal(a.pid,b.pid);assert.equal(a.startTicks,b.startTicks);
  const result={};for(const key of ["minorFaults","majorFaults","cpuTicks","runtimeNs","waitNs","slices","voluntary","involuntary"]){assert.ok(b[key]>=a[key],"Process counter regressed: "+key);result[key]=b[key]-a[key];}
  return result;
}
