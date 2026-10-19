import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {spawnSync} from "node:child_process";
import {resolve} from "node:path";
import {fileURLToPath} from "node:url";

export function checkMessage(message){
  const subject=message.trimEnd();
  assert.ok(subject.length>0&&!/[\r\n]/.test(subject),"Commit messages must contain one subject line and no description");
}
const git=args=>{
  const r=spawnSync("git",args,{encoding:"utf8"});
  assert.equal(r.status,0,r.stderr||"Git command failed");return r.stdout;
};
export function checkCommits(commits){
  for(const commit of new Set(commits)){
    assert.match(commit,/^[0-9a-f]{40}$/);
    checkMessage(git(["show","-s","--format=%B",commit]));
    git(["verify-commit",commit]);
  }
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  if(process.argv[2]==="message")checkMessage(readFileSync(process.argv[3],"utf8"));
  else if(process.argv[2]==="push"){
    const commits=[];
    for(const line of readFileSync(0,"utf8").trim().split("\n").filter(Boolean)){
      const fields=line.split(/\s+/);assert.equal(fields.length,4);
      const [,local,,remote]=fields;
      if(/^0{40}$/.test(local))continue;
      assert.match(local,/^[0-9a-f]{40}$/);assert.match(remote,/^[0-9a-f]{40}$/);
      const exists=spawnSync("git",["cat-file","-e",remote+"^{commit}"],{stdio:"ignore"}).status===0;
      commits.push(...git(["rev-list",local,...exists?["^"+remote]:[]]).trim().split("\n").filter(Boolean));
    }
    checkCommits(commits);
  }else throw Error("Usage: node scripts/commit-policy.mjs message FILE | push");
}
