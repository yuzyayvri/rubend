import assert from "node:assert/strict";
import {spawnSync} from "node:child_process";
import {mkdtempSync,readFileSync,writeFileSync,rmSync} from "node:fs";
import {join} from "node:path";

const directory=mkdtempSync("build/h0-class-test-"),path=join(directory,"classes.raw");
function run(program,args,status=0,includes) {
  const result=spawnSync(program,args,{encoding:"utf8",timeout:120000,maxBuffer:4194304});
  assert.ifError(result.error);
  const output=result.stdout+result.stderr;
  assert.equal(result.status,status,output);
  if(includes)assert.ok(output.includes(includes),output);
  return output;
}
try {
  const generated=run("build/h0-class-pilot",["--threads","1","--",path]).trim().split("\n").map(JSON.parse);
  assert.equal(generated.at(-1).classes,3393);assert.equal(generated.at(-1).visited,153090);
  assert.equal(generated.at(-1).rawRoundtrips,153090);assert.equal(generated.at(-1).stabilizerAudit,true);
  const oracle=JSON.parse(run(process.execPath,["tests/h0-class-oracle.mjs",path]));
  assert.equal(oracle.passed,true);
  for(let i=0;i<2;i++)assert.deepEqual(JSON.parse(run("build/h0-class-audit",["--threads","1","--",path,"0"])),{audited:true,checked:153090});
  const negative=[];
  for(const [mode,code,name] of [[1,1,"out-of-range-transform"],[2,5,"out-of-range-representative"],[3,9,"missing-stabilizer-identity"],[4,9,"invalid-high-stabilizer-bits"],[5,8,"wrong-array-size"],[6,8,"false-completion-count"]]) {
    const output=run("build/h0-class-audit",["--threads","1","--",path,String(mode)],2,"code "+code);
    negative.push({mode,code,name,output});
  }
  const report={passed:true,generation:generated.at(-1),oracle,auditIdempotent:true,negative,sourceHashesNote:"Final source identities are recorded with the unit evidence",independentReview:false};
  writeFileSync("build/evidence/h0-classes.json",JSON.stringify(report,null,2)+"\n");
  console.log(JSON.stringify({passed:true,classes:3393,rawRoundtrips:153090,physicalWordsCompared:oracle.physicalWordsCompared,stabilizerAudit:true,auditIdempotent:true,rejectedMutations:negative.length}));
} finally {rmSync(directory,{recursive:true,force:true});}
