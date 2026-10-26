import assert from "node:assert/strict";
import {existsSync} from "node:fs";
import {nativeIdentity} from "./startup-measure.mjs";

export async function settleOwnedProcesses(owners,limitMs=1000){
  assert.ok(Array.isArray(owners));assert.ok(Number.isInteger(limitMs)&&limitMs>=1&&limitMs<=5000);
  for(const o of owners){assert.ok(Number.isSafeInteger(o.pid)&&o.pid>0);assert.match(o.startTicks,/^\d+$/);assert.ok(o.ipcDirectory===null||typeof o.ipcDirectory==="string");}
  const started=performance.now(),snapshot=()=>owners.map(o=>({pid:o.pid,startTicks:o.startTicks,ownerGone:nativeIdentity(o.pid)?.startTicks!==o.startTicks,pidRootIpcPathGone:o.ipcDirectory?!existsSync(o.ipcDirectory):null})),initial=snapshot();
  return{initial,cleanup:initial,complete:initial.every(o=>o.ownerGone&&o.pidRootIpcPathGone!==false),elapsedMs:performance.now()-started,limitMs,samples:1};
}
