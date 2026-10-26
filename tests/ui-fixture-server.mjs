import assert from "node:assert/strict";
import {spawn} from "node:child_process";
import {createServer,request} from "node:http";
import {chmodSync,mkdtempSync,readFileSync,rmSync,writeFileSync,mkdirSync,existsSync} from "node:fs";
import {tmpdir} from "node:os";
import {resolve} from "node:path";
import {proxyTarget} from "./support/ui-proxy.mjs";
import {nativeIdentity} from "../bench/startup-measure.mjs";
import {inputs} from "../scripts/manifest.mjs";
import {createHash} from "node:crypto";
import {deliveryPin} from "../bench/delivery-pins.mjs";
import {fileHash} from "../bench/bounded-file-hash.mjs";
import {localPackageLaunch} from "../bench/local-package-launch.mjs";
import {settleOwnedProcesses} from "../bench/owned-process-settlement.mjs";

const mode=process.argv[2],runId=process.argv[3],deliveryRunId=process.argv[4]??"u01-delivery-v1";assert.ok(["normal","delayed","model-failure","rewind-failure","bad-protocol","acceptance","fallback","policy-only","delivered","local-delivered","design-sheet","design-ledger"].includes(mode));assert.ok(process.argv.length===3||process.argv.length===4||(process.argv.length===5&&["delivered","local-delivered"].includes(mode)));if(runId)assert.match(runId,/^u0[01]-live-[a-z0-9-]+$/);assert.match(deliveryRunId,mode==="local-delivered"?/^u07-delivery-http-[a-z0-9-]+$/:/^u01-delivery-[a-z0-9-]+$/);
const directory=mkdtempSync(resolve(tmpdir(),"rubend-ui-fixture-")),env={...process.env,PORT:"0",RUBEND_BINARY:resolve("build/rubend")};
const evidence=runId?resolve("build/evidence/next-plan",runId.startsWith("u01")?"U01":"U00",runId):null;if(evidence){assert.equal(existsSync(evidence),false);mkdirSync(evidence,{recursive:true});}
const state={format:"rubend-ui-fixture-session-v1",mode,state:"starting",startedAt:new Date().toISOString(),wrapper:nativeIdentity(process.pid),sourceHashes:inputs(),native:[]};
const design=mode.startsWith("design-")?mode.slice(7):null;
if(mode==="normal")assert.deepEqual(JSON.parse(readFileSync("build/manifest.json","utf8")).sourceHashes,inputs(),"Rebuild the app before normal GUI checks");
if(design)state.prototype={visualOnly:true,html:"docs/design/prototypes/sheet.html",css:"docs/design/prototypes/"+design+".css",controllerSourceHashes:JSON.parse(readFileSync("build/manifest.json","utf8")).sourceHashes};
const save=()=>{if(evidence)writeFileSync(resolve(evidence,"session.json"),JSON.stringify(state,null,2)+"\n");};save();
if(mode==="bad-protocol")Object.assign(env,{RUBEND_BINARY:resolve("tests/fixtures/lifecycle-worker.mjs"),RUBEND_LIFECYCLE_MODE:"bad-protocol",RUBEND_LIFECYCLE_LOG:resolve(evidence??directory,"native.jsonl")});
if(mode==="delayed"){
  const cache=resolve(directory,"cache.raw"),fixture=resolve("tests/fixtures/startup-worker.mjs");writeFileSync(cache,Buffer.alloc(4096,1));chmodSync(fixture,0o755);
  Object.assign(env,{RUBEND_BINARY:fixture,RUBEND_STARTUP_FIXTURE_CACHE:cache,RUBEND_STARTUP_FIXTURE_MODE:"ok",RUBEND_STARTUP_FIXTURE_DELAY_MS:"25000"});
}
let program=process.execPath,args=["apps/server.mjs"];
if(mode==="delivered"){
  const d=JSON.parse(readFileSync(resolve("build/experiments",deliveryRunId,"delivery.json"),"utf8")),pin=deliveryPin(d.pinName);assert.equal(d.passed,true);for(const k of["runId","artifactId","commit","zipSha256"])assert.equal(d[k],pin[k],"Delivered identity mismatch: "+k);assert.equal(d.privateStore,resolve("build/experiments",deliveryRunId,"store-root"));assert.match(d.logicalStorePath,/^\/nix\/store\/[a-z0-9]{32}-rubend-[A-Za-z0-9._-]+$/);
  const build=d.privateStore+d.logicalStorePath+"/share/rubend/build",manifest=JSON.parse(readFileSync(build+"/manifest.json","utf8"));assert.deepEqual(manifest.sourceHashes,inputs());assert.equal(createHash("sha256").update(readFileSync(build+"/rubend")).digest("hex"),manifest.nativeSha256);state.delivery={artifactId:d.artifactId,logicalStorePath:d.logicalStorePath,privateStore:d.privateStore,hostStoreMounted:false,repositoryMounted:false};
  program="bwrap";args=["--unshare-user","--uid","0","--gid","0","--unshare-pid","--die-with-parent","--new-session","--ro-bind",d.privateStore+"/nix","/nix","--proc","/proc","--dev","/dev","--tmpfs","/tmp","--dir","/work","--chdir","/work","--clearenv","--setenv","HOME","/tmp","--setenv","TMPDIR","/tmp","--setenv","PORT","0",d.logicalStorePath+"/bin/rubend"];
}
if(mode==="local-delivered"){
  const receiptPath=resolve("build/experiments",deliveryRunId,"delivery.json"),d=JSON.parse(readFileSync(receiptPath,"utf8")),index=JSON.parse(readFileSync(resolve("docs/verification/next-plan/U07",deliveryRunId,"index.json"),"utf8"));assert.equal(index.passed,true);assert.equal(index.id,deliveryRunId);assert.equal(index.workerGone,true);assert.equal(index.resourceStops,false);assert.equal(fileHash(receiptPath),index.archives.find(a=>/^\d+-delivery\.json\.gz$/.test(a.path)).sha256);assert.equal(d.format,"rubend-local-nix-delivery-v1");assert.equal(d.passed,true);assert.equal(d.localBuild,true);assert.equal(d.githubArtifact,false);assert.equal(d.httpRunId,deliveryRunId);assert.equal(d.installedHttpPassed,true);assert.match(d.exportImportRunId,/^u07-delivery-[a-z0-9-]+$/);assert.equal(d.privateStore,resolve("build/experiments",d.exportImportRunId,"runtime-store"));assert.deepEqual(d.sourceHashes,inputs());assert.equal(fileHash(d.narPath),d.narSha256);
  const build=d.privateStore+d.logicalStorePath+"/share/rubend/build",manifest=JSON.parse(readFileSync(build+"/manifest.json","utf8"));assert.deepEqual(manifest.sourceHashes,inputs());assert.equal(manifest.nativeSha256,d.nativeSha256);assert.equal(fileHash(build+"/rubend"),d.nativeSha256);for(const[p,h]of Object.entries(manifest.artifacts))assert.equal(fileHash(build+"/"+p),h);state.delivery={localBuild:true,githubArtifact:false,httpRunId:deliveryRunId,sourceRevision:d.sourceRevision,narSha256:d.narSha256,nativeSha256:d.nativeSha256,logicalStorePath:d.logicalStorePath,privateStore:d.privateStore,hostStoreMounted:false,repositoryMounted:false};const launch=localPackageLaunch(process.cwd(),d.privateStore,d.logicalStorePath);program=launch.program;args=launch.args;
}
const child=spawn(program,args,{stdio:["ignore","pipe","pipe"],env});
const stopped=new Promise(done=>child.once("close",(code,signal)=>done({code,signal})));
let stderr="",server,stopping;child.stderr.on("data",bytes=>{stderr=(stderr+bytes).slice(-4000);});
function isolatedNatives(pid){
  let children;try{children=readFileSync(`/proc/${pid}/task/${pid}/children`,"utf8").trim().split(/\s+/).filter(Boolean).map(Number);}catch{return[];}
  return children.flatMap(pid=>{const identity=nativeIdentity(pid);if(!identity)return[];let args;try{args=readFileSync(`/proc/${pid}/cmdline`,"utf8").split("\0");}catch{return[];}if(args.includes(state.delivery.logicalStorePath+"/share/rubend/apps/server.mjs"))state.application=identity;const fifo=args.find(a=>a.endsWith("/input")&&a.includes("rubend-")),ipcDirectory=fifo?`/proc/${pid}/root`+resolve(fifo,".."):null;if(mode==="local-delivered")state.owned.push({...identity,ipcDirectory});return fifo?[{...identity,ipcDirectory,isolated:true}]:isolatedNatives(pid);});
}
function close(){
  if(stopping)return stopping;stopping=(async()=>{server?.closeAllConnections();server?.close();
  state.forcedStop=false;const force=setTimeout(()=>{state.forcedStop=true;child.kill("SIGKILL");},3000);
  if(state.application&&nativeIdentity(state.application.pid)?.startTicks===state.application.startTicks)process.kill(state.application.pid,"SIGTERM");else child.kill("SIGTERM");state.wrapperExit=await stopped;clearTimeout(force);rmSync(directory,{recursive:true,force:true});if(mode==="local-delivered")state.ownedSettlement=await settleOwnedProcesses(state.owned??[],1000);
  state.cleanup=state.native.map(n=>({pid:n.pid,ownerGone:nativeIdentity(n.pid)?.startTicks!==n.startTicks,ipcRemoved:n.ipcDirectory?!existsSync(n.ipcDirectory):false}));state.applicationGone=!state.application||nativeIdentity(state.application.pid)?.startTicks!==state.application.startTicks;state.state=!state.forcedStop&&state.applicationGone&&state.cleanup.every(r=>r.ownerGone&&r.ipcRemoved)&&(mode!=="local-delivered"||state.ownedSettlement.complete&&state.wrapperExit.code===0&&state.wrapperExit.signal===null)?"stopped-cleanly":"failed";state.finishedAt=new Date().toISOString();save();})();return stopping;
}
process.on("SIGTERM",()=>close().then(()=>process.exit(state.state==="stopped-cleanly"?0:1)));process.on("SIGINT",()=>close().then(()=>process.exit(state.state==="stopped-cleanly"?0:1)));
try{
  const upstream=await new Promise((done,reject)=>{
    let text="";child.stdout.on("data",bytes=>{text+=bytes;const found=text.match(/Rubend local: (http:\/\/127\.0\.0\.1:\d+)/);if(found)done(new URL(found[1]));});
    child.once("exit",()=>reject(Error(stderr)));
  });
  let origin;
  state.server=nativeIdentity(child.pid);if(mode==="local-delivered")state.owned=[{...state.server,ipcDirectory:null}];state.native=["delivered","local-delivered"].includes(mode)?isolatedNatives(child.pid):readFileSync(`/proc/${child.pid}/task/${child.pid}/children`,"utf8").trim().split(/\s+/).filter(Boolean).map(Number).flatMap(pid=>{const identity=nativeIdentity(pid);if(!identity)return[];const fifo=readFileSync(`/proc/${pid}/cmdline`,"utf8").split("\0").find(a=>a.endsWith("/input")&&a.includes("rubend-"));return[{...identity,ipcDirectory:fifo?resolve(fifo,".."):null}];});assert.ok(state.native.length>0,"No native owner observed");if(["delivered","local-delivered"].includes(mode))assert.ok(state.application,"No installed application owner observed");if(mode==="local-delivered")for(const n of state.native){n.runningNativeSha256=fileHash("/proc/"+n.pid+"/exe");assert.equal(n.runningNativeSha256,state.delivery.nativeSha256);}if(mode==="local-delivered")state.repositoryUnavailableInsideNamespace=!existsSync("/proc/"+state.application.pid+"/root"+process.cwd());if(mode==="local-delivered")assert.equal(state.repositoryUnavailableInsideNamespace,true);
  server=createServer((req,res)=>{
    if(["acceptance","fallback","policy-only"].includes(mode))res.setHeader("Permissions-Policy","clipboard-write=()");
    const target=proxyTarget(req.headers,req.url,origin,upstream);if(!target){res.writeHead(403);res.end();return;}
    if(design&&(req.url==="/style.css"||req.url==="/__test/sheet-base.css")){res.writeHead(200,{"Content-Type":"text/css","Cache-Control":"no-store"});res.end(readFileSync(req.url==="/__test/sheet-base.css"?"docs/design/prototypes/sheet.css":state.prototype.css));return;}
    if(req.url==="/__test/diagnostics.mjs"){res.writeHead(200,{"Content-Type":"text/javascript","Cache-Control":"no-store"});res.end(readFileSync("tests/fixtures/ui-diagnostics.mjs"));return;}
    if(mode==="policy-only"&&req.url==="/__test/clipboard-policy.js"){res.writeHead(200,{"Content-Type":"text/javascript","Cache-Control":"no-store"});res.end(readFileSync("tests/fixtures/clipboard-policy-observation.js"));return;}
    if(["acceptance","fallback"].includes(mode)&&req.url==="/__test/setup.js"){res.writeHead(200,{"Content-Type":"text/javascript","Cache-Control":"no-store"});res.end("const rubendTestFallback="+String(mode==="fallback")+";\n"+readFileSync("tests/fixtures/ui-acceptance-setup.js","utf8"));return;}
    if(["model-failure","rewind-failure"].includes(mode)&&req.url==="/worker.js"){
      res.writeHead(200,{"Content-Type":"text/javascript","Cache-Control":"no-store"});
      res.end('let rubendFixtureApplies=0;self.addEventListener("message",event=>{if(event.data.type==="apply"&&++rubendFixtureApplies==='+String(mode==="rewind-failure"?2:1)+'){event.stopImmediatePropagation();throw Error("Deliberate cube-worker fixture failure");}});\n'+readFileSync("build/web/worker.js","utf8"));return;
    }
    const headers={...req.headers,host:upstream.host};if(headers.origin)headers.origin=upstream.origin;
    const forwarded=request(target,{method:req.method,headers},response=>{
      if(req.url==="/"){let html="";response.setEncoding("utf8");response.on("data",data=>html+=data);response.on("end",()=>{const headers={...response.headers};delete headers["content-length"];res.writeHead(response.statusCode,headers);if(design)html=readFileSync(state.prototype.html,"utf8");if(["acceptance","fallback"].includes(mode))html=html.replace("<head>",'<head><script src="/__test/setup.js"></script>');if(mode==="policy-only")html=html.replace("<head>",'<head><script src="/__test/clipboard-policy.js"></script>');res.end(html.replace("</body>",'<script type="module" src="/__test/diagnostics.mjs"></script></body>'));});}
      else{res.writeHead(response.statusCode,response.headers);response.pipe(res);}
    });
    forwarded.on("error",error=>{if(!res.headersSent)res.writeHead(502);res.end(error.message);});req.pipe(forwarded);res.on("close",()=>forwarded.destroy());
  });
  server.listen(0,"127.0.0.1",()=>{origin=new URL(`http://127.0.0.1:${server.address().port}`);state.origin=origin.origin;state.state="ready";save();console.log(`Rubend UI fixture ${mode}: ${origin.origin}`);});
}catch(error){await close();throw error;}
