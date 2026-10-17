import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { resolve, extname, relative, isAbsolute } from "node:path";
import { randomBytes, timingSafeEqual } from "node:crypto";
import { Engine } from "./engine.mjs";
import { validate } from "./model.mjs";

const root = resolve("build/web");
const token = randomBytes(32).toString("hex");
const engine = new Engine();
const contentTypes={".html":"text/html; charset=utf-8",".mjs":"text/javascript; charset=utf-8",".js":"text/javascript; charset=utf-8",".css":"text/css; charset=utf-8",".map":"application/json",".svg":"image/svg+xml"};
let address;
const server=createServer(async(req,res)=>{
  res.setHeader("X-Content-Type-Options","nosniff");
  res.setHeader("Cross-Origin-Resource-Policy","same-origin");
  res.setHeader("Referrer-Policy","no-referrer");
  res.setHeader("Content-Security-Policy","default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; connect-src 'self'; worker-src 'self' blob:; object-src 'none'; base-uri 'none'; frame-ancestors 'none'");
  res.setHeader("Cache-Control","no-store");
  const fail=(status,message)=>{if(!res.headersSent){res.writeHead(status,{"Content-Type":"application/json"});res.end(JSON.stringify({error:message}));}else res.end();};
  try {
    if(req.headers.host!==address.host) return fail(403,"Invalid host");
    const url=new URL(req.url,address);
    if(req.headers.origin && req.headers.origin!==address.origin) return fail(403,"Invalid origin");
    if(req.headers["sec-fetch-site"] && !["same-origin","none"].includes(req.headers["sec-fetch-site"])) return fail(403,"Cross-site requests are not allowed");
    if(req.method==="GET" && url.pathname==="/api/session") {
      res.writeHead(200,{"Content-Type":"application/json"});return res.end(JSON.stringify({token,ready:engine.available,version:1}));
    }
    if(req.method==="POST" && url.pathname==="/api/solve") {
      const provided=Buffer.from(String(req.headers["x-rubend-token"]??""));
      if(req.headers.origin!==address.origin || provided.length!==token.length || !timingSafeEqual(provided,Buffer.from(token))) return fail(403,"Invalid session");
      if(!req.headers["content-type"]?.startsWith("application/json")) return fail(415,"JSON required");
      let body="";
      for await(const chunk of req) {body+=chunk;if(Buffer.byteLength(body)>8192)return fail(413,"Input too large");}
      const input=JSON.parse(body);
      if(!input||Object.keys(input).some(k=>!["facelets","mode","budgetMs","id"].includes(k)))return fail(400,"Unsupported request");
      validate(input.facelets);
      if(engine.job)return fail(409,"Engine is busy");
      if(!["fast","exact"].includes(input.mode)||!Number.isInteger(input.budgetMs)||input.budgetMs<50||input.budgetMs>30000)return fail(400,"Invalid budget or mode");
      let ended=false;
      let cancel;
      res.on("close",()=>{if(!ended){ended=true;cancel?.();}});
      res.writeHead(200,{"Content-Type":"text/event-stream; charset=utf-8","Connection":"keep-alive"});
      res.write(": rubend\n\n");
      cancel=await engine.solve(input,event=>{
        if(ended)return;
        res.write(`data: ${JSON.stringify({...event,id:input.id})}\n\n`);
        if(["done","invalid","error"].includes(event.type)){ended=true;res.end();}
      });
      if(ended)cancel();
      return;
    }
    if(req.method!=="GET")return fail(405,"Method not allowed");
    const path=resolve(root,`.${decodeURIComponent(url.pathname==="/"?"/index.html":url.pathname)}`);
    const local=relative(root,path);
    if(local.startsWith("..")||isAbsolute(local))return fail(403,"Invalid path");
    if(!(await stat(path)).isFile())return fail(404,"Not found");
    res.writeHead(200,{"Content-Type":contentTypes[extname(path)]??"application/octet-stream"});
    res.end(await readFile(path));
  } catch(error) {fail(error.code==="ENOENT"?404:400,error.message);}
});
server.listen(Number(process.env.PORT??0),"127.0.0.1",()=>{
  address=new URL(`http://127.0.0.1:${server.address().port}`);
  console.log(`Rubend local: ${address.origin}`);
});
function close(){const stopped=engine.close();server.closeAllConnections();server.close(async()=>{await stopped;process.exit(0);});}
process.on("SIGTERM",close);
process.on("SIGINT",close);
