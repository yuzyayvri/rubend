import assert from "node:assert/strict";
import {spawnSync} from "node:child_process";
import {mkdtempSync,writeFileSync,rmSync} from "node:fs";
import {tmpdir} from "node:os";
import {resolve} from "node:path";

const directory=mkdtempSync(resolve(tmpdir(),"rubend-fixed-inputs-"));
try{
  const control=resolve(directory,"control"),mutable=resolve(directory,"mutable"),output=resolve(directory,"result.json");
  const body=`import {readFileSync,appendFileSync} from "node:fs";
const rows=readFileSync(process.argv.at(-1),"utf8").trim().split("\\n");
if(process.argv[1].endsWith("mutable"))appendFileSync(process.argv[1],"\\n");
for(const row of rows){const [id,,request]=row.split("\\t");console.log(JSON.stringify({type:"snapshot",id,request:Number(request),slice:0,nodes:0,moves:[],length:31,lower:0,status:0,state:[[],Number(request),[]]}));}
`;
  for(const path of [control,mutable])writeFileSync(path,`#!${process.execPath}\n${body}`,{mode:0o755});
  const run=candidate=>spawnSync(process.execPath,["bench/fixed-work.mjs","--reference",control,"--candidate",candidate,"--slices","0","--output",output],{encoding:"utf8",timeout:10000,maxBuffer:1048576});
  const stable=run(control);assert.equal(stable.status,0,stable.stderr);
  const changed=run(mutable);assert.notEqual(changed.status,0,"A mutated binary must not receive a successful comparison");
  assert.match(changed.stderr,/changed during execution/);
  const notFile=run(directory);assert.notEqual(notFile.status,0);assert.match(notFile.stderr,/regular file/);
  console.log("Fixed-work input sealing rejects binary mutation and non-files.");
}finally{rmSync(directory,{recursive:true,force:true});}
