import assert from "node:assert/strict";
import {spawn,spawnSync} from "node:child_process";
import {mkdtempSync,writeFileSync,existsSync,rmSync} from "node:fs";
import {tmpdir} from "node:os";
import {resolve} from "node:path";
import {pathToFileURL} from "node:url";

const temporary=mkdtempSync(resolve(tmpdir(),"rubend-artifact-lease-")),client=resolve(temporary,"client.mjs"),marker=resolve(temporary,"wrote");
writeFileSync(client,`import {withArtifactLease} from ${JSON.stringify(pathToFileURL(resolve("scripts/artifact-lease.mjs")).href)};
import {writeFileSync} from "node:fs";
import {spawnSync} from "node:child_process";
withArtifactLease();
if(process.argv[2]==="hold"){console.log("lease-ready");setTimeout(()=>process.exit(17),1500);}
else if(process.argv[2]==="nested"){const r=spawnSync(process.execPath,[process.argv[1],"write"],{stdio:"inherit"});process.exit(r.status??1);}
else writeFileSync(${JSON.stringify(marker)},"written");
`);
let child;
try{
  child=spawn(process.execPath,[client,"hold"],{cwd:temporary,stdio:["ignore","pipe","pipe"]});
  const exited=new Promise((resolve,reject)=>{child.on("error",reject);child.on("exit",(code,signal)=>resolve({code,signal}));});
  await new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(Error("Lease fixture never became ready")),5000);child.stdout.on("data",chunk=>{if(chunk.toString().includes("lease-ready")){clearTimeout(timer);resolve();}});child.on("error",reject);child.on("exit",()=>{clearTimeout(timer);reject(Error("Lease fixture exited before ready"));});});
  const busy=spawnSync(process.execPath,[client,"write"],{cwd:temporary,encoding:"utf8",timeout:1000});assert.equal(busy.status,73);assert.match(busy.stderr,/artifacts are in use/);assert.equal(existsSync(marker),false);
  assert.deepEqual(await exited,{code:17,signal:null});
  const after=spawnSync(process.execPath,[client,"nested"],{cwd:temporary,encoding:"utf8",timeout:2000});assert.equal(after.status,0,after.stderr);assert.equal(existsSync(marker),true);
  console.log(JSON.stringify({passed:true,concurrentWriterRejected:true,noWriteOnConflict:true,leaseReleasedAfterFailure:true,nestedOwnerAllowed:true}));
}finally{
  if(child&&child.exitCode===null)await new Promise(resolve=>child.on("exit",resolve));
  rmSync(temporary,{recursive:true,force:true});
}
