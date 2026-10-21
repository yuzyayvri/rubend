import assert from "node:assert/strict";
import {readFileSync,writeFileSync,mkdirSync,renameSync,existsSync} from "node:fs";
import {resolve,dirname} from "node:path";
import {spawn} from "node:child_process";
import {createServer,request} from "node:http";
import {createHash} from "node:crypto";
import {inputs} from "../scripts/manifest.mjs";
import {nativeIdentity} from "./startup-measure.mjs";
import {proxyTarget} from "../tests/support/ui-proxy.mjs";

const [id,specPath,profileId]=process.argv.slice(2);assert.ok(process.argv.length===3||process.argv.length===5);assert.match(id,/^u0[01]-live-[a-z0-9-]+$/);
const root=process.cwd(),directory=resolve("build/evidence/next-plan",id.startsWith("u01")?"U01":"U00",id);assert.equal(existsSync(directory),false);mkdirSync(directory,{recursive:true});
const hash=path=>createHash("sha256").update(readFileSync(path)).digest("hex"),manifest=JSON.parse(readFileSync("build/manifest.json","utf8"));assert.deepEqual(manifest.sourceHashes,inputs());
const baseline=resolve("build/experiments/u00-controls-v1/control");assert.equal(hash(resolve(baseline,"build/rubend")),manifest.nativeSha256);assert.equal(hash("build/rubend"),manifest.nativeSha256);
let profile=null;
if(specPath){const spec=JSON.parse(readFileSync(specPath,"utf8"));assert.equal(spec.format,"rubend-u00-profile-spec-v1");profile=spec.profiles.find(p=>p.id===profileId);assert.ok(profile,"Unknown sealed profile");const metadata=JSON.parse(readFileSync(profile.binary+".json","utf8"));assert.equal(hash(profile.binary),metadata.binarySha256);for(const [path,expected]of Object.entries(metadata.sourceHashes))assert.equal(hash(path),expected);}
const state={format:"rubend-u00-live-session-v1",state:"starting",startedAt:new Date().toISOString(),wrapper:nativeIdentity(process.pid),binarySha256:profile?hash(profile.binary):manifest.nativeSha256,profile,sourceHashes:inputs(),servers:[],timingClaim:false};
const statusPath=resolve(directory,"session.json"),save=()=>{const pending=statusPath+".tmp";writeFileSync(pending,JSON.stringify(state,null,2)+"\n");renameSync(pending,statusPath);};save();
const processes=[],proxies=[];let closing=false,finish;const stop=new Promise(done=>{finish=done;});
function children(pid){
  try{return readFileSync(`/proc/${pid}/task/${pid}/children`,"utf8").trim().split(/\s+/).filter(Boolean).map(Number).map(pid=>{
    const identity=nativeIdentity(pid),args=readFileSync("/proc/"+pid+"/cmdline","utf8").split("\0"),fifo=args.find(a=>a.endsWith("/input")&&a.includes("rubend-"));return{...identity,ipcDirectory:fifo?dirname(fifo):null};
  });}catch{return[];}
}
for(const signal of["SIGINT","SIGTERM"])process.on(signal,()=>finish(signal));
const timer=setTimeout(()=>finish("session-time-limit"),540000);
try{
  for(const [role,cwd]of(profile?[["head",root]]:[["baseline",baseline],["head",root]])){
    const env={...process.env,PORT:"0",RUBEND_BINARY:profile?profile.binary:resolve(cwd,"build/rubend")};
    for(const key of["RUBEND_APP_COMMAND","RUBEND_JOINT_CACHE","RUBEND_CORNER_CACHE","RUBEND_H0_CACHE","RUBEND_H0_META_CACHE","RUBEND_CORNER_POLICY","RUBEND_H0_POLICY","RUBEND_SEGMENTED_POLICY"])delete env[key];
    Object.assign(env,profile?.env);
    const child=spawn(process.execPath,["apps/server.mjs"],{cwd,env,stdio:["ignore","pipe","pipe"]});
    const row={role,server:nativeIdentity(child.pid),root:cwd,origin:null,native:[],stderr:""};state.servers.push(row);
    const closed=new Promise(done=>child.once("close",(code,signal)=>{row.exitCode=code;row.signal=signal;if(!closing)finish("unexpected-server-exit");done();}));processes.push({child,closed,row});
    child.stderr.on("data",data=>{row.stderr=(row.stderr+data).slice(-4000);});
    row.origin=await new Promise((done,reject)=>{let text="";child.stdout.on("data",data=>{text+=data;const match=text.match(/Rubend local: (http:\/\/127\.0\.0\.1:\d+)/);if(match)done(match[1]);});child.once("error",reject);child.once("exit",()=>reject(Error(row.stderr||"Server exited before listening")));});
    row.native=children(child.pid);assert.ok(row.native.length>0);
    const upstream=new URL(row.origin);let publicOrigin;
    const proxy=createServer((req,res)=>{
      const target=proxyTarget(req.headers,req.url,publicOrigin,upstream);if(!target){res.writeHead(403);res.end();return;}
      if(req.url==="/__test/diagnostics.mjs"){res.writeHead(200,{"Content-Type":"text/javascript","Cache-Control":"no-store"});res.end(readFileSync("tests/fixtures/ui-diagnostics.mjs"));return;}
      const headers={...req.headers,host:upstream.host};if(headers.origin)headers.origin=upstream.origin;
      const forwarded=request(target,{method:req.method,headers},response=>{
        if(req.url==="/"){let html="";response.setEncoding("utf8");response.on("data",data=>html+=data);response.on("end",()=>{const headers={...response.headers};delete headers["content-length"];res.writeHead(response.statusCode,headers);res.end(html.replace("</body>",'<script type="module" src="/__test/diagnostics.mjs"></script></body>'));});}
        else{res.writeHead(response.statusCode,response.headers);response.pipe(res);}
      });forwarded.on("error",error=>{if(!res.headersSent)res.writeHead(502);res.end(error.message);});req.pipe(forwarded);res.on("close",()=>forwarded.destroy());
    });
    await new Promise(done=>proxy.listen(0,"127.0.0.1",done));proxies.push(proxy);publicOrigin=new URL(`http://127.0.0.1:${proxy.address().port}`);row.upstream=row.origin;row.origin=publicOrigin.origin;row.diagnosticBridgeSha256=hash("tests/fixtures/ui-diagnostics.mjs");save();console.log(JSON.stringify({role,origin:row.origin,statusPath}));
  }
  state.state="ready";save();state.stopReason=await stop;
}catch(error){state.error=String(error.stack??error);state.stopReason="startup-failure";}
finally{
  for(const row of state.servers)row.beforeStop=row.native.map(n=>({pid:n.pid,ownerRetained:nativeIdentity(n.pid)?.startTicks===n.startTicks}));
  closing=true;clearTimeout(timer);for(const proxy of proxies){proxy.closeAllConnections();proxy.close();}for(const p of processes)p.child.kill("SIGTERM");
  const force=setTimeout(()=>{for(const p of processes){p.child.kill("SIGKILL");for(const n of p.row.native){const current=nativeIdentity(n.pid);if(current?.startTicks===n.startTicks)try{process.kill(n.pid,"SIGKILL");}catch{}}}},3000);
  await Promise.all(processes.map(p=>p.closed));clearTimeout(force);
  for(const row of state.servers)row.cleanup=row.native.map(n=>({pid:n.pid,ownerGone:nativeIdentity(n.pid)?.startTicks!==n.startTicks,ipcRemoved:n.ipcDirectory?!existsSync(n.ipcDirectory):false}));
  state.state=!state.error&&state.servers.every(r=>r.exitCode===0&&r.cleanup.every(c=>c.ownerGone&&c.ipcRemoved))?"stopped-cleanly":"failed";state.finishedAt=new Date().toISOString();save();process.exitCode=state.state==="stopped-cleanly"?0:1;
}
