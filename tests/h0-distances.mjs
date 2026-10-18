import assert from "node:assert/strict";
import {spawnSync} from "node:child_process";
import {mkdtempSync,writeFileSync,rmSync} from "node:fs";
import {join} from "node:path";

const directory=mkdtempSync("build/h0-distance-test-"),classes=join(directory,"classes.raw"),distances=join(directory,"distances.raw");
function run(program,args,status=0,includes){
  const result=spawnSync(program,args,{encoding:"utf8",timeout:120000,maxBuffer:4194304});assert.ifError(result.error);
  const output=result.stdout+result.stderr;assert.equal(result.status,status,output);if(includes)assert.ok(output.includes(includes),output);return output;
}
try{
  run("build/h0-class-pilot",["--threads","1","--",classes]);
  const generated=JSON.parse(run("build/h0-distance-pilot",["--threads","1","--",distances]));
  assert.equal(generated.rawStates,153090);assert.equal(generated.classes,3393);assert.equal(generated.rawEdgesAudited,2755620);assert.equal(generated.rawClassDistancesEqual,true);
  const oracle=JSON.parse(run(process.execPath,["tests/h0-distance-oracle.mjs",classes,distances]));assert.equal(oracle.physicalWordsCompared,1048576);
  const valid=JSON.parse(run("build/h0-distance-audit",["--threads","1","--",distances,"0"]));assert.deepEqual(valid,{audited:true,maximum:9,sum:984482});
  const negative=[];
  for(const[mode,code,name]of[[1,3,"nonzero-goal"],[2,3,"unknown-distance"],[3,2,"raw-class-disagreement"],[4,4,"edge-overestimate"],[5,1,"out-of-range-transition"],[6,5,"no-decreasing-successor"],[7,6,"wrong-distance-array"],[8,6,"wrong-transition-array"],[9,6,"raw-only-incomplete"]])negative.push({mode,code,name,output:run("build/h0-distance-audit",["--threads","1","--",distances,String(mode)],2,"code "+code)});
  writeFileSync("build/evidence/h0-distances.json",JSON.stringify({passed:true,generation:generated,oracle,negative,independentReview:false},null,2)+"\n");
  console.log(JSON.stringify({passed:true,rawStates:153090,classes:3393,physicalWordsCompared:1048576,edgesAudited:2755620,rejectedMutations:negative.length,maximum:9}));
}finally{rmSync(directory,{recursive:true,force:true});}
