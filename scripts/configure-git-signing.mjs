import assert from "node:assert/strict";
import {readFileSync,writeFileSync} from "node:fs";
import {spawnSync} from "node:child_process";
import {resolve} from "node:path";

const run=(program,args)=>{
  const r=spawnSync(program,args,{encoding:"utf8"});assert.equal(r.status,0,r.stderr);return r.stdout.trim();
};
assert.equal(process.argv.length,3,"Pass the path of an existing registered SSH signing key");
const key=resolve(process.argv[2]),publicKey=readFileSync(key+".pub","utf8").trim().split(/\s+/).slice(0,2).join(" ");
assert.match(publicKey,/^ssh-ed25519 [A-Za-z0-9+/=]+$/);
const login=run("gh",["api","user","--jq",".login"]),registered=JSON.parse(run("gh",["api",`users/${login}/ssh_signing_keys`]));
assert.ok(registered.some(k=>k.key.trim().split(/\s+/).slice(0,2).join(" ")===publicKey),"This public key is not registered for GitHub commit signing");
const email=run("git",["config","user.email"]);assert.match(email,/^[^\s<>]+$/);
const allowed=run("git",["rev-parse","--path-format=absolute","--git-path","allowed_signers"]);
writeFileSync(allowed,`${email} namespaces="git" ${publicKey}\n`,{mode:0o600});
for(const [name,value]of Object.entries({"gpg.format":"ssh","user.signingkey":key,"gpg.ssh.allowedSignersFile":allowed,"commit.gpgsign":"true","tag.gpgsign":"true","core.hooksPath":".githooks","merge.log":"false"}))run("git",["config","--local",name,value]);
console.log(JSON.stringify({configured:true,registeredSigner:login,signedCommits:true,subjectOnlyHooks:true}));
