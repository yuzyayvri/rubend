import assert from "node:assert/strict";
import {readFileSync,writeFileSync} from "node:fs";
import {createHash} from "node:crypto";
import {startFinalReplayServer,loadReplayArtifact} from "../bench/u07-final-replay-server.mjs";

assert([3,4].includes(process.argv.length));const artifactPath=process.argv[2],artifact=loadReplayArtifact(artifactPath),session=await startFinalReplayServer({artifactPath});let refusals=0;
try{
  const html=await(await fetch(session.origin+"/?record=hard-default")).text();assert(html.includes("STORED EVENT REPLAY. No solver execution."));assert(html.includes("Original timeout"));assert(html.includes('id="fixture-facelets"'));
  for(const[name,hash]of Object.entries(artifact.webAssets).filter(([name])=>name!=="index.html")){const response=await fetch(session.origin+"/"+name);assert.equal(response.status,200);assert.equal(createHash("sha256").update(Buffer.from(await response.arrayBuffer())).digest("hex"),hash);}
  const info=await(await fetch(session.origin+"/api/session")).json();assert.equal(info.solverExecution,false);const headers={Origin:session.origin,Referer:session.origin+"/?record=hard-default","Content-Type":"application/json","X-Rubend-Token":info.token},record=artifact.records[0],input={facelets:record.facelets,...record.request,id:8};
  for(const change of[{facelets:"invalid"},{mode:"exact"},{budgetMs:2000},{id:-1},{extra:true}]){assert.equal((await fetch(session.origin+"/api/solve",{method:"POST",headers,body:JSON.stringify({...input,...change})})).status,400);refusals++;}
  for(const change of[{Origin:"http://invalid.example"},{"X-Rubend-Token":"wrong"}]){assert.equal((await fetch(session.origin+"/api/solve",{method:"POST",headers:{...headers,...change},body:JSON.stringify(input)})).status,403);refusals++;}
  assert.equal((await fetch(session.origin+"/not-admitted.js")).status,404);refusals++;
  const response=await fetch(session.origin+"/api/solve",{method:"POST",headers,body:JSON.stringify(input)});assert.equal(response.headers.get("x-rubend-fixture"),"stored-ui-replay");const frames=(await response.text()).split("\n\n").filter(f=>f.startsWith("data: ")).map(f=>JSON.parse(f.slice(6)));assert(frames.some(e=>e.type==="candidate"));assert(frames.every(e=>e.id===8));assert.equal(frames.at(-1).type,"done");assert.equal(frames.at(-1).optimal,false);assert.equal(session.state.completed,1);assert.equal(session.state.nativeSolverRequests,0);
  const cancelled=await fetch(session.origin+"/api/solve",{method:"POST",headers,body:JSON.stringify({...input,id:9})});await cancelled.body.cancel();
  const comparison=await(await fetch(session.origin+"/records")).text();assert(comparison.includes("9962/10000")&&comparison.includes("inconclusive-duplicate-or-work-gate"));
}finally{await session.stop();}
assert.equal(session.state.state,"stopped-cleanly");assert.equal(session.state.activeResponses,0);assert.equal(session.state.cancelled,1);const result={passed:true,admittedWebAssets:Object.keys(artifact.webAssets).length,refusals,completedReplayRequests:session.state.completed,cancelledReplayRequests:session.state.cancelled,solverExecution:false,normalServerCleanup:true,browserAcceptance:false};if(process.argv[3])writeFileSync(process.argv[3],JSON.stringify(result,null,2)+"\n",{flag:"wx"});console.log(JSON.stringify(result));
