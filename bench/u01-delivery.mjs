import assert from "node:assert/strict";
import {readFileSync,writeFileSync,mkdirSync,openSync,closeSync,existsSync,lstatSync,createReadStream} from "node:fs";
import {resolve} from "node:path";
import {spawn,spawnSync,execFileSync} from "node:child_process";
import {createHash} from "node:crypto";
import {createGunzip} from "node:zlib";
import {Transform} from "node:stream";
import {pipeline} from "node:stream/promises";
import {inputs} from "../scripts/manifest.mjs";

const [mode,id]=process.argv.slice(2);assert.equal(process.argv.length,4);assert.ok(["plan","check","deliver"].includes(mode));assert.match(id,/^u01-delivery-[a-z0-9-]+$/);
const pinned={runId:39291425745,artifactId:12205837803,commit:"a7a087235b20b38767b216b0ab90523ac1a2b13f"};
const zipSha256="e32162972ca3d36a17125fc069862d5ca7f5e3709228b3148d84b9f62ecdcb84",directory=resolve("build/experiments",id),hash=p=>createHash("sha256").update(readFileSync(p)).digest("hex"),save=(name,value)=>writeFileSync(resolve(directory,name),JSON.stringify(value,null,2)+"\n",{flag:"wx"});
function run(program,args,env={}){const r=spawnSync(program,args,{encoding:"utf8",timeout:120000,maxBuffer:4*1024*1024,env:{...process.env,GH_DEBUG:"",...env}});assert.ifError(r.error);assert.equal(r.status,0,r.stderr||program+" failed");return r.stdout.trim();}
if(mode==="plan"){
  const sourceHashes={};for(const p of execFileSync("git",["ls-files","-z"],{encoding:"utf8"}).split("\0").filter(Boolean))sourceHashes[p]=hash(p);
  const jobs=[{id:"focused",memoryMiB:4096,seconds:120,cpus:[2],command:[process.execPath,"bench/u01-delivery.mjs","check",id]},{id:"delivery",memoryMiB:4096,seconds:600,cpus:[2],command:[process.execPath,"bench/u01-delivery.mjs","deliver",id]}],path=resolve("build/evidence",id+"-plan.json");
  writeFileSync(path,JSON.stringify({format:"rubend-background-tests-v1",id,root:process.cwd(),revision:run("git",["rev-parse","HEAD"]),sourceHashes,jobs,expectedMinutes:5,queueHardLimitMinutes:12,scope:"Download the pinned successful CI artifact, verify its GitHub ZIP digest and delivered checksums, import only into a fresh private Nix store, and exercise installed package HTTP/replay/cancellation in an empty mount namespace. No host-store import, rebuild, system change, publication, or browser acceptance claim."},null,2)+"\n",{flag:"wx"});console.log(JSON.stringify({path,expectedMinutes:5,maximumMinutes:12}));process.exit(0);
}
if(mode==="check"){
  for(const test of["http-args","package"])console.log(run(process.execPath,["tests/"+test+".mjs"]));
  console.log(run("just",["check"]));
  console.log(run("bwrap",["--unshare-user","--uid","0","--gid","0","--ro-bind","/","/","--proc","/proc","--dev","/dev","true"]));save("focused.json",{passed:true,explicitArguments:true,hostNamespaceProbe:true,packageManifest:true});process.exit(0);
}
const runRecord=JSON.parse(run("gh",["api",`repos/yuzyayvri/rubend/actions/runs/${pinned.runId}`]));assert.equal(runRecord.conclusion,"success");assert.equal(runRecord.head_sha,pinned.commit);assert.equal(runRecord.event,"push");
const all=JSON.parse(run("gh",["api",`repos/yuzyayvri/rubend/actions/runs/${pinned.runId}/artifacts`])),artifact=all.artifacts.find(a=>a.id===pinned.artifactId);assert.ok(artifact);assert.equal(artifact.expired,false);assert.equal(artifact.name,"rubend-x86_64-linux-"+pinned.commit);assert.equal(artifact.digest,"sha256:"+zipSha256);
save("provenance.json",{...pinned,runConclusion:runRecord.conclusion,runUrl:runRecord.html_url,artifact:{id:artifact.id,name:artifact.name,sizeBytes:artifact.size_in_bytes,digest:artifact.digest},sourceHashes:inputs()});
const zip=resolve(directory,"delivery.zip"),fd=openSync(zip,"wx");let downloaded;
try{downloaded=spawnSync("gh",["api",`repos/yuzyayvri/rubend/actions/artifacts/${pinned.artifactId}/zip`],{stdio:["ignore",fd,"pipe"],encoding:"utf8",timeout:120000,env:{...process.env,GH_DEBUG:""}});}finally{closeSync(fd);}assert.ifError(downloaded.error);assert.equal(downloaded.status,0,downloaded.stderr);assert.equal(hash(zip),zipSha256);
const expected=["LICENSE","README.md","SHA256SUMS","THIRD_PARTY_NOTICES.md","commit.txt","rubend-x86_64-linux.nar.gz","store-path.txt"],entries=run("unzip",["-Z1",zip]).split("\n");assert.deepEqual(entries.sort(),expected);
const delivery=resolve(directory,"delivery");mkdirSync(delivery);run("unzip",["-q",zip,"-d",delivery]);for(const name of expected)assert.equal(lstatSync(resolve(delivery,name)).isFile(),true);
const sums=readFileSync(resolve(delivery,"SHA256SUMS"),"utf8").trim().split("\n"),checked=[];
for(const line of sums){const m=line.match(/^([a-f0-9]{64})  ([A-Za-z0-9_.-]+)$/);assert.ok(m);assert.ok(expected.includes(m[2])&&m[2]!=="SHA256SUMS");assert.equal(hash(resolve(delivery,m[2])),m[1]);checked.push(m[2]);}assert.deepEqual(checked.sort(),expected.filter(p=>p!=="SHA256SUMS"));assert.equal(readFileSync(resolve(delivery,"commit.txt"),"utf8").trim(),pinned.commit);
const packagePath=readFileSync(resolve(delivery,"store-path.txt"),"utf8").trim();assert.match(packagePath,/^\/nix\/store\/[a-z0-9]{32}-rubend-[A-Za-z0-9._-]+$/);
const storeRoot=resolve(directory,"store-root");assert.equal(existsSync(storeRoot),false);mkdirSync(storeRoot);run("nix-store",["--store",storeRoot,"--init"]);
const importer=spawn("nix-store",["--store",storeRoot,"--import"],{stdio:["pipe","pipe","pipe"]});let imported="",importErrors="",narBytes=0;importer.stdout.on("data",d=>imported+=d);importer.stderr.on("data",d=>importErrors+=d);const finished=new Promise(done=>{importer.once("error",error=>done({error}));importer.once("close",(code,signal)=>done({code,signal}));});
try{await pipeline(createReadStream(resolve(delivery,"rubend-x86_64-linux.nar.gz")),createGunzip(),new Transform({transform(chunk,encoding,done){narBytes+=chunk.length;done(narBytes>2147483648?Error("NAR exceeds two-GiB admission"):null,chunk);}}),importer.stdin);}catch(error){importer.kill("SIGTERM");await finished;throw error;}
const result=await finished;assert.ifError(result.error);assert.equal(result.code,0,importErrors);assert.equal(result.signal,null);const requisites=run("nix-store",["--store",storeRoot,"--query","--requisites",packagePath]).split("\n");assert.ok(requisites.includes(packagePath));for(const p of requisites){assert.match(p,/^\/nix\/store\/[a-z0-9]{32}-[^/]+$/);assert.equal(existsSync(storeRoot+p),true);}
const installedBuild=storeRoot+packagePath+"/share/rubend/build";console.log(run(process.execPath,["tests/package.mjs",installedBuild]));assert.deepEqual(JSON.parse(readFileSync(installedBuild+"/manifest.json","utf8")).sourceHashes,inputs());
const args=["--unshare-user","--uid","0","--gid","0","--unshare-pid","--die-with-parent","--new-session","--ro-bind",storeRoot+"/nix","/nix","--proc","/proc","--dev","/dev","--tmpfs","/tmp","--dir","/work","--chdir","/work","--clearenv","--setenv","HOME","/tmp","--setenv","TMPDIR","/tmp","--setenv","PORT","0",packagePath+"/bin/rubend"];
console.log(run(process.execPath,["tests/http.mjs"],{RUBEND_APP_COMMAND:"bwrap",RUBEND_APP_ARGS:JSON.stringify(args)}));const http=JSON.parse(readFileSync("build/evidence/http.json","utf8"));assert.equal(http.passed,true);
save("delivery.json",{passed:true,...pinned,zipSha256,verifiedDeliveryFiles:checked,narBytes,importedPaths:imported.trim().split("\n").filter(Boolean),requisites,privateStore:storeRoot,hostStoreMounted:false,repositoryMounted:false,environmentCleared:true,logicalStorePath:packagePath,packageManifest:true,sourceGraphIdentical:true,http,browserAcceptance:false,independentReview:false});console.log(JSON.stringify({passed:true,artifactId:pinned.artifactId,privateStore:true,installedHttp:true,browserClaim:false}));
