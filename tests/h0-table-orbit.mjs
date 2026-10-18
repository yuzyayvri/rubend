import assert from "node:assert/strict";
import {spawnSync} from "node:child_process";
import {mkdtempSync,readFileSync,writeFileSync,rmSync} from "node:fs";
import {join} from "node:path";

assert.equal(process.argv.length,5,"Expected fresh class, edge, and metadata fixtures");
const args=["--threads","1","--",...process.argv.slice(2)];
function run(program,args,status=0){const r=spawnSync(program,args,{encoding:"utf8",timeout:120000,maxBuffer:4194304});assert.ifError(r.error);const output=r.stdout+r.stderr;assert.equal(r.status,status,output);return output;}
const positive=JSON.parse(run("build/h0-table-orbit-test",args));assert.equal(positive.equivalent,5);assert.ok(positive.orbitMembers>1);
const directory=mkdtempSync("build/h0-orbit-mutation-");
try{
  const source=readFileSync("src/h0-table.bend","utf8"),needle="orbit(48n, 0, (target / 34650";assert.equal(source.split(needle).length,2);
  writeFileSync(join(directory,"core.bend"),source.replace(needle,"orbit(1n, 0, (target / 34650").replaceAll("import ./","import ../../src/"));
  writeFileSync(join(directory,"test.bend"),readFileSync("tests/h0-table-orbit.bend","utf8").replace("import ../src/h0-table.bend as B","import ./core.bend as B").replaceAll("import ../src/","import ../../src/"));
  run("bend",[join(directory,"test.bend"),"-o",join(directory,"mutant")]);
  const negative=run(join(directory,"mutant"),args,2);assert.ok(negative.includes('"equivalent":255'));assert.ok(negative.includes('"orbitMembers":1'));assert.ok(negative.includes("Missing stabilizer-equivalent edge"));
  writeFileSync("build/evidence/h0-table-orbit.json",JSON.stringify({passed:true,positive,negative,mutation:"Actual orbit expansion shortened from forty-eight symmetries to identity only",independentReview:false},null,2)+"\n");
  console.log(JSON.stringify({passed:true,positive,missingOrbitUpdateRejected:true}));
}finally{rmSync(directory,{recursive:true,force:true});}
