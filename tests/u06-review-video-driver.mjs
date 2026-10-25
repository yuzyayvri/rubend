import assert from "node:assert/strict";
import {mkdir,writeFile,readFile} from "node:fs/promises";
import {resolve} from "node:path";
import {createHash} from "node:crypto";
import {shallow} from "./u00-browser-driver.mjs";
import {observe,cameraOrbit} from "./u06-browser-driver.mjs";
import {apply,solved} from "../bench/fixed-work-model.mjs";

export async function recordReview(tab,directoryPath,scenario){
  assert.ok(["desktop","fallback","failure"].includes(scenario));const directory=resolve(directoryPath);assert.ok(directory.startsWith(resolve("build")+"/"));await mkdir(directory+"/frames",{recursive:true});
  const ready=JSON.parse(await readFile(resolve(directory,"..",scenario+"-ready.json"),"utf8"));assert.equal(new URL(await tab.url()).origin,ready.origin);await tab.playwright.getByText("Bend 2 · Local",{exact:true}).waitFor({state:"visible",timeoutMs:30000});await tab.getAXState({emit:false});
  const frames=[],phases=[],started=performance.now();let error=null;
  const read=async()=>JSON.parse(await tab.playwright.locator("#rubend-test-diagnostics").textContent());
  const record=async label=>{assert.ok(frames.length<120&&performance.now()-started<90000);await tab.getAXState({emit:false});const value=await read();assert.equal(value.visibility,"visible");phase(label,value);const before=performance.now(),bytes=await tab.screenshot({fullPage:true}),mime=bytes[0]===137&&bytes[1]===80?"png":bytes[0]===255&&bytes[1]===216?"jpg":null;assert.ok(mime,"Screenshot is neither PNG nor JPEG");const path=resolve(directory,"frames",String(frames.length).padStart(4,"0")+"."+mime);await writeFile(path,bytes,{flag:"wx"});frames.push({label,path,mime,sha256:createHash("sha256").update(bytes).digest("hex"),bytes:bytes.byteLength,requestedMs:before-started,capturedMs:performance.now()-started});};
  function phase(name,value){const d=value.diagnostics??value;if(d.solution)assert.equal(d.facelets,apply(d.solution.origin,d.solution.moves.slice(0,d.step)));phases.push({name,atMs:performance.now()-started,value});}
  try{
    await record("ready");
    if(scenario==="desktop"){
      phase("exact-shallow-solve",await shallow(tab,directory,"video"));
      await record("native-answer");await tab.playwright.locator("#export-button").press("Enter");await record("export-record");await tab.playwright.locator("#close-export").press("Enter");await tab.getAXState({emit:false});
      await tab.playwright.locator("#guide-button").press("Enter");await tab.getAXState({emit:false});await tab.playwright.locator("#reduced-motion").uncheck();await record("animation-controls");await tab.playwright.locator("#close-guide").press("Enter");await tab.getAXState({emit:false});await tab.playwright.locator("#speed").selectOption({label:"Slow"});await tab.getAXState({emit:false});
      await tab.playwright.locator("#play-button").press("Enter");for(let i=0;i<3;i++)await record("slow-playback-"+i);await tab.playwright.getByText("4 / 4",{exact:true}).waitFor({state:"visible",timeoutMs:5000});const played=await observe(tab);assert.equal(played.diagnostics.facelets,solved);assert.equal(played.diagnostics.playing,false);await record("playback-complete");
      await tab.playwright.locator("#first-button").press("Enter");await tab.getAXState({emit:false});await tab.playwright.getByText("0 / 4",{exact:true}).waitFor({state:"visible",timeoutMs:5000});await record("rewind");phase("camera-and-idle",await cameraOrbit(tab,directory));await record("camera-home-idle");
      await tab.playwright.locator("#guide-button").press("Enter");await tab.getAXState({emit:false});await tab.playwright.locator("#reduced-motion").check();await tab.playwright.locator("#close-guide").press("Enter");await tab.getAXState({emit:false});await tab.playwright.locator("#next-button").press("Enter");phase("reduced-motion-step",await observe(tab));await record("reduced-motion-step");
    }else if(scenario==="fallback"){
      await tab.playwright.locator("#fallback").waitFor({state:"visible",timeoutMs:5000});const value=await shallow(tab,directory,"fallback-video");assert.equal(value.diagnostics.renderer,null);await record("fallback-native-answer");await tab.playwright.locator("#speed").selectOption({label:"Slow"});await tab.getAXState({emit:false});
      await tab.playwright.locator("#next-button").press("Enter");await record("fallback-step");await tab.playwright.locator("#play-button").press("Enter");for(let i=0;i<3;i++)await record("fallback-playback-"+i);await tab.playwright.getByText("4 / 4",{exact:true}).waitFor({state:"visible",timeoutMs:5000});const end=await observe(tab);assert.equal(end.diagnostics.facelets,solved);assert.equal(end.diagnostics.renderer,null);await record("fallback-solved");await tab.playwright.locator("#first-button").press("Enter");await record("fallback-rewind");
    }else{
      await shallow(tab,directory,"failure-video");await record("native-answer-before-failure");await tab.playwright.locator("#next-button").press("Enter");await tab.playwright.getByText("1 / 4",{exact:true}).waitFor({state:"visible",timeoutMs:5000});const before=await observe(tab);await record("valid-step-before-failure");
      await tab.playwright.locator("#first-button").press("Enter");await tab.playwright.locator("#rubend-test-diagnostics").filter({hasText:'"modelState":"failed"'}).waitFor({state:"attached",timeoutMs:5000});await record("failed-rewind-retains-step");const failed=await read();assert.equal(failed.diagnostics.step,1);
      for(let i=0;i<10;i++)await tab.playwright.locator("#camera-button").press("Space");await tab.playwright.locator("#camera-button").press("ArrowLeft");await record("failed-model-keyboard-responsive");const after=await read();assert.ok(after.ticks>failed.ticks);assert.equal(after.diagnostics.playing,false);assert.equal(after.diagnostics.pendingModelRequests,0);assert.equal(after.diagnostics.step,1);assert.equal(after.diagnostics.facelets,before.diagnostics.facelets);assert.deepEqual(after.diagnostics.solution,before.diagnostics.solution);
      await tab.playwright.locator("#export-button").press("Enter");await tab.getAXState({emit:false});const exported=JSON.parse(await tab.playwright.locator("#export-record").evaluate(el=>el.value)),names=[..."URFDLB"].flatMap(f=>[f,f+"2",f+"'"]);assert.equal(exported.replayCertified,true);assert.equal(apply(exported.facelets,exported.moves.map(m=>names.indexOf(m))),solved);await record("failed-model-retained-export");await tab.playwright.locator("#close-export").press("Enter");await record("failed-model-final-responsive-state");
    }
  }catch(e){error=e;}
  try{assert.ok(frames.length>=6,"Too few sampled UI frames");assert.ok(new Set(frames.map(f=>f.sha256)).size>=3,"Recording lacks distinct UI states");}catch(e){if(!error)error=e;}
  const result={passed:error===null,format:"rubend-sampled-ui-review-v1",scenario,frames,phases,elapsedMs:performance.now()-started,error:error?String(error.stack??error):null,source:"Actual full-page screenshots captured sequentially between semantic UI actions on the sealed app",screenshotOwner:"Single serial caller; no background capture loop",sampledReviewNotRealTimeCapture:true,canonicalReplayCheckedAtPhaseBoundaries:true,intermediateAnimationPixelsNotCommittedStates:true,frameCadencePerformanceMeasured:false,uiSourceChanged:false,operatorReview:false,clipboardDenial:"unverified",downloadedFile:"unverified",performanceAcceptance:false,releaseHoldoutOpened:false,independentReview:false};
  await writeFile(directory+"/result.json",JSON.stringify(result,null,2)+"\n",{flag:"wx"});if(error)throw error;return{passed:true,scenario,frames:frames.length,distinctFrames:new Set(frames.map(f=>f.sha256)).size,phases:phases.map(p=>p.name),elapsedMs:result.elapsedMs};
}

export async function recordAndClose(tab,browser,directory,scenario){
  try{return await recordReview(tab,directory,scenario);}finally{
    if(scenario==="fallback")await(await browser.capabilities.get("viewport")).reset();await tab.close();const tabs=await browser.tabs.list();assert.equal(tabs.some(t=>t.id===tab.id),false,"Owned review tab remained open");await writeFile(resolve(directory,"cleanup.json"),JSON.stringify({passed:true,tabId:tab.id,tabClosed:true,tabAbsentAfterClose:true,temporaryViewportReset:scenario==="fallback",otherViewportsNotChanged:scenario!=="fallback"})+"\n",{flag:"wx"});
  }
}
