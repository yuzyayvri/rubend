import assert from "node:assert/strict";
import {ModelClient} from "../apps/web/model-client.mjs";

const solved="UUUUUUUUURRRRRRRRRFFFFFFFFFDDDDDDDDDLLLLLLLLLBBBBBBBBB";
class FakeWorker extends EventTarget {
  sent=[];terminated=0;listeners=0;brokenPost=false;
  addEventListener(...args){this.listeners++;super.addEventListener(...args);}
  removeEventListener(...args){this.listeners--;super.removeEventListener(...args);}
  postMessage(data){if(this.brokenPost)throw Error("Clone failed");this.sent.push(data);}
  terminate(){this.terminated++;}
  send(data){const event=new Event("message");event.data=data;this.dispatchEvent(event);}
  error(type){const event=new Event(type,{cancelable:true});event.message="Worker crashed";this.dispatchEvent(event);}
}
const result=id=>({id,facelets:solved,moves:[],solved:true});let checks=0;
{
  const worker=new FakeWorker(),client=new ModelClient(worker),a=client.request("validate",{facelets:solved,id:999,type:"overwrite"}),b=client.request("scramble");
  assert.equal(worker.sent[0].id,1);assert.equal(worker.sent[0].type,"validate");worker.send(result(2));worker.send(result(1));
  assert.deepEqual(await a,{facelets:solved,moves:[],solved:true});assert.deepEqual(await b,await a);assert.equal(client.pending.size,0);worker.send(result(1));assert.equal(client.state,"active");client.close();assert.equal(worker.listeners,0);checks++;
}
{
  const worker=new FakeWorker(),client=new ModelClient(worker);const p=client.request("input");const rejected=assert.rejects(p,/Bad input/);worker.send({id:1,error:"Bad input"});await rejected;assert.equal(client.state,"active");worker.brokenPost=true;await assert.rejects(client.request("input"),/Clone failed/);assert.equal(client.pending.size,0);worker.brokenPost=false;const next=client.request("validate");worker.send(result(3));await next;client.close();checks++;
}
for(const type of["error","messageerror"]){
  const worker=new FakeWorker();let failures=0;const client=new ModelClient(worker,{onFailure:()=>failures++}),a=assert.rejects(client.request("input"),/Reload to restore cube controls/),b=assert.rejects(client.request("apply"),/Reload to restore cube controls/);
  worker.error(type);await Promise.all([a,b]);assert.equal(client.state,"failed");assert.equal(client.pending.size,0);assert.equal(worker.listeners,0);assert.equal(worker.terminated,1);assert.equal(failures,1);await assert.rejects(client.request("validate"),/unavailable/);client.close();assert.equal(worker.terminated,1);checks++;
}
for(const bad of[null,{id:1,error:4},{id:1,facelets:"bad",moves:[],solved:false},{...result(1),moves:[18]}]){
  const worker=new FakeWorker(),client=new ModelClient(worker),pending=assert.rejects(client.request("validate"),/Invalid cube-worker/);worker.send(bad);await pending;assert.equal(client.pending.size,0);assert.equal(client.state,"failed");checks++;
}
{
  const worker=new FakeWorker(),client=new ModelClient(worker,{timeoutMs:10});await assert.rejects(client.request("validate"),/did not respond/);assert.equal(client.pending.size,0);assert.equal(client.state,"failed");assert.equal(worker.terminated,1);checks++;
}
{
  const worker=new FakeWorker(),client=new ModelClient(worker),pending=assert.rejects(client.request("validate"),/closed/);client.close();await pending;assert.equal(client.pending.size,0);assert.equal(worker.listeners,0);assert.equal(worker.terminated,1);checks++;
}
console.log(JSON.stringify({passed:true,checks,pendingFailuresSettle:true,lateRepliesIgnored:true,transportIdentityNotOverridden:true}));
