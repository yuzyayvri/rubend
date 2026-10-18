import assert from "node:assert/strict";
import {spawnSync} from "node:child_process";
import {mkdtempSync,readFileSync,writeFileSync,rmSync} from "node:fs";
import {join} from "node:path";

const directory=mkdtempSync("build/h0-edge-test-"),path=join(directory,"edges.raw");
function run(program,args,status=0,includes){const r=spawnSync(program,args,{encoding:"utf8",timeout:120000,maxBuffer:4194304});assert.ifError(r.error);const output=r.stdout+r.stderr;assert.equal(r.status,status,output);if(includes)assert.ok(output.includes(includes),output);return output;}
try{
  const generation=JSON.parse(run("build/h0-edge-pilot",["--threads","1","--",path]));assert.equal(generation.placements,34650);assert.equal(generation.commutations,29937600);assert.equal(generation.goal,34629);
  const oracle=JSON.parse(run(process.execPath,["tests/h0-edge-oracle.mjs",path]));assert.equal(oracle.physicalWordsCompared,4194304);
  const bytes=readFileSync(path);assert.notEqual(bytes.readUInt32LE((65536+3)*4),0);assert.notEqual(bytes.readUInt32LE((1048576+2)*4),0);
  for(let sym=0;sym<48;sym++)assert.equal(bytes.readUInt32LE((1048576+34629*48+sym)*4),34629);
  assert.equal(JSON.parse(run("build/h0-edge-audit",["--threads","1","--",path,"0"])).audited,true);
  const negative=[];for(const[mode,code,name]of[[1,1,"invalid-placement-word"],[2,2,"move-out-of-range"],[3,3,"move-inverse-mismatch"],[4,2,"symmetry-out-of-range"],[5,3,"symmetry-inverse-mismatch"],[6,5,"noncommuting-invertible-action"],[7,7,"wrong-array-size"]])negative.push({mode,code,name,output:run("build/h0-edge-audit",["--threads","1","--",path,String(mode)],2,"code "+code)});
  writeFileSync("build/evidence/h0-edges.json",JSON.stringify({passed:true,generation,oracle,goalSymmetries:48,negative,independentReview:false},null,2)+"\n");console.log(JSON.stringify({passed:true,placements:34650,physicalWordsCompared:4194304,commutations:29937600,rejectedMutations:negative.length,goal:34629}));
}finally{rmSync(directory,{recursive:true,force:true});}
