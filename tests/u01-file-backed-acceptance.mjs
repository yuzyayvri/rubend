import assert from "node:assert/strict";
import {watch,existsSync,lstatSync,statSync,readFileSync,renameSync,writeFileSync,mkdirSync} from "node:fs";
import {resolve,dirname,basename} from "node:path";
import {fileHash} from "../bench/bounded-file-hash.mjs";
import {apply,solved} from "../bench/fixed-work-model.mjs";

const names=[..."URFDLB"].flatMap(f=>[f,f+"2",f+"'"]);
async function screenshot(tab,directory,name){const bytes=Buffer.from(await tab.screenshot({fullPage:true})),png=bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])),jpeg=bytes[0]===255&&bytes[1]===216,webp=bytes.toString("ascii",0,4)==="RIFF"&&bytes.toString("ascii",8,12)==="WEBP";assert.ok(png||jpeg||webp);const extension=png?"png":jpeg?"jpg":"webp",path=resolve(directory,name+"."+extension);writeFileSync(path,bytes,{flag:"wx"});return{path,sha256:fileHash(path),mimeType:png?"image/png":jpeg?"image/jpeg":"image/webp"};}
export function waitForExactDownloadedFile(path,text,timeoutMs=10000){
  assert.equal(existsSync(path),false,"The expected actual download must not exist before the UI action");
  let watcher,timer,settled=false,resolvePromise,rejectPromise;
  const promise=new Promise((resolve,reject)=>{resolvePromise=resolve;rejectPromise=reject;});
  function close(){clearTimeout(timer);watcher?.close();}
  function inspect(){if(settled||!existsSync(path))return;const s=lstatSync(path);if(!s.isFile()||s.isSymbolicLink())return;if(readFileSync(path,"utf8")!==text)return;settled=true;close();resolvePromise({path,bytes:s.size,sha256:fileHash(path),birthtimeMs:s.birthtimeMs,mtimeMs:s.mtimeMs,absentBeforeAction:true,observedBy:"filesystem-event-after-browser-click",browserEventRequired:false});}
  watcher=watch(dirname(path),(event,name)=>{if(String(name)===basename(path))inspect();});watcher.once("error",error=>{if(!settled){settled=true;close();rejectPromise(error);}});
  timer=setTimeout(()=>{if(!settled){settled=true;close();rejectPromise(Error("Actual downloaded file did not arrive with the exact displayed bytes"));}},timeoutMs);
  return{promise,cancel(){if(!settled){settled=true;close();rejectPromise(Error("Download observation cancelled"));}}};
}

