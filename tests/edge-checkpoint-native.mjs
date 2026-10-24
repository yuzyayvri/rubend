import assert from "node:assert/strict";
import {readFileSync,writeFileSync,mkdirSync,existsSync} from "node:fs";
import {resolve} from "node:path";
import {spawnSync} from "node:child_process";
import {pathToFileURL} from "node:url";
import {array} from "../apps/model.mjs";
import {fileHash} from "../bench/reference-provenance.mjs";
import {admitCheckpoint,makeCheckpoint,decodeCheckpointPacket} from "../bench/edge-checkpoint-record.mjs";

assert.equal(process.argv.length,7);const [binaryPath,modulePath,pilotPath,directoryPath,output]=process.argv.slice(2),binary=resolve(binaryPath),module=resolve(modulePath),directory=resolve(directoryPath),read=p=>JSON.parse(readFileSync(p,"utf8")),pilot=read(pilotPath),C=(await import(pathToFileURL(module))).default,binarySha256=fileHash(binary),moduleSha256=fileHash(module),records=[],controls=[];assert.equal(pilot.passed,true);mkdirSync(directory,{recursive:true});
function execute(payload,length,action="resume"){
  const identity=fileHash(payload),r=spawnSync(binary,["--threads","1","--gpu","off","--",payload,String(length),action],{encoding:"utf8",timeout:10000,maxBuffer:128*1024});assert.ifError(r.error);assert.equal(r.signal,null);assert.equal(fileHash(payload),identity);assert.equal(fileHash(binary),binarySha256);assert.equal(existsSync("/proc/"+r.pid),false,"Native worker still present after wait");return r;
}
let restarts=0,repeats=0,crashes=0,maximumPayloadBytes=0;
for(const row of pilot.rows.filter(r=>r.mode==="valid")){
  const identity={pattern:row.pattern,count:row.count,labels:pilot.patterns[row.pattern].slice(0,row.count),size:row.values.length,goal:row.goal,moduleSha256,nativeSha256:binarySha256},prefix=`p${row.pattern}-k${row.count}`;
  let packet=decodeCheckpointPacket(C.start(row.count,row.goal,0),row.count),parent="0".repeat(64),layer=0;
  while(packet[0]===0){
    assert.ok(layer<32);const checkpoint=makeCheckpoint(identity,packet,parent),path=resolve(directory,`${prefix}-layer${layer}.json`);writeFileSync(path,JSON.stringify(checkpoint)+"\n",{flag:"wx"});
    const pinned=read(path);assert.equal(pinned.sha256,checkpoint.sha256);const state=admitCheckpoint(pinned,identity),values=[row.count,state.depth,state.reached,state.expanded,...state.values],csv=values.join(",")+"\n",bytes=Buffer.byteLength(csv);assert.ok(bytes<=65536);maximumPayloadBytes=Math.max(maximumPayloadBytes,bytes);
    const payload=resolve(directory,`${prefix}-layer${layer}.csv`);writeFileSync(payload,csv,{flag:"wx"});
    if(layer===1){const before=fileHash(path),failure=execute(payload,bytes,"fail");assert.equal(failure.status,2);assert.equal(failure.stdout,"");assert.match(failure.stderr,/Injected native checkpoint failure/);assert.equal(fileHash(path),before);crashes++;}
    const run=execute(payload,bytes);assert.equal(run.status,0,run.stderr);assert.equal(run.stderr,"");const result=JSON.parse(run.stdout);assert.deepEqual(Object.keys(result),["packet"]);assert.ok(Array.isArray(result.packet));assert.equal(result.packet.length,row.values.length+5);assert.ok(result.packet.every(v=>Number.isInteger(v)&&v>=0&&v<=0xffffffff));restarts++;
    if(layer===1){const repeat=execute(payload,bytes);assert.equal(repeat.status,0,repeat.stderr);assert.equal(repeat.stdout,run.stdout);repeats++;}
    const resultPath=resolve(directory,`${prefix}-result${layer}.json`);writeFileSync(resultPath,JSON.stringify({parentSha256:checkpoint.sha256,nativePid:run.pid,exitCode:run.status,stdout:run.stdout,stderr:run.stderr,packet:result.packet})+"\n",{flag:"wx"});records.push({checkpoint:path,checkpointSha256:fileHash(path),payload,payloadSha256:fileHash(payload),payloadBytes:bytes,result:resultPath,resultSha256:fileHash(resultPath),nativePid:run.pid,identity,depth:state.depth,parentSha256:parent});
    parent=checkpoint.sha256;packet=result.packet;layer++;
  }
  assert.deepEqual(packet,[1,row.depth,row.reached,row.expanded,row.bad,...row.values],"Native file-restored table differs from the complete audited reference");
}
const first=records[0],base=readFileSync(first.payload,"utf8"),parts=base.trim().split(","),cases=[
  {name:"short-read-length",text:base,length:first.payloadBytes+1,diagnostic:/byte count mismatch/},
  {name:"long-read-length",text:base,length:first.payloadBytes-1,diagnostic:/byte count mismatch|trailing data/},
  {name:"missing-cell",text:parts.slice(0,-1).join(",")+"\n",diagnostic:/Invalid checkpoint packet/},
  {name:"extra-cell",text:base.trim()+",0\n",diagnostic:/Invalid checkpoint packet/},
  {name:"unsupported-four",text:[4,...parts.slice(1)].join(",")+"\n",diagnostic:/Invalid checkpoint packet/},
  {name:"bad-depth",text:[parts[0],33,...parts.slice(2)].join(",")+"\n",diagnostic:/Invalid checkpoint packet/},
  {name:"bad-counters",text:[parts[0],parts[1],1,2,...parts.slice(4)].join(",")+"\n",diagnostic:/Invalid checkpoint packet/},
  {name:"invalid-integer",text:["bad",...parts.slice(1)].join(",")+"\n",diagnostic:/Invalid checkpoint fields/},
  {name:"empty-field",text:["",...parts.slice(1)].join(",")+"\n",diagnostic:/Invalid checkpoint fields/},
  {name:"oversized-admission",text:base,length:65537,diagnostic:/Invalid checkpoint byte limit/},
  {name:"invalid-action",text:base,action:"other",diagnostic:/Invalid checkpoint byte limit or action/}
];
for(const c of cases){const path=resolve(directory,"fault-"+c.name+".csv");writeFileSync(path,c.text,{flag:"wx"});const run=execute(path,c.length??Buffer.byteLength(c.text),c.action??"resume");assert.equal(run.status,2,c.name);assert.equal(run.stdout,"",c.name);assert.match(run.stderr,c.diagnostic,c.name);controls.push({name:c.name,exitCode:run.status,stderr:run.stderr,payload:path,payloadSha256:fileHash(path)});}
assert.equal(array(C.start(6,0,0)).length,0);
const result={passed:true,format:"rubend-edge-native-file-checkpoint-v1",binarySha256,moduleSha256,tables:6,restarts,repeats,nativeCrashes:crashes,maximumPayloadBytes,payloadLimitBytes:65536,records,controls,nativeFileRestartVerified:true,eachNativeReadsPayloadFromDisk:true,checkpointAdmissionInHost:true,regularFileExactReadContract:true,shortReadsFailClosed:true,hashIsIntegrityNotDistanceProof:true,newDistanceGeometry:false,fullDatabaseBuild:false,largeProfileChunkingImplemented:false,productionIntegrated:false,performanceAcceptance:false,releaseHoldoutOpened:false,independentReview:false};
writeFileSync(resolve(output),JSON.stringify(result,null,2)+"\n",{flag:"wx"});console.log(JSON.stringify({passed:true,tables:6,restarts,repeats,nativeCrashes:crashes,malformedNativeControls:controls.length,maximumPayloadBytes,nativeFileRestartVerified:true}));
