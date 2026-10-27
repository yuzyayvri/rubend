import assert from "node:assert/strict";
import {readFileSync,writeFileSync,mkdirSync} from "node:fs";
import {resolve} from "node:path";
import {loadAdmittedEvaluationFreeze} from "./evaluation-freeze-admission.mjs";
import {normalizeMeasuredEvaluation} from "./measured-evaluation-record.mjs";
import {valueDigest} from "./final-evaluation-protocol.mjs";
import {fileHash} from "./bounded-file-hash.mjs";
import {loadCorpus} from "./corpus.mjs";
import {apply,solved} from "./fixed-work-model.mjs";
import {apply as bendApply} from "../apps/model.mjs";
import {inputs} from "../scripts/manifest.mjs";

export function validateReplayAssets(assets){
  assert(assets&&typeof assets==="object"&&!Array.isArray(assets));
  for(const name of["index.html","main.js","worker.js","style.css","favicon.svg"])assert.match(assets[name]??"",/^[a-f0-9]{64}$/,"Missing admitted installed web asset "+name);
  for(const[name,hash]of Object.entries(assets)){assert.match(name,/^[a-z0-9][a-z0-9.-]*$/);assert.match(hash,/^[a-f0-9]{64}$/);}
  return true;
}

export function projectSavedRecord(envelope,item,actor){
  assert.equal(envelope.format,"rubend-measured-evaluation-envelope-v1");
  assert.equal(envelope.slot.actorId,actor.id);assert.equal(envelope.slot.caseId,item.id);
  assert.equal(envelope.inputSha256,valueDigest(item.facelets));assert.equal(envelope.configurationSha256,actor.configurationSha256);assert.equal(envelope.requestMode,actor.requestMode);
  const raw=envelope.observation;assert(raw&&["ok","timeout"].includes(raw.status));assert.equal(raw.status,envelope.status);assert.equal(raw.budgetMs,envelope.slot.budgetMs);
  const eligible=raw.candidates.filter(c=>c.atMs<=raw.budgetMs);assert(eligible.length>0);
  for(const c of eligible){assert.equal(apply(item.facelets,c.moves),solved);assert.equal(bendApply(item.facelets,c.moves),solved);assert(Number.isInteger(c.lower)&&c.lower>=0&&c.lower<=c.moves.length);if(c.optimal)assert.equal(c.lower,c.moves.length);}
  let lower=0;const events=[];
  for(const frame of raw.frames.filter(f=>f.atMs<=raw.budgetMs&&["candidate","progress","done"].includes(f.event.raw?.type))){const event=structuredClone(frame.event.raw);assert.equal(event.jobId,raw.requestId);assert(Number.isFinite(frame.atMs)&&frame.atMs>=0);if(event.lower!==undefined){assert(Number.isInteger(event.lower)&&event.lower>=lower);lower=event.lower;}if(event.type==="candidate"){assert.equal(event.length,event.moves.length);assert.equal(apply(item.facelets,event.moves),solved);assert.equal(bendApply(item.facelets,event.moves),solved);assert(event.lower<=event.length);if(event.optimal)assert.equal(event.lower,event.length);}events.push({atMs:frame.atMs,event,sourceFrameSha256:valueDigest(frame)});}
  const best=eligible.at(-1);assert(lower<=best.moves.length);assert(events.some(f=>f.event.type==="candidate"));
  const nativeTerminal=events.findLast(f=>f.event.type==="done"),terminal=nativeTerminal??{atMs:raw.budgetMs,event:{type:"done",length:best.moves.length,lower,optimal:false,elapsedMs:raw.budgetMs,reason:"stored-timeout-fixture-projection"},sourceFrameSha256:null};
  if(!nativeTerminal)assert.equal(raw.status,"timeout");
  return{format:"rubend-saved-ui-record-v1",evidenceKind:"stored-ui-replay",caseId:item.id,facelets:item.facelets,actorId:actor.id,request:{mode:actor.requestMode,budgetMs:raw.budgetMs},originalSlot:envelope.slot,originalStatus:raw.status,contract:actor.contract,configurationSha256:actor.configurationSha256,envelopeSha256:valueDigest(envelope),events,terminal,terminalProjection:!nativeTerminal,best:{moves:best.moves,lower,optimal:Boolean(nativeTerminal?.event.optimal)},solverExecution:false,browserTimingIsMeasurement:false};
}

export function matchReplayRequest(record,input){
  assert.deepEqual(Object.keys(input).sort(),["budgetMs","facelets","id","mode"]);
  assert.equal(input.facelets,record.facelets);assert.equal(input.mode,record.request.mode);assert.equal(input.budgetMs,record.request.budgetMs);assert(Number.isInteger(input.id)&&input.id>=0);
  return[...record.events.filter(f=>f.event.type!=="done"),record.terminal].map(f=>({atMs:f.atMs,event:{...f.event,id:input.id}}));
}

