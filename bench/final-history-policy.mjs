import assert from "node:assert/strict";
import {writeFileSync} from "node:fs";
import {execFileSync} from "node:child_process";
import {checkCommits} from "../scripts/commit-policy.mjs";

assert.equal(process.argv.length,4);const[base,output]=process.argv.slice(2);assert.match(base,/^[a-f0-9]{40}$/);const head=execFileSync("git",["rev-parse","HEAD"],{encoding:"utf8"}).trim();execFileSync("git",["merge-base","--is-ancestor",base,head]);const commits=execFileSync("git",["rev-list",base+".."+head],{encoding:"utf8"}).trim().split("\n").filter(Boolean);checkCommits(commits);assert.equal(execFileSync("git",["rev-parse","HEAD"],{encoding:"utf8"}).trim(),head);const result={passed:true,base,head,commitsChecked:commits.length,signedSubjectOnly:true,localSignatureVerification:true,freshGithubVerification:false,pushOrMergeAuthorized:false};writeFileSync(output,JSON.stringify(result,null,2)+"\n",{flag:"wx"});console.log(JSON.stringify(result));
