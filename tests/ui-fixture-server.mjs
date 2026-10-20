import assert from "node:assert/strict";
import {spawn} from "node:child_process";
import {createServer,request} from "node:http";
import {chmodSync,mkdtempSync,readFileSync,rmSync,writeFileSync,mkdirSync,existsSync} from "node:fs";
import {tmpdir} from "node:os";
import {resolve} from "node:path";
import {proxyTarget} from "./support/ui-proxy.mjs";
import {nativeIdentity} from "../bench/startup-measure.mjs";
import {inputs} from "../scripts/manifest.mjs";

const mode=process.argv[2],runId=process.argv[3];assert.ok(["delayed","model-failure","rewind-failure","bad-protocol","acceptance","fallback"].includes(mode));assert.ok(process.argv.length===3||process.argv.length===4);if(runId)assert.match(runId,/^u0[01]-live-[a-z0-9-]+$/);
const directory=mkdtempSync(resolve(tmpdir(),"rubend-ui-fixture-")),env={...process.env,PORT:"0",RUBEND_BINARY:resolve("build/rubend")};
const evidence=runId?resolve("build/evidence/next-plan",runId.startsWith("u01")?"U01":"U00",runId):null;if(evidence){assert.equal(existsSync(evidence),false);mkdirSync(evidence,{recursive:true});}
const state={format:"rubend-ui-fixture-session-v1",mode,state:"starting",startedAt:new Date().toISOString(),wrapper:nativeIdentity(process.pid),sourceHashes:inputs(),native:[]};
const save=()=>{if(evidence)writeFileSync(resolve(evidence,"session.json"),JSON.stringify(state,null,2)+"\n");};save();
if(mode==="bad-protocol")Object.assign(env,{RUBEND_BINARY:resolve("tests/fixtures/lifecycle-worker.mjs"),RUBEND_LIFECYCLE_MODE:"bad-protocol",RUBEND_LIFECYCLE_LOG:resolve(evidence??directory,"native.jsonl")});
if(mode==="delayed"){
  const cache=resolve(directory,"cache.raw"),fixture=resolve("tests/fixtures/startup-worker.mjs");writeFileSync(cache,Buffer.alloc(4096,1));chmodSync(fixture,0o755);
  Object.assign(env,{RUBEND_BINARY:fixture,RUBEND_STARTUP_FIXTURE_CACHE:cache,RUBEND_STARTUP_FIXTURE_MODE:"ok",RUBEND_STARTUP_FIXTURE_DELAY_MS:"25000"});
}
const child=spawn(process.execPath,["apps/server.mjs"],{stdio:["ignore","pipe","pipe"],env});
const stopped=new Promise(done=>child.once("close",done));
let stderr="",server,closing=false;child.stderr.on("data",bytes=>{stderr=(stderr+bytes).slice(-4000);});
async function close(){
  if(closing)return;closing=true;server?.closeAllConnections();server?.close();
  child.kill("SIGTERM");await stopped;rmSync(directory,{recursive:true,force:true});
  state.cleanup=state.native.map(n=>({pid:n.pid,ownerGone:nativeIdentity(n.pid)?.startTicks!==n.startTicks,ipcRemoved:n.ipcDirectory?!existsSync(n.ipcDirectory):false}));state.state=state.cleanup.every(r=>r.ownerGone&&r.ipcRemoved)?"stopped-cleanly":"failed";state.finishedAt=new Date().toISOString();save();
}
process.on("SIGTERM",()=>close().then(()=>process.exit(0)));process.on("SIGINT",()=>close().then(()=>process.exit(0)));
try{
  const upstream=await new Promise((done,reject)=>{
    let text="";child.stdout.on("data",bytes=>{text+=bytes;const found=text.match(/Rubend local: (http:\/\/127\.0\.0\.1:\d+)/);if(found)done(new URL(found[1]));});
    child.once("exit",()=>reject(Error(stderr)));
  });
  let origin;
  state.server=nativeIdentity(child.pid);state.native=readFileSync(`/proc/${child.pid}/task/${child.pid}/children`,"utf8").trim().split(/\s+/).filter(Boolean).map(Number).flatMap(pid=>{const identity=nativeIdentity(pid);if(!identity)return[];const fifo=readFileSync(`/proc/${pid}/cmdline`,"utf8").split("\0").find(a=>a.endsWith("/input")&&a.includes("rubend-"));return[{...identity,ipcDirectory:fifo?resolve(fifo,".."):null}];});
  server=createServer((req,res)=>{
    if(["acceptance","fallback"].includes(mode))res.setHeader("Permissions-Policy","clipboard-write=()");
    const target=proxyTarget(req.headers,req.url,origin,upstream);if(!target){res.writeHead(403);res.end();return;}
    if(req.url==="/__test/diagnostics.mjs"){res.writeHead(200,{"Content-Type":"text/javascript","Cache-Control":"no-store"});res.end(readFileSync("tests/fixtures/ui-diagnostics.mjs"));return;}
    if(["acceptance","fallback"].includes(mode)&&req.url==="/__test/setup.js"){res.writeHead(200,{"Content-Type":"text/javascript","Cache-Control":"no-store"});res.end("const rubendTestFallback="+String(mode==="fallback")+";\n"+readFileSync("tests/fixtures/ui-acceptance-setup.js","utf8"));return;}
    if(["model-failure","rewind-failure"].includes(mode)&&req.url==="/worker.js"){
      res.writeHead(200,{"Content-Type":"text/javascript","Cache-Control":"no-store"});
      res.end('let rubendFixtureApplies=0;self.addEventListener("message",event=>{if(event.data.type==="apply"&&++rubendFixtureApplies==='+String(mode==="rewind-failure"?2:1)+'){event.stopImmediatePropagation();throw Error("Deliberate cube-worker fixture failure");}});\n'+readFileSync("build/web/worker.js","utf8"));return;
    }
    const headers={...req.headers,host:upstream.host};if(headers.origin)headers.origin=upstream.origin;
    const forwarded=request(target,{method:req.method,headers},response=>{
      if(req.url==="/"){let html="";response.setEncoding("utf8");response.on("data",data=>html+=data);response.on("end",()=>{const headers={...response.headers};delete headers["content-length"];res.writeHead(response.statusCode,headers);if(["acceptance","fallback"].includes(mode))html=html.replace("<head>",'<head><script src="/__test/setup.js"></script>');res.end(html.replace("</body>",'<script type="module" src="/__test/diagnostics.mjs"></script></body>'));});}
      else{res.writeHead(response.statusCode,response.headers);response.pipe(res);}
    });
    forwarded.on("error",error=>{if(!res.headersSent)res.writeHead(502);res.end(error.message);});req.pipe(forwarded);res.on("close",()=>forwarded.destroy());
  });
  server.listen(0,"127.0.0.1",()=>{origin=new URL(`http://127.0.0.1:${server.address().port}`);state.origin=origin.origin;state.state="ready";save();console.log(`Rubend UI fixture ${mode}: ${origin.origin}`);});
}catch(error){await close();throw error;}