export function prepareFinalAppRecords(output){
  const digest="7db44c8dd10f127bcaee094bd35ffeb7b63f75ab9e6d326c0804c49b01b1db0d",freezePath=resolve("build/experiments/u07-final-evaluation-v1/freeze.json"),freeze=loadAdmittedEvaluationFreeze(freezePath,digest,{stage:"final-frozen"}),reportPath=resolve("build/experiments/u07-final-report-v1/report.json"),reportIndexPath=resolve("docs/verification/next-plan/U07/u07-final-report-v1/index.json"),reportIndex=JSON.parse(readFileSync(reportIndexPath)),report=JSON.parse(readFileSync(reportPath));
  assert(reportIndex.passed&&reportIndex.workerGone&&!reportIndex.resourceStops);assert.equal(fileHash(reportPath),reportIndex.archives.find(a=>a.path==="3-report.json.gz").sha256);assert.equal(report.aggregate.slots,57678);assert.equal(report.freezeSha256,digest);assert(report.allAnswersIndependentlyReplayedAgain);
  const corpus=new Map(loadCorpus("release").map(c=>[c.id,c])),structures=JSON.parse(readFileSync(freeze.structuralArtifact.path)).cases,records=[];
  for(const [id,run,actorId,structural]of [["hard-default","u07-final-timing-c0-a-p1","rubend-default",false],["small-control","u07-final-timing-c0-b-p1","rubend-u00-small",false],["h0-control","u07-final-timing-c0-b-p1","rubend-u00-h0",false],["known-exact","u07-final-structural-p1","rubend-default-exact",true]]){
    const indexPath=resolve("docs/verification/next-plan/U07",run,"index.json"),index=JSON.parse(readFileSync(indexPath)),confirmationPath=resolve("build/experiments",run,"confirmation.json"),confirmation=JSON.parse(readFileSync(confirmationPath));assert(index.passed&&index.workerGone&&!index.resourceStops);assert.equal(fileHash(confirmationPath),index.archives.find(a=>/^\d+-confirmation\.json\.gz$/.test(a.path)).sha256);const source=confirmation.outputs.find(o=>o.path.endsWith("/"+actorId+"-"+actorId+".json"));assert(source);assert.equal(fileHash(source.path),source.sha256);const result=JSON.parse(readFileSync(source.path)),actor=freeze.actors.find(a=>a.id===actorId);
    const envelope=structural?result.envelopes.find(e=>{const item=structures.find(c=>c.id===e.slot.caseId);return item.knownOptimum===4&&e.status==="ok"&&e.observation.candidates.at(-1)?.moves.length===4;}):result.envelopes.find(e=>e.slot.caseId==="release-91"&&e.slot.clock==="warm-request"&&e.slot.repeat===0);
    assert(envelope);const item=structural?structures.find(c=>c.id===envelope.slot.caseId):corpus.get(envelope.slot.caseId),normalized=normalizeMeasuredEvaluation(envelope,item,freeze,envelope.slot);assert(normalized.coveredByDeadline);const record=projectSavedRecord(envelope,item,actor);records.push({id,...record,sourcePath:source.path,sourceSha256:source.sha256,indexPath,indexSha256:fileHash(indexPath),knownOptimum:item.knownOptimum??null});
  }
  const deliveryPath=resolve("build/experiments/u07-delivery-http-v1/delivery.json"),delivery=JSON.parse(readFileSync(deliveryPath)),installedBuild=delivery.privateStore+delivery.logicalStorePath+"/share/rubend/build",manifest=JSON.parse(readFileSync(installedBuild+"/manifest.json"));assert.deepEqual(delivery.sourceHashes,inputs());assert.deepEqual(manifest.sourceHashes,inputs());assert.equal(fileHash(installedBuild+"/rubend"),delivery.nativeSha256);for(const[p,h]of Object.entries(manifest.artifacts))assert.equal(fileHash(installedBuild+"/"+p),h);
  const guiIndexPath=resolve("docs/verification/next-plan/U07/u07-installed-gui-v1/index.json"),guiIndex=JSON.parse(readFileSync(guiIndexPath)),mediaPath=resolve("docs/verification/next-plan/U07/u07-installed-gui-v1-media/index.json"),media=JSON.parse(readFileSync(mediaPath));assert(guiIndex.passed&&guiIndex.workerGone&&!guiIndex.resourceStops);for(const m of media.screenshots)assert.equal(fileHash(m.path),m.sha256);
  const prefix=installedBuild+"/web/",webAssets=Object.fromEntries(Object.entries(freeze.sourceHashes).filter(([p])=>p.startsWith(prefix)).map(([p,h])=>[p.slice(prefix.length),h]));validateReplayAssets(webAssets);for(const[name,hash]of Object.entries(webAssets))assert.equal(fileHash(prefix+name),hash);
  const artifact={format:"rubend-final-app-records-v1",records,freezePath,freezeSha256:digest,reportPath,reportSha256:fileHash(reportPath),reportIndexPath,reportIndexSha256:fileHash(reportIndexPath),installedBuild,installedManifestSha256:fileHash(installedBuild+"/manifest.json"),webAssets,deliveryPath,deliverySha256:fileHash(deliveryPath),guiReuse:{indexPath:guiIndexPath,indexSha256:fileHash(guiIndexPath),mediaPath,mediaSha256:fileHash(mediaPath),nativeSourceIdentical:true,freshNativeBrowserSolve:false},browserPreviewHidden:true,solverExecution:false,performanceAcceptance:false,formalOptimality:false,independentReview:false};
  artifact.valueDigest=valueDigest(artifact);mkdirSync(resolve(output,".."),{recursive:true});writeFileSync(output,JSON.stringify(artifact,null,2)+"\n",{flag:"wx"});return{passed:true,records:records.length,output,solverExecution:false};
}

if(process.argv[1]&&resolve(process.argv[1])===resolve(import.meta.filename)){assert.equal(process.argv.length,4);assert.equal(process.argv[2],"prepare");console.log(JSON.stringify(prepareFinalAppRecords(resolve(process.argv[3]))));}
