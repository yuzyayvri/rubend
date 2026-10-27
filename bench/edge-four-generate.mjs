import assert from "node:assert/strict";
import {readFileSync,writeFileSync} from "node:fs";
import {resolve,dirname} from "node:path";
import {spawnSync} from "node:child_process";
import {performance} from "node:perf_hooks";
import {createHash} from "node:crypto";
import {fileHash} from "./reference-provenance.mjs";

assert.equal(process.argv.length,5);const[binaryPath,mutantPath,outputPath]=process.argv.slice(2).map(p=>resolve(p)),directory=dirname(outputPath),started=performance.now(),identity=fileHash(binaryPath);
const run=spawnSync(binaryPath,["--threads","1","--gpu","off"],{encoding:"utf8",timeout:100000,maxBuffer:4*1024*1024});assert.ifError(run.error);assert.equal(run.status,0,run.stderr);assert.equal(run.signal,null);assert.equal(run.stderr,"");assert.equal(fileHash(binaryPath),identity);
const rows=run.stdout.trim().split("\n").map(s=>JSON.parse(s));assert.equal(rows.length,2);const artifacts={},summaries=[];
for(const[pattern,row]of rows.entries()){
  assert.equal(row.pattern,pattern);assert.equal(row.count,4);assert.equal(row.allocatedWords,262144);assert.equal(row.complete,1);assert.equal(row.reached,190080);assert.equal(row.expanded,190080);assert.equal(row.bad,0);assert.equal(row.values.length,190080);assert.ok(row.values.every(v=>Number.isInteger(v)&&v>=0&&v<255));assert.ok(Number.isInteger(row.nativeGenerationMs)&&row.nativeGenerationMs>=0);
  const path=resolve(directory,"pattern"+pattern+".data"),bytes=Uint8Array.from(row.values);writeFileSync(path,bytes,{flag:"wx"});artifacts[path]=fileHash(path);const{values,...summary}=row;summaries.push({...summary,payload:path,payloadSha256:artifacts[path],payloadBytes:bytes.byteLength});
}
const fault=spawnSync(mutantPath,["--threads","1","--gpu","off"],{encoding:"utf8",timeout:10000,maxBuffer:1024*1024});assert.ifError(fault.error);assert.equal(fault.status,0,fault.stderr);assert.equal(fault.signal,null);const faultRows=fault.stdout.trim().split("\n").map(s=>JSON.parse(s));assert.equal(faultRows.length,2);for(const row of faultRows){assert.equal(row.allocatedWords,131072);assert.equal(row.complete,0);assert.equal(row.reached,0);assert.equal(row.bad,1);assert.deepEqual(row.values,[]);}
const result={passed:true,format:"rubend-four-edge-generation-v1",binarySha256:identity,rows:summaries,artifacts,stdoutSha256:createHash("sha256").update(run.stdout).digest("hex"),stderr:run.stderr,allocationMutation:{source:"Actual native allocation changed from2^18 to2^17 words",rows:faultRows,refusedBeforeSeed:true},hostExecutionParsingAndWriteMs:performance.now()-started,nativeGenerationMsExcludesSerialization:true,timingRuns:1,planningCostsOnly:true,comparisonWinnerSelected:false,fourEdgeTablesGenerated:true,maximumEdges:4,fullSixEdgeBuild:false,largeProfileScratchMeasured:false,productionIntegrated:false,np05Proved:false,performanceAcceptance:false,releaseHoldoutOpened:false,independentReview:false};
writeFileSync(outputPath,JSON.stringify(result,null,2)+"\n",{flag:"wx"});console.log(JSON.stringify({passed:true,states:380160,patterns:2,nativeGenerationMs:rows.map(r=>r.nativeGenerationMs),payloadBytes:380160,allocationMutationRefused:true,planningOnly:true}));
