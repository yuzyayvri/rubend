import assert from "node:assert/strict";
import {spawnSync} from "node:child_process";
import {readFileSync} from "node:fs";
import {randomBytes} from "node:crypto";
import {deliveryPin} from "../bench/delivery-pins.mjs";

const legacy=deliveryPin(),current=deliveryPin("redesign");
assert.equal(legacy,deliveryPin("legacy"));assert.equal(legacy.artifactId,12205837803);assert.equal(current.artifactId,12429624367);assert.notEqual(legacy.commit,current.commit);
for(const pin of[legacy,current]){assert.ok(Object.isFrozen(pin));assert.match(pin.commit,/^[a-f0-9]{40}$/);assert.match(pin.zipSha256,/^[a-f0-9]{64}$/);for(const k of["runId","artifactId","sizeBytes"])assert.ok(Number.isSafeInteger(pin[k])&&pin[k]>0);assert.throws(()=>{pin.artifactId=0;},TypeError);}
for(const name of["missing","__proto__","constructor","toString",null])assert.throws(()=>deliveryPin(name),/Unknown pinned delivery/);
function exec(file,args){const r=spawnSync(process.execPath,[file,...args],{encoding:"utf8",timeout:10000});assert.ifError(r.error);return r;}
for(const pinName of["legacy","redesign"]){
  const id="u01-delivery-fixture-"+randomBytes(8).toString("hex"),r=exec("bench/u01-delivery.mjs",["plan",id,pinName]);assert.equal(r.status,0,r.stderr);const p=JSON.parse(readFileSync(JSON.parse(r.stdout).path,"utf8"));assert.deepEqual(p.deliveryPin,{name:pinName,...deliveryPin(pinName)});assert.equal(p.jobs.length,2);assert.equal(p.queueHardLimitMinutes,12);assert.equal(p.expectedMinutes,5);assert.equal(p.jobs.reduce((n,j)=>n+j.seconds,0),720);
  for(const [i,j]of p.jobs.entries()){assert.equal(j.memoryMiB,3072);assert.deepEqual(j.cpus,[2]);assert.deepEqual(j.command,[process.execPath,"bench/u01-delivery.mjs",i===0?"check":"deliver",id,pinName]);}
}
const badPin=exec("bench/u01-delivery.mjs",["plan","u01-delivery-invalid-fixture","unknown"]);assert.notEqual(badPin.status,0);assert.match(badPin.stderr,/Unknown pinned delivery/);
for(const [file,args]of[["tests/ui-fixture-server.mjs",["delivered","u01-live-invalid-fixture","../escape"]],["tests/ui-fixture-session.mjs",["--delivered","../escape"]]]){const r=exec(file,args);assert.notEqual(r.status,0);assert.match(r.stderr,/did not match the regular expression/);assert.match(r.stderr,/\.\.\/escape/);}
console.log(JSON.stringify({passed:true,pins:2,immutable:true,rejectedNames:5,plansCarryIdentity:true,rejectedReceiptPaths:2,browserClaim:false}));
