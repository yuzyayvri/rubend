import assert from "node:assert/strict";
import {createServer} from "node:http";
import {randomBytes} from "node:crypto";
import {readFileSync,writeFileSync,mkdirSync,renameSync} from "node:fs";
import {resolve,dirname,basename,extname} from "node:path";
import {fileHash} from "./bounded-file-hash.mjs";
import {valueDigest} from "./final-evaluation-protocol.mjs";
import {matchReplayRequest,validateReplayAssets} from "./u07-final-app-records.mjs";
import {nativeIdentity} from "./startup-measure.mjs";

const escape=text=>String(text).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
export function loadReplayArtifact(path){
  const artifact=JSON.parse(readFileSync(path)),{valueDigest:claimed,...values}=artifact;assert.equal(artifact.format,"rubend-final-app-records-v1");assert.equal(valueDigest(values),claimed);validateReplayAssets(artifact.webAssets);assert.equal(artifact.solverExecution,false);
  const id=basename(dirname(resolve(path)));assert.match(id,/^u07-final-app-data-v\d+$/);const indexPath=resolve("docs/verification/next-plan/U07",id,"index.json"),index=JSON.parse(readFileSync(indexPath));assert(index.passed&&index.workerGone&&!index.resourceStops);assert.equal(fileHash(path),index.archives.find(a=>/^\d+-records\.json\.gz$/.test(a.path)).sha256);assert.equal(fileHash(artifact.reportPath),artifact.reportSha256);for(const[name,hash]of Object.entries(artifact.webAssets))assert.equal(fileHash(artifact.installedBuild+"/web/"+name),hash);return artifact;
}

