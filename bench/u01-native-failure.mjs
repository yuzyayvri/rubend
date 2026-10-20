import assert from "node:assert/strict";
import {readFileSync,writeFileSync,existsSync} from "node:fs";
import {resolve} from "node:path";
import {nativeIdentity} from "./startup-measure.mjs";

const id=process.argv[2];assert.equal(process.argv.length,3);assert.match(id,/^u01-live-native-[a-z0-9-]+$/);
const directory=resolve("build/evidence/next-plan/U01",id),record=resolve(directory,"native-kill.json"),s=JSON.parse(readFileSync(resolve(directory,"session.json"),"utf8"));assert.equal(existsSync(record),false);assert.equal(s.state,"ready");assert.equal(s.mode,"acceptance");assert.equal(s.native.length,1);
for(const owner of[s.wrapper,s.server])assert.equal(nativeIdentity(owner.pid)?.startTicks,owner.startTicks,"Session owner identity changed");
const owner=s.native[0];assert.equal(nativeIdentity(owner.pid)?.startTicks,owner.startTicks,"Native owner identity changed");assert.ok(readFileSync(`/proc/${owner.pid}/cmdline`,"utf8").split("\0").includes(resolve(owner.ipcDirectory,"input")),"Native IPC identity changed");
process.kill(owner.pid,"SIGKILL");writeFileSync(record,JSON.stringify({format:"rubend-u01-native-failure-v1",signal:"SIGKILL",owner,issuedAt:new Date().toISOString()},null,2)+"\n",{flag:"wx"});console.log(JSON.stringify({issued:true,signal:"SIGKILL",pid:owner.pid}));
