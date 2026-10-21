import assert from "node:assert/strict";
import {mkdir,writeFile} from "node:fs/promises";
import {apply,solved} from "../apps/model.mjs";

const names=[..."URFDLB"].flatMap(f=>[f,f+"2",f+"'"]);
async function observe(tab){
  await tab.getAXState({emit:false});
  const value=JSON.parse(await tab.playwright.locator("#rubend-test-diagnostics").textContent());
  assert.equal(value.format,"rubend-dom-diagnostics-v1");assert.ok(value.diagnostics);assert.equal(value.diagnostics.modelState,"active");return value;
}
function canonical(value){const d=value.diagnostics;if(d.solution)assert.equal(d.facelets,apply(d.solution.origin,d.solution.moves.slice(0,d.step)));}
async function save(tab,directory,name,value){
  await mkdir(directory,{recursive:true});await writeFile(directory+"/"+name+".json",JSON.stringify(value,null,2),{flag:"wx"});await writeFile(directory+"/"+name+".jpg",await tab.screenshot({fullPage:true}),{flag:"wx"});
}
async function enter(tab,text){await tab.playwright.locator("#cube-input").fill(text);await tab.playwright.locator("#apply-button").click();}
async function solve(tab){await tab.playwright.getByText("Bend 2 · Local",{exact:true}).waitFor({state:"visible",timeoutMs:30000});await tab.playwright.locator("#exact-mode").click();await tab.playwright.locator("#solve-button").click();await tab.playwright.locator("#cancel-button").waitFor({state:"hidden",timeoutMs:10000});}
export async function shallow(tab,directory,role){
  await enter(tab,"R U R' U'");await solve(tab);const value=await observe(tab),d=value.diagnostics;canonical(value);
  assert.equal(d.solution.moves.length,4);assert.equal(d.solution.lower,4);assert.equal(d.solution.optimal,true);assert.equal(d.searching,false);assert.equal(apply(d.solution.origin,d.solution.moves),solved);
  await save(tab,directory,role+"-shallow",value);
  await tab.playwright.locator("#export-button").press("Enter");await tab.getAXState({emit:false});const exported=JSON.parse(await tab.playwright.locator("#export-record").evaluate(el=>el.value));
  assert.equal(exported.htm,4);assert.equal(exported.lowerBound,4);assert.equal(exported.replayCertified,true);assert.equal(exported.searchOptimal,true);assert.equal(apply(exported.facelets,exported.moves.map(m=>names.indexOf(m))),solved);
  await save(tab,directory,role+"-export",exported);await tab.playwright.locator("#close-export").press("Enter");await tab.getAXState({emit:false});return value;
}
export async function playback(tab,directory){
  await tab.playwright.locator("#guide-button").click();await tab.getAXState({emit:false});await tab.playwright.locator("#reduced-motion").check();await tab.playwright.locator("#close-guide").click();await tab.getAXState({emit:false});
  await tab.playwright.locator("#next-button").press("Enter");let value=await observe(tab);assert.equal(value.diagnostics.step,1);canonical(value);await save(tab,directory,"head-step-1",value);
  await tab.playwright.locator("#camera-button").press("ArrowRight");value=await observe(tab);assert.equal(value.diagnostics.step,2);canonical(value);await save(tab,directory,"head-keyboard-step-2",value);
  await tab.playwright.locator("#play-button").press("Enter");await tab.playwright.getByText("4 / 4",{exact:true}).waitFor({state:"visible",timeoutMs:5000});value=await observe(tab);assert.equal(value.diagnostics.facelets,solved);assert.equal(value.diagnostics.playing,false);canonical(value);await save(tab,directory,"head-playback-complete",value);
  await tab.playwright.locator("#back-button").press("Enter");value=await observe(tab);assert.equal(value.diagnostics.step,3);canonical(value);
  await tab.playwright.locator("#first-button").press("Enter");value=await observe(tab);assert.equal(value.diagnostics.step,0);canonical(value);await save(tab,directory,"head-rewind",value);return value;
}
export async function invalid(tab,directory){
  const before=await observe(tab);await enter(tab,"U".repeat(54));const value=await observe(tab);assert.equal(value.diagnostics.revision,before.diagnostics.revision);assert.equal(value.diagnostics.facelets,before.diagnostics.facelets);assert.equal(await tab.playwright.locator("#input-error").isVisible(),true);canonical(value);await save(tab,directory,"head-invalid",value);return value;
}
export async function solvedCase(tab,directory){
  await tab.playwright.locator("#reset-button").click();await solve(tab);const value=await observe(tab);assert.equal(value.diagnostics.facelets,solved);assert.equal(value.diagnostics.solution.moves.length,0);assert.equal(value.diagnostics.solution.lower,0);assert.equal(value.diagnostics.solution.optimal,true);await save(tab,directory,"head-solved",value);return value;
}
export async function timeout(tab,directory,facelets,label,expectAnswer){
  await enter(tab,facelets);await tab.playwright.locator("#budget").press("Home");await solve(tab);const value=await observe(tab),d=value.diagnostics;assert.equal(d.searching,false);assert.equal(d.lastRun.budgetMs,250);assert.equal(d.lastRun.events.at(-1).optimal,0);
  if(expectAnswer){assert.ok(d.solution);assert.equal(d.solution.optimal,false);assert.ok(d.solution.lower<d.solution.moves.length);canonical(value);}
  else{assert.equal(d.solution,null);assert.equal(await tab.playwright.locator("#export-button").isEnabled(),false);}
  await save(tab,directory,label,value);return value;
}
export async function cancelResubmit(tab,directory,facelets){
  await enter(tab,facelets);await tab.playwright.locator("#budget").press("End");await tab.playwright.locator("#solve-button").click();await tab.playwright.locator("#cancel-button").click();const cancelled=await observe(tab);assert.equal(cancelled.diagnostics.searching,false);await save(tab,directory,"head-cancelled",cancelled);
  await enter(tab,"R U R' U'");await solve(tab);const value=await observe(tab);assert.equal(value.diagnostics.solution.moves.length,4);assert.equal(value.diagnostics.solution.optimal,true);canonical(value);await save(tab,directory,"head-resubmitted",value);return value;
}
export async function workerFailure(tab,directory){
  await shallow(tab,directory,"before-failure");
  await tab.playwright.locator("#next-button").press("Enter");await tab.getAXState({emit:false});
  const read=async()=>JSON.parse(await tab.playwright.locator("#rubend-test-diagnostics").textContent());
  const before=await read();assert.equal(before.diagnostics.modelState,"failed");assert.equal(before.diagnostics.pendingModelRequests,0);assert.equal(before.diagnostics.step,0);assert.equal(before.diagnostics.playing,false);
  for(let i=0;i<20;i++)await tab.playwright.locator("#camera-button").press("Space");
  await tab.playwright.locator("#camera-button").press("ArrowLeft");await tab.playwright.locator("#camera-button").press("ArrowRight");await tab.getAXState({emit:false});
  await tab.playwright.locator("#theme-button").press("Enter");await tab.getAXState({emit:false});
  const after=await read();assert.ok(after.ticks>before.ticks);assert.equal(after.diagnostics.modelState,"failed");assert.equal(after.diagnostics.playing,false);assert.equal(after.diagnostics.pendingModelRequests,0);assert.equal(after.diagnostics.step,0);assert.equal(after.diagnostics.facelets,before.diagnostics.facelets);assert.deepEqual(after.diagnostics.solution,before.diagnostics.solution);assert.equal(await tab.playwright.locator("#play-button").isEnabled(),false);assert.equal(await tab.playwright.locator("#timeline").isEnabled(),false);
  await save(tab,directory,"worker-failure-responsive",{before,after,spaceKeyPresses:20});
  await tab.playwright.locator("#export-button").press("Enter");await tab.getAXState({emit:false});const exported=JSON.parse(await tab.playwright.locator("#export-record").evaluate(el=>el.value));assert.equal(exported.htm,4);assert.equal(exported.replayCertified,true);assert.equal(apply(exported.facelets,exported.moves.map(m=>names.indexOf(m))),solved);await save(tab,directory,"worker-failure-export",exported);return after;
}
export async function capabilityFailure(tab,directory){
  await tab.playwright.getByText("Engine offline",{exact:true}).waitFor({state:"visible",timeoutMs:10000});await tab.getAXState({emit:false});
  assert.match(await tab.playwright.locator("#search-status").textContent(),/Unsupported engine protocol/);assert.equal(await tab.playwright.locator("#solve-button").isEnabled(),false);
  const value=JSON.parse(await tab.playwright.locator("#rubend-test-diagnostics").textContent());assert.equal(value.diagnostics.searching,false);assert.equal(value.diagnostics.solution,null);assert.equal(value.diagnostics.pendingModelRequests,0);await save(tab,directory,"capability-mismatch",value);return value;
}
