import {spawnSync} from "node:child_process";
import {mkdirSync,realpathSync} from "node:fs";
import {resolve,dirname} from "node:path";

export function withArtifactLease(){
  const lease=resolve(realpathSync(process.cwd()),".cache/build-artifacts.lock");
  if(process.env.RUBEND_ARTIFACT_LEASE===lease)return;
  mkdirSync(dirname(lease),{recursive:true});
  const r=spawnSync("flock",["--nonblock","--conflict-exit-code","73",lease,process.execPath,...process.argv.slice(1)],{stdio:"inherit",env:{...process.env,RUBEND_ARTIFACT_LEASE:lease}});
  if(r.status===73)process.stderr.write("Rubend artifacts are in use by another build or experiment. Retry after it exits.\n");
  if(r.error)process.stderr.write(String(r.error)+"\n");
  process.exit(r.status??1);
}
