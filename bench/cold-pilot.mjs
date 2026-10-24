import assert from "node:assert/strict";
import {readFileSync,writeFileSync,renameSync} from "node:fs";
import {resolve} from "node:path";
import {runColdCase} from "./cold-run.mjs";
import {assessColdPilot} from "./cold-pilot-model.mjs";
import {verifyReferenceSources,fileHash} from "./reference-provenance.mjs";

assert.equal(process.argv.length,4);const directory=resolve(process.argv[2]),freeze=JSON.parse(readFileSync(resolve(directory,"freeze.json"),"utf8")),output=resolve(process.argv[3]),context={rubendBinary:resolve("build/rubend"),nissyBinary:resolve(freeze.references.nissy.binary),nissyStage:freeze.readOnlyStage.path,nissyTableSha256:freeze.references.nissy.tableSha256},rows=[],report={format:"rubend-cold-pilot-observation-v1",passed:false,freezeSha256:fileHash(resolve(directory,"freeze.json")),rows,plannedRequests:60,errors:[],assessment:null,performanceAcceptance:false,releaseHoldoutOpened:false};
const verify=()=>{for(const[path,h]of Object.entries(freeze.actorSourceHashes))assert.equal(fileHash(path),h,"Pilot source changed: "+path);verifyReferenceSources(freeze.references);};
function save(){const temporary=output+".tmp";writeFileSync(temporary,JSON.stringify(report,null,2)+"\n");renameSync(temporary,output);}
verify();save();
try{
  for(const slot of freeze.slots){const envelope={slot,resources:freeze.resources,sourceSha256:freeze.solverSourceSha256[slot.solver],run:null,unavailableReason:null};try{envelope.run=await runColdCase({solver:slot.solver,item:freeze.cases.find(c=>c.id===slot.caseId),budgetMs:freeze.budgetMs,context});}catch(error){envelope.unavailableReason=String(error.stack??error);}rows.push(envelope);save();console.log(JSON.stringify({completed:rows.length,...slot,status:envelope.run?.status??"unavailable",length:envelope.run?.bestAtDeadline?.length??null,forced:envelope.run?.forced??false}));}
  verify();report.assessment=assessColdPilot(freeze,rows);for(const[s,summary]of Object.entries(report.assessment.bySolver))if(summary.errors||summary.unavailable)report.errors.push({solver:s,errors:summary.errors,unavailable:summary.unavailable});assert.equal(report.errors.length,0,"Pilot actor errors require inspection");report.passed=true;
}catch(error){report.errors.push({stage:"pilot",error:String(error.stack??error)});}
finally{save();}
console.log(JSON.stringify({passed:report.passed,requests:rows.length,summary:report.assessment?.bySolver??null,errors:report.errors,performanceAcceptance:false}));if(!report.passed)process.exitCode=1;