export async function runFileBackedAcceptance(tab,directory,downloadDirectory){
  directory=resolve(directory);downloadDirectory=resolve(downloadDirectory);mkdirSync(directory,{recursive:true});
  await tab.getAXState({emit:false});await tab.playwright.locator("#guide-button").click();await tab.getAXState({emit:false});if(!await tab.playwright.locator("#reduced-motion").evaluate(el=>el.checked))await tab.playwright.locator("#reduced-motion").click();await tab.playwright.locator("#close-guide").click();await tab.getAXState({emit:false});await tab.playwright.locator("#reset-button").click();await tab.getAXState({emit:false});
  for(const face of ["R","U","R","R","R","U","U","U"]){await tab.playwright.getByRole("button",{name:"Turn "+face+" face",exact:true}).click();await tab.getAXState({emit:false});}
  await tab.playwright.getByText("Bend 2 · Local",{exact:true}).waitFor({state:"visible",timeoutMs:30000});await tab.playwright.locator("#exact-mode").click();await tab.playwright.locator("#solve-button").click();await tab.playwright.locator("#cancel-button").waitFor({state:"hidden",timeoutMs:15000});await tab.getAXState({emit:false});
  const observed=JSON.parse(await tab.playwright.locator("#rubend-test-diagnostics").textContent()),d=observed.diagnostics;assert.equal(d.solution.origin,apply(solved,[3,0,5,2]));assert.equal(d.step,0);assert.equal(d.facelets,d.solution.origin);assert.equal(d.solution.moves.length,4);assert.equal(d.solution.lower,4);assert.equal(d.solution.optimal,true);assert.equal(d.searching,false);assert.equal(apply(d.solution.origin,d.solution.moves),solved);
  await tab.playwright.locator("#copy-button").click();await tab.getAXState({emit:false});const message=await tab.playwright.locator("#search-status").textContent(),policy=JSON.parse(await tab.playwright.locator("#rubend-test-clipboard-policy").textContent());assert.equal(policy.policyAllowed,false);assert.equal(policy.permission,"denied");assert.equal(policy.clipboardWriteUnchanged,true);assert.equal(message,"Clipboard unavailable. Use Export to save the moves.");
  writeFileSync(resolve(directory,"clipboard.json"),JSON.stringify({passed:true,message,policy,observed,syntheticClipboardOverride:false},null,2)+"\n",{flag:"wx"});const clipboardScreenshot=await screenshot(tab,directory,"clipboard");
  await tab.playwright.locator("#export-button").click();await tab.getAXState({emit:false});const text=await tab.playwright.locator("#export-record").evaluate(el=>el.value),record=JSON.parse(text);assert.equal(record.replayCertified,true);assert.equal(record.searchOptimal,true);assert.equal(record.htm,4);assert.equal(record.lowerBound,4);assert.equal(apply(record.facelets,record.moves.map(m=>names.indexOf(m))),solved);
  const path=resolve(downloadDirectory,"rubend-solve.json"),backup=resolve(directory,"preexisting-download.private.json"),artifact=resolve(directory,"downloaded-record.json");assert.equal(existsSync(backup),false);assert.equal(existsSync(artifact),false);let prior=null,waiting,download=null;
  if(existsSync(path)){const s=lstatSync(path);assert.equal(s.isFile(),true);assert.equal(s.isSymbolicLink(),false);prior={sha256:fileHash(path),bytes:s.size};renameSync(path,backup);assert.equal(fileHash(backup),prior.sha256);}
  try{
    waiting=waitForExactDownloadedFile(path,text);await tab.playwright.locator("#download-record").click();await tab.getAXState({emit:false});download=await waiting.promise;const saved=readFileSync(path,"utf8");assert.equal(saved,text);assert.deepEqual(JSON.parse(saved),record);assert.equal(apply(record.facelets,record.moves.map(m=>names.indexOf(m))),solved);renameSync(path,artifact);assert.equal(fileHash(artifact),download.sha256);
  }finally{
    if(waiting&&!download){waiting.cancel();await waiting.promise.catch(()=>{});}
    if(prior){assert.equal(existsSync(path),false,"Do not overwrite a concurrent or unexpected download when restoring the preexisting file");assert.equal(fileHash(backup),prior.sha256);renameSync(backup,path);assert.equal(fileHash(path),prior.sha256);}
  }
  writeFileSync(resolve(directory,"download.json"),JSON.stringify({passed:true,download,artifact,artifactSha256:fileHash(artifact),displayedText:text,displayedRecord:record,exactDisplayedBytes:true,independentReplay:true,preexistingFileRestored:prior!==null,preexistingBytes:prior?.bytes??null,productionHandlerUnchanged:true,downloadEventNotUsed:true},null,2)+"\n",{flag:"wx"});const exportScreenshot=await screenshot(tab,directory,"export");
  await tab.playwright.locator("#close-export").click();await tab.getAXState({emit:false});
  const result={passed:true,inputMethod:"face-turn-controls-only",textEntryAutomationUsed:false,actualBrowserClipboardDenied:true,syntheticClipboardOverride:false,actualDownloadedFileBytesMatched:true,independentlyReplayed:true,preexistingDownloadRestored:prior!==null,downloadEventAPIClaim:false,productionChanged:false,screenshots:{clipboard:clipboardScreenshot,export:exportScreenshot},independentReview:false};writeFileSync(resolve(directory,"result.json"),JSON.stringify(result)+"\n",{flag:"wx"});return result;
}
