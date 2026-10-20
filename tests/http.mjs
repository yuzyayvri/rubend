import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { writeFileSync, mkdirSync } from "node:fs";
import { apply, solved } from "../apps/model.mjs";

const appArgs=process.env.RUBEND_APP_COMMAND?JSON.parse(process.env.RUBEND_APP_ARGS??"[]"):["apps/server.mjs"];
assert.ok(Array.isArray(appArgs)&&appArgs.every(a=>typeof a==="string"&&!a.includes("\0")),"App arguments must be an array of strings without NUL");
const child=spawn(process.env.RUBEND_APP_COMMAND??process.execPath,appArgs,{cwd:process.env.RUBEND_APP_COMMAND?"/tmp":process.cwd(),stdio:["ignore","pipe","pipe"],env:{...process.env,PORT:"0"}});
let errors="";child.stderr.on("data",d=>errors+=d);
try{
 const origin=await new Promise((resolve,reject)=>{let out="";child.stdout.on("data",d=>{out+=d;const m=out.match(/Rubend local: (http:\/\/127\.0\.0\.1:\d+)/);if(m)resolve(m[1]);});child.once("exit",()=>reject(Error(errors)));});
 const get=path=>fetch(`${origin}${path}`);
 const session=await(await get("/api/session")).json();
 const post=(body,headers={})=>fetch(`${origin}/api/solve`,{method:"POST",headers:{"Content-Type":"application/json","Origin":origin,"X-Rubend-Token":session.token,...headers},body:JSON.stringify(body)});
 assert.equal((await get("/")).status,200);
 assert.ok((await get("/")).headers.get("content-security-policy").includes("frame-ancestors 'none'"));
 assert.equal((await fetch(`${origin}/api/session`,{headers:{Origin:"https://example.com"}})).status,403);
 assert.equal((await post({facelets:solved,mode:"fast",budgetMs:100},{"X-Rubend-Token":"wrong"})).status,403);
 assert.equal((await post({facelets:"U".repeat(54),mode:"fast",budgetMs:100})).status,400);
 assert.equal((await post({facelets:solved,mode:"fast",budgetMs:999999})).status,400);
 assert.equal((await post({facelets:solved,mode:"fast",budgetMs:100,executable:"bad"})).status,400);
 const response=await post({facelets:apply(solved,[3,0,5,2]),mode:"exact",budgetMs:1000,id:7});assert.equal(response.status,200);
 const text=await response.text(),events=text.split("\n\n").filter(s=>s.startsWith("data: ")).map(s=>JSON.parse(s.slice(6)));
 assert.equal(events.at(-1).type,"done");assert.equal(events.at(-1).optimal,1);assert.ok(events.some(e=>e.type==="candidate"&&e.length===4));assert.ok(events.every(e=>e.id===7));
 const controller=new AbortController();
 const cancelling=await fetch(`${origin}/api/solve`,{method:"POST",headers:{"Content-Type":"application/json","Origin":origin,"X-Rubend-Token":session.token},body:JSON.stringify({facelets:apply(solved,[0,3,6,9,12,15]),mode:"exact",budgetMs:15000}),signal:controller.signal});
 assert.equal(cancelling.status,200);controller.abort();
 const started=performance.now();let recovered=false;
 while(performance.now()-started<5000){const s=await(await get("/api/session")).json();if(s.ready){const r=await post({facelets:solved,mode:"exact",budgetMs:100});if(r.status===200){const t=await r.text();assert.ok(t.includes('"length":0'));recovered=true;break;}}await new Promise(resolve=>setTimeout(resolve,20));}
 assert.ok(recovered,"Cancellation did not recover");
 mkdirSync("build/evidence",{recursive:true});writeFileSync("build/evidence/http.json",JSON.stringify({passed:true,originAndSessionGuards:true,invalidInput:true,sseSolve:true,abortRecoveryMs:Math.round(performance.now()-started)},null,2));
 console.log("HTTP: origin/session protection, input limits, streamed solve, and abort recovery passed.");
}finally{child.kill("SIGTERM");await once(child,"exit");}
