import assert from "node:assert/strict";
import {readFileSync,writeFileSync,mkdirSync,existsSync} from "node:fs";
import {resolve} from "node:path";
import {pathToFileURL} from "node:url";
import {spawnSync} from "node:child_process";
import {array,list} from "../apps/model.mjs";
import {fileHash} from "../bench/reference-provenance.mjs";
import {admitCheckpoint,makeCheckpoint,checkpointHash,decodeCheckpointPacket} from "../bench/edge-checkpoint-record.mjs";

const [mode,modulePath,argument,...rest]=process.argv.slice(2);assert.ok(["worker","suite"].includes(mode));
const moduleFile=resolve(modulePath),C=(await import(pathToFileURL(moduleFile))).default,read=p=>JSON.parse(readFileSync(p,"utf8"));
if(mode==="worker"){
  assert.equal(process.argv.length,8);const input=resolve(argument),[output,fault,expectedSha256]=rest,record=read(input),identity=record.identity;
  assert.equal(record.sha256,expectedSha256,"Checkpoint differs from caller's pinned record");
  assert.equal(fileHash(moduleFile),identity.moduleSha256);const state=admitCheckpoint(record,identity);
  if(fault==="crash")process.exit(2);assert.equal(fault,"normal");
  const packet=decodeCheckpointPacket(C.resume_admitted(identity.count,state.depth,state.reached,state.expanded,list(state.values),1),identity.count);
  const result={format:"rubend-edge-checkpoint-step-v1",parentSha256:record.sha256,packet};
  writeFileSync(resolve(output),JSON.stringify(result)+"\n",{flag:"wx"});process.exit();
}
assert.equal(process.argv.length,7);const directory=resolve(argument),[pilotPath,output]=rest,pilot=read(pilotPath),moduleSha256=fileHash(moduleFile);assert.equal(pilot.passed,true);mkdirSync(directory,{recursive:true});
const rows=pilot.rows.filter(r=>r.mode==="valid"),records=[],nativeCases=[],controls=[];let restarts=0,duplicateChecks=0,crashControls=0;
for(const row of rows){
  const identity={pattern:row.pattern,count:row.count,labels:pilot.patterns[row.pattern].slice(0,row.count),size:row.values.length,goal:row.goal,moduleSha256},prefix=`p${row.pattern}-k${row.count}`,uninterrupted=decodeCheckpointPacket(C.start(row.count,row.goal,32),row.count);
  assert.equal(uninterrupted[0],1);assert.deepEqual(uninterrupted.slice(5),row.values,"Fresh Bend result differs from audited native reference");
  let packet=decodeCheckpointPacket(C.start(row.count,row.goal,0),row.count),parent="0".repeat(64),layer=0;
  while(packet[0]===0){
    assert.ok(layer<32);const record=makeCheckpoint(identity,packet,parent),input=resolve(directory,`${prefix}-layer${layer}.json`),next=resolve(directory,`${prefix}-step${layer}.json`);
    writeFileSync(input,JSON.stringify(record)+"\n",{flag:"wx"});assert.deepEqual(read(input),record);
    if(layer===1){
      const before=fileHash(input),crashed=resolve(directory,prefix+"-crashed.json"),run=spawnSync(process.execPath,["tests/edge-checkpoint.mjs","worker",moduleFile,input,crashed,"crash",record.sha256],{encoding:"utf8",timeout:15000});
      assert.ifError(run.error);assert.equal(run.status,2);assert.equal(run.signal,null);assert.equal(existsSync(crashed),false);assert.equal(fileHash(input),before);crashControls++;
    }
    const run=spawnSync(process.execPath,["tests/edge-checkpoint.mjs","worker",moduleFile,input,next,"normal",record.sha256],{encoding:"utf8",timeout:15000,maxBuffer:1024*1024});
    assert.ifError(run.error);assert.equal(run.status,0,run.stdout+run.stderr);assert.equal(run.signal,null);const result=read(next);assert.equal(result.parentSha256,record.sha256);restarts++;
    if(layer===1){
      const repeated=resolve(directory,prefix+"-repeated.json"),retry=spawnSync(process.execPath,["tests/edge-checkpoint.mjs","worker",moduleFile,input,repeated,"normal",record.sha256],{encoding:"utf8",timeout:15000});
      assert.ifError(retry.error);assert.equal(retry.status,0,retry.stdout+retry.stderr);assert.deepEqual(read(repeated),result);duplicateChecks++;
      if(row.count<=2){const final=decodeCheckpointPacket(C.resume_admitted(row.count,record.packet[1],record.packet[2],record.packet[3],list(record.packet.slice(5)),32),row.count);nativeCases.push({identity,checkpoint:record.packet,expectedChecksum:final.reduce((a,v)=>(Math.imul(a,33)+v)>>>0,17)});}
    }
    records.push({input,inputSha256:fileHash(input),step:next,stepSha256:fileHash(next),identity,depth:packet[1],reached:packet[2],expanded:packet[3],parentSha256:parent,checkpointSha256:record.sha256});packet=result.packet;parent=record.sha256;layer++;
  }
  assert.deepEqual(packet,uninterrupted,"Resumed completion differs from uninterrupted Bend build");
  assert.equal(packet[2],row.values.length);assert.equal(packet[3],row.values.length);assert.equal(packet[4],0);
}
const base=read(records.find(r=>r.depth===1).input),id=base.identity,resign=r=>{const{sha256,...payload}=r;return{...payload,sha256:checkpointHash(payload)};};
const variants=[
  {name:"bad-digest",change:r=>r.packet[5]++,resign:false,diagnostic:/digest mismatch/},
  {name:"wrong-source",change:r=>r.identity.moduleSha256="f".repeat(64),diagnostic:/identity mismatch/},
  {name:"wrong-pattern",change:r=>r.identity.pattern=1-r.identity.pattern,diagnostic:/identity mismatch/},
  {name:"missing-value",change:r=>r.packet.pop(),diagnostic:/value count mismatch/},
  {name:"false-completion",change:r=>r.packet[0]=1,diagnostic:/Only active layer boundaries/},
  {name:"wrong-reached",change:r=>r.packet[2]++,diagnostic:/reached counter mismatch/},
  {name:"wrong-expanded",change:r=>r.packet[3]++,diagnostic:/expanded counter mismatch/},
  {name:"future-distance",change:r=>r.packet[5]=33,diagnostic:/distance exceeds its layer/},
  {name:"extra-field",change:r=>r.authorized=true,diagnostic:/schema mismatch/}
];
for(const v of variants){let bad=structuredClone(base);v.change(bad);if(v.resign!==false)bad=resign(bad);let failure;try{admitCheckpoint(bad,id);}catch(error){failure=error;}assert.ok(failure instanceof assert.AssertionError,v.name);assert.match(failure.message,v.diagnostic);controls.push({name:v.name,diagnostic:failure.message});}
for(const count of[0,4,5,6,7,4294967295])assert.deepEqual(array(C.start(count,0,0)),[]);
assert.deepEqual(array(C.resume_admitted(1,0,1,0,list([0]),0)),[]);
const result={passed:true,format:"rubend-edge-checkpoint-suite-v1",moduleSha256,tables:rows.length,restarts,duplicateChecks,crashControls,recordControls:controls,records,nativeCases,sourceBoundImmutableFiles:true,completedOutputsComparedWithAuditedNativeReference:true,generationEngine:"Actual Bend table builder through generated JavaScript",nativeFileRestartVerified:false,scratchForLargerProfilesMeasured:false,maximumEdges:3,fullDatabaseBuild:false,productionIntegrated:false,np04Proved:false,np05Proved:false,performanceAcceptance:false,releaseHoldoutOpened:false,independentReview:false};
writeFileSync(resolve(output),JSON.stringify(result,null,2)+"\n",{flag:"wx"});console.log(JSON.stringify({passed:true,tables:rows.length,restarts,duplicateChecks,crashControls,recordControls:controls.length,nativeCases:nativeCases.length,fullDatabaseBuild:false}));
