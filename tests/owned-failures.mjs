import assert from "node:assert/strict";
import {spawnSync} from "node:child_process";
import {resolve} from "node:path";

const binary=resolve("build/owned-failures-test");
for(const mode of[null,"legacy","controlled"]){
  const result=spawnSync(binary,["--threads","1",...mode?[mode]:[]],{encoding:"utf8",timeout:10000,maxBuffer:1048576});
  assert.ifError(result.error);assert.equal(result.signal,null);
  assert.equal(result.status,mode?2:0,result.stdout+result.stderr);
  if(mode){assert.match(result.stderr,/Owned continuation failure 1/);assert.doesNotMatch(result.stdout,/"type":"done"|"optimal":1/);}
  else assert.equal(JSON.parse(result.stdout).passed,true);
}
console.log(JSON.stringify({passed:true,portfolioFailure:true,stickyRestart:true,descriptorOrder:true,runtimeFailurePaths:2,noSuccessfulTerminalOutput:true}));
