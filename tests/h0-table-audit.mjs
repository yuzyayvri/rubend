import assert from "node:assert/strict";
import {spawnSync} from "node:child_process";
import {writeFileSync} from "node:fs";

const modes=[7,6,5,3,3,1,2,4,1,null],records=[];
assert.equal(process.argv.length,5,"Expected fresh class, edge, and metadata fixtures");
for(let mode=0;mode<modes.length;mode++){
  const r=spawnSync("build/h0-table-audit-test",["--threads","1","--",...process.argv.slice(2),String(mode)],{encoding:"utf8",timeout:120000,maxBuffer:4194304});
  assert.ifError(r.error);assert.equal(r.status,0,r.stdout+r.stderr);const value=JSON.parse(r.stdout.trim());
  if(mode===9){assert.equal(value.failed,false);assert.equal(value.complete,false);assert.equal(value.index,450430);}
  else{assert.equal(value.failed,true);assert.equal(value.code,modes[mode],JSON.stringify({mode,value}));}
  records.push({mode,...value});
}
writeFileSync("build/evidence/h0-table-audit.json",JSON.stringify({passed:true,negative:records.slice(0,9),positive:records[9],fullTableAudited:false,independentReview:false},null,2)+"\n");console.log(JSON.stringify({passed:true,rejections:9,goalNodePasses:true}));
