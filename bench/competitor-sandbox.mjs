import assert from "node:assert/strict";
import {resolve,relative} from "node:path";

export function competitorSandbox(root,{actor,binary,tables=null,writableTables=false}){
  const base=resolve(root),program=resolve(binary),local=relative(base,program);assert.ok(["muodov-c","vcube","probe"].includes(actor));assert.equal(typeof writableTables,"boolean");
  if(actor==="probe"){assert.match(program,/^\/nix\/store\/[a-z0-9]{32}-[A-Za-z0-9._+-]+\/bin\/node$/);assert.equal(tables,null);assert.equal(writableTables,false);}else assert.match(local,actor==="vcube"?/^build\/experiments\/u07-competitor-build-[a-z0-9-]+\/runtime\/vcube\/vc-optimal$/:/^build\/experiments\/u07-competitor-build-[a-z0-9-]+\/runtime\/muodov-kociemba\/kociemba$/);
  const target=actor==="muodov-c"?"/work/kociemba":actor==="vcube"?"/work/vc-optimal":"/work/node",args=["--unshare-user","--uid","0","--gid","0","--unshare-ipc","--unshare-net","--unshare-pid","--die-with-parent","--new-session","--ro-bind","/nix","/nix","--proc","/proc","--dev","/dev","--tmpfs","/tmp","--dir","/work","--ro-bind",program,target];
  if(actor!=="probe"){assert.equal(typeof tables,"string");const path=resolve(tables);assert.match(relative(base,path),actor==="vcube"?/^build\/experiments\/u07-competitor-calibration-[a-z0-9-]+\/vcube-(104|108)-tables$/:/^build\/experiments\/u07-competitor-build-[a-z0-9-]+\/runtime\/muodov-kociemba\/cache$/);if(actor==="muodov-c")assert.equal(writableTables,false);args.push(writableTables?"--bind":"--ro-bind",path,actor==="vcube"?"/work/tables":"/work/cache");}
  args.push("--chdir","/work","--clearenv","--setenv","HOME","/tmp","--setenv","TMPDIR","/tmp","--setenv","LANG","C",target);return{program:"bwrap",args,target,privateIpc:true,privateNetwork:true,privatePid:true,repositoryMounted:false,hostNixStoreReadOnly:true,writableTables};
}
