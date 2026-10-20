import assert from "node:assert/strict";
import {mkdirSync,writeFileSync} from "node:fs";
import {resolve} from "node:path";
import {randomBytes} from "node:crypto";
import {spawnSync} from "node:child_process";
import {nativeIdentity} from "../bench/startup-measure.mjs";

const id="u01-live-native-stale-"+randomBytes(8).toString("hex"),directory=resolve("build/evidence/next-plan/U01",id),self=nativeIdentity(process.pid);mkdirSync(directory,{recursive:true});writeFileSync(resolve(directory,"session.json"),JSON.stringify({state:"ready",mode:"acceptance",wrapper:self,server:self,native:[{...self,startTicks:"0"}]}),{flag:"wx"});
const r=spawnSync(process.execPath,["bench/u01-native-failure.mjs",id],{encoding:"utf8",timeout:5000});assert.ifError(r.error);assert.notEqual(r.status,0);assert.match(r.stderr,/Native owner identity changed/);assert.deepEqual(nativeIdentity(process.pid),self);
console.log(JSON.stringify({passed:true,staleNativeIdentityRejected:true,signalNotIssued:true}));
