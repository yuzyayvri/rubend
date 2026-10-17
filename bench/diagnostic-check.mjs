import assert from "node:assert/strict";
import {readFileSync,writeFileSync,mkdirSync,mkdtempSync,rmSync,statSync} from "node:fs";
import {createHash} from "node:crypto";
import {spawnSync} from "node:child_process";
import {resolve,dirname} from "node:path";
import {tmpdir} from "node:os";
import {fileURLToPath} from "node:url";
import {validateRecords} from "./fixed-work-model.mjs";

const root=fileURLToPath(new URL("../",import.meta.url));
export const contract=JSON.parse(readFileSync(new URL("./search-observer-contract.json",import.meta.url),"utf8"));
const hash=bytes=>createHash("sha256").update(bytes).digest("hex");

export function checkCounters(records,snapshots,tier){
  assert.equal(records.length,snapshots.length,"Diagnostic coverage differs");
  const previous=new Map();
  const counts=records.map((record,index)=>{
    const snapshot=snapshots[index];
    assert.equal(record.type,"diagnostic");
    for(const key of ["id","request","slice"])assert.equal(record[key],snapshot[key],"Diagnostic identity differs");
    assert.equal(record.counts?.length,contract.fields.length,"Counter schema differs");
    assert.ok(record.counts.every(v=>Number.isSafeInteger(v)&&v>=0),"Non-integer counter");
    const c=Object.fromEntries(contract.fields.map((name,i)=>[name,record.counts[i]]));
    assert.equal(c.workSteps,snapshot.nodes,"Work-step counter differs");
    assert.equal(c.workSteps,c.reductionSteps+c.subgroupSteps+c.exactSteps,"Phase accounting differs");
    assert.equal(c.considered,c.canonicalRejected+c.legalAttempts,"Canonical accounting differs");
    assert.equal(c.legalAttempts,c.admitted+c.pairCuts+c.jointFirstCuts+c.jointSecondCuts+c.jointThirdCuts,"Admission accounting differs");
    assert.equal(c.logicalTransitionReads,3*c.legalAttempts,"Transition accounting differs");
    assert.equal(c.logicalPairReads,2*c.legalAttempts+2*c.phaseTwoLaunches,"Pair accounting differs");
    assert.ok(c.expanded<=c.considered,"Expansion accounting differs");
    assert.ok(c.logicalJointEstimates<=3*c.legalAttempts);
    assert.ok(c.logicalJointEstimates>=c.jointFirstCuts+2*c.jointSecondCuts+3*c.jointThirdCuts);
    if(tier==="light")assert.equal(c.logicalJointEstimates,0,"Light profile used joint data");
    const key=record.id+":"+record.request;
    if(previous.has(key))assert.ok(record.counts.every((v,i)=>v>=previous.get(key)[i]),"Counter regressed");
    else assert.ok(record.counts.every(v=>v===0),"Initial counters are nonzero");
    previous.set(key,record.counts);
    return {...record,metrics:c};
  });
  const finals=new Map();
  for(const record of counts)finals.set(record.id+":"+record.request,record);
  return [...finals.values()];
}

function checkContract(){
  for(const [path,expected] of Object.entries(contract.sourceHashes))assert.equal(hash(readFileSync(resolve(root,path))),expected,"Search changed; reconcile diagnostic model before updating its source contract");
}

function sealed(path){
  const before=statSync(path,{bigint:true});assert.ok(before.isFile());
  const bytes=readFileSync(path),after=statSync(path,{bigint:true});
  for(const key of ["dev","ino","size","mtimeNs","ctimeNs"])assert.equal(before[key],after[key],"Binary changed while reading");
  return {sha256:hash(bytes),identity:["dev","ino","size","mtimeNs","ctimeNs"].map(key=>String(after[key]))};
}

export function diagnosticCheck({reference,diagnostic,tier="light",slices=6,output}){
  checkContract();assert.ok(["light","raw"].includes(tier));assert.ok(Number.isInteger(slices)&&slices>=0&&slices<=24);
  const fixture=JSON.parse(readFileSync(new URL("./fixed-work-cases.json",import.meta.url),"utf8"));
  const cases=fixture.cases.flatMap(entry=>[0,2].map(request=>({...entry,id:entry.id+(request===0?"-fast":"-exact"),request})));
  const temporary=mkdtempSync(resolve(tmpdir(),"rubend-diagnostic-")),path=resolve(temporary,"requests.tsv");
  writeFileSync(path,cases.map(c=>c.id+"\t"+c.facelets+"\t"+c.request+"\t"+slices+"\n").join(""));
  function run(binary){
    const absolute=resolve(binary),before=sealed(absolute);
    const result=spawnSync(absolute,["--threads","1","--gpu","off",tier,path],{encoding:"utf8",maxBuffer:64*1024*1024,timeout:240000,killSignal:"SIGKILL"});
    assert.deepEqual(sealed(absolute),before,"Binary changed during diagnostics");
    assert.ifError(result.error);assert.equal(result.status,0,result.stderr);assert.equal(result.signal,null);
    return {binarySha256:before.sha256,records:result.stdout.trim().split("\n").filter(Boolean).map(line=>JSON.parse(line))};
  }
  try{
    const a=run(reference),b=run(diagnostic);
    const clean=b.records.filter(r=>r.type!=="diagnostic"),observed=b.records.filter(r=>r.type==="diagnostic");
    const baseline=validateRecords(a.records,cases,slices),checked=validateRecords(clean,cases,slices);
    assert.deepEqual(checked.snapshots,baseline.snapshots,"Observer changed semantic traversal");
    assert.deepEqual(checked.counts,baseline.counts);
    const counters=checkCounters(observed,clean.filter(r=>r.type==="snapshot"),tier);
    checkContract();
    const result={format:"rubend-search-diagnostic-v1",passed:true,tier,slices,cases,contract,referenceBinarySha256:a.binarySha256,diagnosticBinarySha256:b.binarySha256,semanticSnapshotSha256:hash(JSON.stringify(checked.snapshots)),counts:checked.counts,counters,conditions:"Separate observational program. Extra table reads, coordinate recomputation, and ownership traffic distort time. Logical probes are source-model counts, not hardware memory events. Every attempted-move prediction checks actual child/parent coordinates. No release timing uses this executable.",independentReview:"Not run. Solo work required."};
    if(output){mkdirSync(dirname(resolve(output)),{recursive:true});writeFileSync(output,JSON.stringify(result,null,2)+"\n");}
    return result;
  }finally{rmSync(temporary,{recursive:true,force:true});}
}

if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  const args=process.argv.slice(2),options={};
  for(let i=0;i<args.length;i+=2){assert.ok(["--reference","--diagnostic","--tier","--slices","--output"].includes(args[i]));assert.ok(args[i+1]);assert.equal(options[args[i]],undefined);options[args[i]]=args[i+1];}
  assert.ok(options["--reference"]&&options["--diagnostic"]);
  const result=diagnosticCheck({reference:options["--reference"],diagnostic:options["--diagnostic"],tier:options["--tier"]??"light",slices:Number(options["--slices"]??6),output:options["--output"]});
  console.log(JSON.stringify({passed:result.passed,tier:result.tier,counts:result.counts,metrics:result.counters.map(c=>({id:c.id,request:c.request,...c.metrics}))}));
}
