import assert from "node:assert/strict";
import {existsSync} from "node:fs";
import {nativeIdentity} from "./startup-measure.mjs";

export async function settleOwnedProcesses(owners,limitMs=1000){
  assert.ok(Array.isArray(owners));assert.ok(Number.isInteger(limitMs)&&limitMs>=1&&limitMs<=5000);
  for(const o of owners){assert.ok(Number.isSafeInteger(o.pid)&&o.pid>0);assert.match(o.startTicks,/^\d+$/);assert.ok(o.ipcDirectory===null||typeof o.ipcDirectory==="string");}
  const started=performance.now(),snapshot=()=>owners.map(o=>({pid:o.pid,startTicks:o.startTicks,ownerGone:nativeIdentity(o.pid)?.startTicks!==o.startTicks,pidRootIpcPathGone:o.ipcDirectory?!existsSync(o.ipcDirectory):null})),initial=snapshot();
  let cleanup=initial,samples=1;const complete=()=>cleanup.every(o=>o.ownerGone&&o.pidRootIpcPathGone!==false);
  while(!complete()&&performance.now()-started<limitMs){await new Promise(done=>setTimeout(done,Math.min(10,Math.max(1,limitMs-(performance.now()-started)))));cleanup=snapshot();samples++;}
  return{initial,cleanup,complete:complete(),elapsedMs:performance.now()-started,limitMs,samples};
}
