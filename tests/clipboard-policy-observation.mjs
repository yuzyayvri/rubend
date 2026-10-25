import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {runInNewContext} from "node:vm";

const source=readFileSync("tests/fixtures/clipboard-policy-observation.js","utf8"),callbacks=new Map(),outputs=[];let copies=0,interval;
const original=async()=>{copies++;},clipboard={writeText:original},navigator={clipboard,permissions:{async query(value){assert.equal(value.name,"clipboard-write");return{state:"denied"};}}},document={permissionsPolicy:{allowsFeature(feature){assert.equal(feature,"clipboard-write");return false;}},createElement(name){assert.equal(name,"output");return{};},body:{append(output){outputs.push(output);}},addEventListener(name,fn){callbacks.set(name,fn);}};
runInNewContext(source,{navigator,document,isSecureContext:true,Date,setInterval(fn){interval=fn;}});await callbacks.get("DOMContentLoaded")();assert.equal(outputs.length,1);assert.equal(outputs[0].id,"rubend-test-clipboard-policy");assert.equal(outputs[0].hidden,true);
const before=JSON.parse(outputs[0].textContent);assert.equal(before.policyAllowed,false);assert.equal(before.permission,"denied");assert.equal(before.clipboardWriteUnchanged,true);assert.equal(copies,0);assert.equal(clipboard.writeText,original);
clipboard.writeText=async()=>{};callbacks.get("click")();const after=JSON.parse(outputs[0].textContent);assert.equal(after.clipboardWriteUnchanged,false);interval();assert.equal(copies,0);
console.log(JSON.stringify({passed:true,observerNeverWritesClipboard:true,realPolicyRead:true,methodReplacementDetected:true,browserClaim:false}));
