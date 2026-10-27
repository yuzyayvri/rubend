import assert from "node:assert/strict";
import {mkdirSync,writeFileSync,renameSync,readFileSync} from "node:fs";
import {resolve} from "node:path";
import {waitForExactDownloadedFile} from "./u01-file-backed-acceptance.mjs";

assert.equal(process.argv.length,3);const output=resolve(process.argv[2]),directory=output+"-fixtures";mkdirSync(directory);const path=resolve(directory,"download.json"),expected='{"verified":"bytes"}\n';
const pending=waitForExactDownloadedFile(path,expected,1000);writeFileSync(path,"{");setTimeout(()=>writeFileSync(path,expected),10);const accepted=await pending.promise;assert.equal(accepted.absentBeforeAction,true);assert.equal(readFileSync(path,"utf8"),expected);assert.throws(()=>waitForExactDownloadedFile(path,expected),assert.AssertionError);renameSync(path,resolve(directory,"accepted.json"));
const wrong=waitForExactDownloadedFile(path,expected,100);writeFileSync(path,'{"wrong":true}');await assert.rejects(wrong.promise,/did not arrive with the exact displayed bytes/);renameSync(path,resolve(directory,"wrong.json"));const cancelled=waitForExactDownloadedFile(path,expected,1000);cancelled.cancel();await assert.rejects(cancelled.promise,/cancelled/);
writeFileSync(output,JSON.stringify({passed:true,partialWriteNotAccepted:true,onlyExactBytesAccepted:true,preexistingFileRefused:true,wrongBytesTimedOut:true,cancellationClosed:true,browserClaim:false})+"\n",{flag:"wx"});console.log(JSON.stringify({passed:true,partialWriteNotAccepted:true,wrongBytesTimedOut:true,browserClaim:false}));
