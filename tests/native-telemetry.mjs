import assert from "node:assert/strict";
import {nativeTelemetry,telemetryDelta} from "../bench/native-telemetry.mjs";

const fields=Array(40).fill("0");fields[0]="S";for(const [i,n]of [[7,11],[9,2],[11,8],[12,3],[19,900],[36,2]])fields[i]=String(n);
const raw="123 (native ) control) "+fields.join(" "),status="voluntary_ctxt_switches:\t4\nnonvoluntary_ctxt_switches:\t7\n";
const a=nativeTelemetry(raw,"1000000 200000 4",status);assert.equal(a.pid,123);assert.equal(a.cpuTicks,11);assert.equal(a.minorFaults,11);assert.equal(a.majorFaults,2);assert.equal(a.processor,2);assert.equal(a.startTicks,900);
assert.deepEqual(a,{pid:123,startTicks:900,minorFaults:11,majorFaults:2,cpuTicks:11,processor:2,runtimeNs:1000000,waitNs:200000,slices:4,voluntary:4,involuntary:7});
assert.deepEqual(telemetryDelta(a,{...a,runtimeNs:3000000,waitNs:500000}),{minorFaults:0,majorFaults:0,cpuTicks:0,runtimeNs:2000000,waitNs:300000,slices:0,voluntary:0,involuntary:0});
assert.throws(()=>nativeTelemetry(raw,"0 0",status));assert.throws(()=>nativeTelemetry(raw,"0 0 0",""));assert.throws(()=>telemetryDelta(a,{...a,startTicks:901}));assert.throws(()=>telemetryDelta(a,{...a,minorFaults:0}));
console.log(JSON.stringify({passed:true,telemetryNegativeControls:4}));
