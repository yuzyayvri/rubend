import assert from "node:assert/strict";
import {mkdtempSync,mkdirSync,writeFileSync,readFileSync,symlinkSync,rmSync} from "node:fs";
import {tmpdir} from "node:os";
import {resolve} from "node:path";
import {snapshotTarget,copyDependencies} from "../bench/regression-snapshot.mjs";

const root=mkdtempSync(resolve(tmpdir(),"rubend-regression-copy-"));try{
  mkdirSync(resolve(root,"build/experiments/u07-regression-fixture"),{recursive:true});
  assert.equal(snapshotTarget(root,resolve(root,"build/experiments/u07-regression-fixture/snapshot")),resolve(root,"build/experiments/u07-regression-fixture/snapshot"));for(const p of[resolve(root,"snapshot"),resolve(root,"../snapshot"),resolve(root,"build/experiments/u07-regression-fixture/snapshot/nested"),resolve(root,"build/experiments/u01-fixture/snapshot"),root])assert.throws(()=>snapshotTarget(root,p),assert.AssertionError);
  const source=resolve(root,"deps"),destination=resolve(root,"copied");mkdirSync(source);writeFileSync(resolve(source,"module.mjs"),"fixture source\n");symlinkSync("module.mjs",resolve(source,"link.mjs"));const hashes=copyDependencies(source,destination);assert.equal(Object.keys(hashes).length,2);writeFileSync(resolve(destination,"module.mjs"),"mutated isolated copy\n");assert.equal(readFileSync(resolve(source,"module.mjs"),"utf8"),"fixture source\n");assert.throws(()=>copyDependencies(source,destination),/already exists/);
  writeFileSync(resolve(root,"outside.mjs"),"not part of dependency tree\n");symlinkSync("../outside.mjs",resolve(source,"escape.mjs"));assert.throws(()=>copyDependencies(source,resolve(root,"rejected")),/escapes copied tree/);mkdirSync(resolve(root,"build/experiments/u07-regression-fixture/snapshot"),{recursive:true});assert.throws(()=>snapshotTarget(root,resolve(root,"build/experiments/u07-regression-fixture/snapshot")),/already exists/);console.log(JSON.stringify({passed:true,rejectedPaths:5,existingSnapshotAndDependencyCopyRejected:true,escapingDependencyRejected:true,mutationIsolated:true,realGitCheckoutNotRunByUnitFixture:true}));
}finally{rmSync(root,{recursive:true,force:true});}
