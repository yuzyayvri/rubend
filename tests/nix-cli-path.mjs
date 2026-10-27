import assert from "node:assert/strict";
import {realpathSync} from "node:fs";
import {spawnSync} from "node:child_process";
import {nixCliPath} from "../bench/nix-cli-path.mjs";

const modern=nixCliPath("nix"),legacy=nixCliPath("nix-store"),storeRoot=realpathSync(process.execPath).split("/").slice(0,4).join("/"),args=["--query","--hash",storeRoot],run=program=>spawnSync(program,args,{encoding:"utf8",timeout:10000}),good=run(legacy);assert.equal(good.status,0,good.stderr);assert.match(good.stdout,/^sha256[:\-]/);assert.equal(realpathSync(modern),realpathSync(legacy));const bad=run(realpathSync(legacy));assert.equal(bad.status,1);assert.match(bad.stderr,/unrecognised flag '--query'/);assert.throws(()=>nixCliPath("unknown"));console.log(JSON.stringify({passed:true,actualLegacyQuery:true,realpathMutationRejected:true,sharedMulticallBinaryObserved:true,noBuildOrQueue:true}));
