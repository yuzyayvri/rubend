import assert from "node:assert/strict";
import {spawnSync} from "node:child_process";
import {fileURLToPath} from "node:url";

const mode=process.argv[2];assert.ok(["direct","nested","child","fail"].includes(mode));let checksum=17,childCpuMicros=0;
if(mode==="nested"){
  const child=spawnSync(process.execPath,[fileURLToPath(import.meta.url),"child"],{encoding:"utf8",timeout:10000,maxBuffer:1024*1024});assert.ifError(child.error);assert.equal(child.status,0,child.stderr);assert.equal(child.signal,null);const result=JSON.parse(child.stdout);assert.equal(result.mode,"child");childCpuMicros=result.ownCpuMicros;
}
const target=mode==="nested"?150000:mode==="fail"?100000:250000,start=process.cpuUsage();let used;
do{for(let i=0;i<8192;i++)checksum=(Math.imul(checksum,1664525)+1013904223)>>>0;used=process.cpuUsage(start);}while(used.user+used.system<target);
const own=process.cpuUsage();console.log(JSON.stringify({mode,checksum,targetCpuMicros:target,burnCpuMicros:used.user+used.system,ownCpuMicros:own.user+own.system,childCpuMicros}));console.error("fixture-stderr-"+mode);if(mode==="fail")process.exitCode=7;
