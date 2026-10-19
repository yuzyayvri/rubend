import assert from "node:assert/strict";
import {spawnSync} from "node:child_process";
import {mkdirSync,mkdtempSync,readFileSync,writeFileSync} from "node:fs";
import {resolve} from "node:path";
import {checkCommits} from "./commit-policy.mjs";

const repo="yuzyayvri/rubend",owner="yuzyayvri";
const refs=["refs/heads/main","refs/heads/yuzy/private-review-pass-2","refs/heads/yuzy/roadmap-checkpoint-20261019"];
function run(command,args,options={}){
  const r=spawnSync(command,args,{encoding:"utf8",maxBuffer:32*1024*1024,...options});
  assert.equal(r.status,0,r.stderr||r.error?.message||command+" failed");return r.stdout.trimEnd();
}
const git=(args,options)=>run("git",args,options);
const remote=()=>Object.fromEntries(git(["ls-remote","origin",...refs]).split("\n").map(line=>{const [oid,ref]=line.split(/\s+/);assert.match(oid,/^[0-9a-f]{40}$/);assert.ok(refs.includes(ref));return [ref,oid];}));
const save=(path,record)=>writeFileSync(path,JSON.stringify(record,null,2)+"\n");
const [mode,path]=process.argv.slice(2);
if(mode==="prepare"){
  assert.equal(git(["diff","--name-only"]),"");assert.equal(git(["diff","--cached","--name-only"]),"");
  const before=remote();assert.equal(Object.keys(before).length,refs.length);
  const head=git(["rev-parse","HEAD"]);git(["merge-base","--is-ancestor",before[refs[0]],head]);
  mkdirSync(".cache",{recursive:true});const directory=mkdtempSync(resolve(".cache/history-signing-")),bundle=resolve(directory,"original.bundle"),planPath=resolve(directory,"plan.json");
  git(["bundle","create",bundle,"--all"]);git(["bundle","verify",bundle]);
  const name=git(["config","user.name"]),email=git(["config","user.email"]);
  const plan={format:"rubend-signed-history-v1",startedAt:new Date().toISOString(),repo,bundle,before,originalHead:head,commits:[],after:{},staging:{},verified:false,published:false};save(planPath,plan);
  const commits=git(["rev-list","--reverse","--topo-order",...Object.values(before),head]).split("\n"),mapping=new Map();
  for(const old of commits){
    const fields=git(["show","-s","--format=%T%x00%P%x00%an%x00%ae%x00%aI%x00%cI%x00%s",old]).split("\0");assert.equal(fields.length,7);
    const [tree,parentText,authorName,authorEmail,authorDate,committerDate,subject]=fields;assert.equal(authorEmail,email,"Refuse to re-sign another author's history");
    const parents=parentText?parentText.split(" "):[],mappedParents=parents.map(p=>{assert.ok(mapping.has(p));return mapping.get(p);});
    const next=git(["commit-tree",tree,...mappedParents.flatMap(p=>["-p",p]),"-S"],{input:subject+"\n",env:{...process.env,GIT_AUTHOR_NAME:authorName,GIT_AUTHOR_EMAIL:authorEmail,GIT_AUTHOR_DATE:authorDate,GIT_COMMITTER_NAME:name,GIT_COMMITTER_EMAIL:email,GIT_COMMITTER_DATE:committerDate}});
    assert.match(next,/^[0-9a-f]{40}$/);assert.equal(git(["show","-s","--format=%T",next]),tree);
    mapping.set(old,next);plan.commits.push({old,next,tree,parents,mappedParents,authorName,authorEmail,authorDate,committerDate,subject});save(planPath,plan);
  }
  checkCommits([...mapping.values()]);
  for(const [index,ref]of refs.entries()){
    plan.after[ref]=mapping.get(ref===refs[0]?head:before[ref]);
    plan.staging["refs/heads/yuzy/signing-check-"+directory.split("-").at(-1)+"-"+index]=plan.after[ref];
  }
  save(planPath,plan);console.log(JSON.stringify({plan:planPath,commits:plan.commits.length,bundle}));
}else{
  assert.ok(["stage","verify","publish","cleanup"].includes(mode),"Expected prepare, stage, verify, publish, or cleanup");
  const planPath=resolve(path),plan=JSON.parse(readFileSync(planPath,"utf8"));assert.equal(plan.repo,repo);assert.deepEqual(Object.keys(plan.before),refs);
  if(mode==="stage"){
    git(["push","--atomic","origin",...Object.entries(plan.staging).map(([ref,oid])=>oid+":"+ref)]);
    plan.stagedAt=new Date().toISOString();save(planPath,plan);console.log(JSON.stringify({staged:true,refs:plan.staging}));
  }
  if(mode==="verify"){
    assert.ok(plan.stagedAt);const unique=[...new Set(plan.commits.map(c=>c.next))],results=[];
    for(let offset=0;offset<unique.length;offset+=20){
      const batch=unique.slice(offset,offset+20);
      const fields=batch.map((oid,index)=>`c${index}:object(oid:"${oid}"){...on Commit{oid message tree{oid} signature{isValid state signer{login}}}}`).join(" ");
      const data=JSON.parse(run("gh",["api","graphql","-f",`query=query{repository(owner:"${owner}",name:"rubend"){${fields}}}`]));assert.ok(!data.errors,JSON.stringify(data.errors));
      for(const [index,oid]of batch.entries()){
        const commit=data.data.repository["c"+index],expected=plan.commits.find(c=>c.next===oid);assert.equal(commit.oid,oid);assert.equal(commit.message.trimEnd(),expected.subject);assert.equal(commit.tree.oid,expected.tree);
        assert.equal(commit.signature?.isValid,true,oid);assert.equal(commit.signature.state,"VALID",oid);assert.equal(commit.signature.signer.login,owner,oid);
        results.push({oid,tree:commit.tree.oid,verified:true,state:commit.signature.state,signer:owner});
      }
    }
    plan.verification=results;plan.verified=true;plan.verifiedAt=new Date().toISOString();save(planPath,plan);console.log(JSON.stringify({verified:true,commits:results.length,treesPreserved:true,subjectOnly:true}));
  }
  if(mode==="publish"){
    assert.equal(plan.verified,true);assert.deepEqual(remote(),plan.before);checkCommits(Object.values(plan.after));
    git(["push","--atomic",...refs.map(ref=>"--force-with-lease="+ref+":"+plan.before[ref]),"origin",...refs.map(ref=>plan.after[ref]+":"+ref)]);
    assert.deepEqual(remote(),plan.after);plan.published=true;plan.publishedAt=new Date().toISOString();save(planPath,plan);console.log(JSON.stringify({published:true,refs:plan.after}));
  }
  if(mode==="cleanup"){
    assert.equal(plan.published,true);git(["push","--atomic","origin",...Object.keys(plan.staging).map(ref=>":"+ref)]);plan.stagingRemovedAt=new Date().toISOString();save(planPath,plan);console.log(JSON.stringify({stagingRemoved:true}));
  }
}
