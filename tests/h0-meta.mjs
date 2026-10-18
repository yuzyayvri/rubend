import assert from "node:assert/strict";
import {spawnSync} from "node:child_process";
import {mkdtempSync,writeFileSync,rmSync} from "node:fs";
import {join} from "node:path";

const directory=mkdtempSync("build/h0-meta-test-"),classes=join(directory,"classes.raw"),edges=join(directory,"edges.raw"),distances=join(directory,"distances.raw"),meta=join(directory,"meta.raw");
function run(program,args,status=0,includes){const r=spawnSync(program,args,{encoding:"utf8",timeout:120000,maxBuffer:4194304});assert.ifError(r.error);const output=r.stdout+r.stderr;assert.equal(r.status,status,output);if(includes)assert.ok(output.includes(includes),output);return output;}
try{
  run("build/h0-class-pilot",["--threads","1","--",classes]);run("build/h0-edge-pilot",["--threads","1","--",edges]);run("build/h0-distance-pilot",["--threads","1","--",distances]);
  const generated=JSON.parse(run("build/h0-meta-pilot",["--threads","1","--",classes,edges,meta]));assert.equal(generated.complete,true);assert.equal(generated.words,2892000);
  const oracle=JSON.parse(run(process.execPath,["tests/h0-meta-oracle.mjs",classes,edges,distances,meta]));assert.equal(oracle.goal,450429);
  const args=["--threads","1","--",classes,edges,meta];assert.deepEqual(JSON.parse(run("build/h0-meta-audit",[...args,"0"])),{audited:true,words:2892000});
  const negative=[];for(const[mode,code,name]of[[1,1,"wrong-format"],[2,1,"invalid-class-map"],[3,1,"missing-stabilizer"],[4,1,"invalid-corner-move"],[5,1,"invalid-edge-move"],[6,1,"invalid-edge-symmetry"],[7,4,"wrong-array-size"],[8,3,"incomplete-corners"],[9,3,"incomplete-edges"]])negative.push({mode,code,name,output:run("build/h0-meta-audit",[...args,String(mode)],2,"code "+code)});
  writeFileSync("build/evidence/h0-meta.json",JSON.stringify({passed:true,generation:generated,oracle,negative,independentReview:false},null,2)+"\n");console.log(JSON.stringify({passed:true,wordsCompared:2892000,goal:450429,rejectedMutations:negative.length}));
}finally{rmSync(directory,{recursive:true,force:true});}
