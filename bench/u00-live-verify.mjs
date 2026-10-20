import assert from "node:assert/strict";
import {readFileSync,writeFileSync,mkdirSync,copyFileSync,existsSync} from "node:fs";
import {resolve} from "node:path";
import {spawnSync,execFileSync} from "node:child_process";
import {createHash} from "node:crypto";
import {apply,solved} from "../apps/model.mjs";
import {scorecard} from "./scorecard.mjs";
import {nativeIdentity} from "./startup-measure.mjs";

const id=process.argv[2];assert.equal(process.argv.length,3);assert.match(id,/^u00-live-[a-z0-9-]+$/);
const source=resolve("build/evidence/next-plan/U00",id),read=name=>JSON.parse(readFileSync(resolve(source,name+".json"),"utf8"));
const suite=read("browser-summary"),session=read("session");assert.equal(suite.passed,true);assert.equal(session.state,"stopped-cleanly");
for(const server of session.servers){assert.equal(server.exitCode,0);for(const n of server.native){assert.notEqual(nativeIdentity(n.pid)?.startTicks,n.startTicks);assert.equal(existsSync(n.ipcDirectory),false);}}
const checked=["head-verified-shallow","baseline-shallow","head-step-1","head-keyboard-step-2","head-playback-complete","head-rewind","head-hard-timeout","head-no-answer","head-cancelled","head-resubmitted","head-invalid","head-solved"];
for(const name of checked){const d=read(name).diagnostics;assert.equal(d.modelState,"active");assert.equal(d.searching,false);if(d.solution){assert.equal(d.facelets,apply(d.solution.origin,d.solution.moves.slice(0,d.step)));assert.equal(apply(d.solution.origin,d.solution.moves),solved);}}
assert.deepEqual(read("head-verified-shallow").diagnostics.solution.moves,read("baseline-shallow").diagnostics.solution.moves);
assert.equal(read("head-playback-complete").diagnostics.facelets,solved);assert.equal(read("head-keyboard-step-2").diagnostics.step,2);assert.equal(read("head-rewind").diagnostics.step,0);
assert.equal(read("head-invalid").diagnostics.revision,read("head-resubmitted").diagnostics.revision);assert.equal(read("head-solved").diagnostics.solution.moves.length,0);
const cards={};for(const name of["head-hard-timeout","head-no-answer"]){const run=read(name).diagnostics.lastRun;cards[name]=scorecard([{id:name,facelets:run.origin}],[{id:name,facelets:run.origin,mode:run.mode,budgetMs:run.budgetMs,status:"ok",events:run.events}],{deadlines:[run.budgetMs]}).observations.map(({cases,...summary})=>summary);}
assert.equal(cards["head-no-answer"][0].answered,0);assert.equal(read("head-hard-timeout").diagnostics.solution.optimal,false);
assert.equal(spawnSync("git",["diff","--quiet","a7a0872","--","src","apps","flake.nix","flake.lock","package.json","package-lock.json"],{stdio:"ignore"}).status,0,"Load-bearing application source differs from trunk control");
const destination=resolve("docs/verification/next-plan/U00",id);mkdirSync(destination);
const archives=[...checked,"head-verified-export","baseline-export","browser-summary","session"].map((name,index)=>JSON.parse(execFileSync(process.execPath,["bench/archive-evidence.mjs",resolve(source,name+".json"),resolve(destination,index+"-"+name+".json.gz")],{encoding:"utf8"})));
const images=["head-verified-shallow","head-hard-timeout","head-playback-complete"];for(const name of images)copyFileSync(resolve(source,name+".jpg"),resolve(destination,name+".jpg"));
const hash=path=>createHash("sha256").update(readFileSync(path)).digest("hex"),summary={format:"rubend-u00-live-verified-v1",passed:true,lanesCovered:[1,2,3,4,6,7,8,9],pendingLanes:[5,10],trunkApplicationSourceIdentical:true,testOnlyDomBridge:true,defaultSmallProfileOnly:true,canonicalReceipts:checked.length,cards,independentReview:false,performanceClaim:false,producerHashes:Object.fromEntries(["tests/u00-browser-driver.mjs","tests/fixtures/ui-diagnostics.mjs"].map(p=>[p,hash(p)]))};
writeFileSync(resolve(destination,"index.json"),JSON.stringify({summary,archives,images},null,2)+"\n",{flag:"wx"});console.log(JSON.stringify({...summary,cards:undefined,producerHashes:undefined}));
