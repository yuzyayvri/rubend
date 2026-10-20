import assert from "node:assert/strict";
import {writeFile,mkdir,readFile} from "node:fs/promises";
import {apply,solved} from "../apps/model.mjs";
import {shallow} from "./u00-browser-driver.mjs";

const names=[..."URFDLB"].flatMap(f=>[f,f+"2",f+"'"]);
async function observe(tab){await tab.getAXState({emit:false});const v=JSON.parse(await tab.playwright.locator("#rubend-test-diagnostics").textContent()),d=v.diagnostics;assert.equal(d.modelState,"active");assert.equal(d.pendingModelRequests,0);if(d.solution)assert.equal(d.facelets,apply(d.solution.origin,d.solution.moves.slice(0,d.step)));return v;}
async function save(tab,directory,name,value){await mkdir(directory,{recursive:true});await writeFile(directory+"/"+name+".json",JSON.stringify(value,null,2)+"\n",{flag:"wx"});await writeFile(directory+"/"+name+".jpg",await tab.screenshot({fullPage:true}),{flag:"wx"});}
export async function rendererRecovery(tab,directory){
  await shallow(tab,directory,"renderer");const before=await observe(tab);assert.ok(before.diagnostics.renderer);assert.equal(await tab.playwright.locator("#rubend-test-lose-context").isEnabled(),true);
  await tab.playwright.locator("#rubend-test-lose-context").press("Enter");await tab.playwright.locator("#fallback").waitFor({state:"visible",timeoutMs:5000});const lost=await observe(tab);assert.equal(lost.diagnostics.facelets,before.diagnostics.facelets);assert.deepEqual(lost.diagnostics.solution,before.diagnostics.solution);await save(tab,directory,"context-lost",lost);
  await tab.playwright.locator("#next-button").press("Enter");const moved=await observe(tab);assert.equal(moved.diagnostics.step,1);await save(tab,directory,"context-lost-step",moved);
  await tab.playwright.locator("#rubend-test-restore-context").press("Enter");await tab.playwright.locator("#fallback").waitFor({state:"hidden",timeoutMs:5000});const restored=await observe(tab);assert.equal(restored.diagnostics.facelets,moved.diagnostics.facelets);assert.equal(restored.diagnostics.step,1);assert.deepEqual(restored.diagnostics.solution,before.diagnostics.solution);await save(tab,directory,"context-restored",restored);return restored;
}
export async function downloadRecord(tab,directory){
  await tab.playwright.locator("#export-button").press("Enter");await tab.getAXState({emit:false});const record=JSON.parse(await tab.playwright.locator("#export-record").evaluate(el=>el.value));
  const pending=tab.playwright.waitForEvent("download",{timeoutMs:10000});await tab.playwright.locator("#download-record").press("Enter");const download=await pending,path=await download.path({timeoutMs:10000});assert.ok(path);const downloaded=JSON.parse(await readFile(path,"utf8"));assert.deepEqual(downloaded,record);assert.equal(apply(record.facelets,record.moves.map(m=>names.indexOf(m))),solved);await writeFile(directory+"/downloaded-record.json",JSON.stringify(downloaded,null,2)+"\n",{flag:"wx"});
  await tab.playwright.locator("#close-export").press("Enter");await tab.getAXState({emit:false});return downloaded;
}
export async function reloadSaved(tab,directory){
  const before=await observe(tab);await tab.reload();await tab.playwright.locator("#rubend-test-diagnostics").filter({hasText:before.diagnostics.facelets}).waitFor({state:"attached",timeoutMs:10000});const after=await observe(tab);assert.equal(after.diagnostics.facelets,before.diagnostics.facelets);assert.equal(after.diagnostics.solution,null);await save(tab,directory,"saved-state-reloaded",{before,after});return after;
}
export async function clipboardDenial(tab,directory){
  await tab.playwright.locator("#copy-button").press("Enter");await tab.getAXState({emit:false});const message=await tab.playwright.locator("#search-status").textContent(),fixture=JSON.parse(await tab.playwright.locator("#rubend-test-clipboard-status").textContent());await save(tab,directory,"clipboard-observation",{message,fixture,state:await observe(tab)});assert.equal(message,"Clipboard unavailable. Use Export to save the moves.");
}
export async function fallback(tab,directory){
  await tab.playwright.locator("#fallback").waitFor({state:"visible",timeoutMs:5000});await shallow(tab,directory,"fallback");const before=await observe(tab);assert.equal(before.diagnostics.renderer,null);
  await tab.playwright.locator("#next-button").press("Enter");const stepped=await observe(tab);assert.equal(stepped.diagnostics.step,1);
  await tab.playwright.locator("#play-button").press("Enter");await tab.playwright.getByText("4 / 4",{exact:true}).waitFor({state:"visible",timeoutMs:5000});const after=await observe(tab);assert.equal(after.diagnostics.facelets,solved);assert.equal(after.diagnostics.playing,false);assert.equal(after.diagnostics.renderer,null);await save(tab,directory,"fallback-solved",{before,stepped,after});return after;
}
export async function narrow(tab,directory){
  const size=await tab.playwright.evaluate(()=>({width:document.documentElement.clientWidth,scrollWidth:document.documentElement.scrollWidth}));assert.ok(size.width<=420);assert.ok(size.scrollWidth<=size.width);
  for(const id of["cube-input","apply-button","solve-button","export-button"]){assert.equal(await tab.playwright.locator("#"+id).isVisible(),true);const rect=await tab.playwright.locator("#"+id).evaluate(el=>{const r=el.getBoundingClientRect();return{left:r.left,right:r.right};});assert.ok(rect.left>=0&&rect.right<=size.width,id+" exceeds narrow viewport");}
  await save(tab,directory,"narrow-layout",{size,state:await observe(tab)});
}
export async function rewindFailure(tab,directory){
  await shallow(tab,directory,"rewind");await tab.playwright.locator("#next-button").press("Enter");await tab.playwright.getByText("1 / 4",{exact:true}).waitFor({state:"visible",timeoutMs:5000});const before=await observe(tab);assert.equal(before.diagnostics.step,1);
  await tab.playwright.locator("#first-button").press("Enter");await tab.playwright.locator("#rubend-test-diagnostics").filter({hasText:'"modelState":"failed"'}).waitFor({state:"attached",timeoutMs:5000});await tab.getAXState({emit:false});const read=async()=>JSON.parse(await tab.playwright.locator("#rubend-test-diagnostics").textContent()),failed=await read();assert.equal(failed.diagnostics.modelState,"failed");assert.equal(failed.diagnostics.step,1);
  for(let i=0;i<10;i++)await tab.playwright.locator("#camera-button").press("Space");await tab.playwright.locator("#camera-button").press("ArrowLeft");await tab.getAXState({emit:false});const after=await read();assert.ok(after.ticks>failed.ticks);assert.equal(after.diagnostics.playing,false);assert.equal(after.diagnostics.pendingModelRequests,0);assert.equal(after.diagnostics.step,1);assert.equal(after.diagnostics.facelets,before.diagnostics.facelets);assert.deepEqual(after.diagnostics.solution,before.diagnostics.solution);await save(tab,directory,"rewind-failure",{before,failed,after,spacePresses:10});
  await tab.playwright.locator("#export-button").press("Enter");await tab.getAXState({emit:false});const record=JSON.parse(await tab.playwright.locator("#export-record").evaluate(el=>el.value));assert.equal(record.replayCertified,true);assert.equal(apply(record.facelets,record.moves.map(m=>names.indexOf(m))),solved);await save(tab,directory,"rewind-retained-export",record);
}
export async function nativeSearch(tab,directory,text){
  await tab.playwright.locator("#cube-input").fill(text);await tab.playwright.locator("#apply-button").press("Enter");await tab.playwright.locator("#exact-mode").press("Enter");await tab.playwright.locator("#budget").press("End");await tab.playwright.locator("#solve-button").press("Enter");await tab.playwright.locator("#cancel-button").waitFor({state:"visible",timeoutMs:5000});const value=await observe(tab);assert.equal(value.diagnostics.searching,true);assert.equal(value.diagnostics.lastRun.budgetMs,15000);await save(tab,directory,"native-search-running",value);
}
export async function nativeFailed(tab,directory){
  await tab.playwright.getByText("Engine offline",{exact:true}).waitFor({state:"visible",timeoutMs:5000});const value=await observe(tab);assert.equal(value.diagnostics.searching,false);assert.ok(value.diagnostics.lastRun.events.some(e=>e.type==="error"));assert.equal(await tab.playwright.locator("#solve-button").isEnabled(),false);assert.equal(await tab.playwright.locator("#cancel-button").isVisible(),false);await save(tab,directory,"native-failed-settled",value);
}
export async function warming(tab,directory){
  await tab.playwright.getByText("Engine warming up",{exact:true}).waitFor({state:"visible",timeoutMs:5000});const before=await observe(tab);assert.equal(await tab.playwright.locator("#solve-button").isEnabled(),false);assert.equal(before.diagnostics.searching,false);
  await tab.playwright.locator("#cube-input").fill("R U R' U'");await tab.playwright.locator("#apply-button").press("Enter");const after=await observe(tab);assert.equal(await tab.playwright.locator("#solve-button").isEnabled(),false);assert.equal(after.diagnostics.searching,false);assert.equal(after.diagnostics.lastRun,null);assert.equal(after.diagnostics.facelets,apply(solved,[3,0,5,2]));await save(tab,directory,"warming-input-isolated",{before,after});
}
