import assert from "node:assert/strict";
import {spawn} from "node:child_process";
import {createServer,request} from "node:http";
import {chmodSync,mkdtempSync,readFileSync,rmSync,writeFileSync} from "node:fs";
import {tmpdir} from "node:os";
import {resolve} from "node:path";

const mode=process.argv[2];assert.ok(["delayed","model-failure"].includes(mode));
const directory=mkdtempSync(resolve(tmpdir(),"rubend-ui-fixture-")),env={...process.env,PORT:"0",RUBEND_BINARY:resolve("build/rubend")};
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
}
process.on("SIGTERM",()=>close().then(()=>process.exit(0)));process.on("SIGINT",()=>close().then(()=>process.exit(0)));
try{
  const upstream=await new Promise((done,reject)=>{
    let text="";child.stdout.on("data",bytes=>{text+=bytes;const found=text.match(/Rubend local: (http:\/\/127\.0\.0\.1:\d+)/);if(found)done(new URL(found[1]));});
    child.once("exit",()=>reject(Error(stderr)));
  });
  let origin;
  server=createServer((req,res)=>{
    if(req.headers.host!==origin.host||req.headers.origin&&req.headers.origin!==origin.origin||!req.url.startsWith("/")||req.url.startsWith("//")){res.writeHead(403);res.end();return;}
    if(mode==="model-failure"&&req.url==="/worker.js"){
      res.writeHead(200,{"Content-Type":"text/javascript","Cache-Control":"no-store"});
      res.end('self.addEventListener("message",event=>{if(event.data.type==="apply"){event.stopImmediatePropagation();throw Error("Deliberate cube-worker fixture failure");}});\n'+readFileSync("build/web/worker.js","utf8"));return;
    }
    const headers={...req.headers,host:upstream.host};if(headers.origin)headers.origin=upstream.origin;
    const forwarded=request(new URL(req.url,upstream),{method:req.method,headers},response=>{res.writeHead(response.statusCode,response.headers);response.pipe(res);});
    forwarded.on("error",error=>{if(!res.headersSent)res.writeHead(502);res.end(error.message);});req.pipe(forwarded);res.on("close",()=>forwarded.destroy());
  });
  server.listen(0,"127.0.0.1",()=>{origin=new URL(`http://127.0.0.1:${server.address().port}`);console.log(`Rubend UI fixture ${mode}: ${origin.origin}`);});
}catch(error){await close();throw error;}