export async function startFinalReplayServer({artifactPath,statePath}){
  const artifact=loadReplayArtifact(artifactPath),records=new Map(artifact.records.map(r=>[r.id,r])),report=JSON.parse(readFileSync(artifact.reportPath)),token=randomBytes(24).toString("base64url"),active=new Map(),state={format:"rubend-final-replay-session-v1",state:"starting",startedAt:new Date().toISOString(),owner:nativeIdentity(process.pid),artifactPath:resolve(artifactPath),artifactSha256:fileHash(artifactPath),requests:[],completed:0,cancelled:0,solverExecution:false,nativeSolverRequests:0,browserTimingIsMeasurement:false,browserResourcesEnforced:false,browserPreviewHidden:true};let origin,stopping;
  const save=()=>{if(statePath){mkdirSync(dirname(resolve(statePath)),{recursive:true});const temporary=statePath+".pending";writeFileSync(temporary,JSON.stringify(state,null,2)+"\n");renameSync(temporary,statePath);}};
  const selected=req=>{const ref=new URL(req.headers.referer??origin,origin);assert.equal(ref.origin,origin);const r=records.get(ref.searchParams.get("record")??"hard-default");assert(r);return r;};
  const server=createServer(async(req,res)=>{
    res.setHeader("Cache-Control","no-store");const refuse=(code,message)=>{res.writeHead(code,{"Content-Type":"application/json"});res.end(JSON.stringify({error:message}));};
    if(req.headers.host!==new URL(origin).host||req.headers.origin&&req.headers.origin!==origin)return refuse(403,"Fixture origin refused");
    const url=new URL(req.url,origin);
    try{
      if(req.method==="GET"&&url.pathname==="/api/session"){res.writeHead(200,{"Content-Type":"application/json"});res.end(JSON.stringify({token,ready:true,state:"ready",version:1,fixture:"stored-ui-replay",solverExecution:false}));return;}
      if(req.method==="POST"&&url.pathname==="/api/solve"){
        if(req.headers.origin!==origin||req.headers["x-rubend-token"]!==token)return refuse(403,"Fixture session refused");if(!req.headers["content-type"]?.startsWith("application/json"))return refuse(415,"JSON required");let body="";for await(const chunk of req){body+=chunk;if(Buffer.byteLength(body)>8192)return refuse(413,"Fixture request too large");}
        let record,input,frames;try{record=selected(req);input=JSON.parse(body);frames=matchReplayRequest(record,input);}catch{return refuse(400,"Request does not match the admitted saved record");}
        const row={recordId:record.id,inputId:input.id,originalSlotId:record.originalSlot.id,originalStatus:record.originalStatus,terminalProjection:record.terminalProjection,startedAt:new Date().toISOString(),completed:false,cancelled:false,solverExecution:false},timers=[];state.requests.push(row);active.set(res,timers);save();res.writeHead(200,{"Content-Type":"text/event-stream; charset=utf-8","X-Rubend-Fixture":"stored-ui-replay"});res.write(": captured events, no solver execution\n\n");
        for(const[at,frame]of frames.entries())timers.push(setTimeout(()=>{if(res.destroyed)return;res.write("data: "+JSON.stringify(frame.event)+"\n\n");if(at===frames.length-1){row.completed=true;state.completed++;active.delete(res);res.end();save();}},Math.ceil(frame.atMs)));
        res.on("close",()=>{for(const timer of timers)clearTimeout(timer);active.delete(res);if(!row.completed){row.cancelled=true;state.cancelled++;save();}});return;
      }
      if(req.method!=="GET")return refuse(405,"Read-only fixture");
      if(url.pathname==="/records"){
        const rows=report.aggregate.summary.filter(r=>r.population==="quality").map(r=>`<tr><td>${escape(r.actorId)}</td><td>${r.answeredByDeadline}/${r.planned}</td><td>${r.solutionHtm?.median??"n/a"}</td><td>${r.errors}</td><td>${escape(r.contract)}</td></tr>`).join("");res.writeHead(200,{"Content-Type":"text/html; charset=utf-8"});res.end(`<html><head><title>Frozen comparison records</title></head><body><h1>Frozen comparison records</h1><p>Read-only inspection. No solver execution. Same HTM inputs, four GiB, one search thread, nice 10, no swap.</p><p>Performance verdict ${escape(report.noise.verdict)}. Exact-return and first-answer contracts differ. Failures remain included. No formal optimized-search certificate.</p><table border="1" cellpadding="12"><thead><tr><th>Configuration</th><th>Answers/planned</th><th>Median HTM</th><th>Errors</th><th>Contract</th></tr></thead><tbody>${rows}</tbody></table><p>Source report SHA256 ${artifact.reportSha256}</p><p>Optional preserved tiers are controls, not a shipped GUI selector. No selected larger exact-tier promotion.</p></body></html>`);return;
      }
      if(url.pathname==="/__fixture/diagnostics.mjs"){res.writeHead(200,{"Content-Type":"text/javascript"});res.end(readFileSync("tests/fixtures/ui-diagnostics.mjs"));return;}
      const name=url.pathname==="/"?"index.html":url.pathname.slice(1);if(!Object.hasOwn(artifact.webAssets,name))return refuse(404,"Not an admitted installed asset");const path=artifact.installedBuild+"/web/"+name;assert.equal(fileHash(path),artifact.webAssets[name]);let bytes=readFileSync(path);const type={".html":"text/html; charset=utf-8",".js":"text/javascript",".css":"text/css",".svg":"image/svg+xml",".map":"application/json"}[extname(name)];
      if(name==="index.html"){const record=records.get(url.searchParams.get("record")??"hard-default");if(!record)return refuse(404,"Unknown saved record");const banner=`<aside id="replay-provenance" style="padding:12px;background:#fff2b2;color:#191919;border:3px solid #333;font:14px sans-serif"><strong>STORED EVENT REPLAY. No solver execution. Replay time is not a measurement.</strong><p>${escape(record.actorId)}. Original ${escape(record.originalStatus)}, ${record.request.budgetMs} ms, ${escape(record.contract)}. Interval ${record.best.lower} to ${record.best.moves.length} HTM. Fixture terminal projection ${record.terminalProjection}.</p><p>Input <code id="fixture-facelets">${record.facelets}</code>. Mode <span id="fixture-mode">${record.request.mode}</span>.</p><nav>${[...records.values()].map(r=>`<a href="/?record=${r.id}">${escape(r.id)}</a>`).join(" | ")} | <a href="/records">Matched records</a></nav><p>Slot ${record.originalSlot.id}. Configuration ${record.configurationSha256}.</p></aside>`;bytes=Buffer.from(bytes.toString("utf8").replace("<body>","<body>"+banner).replace("</body>",'<script type="module" src="/__fixture/diagnostics.mjs"></script></body>'));}
      res.writeHead(200,{"Content-Type":type??"application/octet-stream"});res.end(bytes);
    }catch(error){state.error=String(error);save();if(!res.headersSent)refuse(500,"Saved-record fixture refused");else res.end();}
  });
  await new Promise((done,reject)=>{server.once("error",reject);server.listen(0,"127.0.0.1",done);});origin="http://127.0.0.1:"+server.address().port;state.origin=origin;state.state="ready";save();
  const stop=()=>stopping??=(async()=>{for(const[res,timers]of active){for(const timer of timers)clearTimeout(timer);res.destroy();}server.closeAllConnections();await new Promise(done=>server.close(done));state.state="stopped-cleanly";state.activeResponses=active.size;state.finishedAt=new Date().toISOString();save();return state;})();
  return{origin,state,stop};
}

if(process.argv[1]&&resolve(process.argv[1])===resolve(import.meta.filename)){assert.equal(process.argv.length,5);assert.equal(process.argv[2],"serve");const session=await startFinalReplayServer({artifactPath:process.argv[3],statePath:resolve(process.argv[4])});for(const signal of["SIGTERM","SIGINT"])process.once(signal,()=>session.stop().then(()=>process.exit(0)));console.log(JSON.stringify({ready:true,origin:session.origin,solverExecution:false,statePath:resolve(process.argv[4])}));}
