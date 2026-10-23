import assert from "node:assert/strict";
import {FrameDriver,renderLabel} from "../apps/web/scene.mjs";

let serial=0,steps=0,keep=0,reenter=false;const pending=new Map(),cancelled=new Map(),request=fn=>{const id=++serial;pending.set(id,fn);return id;},cancel=id=>{cancelled.set(id,pending.get(id));pending.delete(id);},dirty=[],driver=new FrameDriver((time,changed)=>{steps++;dirty.push(changed);if(reenter){reenter=false;driver.invalidate();}return keep-->0;},request,cancel);
const tick=time=>{assert.equal(pending.size,1);const[id,fn]=pending.entries().next().value;pending.delete(id);fn(time);};
for(let i=0;i<20;i++)driver.invalidate();assert.equal(pending.size,1);tick(0);assert.equal(pending.size,0);assert.equal(steps,1);assert.deepEqual(dirty,[true]);
keep=2;driver.invalidate();tick(17);tick(34);tick(51);assert.equal(pending.size,0);assert.deepEqual(dirty.slice(1),[true,false,false]);
reenter=true;driver.invalidate();tick(68);assert.equal(pending.size,1);tick(85);assert.equal(pending.size,0);assert.equal(dirty.at(-1),true);
driver.invalidate();const oldId=[...pending.keys()][0];driver.suspend(true);assert.equal(pending.size,0);driver.invalidate();assert.equal(pending.size,0);driver.suspend(false);const before=steps;cancelled.get(oldId)(102);assert.equal(steps,before);assert.equal(pending.size,1);tick(119);assert.equal(pending.size,0);assert.equal(dirty.at(-1),true);
driver.invalidate();const disposedId=[...pending.keys()][0];driver.dispose();driver.invalidate();driver.suspend(false);cancelled.get(disposedId)(136);assert.equal(pending.size,0);assert.equal(steps,before+1);
assert.equal(renderLabel(null),"2D controls remain available without a 3D renderer.");assert.equal(renderLabel({status:"idle",averageFrameMs:null}),"3D ready · idle.");assert.match(renderLabel({status:"lost"}),/context lost/);assert.match(renderLabel({status:"hidden"}),/paused/);assert.match(renderLabel({status:"active",averageFrameMs:1000/60,p95FrameMs:16.8,frames:10}),/60 fps/);
const savedRequest=globalThis.requestAnimationFrame,savedCancel=globalThis.cancelAnimationFrame;
try{globalThis.requestAnimationFrame=function(){assert.ok(this===globalThis,"RAF receiver must remain the global browser object");return 901;};globalThis.cancelAnimationFrame=function(id){assert.ok(this===globalThis,"Cancel RAF receiver must remain the global browser object");assert.equal(id,901);};const nativeDefaults=new FrameDriver(()=>false);nativeDefaults.invalidate();nativeDefaults.dispose();}finally{globalThis.requestAnimationFrame=savedRequest;globalThis.cancelAnimationFrame=savedCancel;}
console.log(JSON.stringify({passed:true,coalescedInvalidations:20,dampingContinuation:true,reentrantDirtyPreserved:true,staleCancelledCallbacksIgnored:true,suspendResumeAndDispose:true,idleNotFallback:true,steps}));
