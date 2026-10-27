import assert from "node:assert/strict";
import {storePath} from "./nix-package-plan.mjs";

export function nixBuildAdmission(stdout,stderr,expected){
  const result=JSON.parse(stdout);assert.deepEqual(result,[{drvPath:expected.drvPath,outputs:{out:expected.outputPath}}]);const lines=stderr.split("\n"),build=[],fetch=[];
  for(let i=0;i<lines.length;i++){const b=lines[i].match(/^these (\d+) derivations will be built:$/),f=lines[i].match(/^these (\d+) paths will be fetched \(.+\):$/),oneBuild=lines[i]==="this derivation will be built:",oneFetch=/^this path will be fetched \(.+\):$/.test(lines[i]);if(!b&&!f&&!oneBuild&&!oneFetch)continue;const target=b||oneBuild?build:fetch,count=b?Number(b[1]):f?Number(f[1]):1;assert.ok(count>0&&count<=64);for(let n=0;n<count;n++){const p=lines[++i]?.match(/^  (\/nix\/store\/\S+)$/);assert.ok(p,"Missing dry-run path");target.push(storePath(p[1]));}}
  assert.equal(new Set(build).size,build.length);assert.equal(new Set(fetch).size,fetch.length);assert.ok(build.includes(expected.drvPath),"Product must require an actual build");assert.ok(build.length<=2);for(const p of build)assert.ok(expected.allowedBuilds.includes(p),"Unexpected derivation build: "+p);for(const p of fetch)assert.equal(p.endsWith(".drv"),false);assert.equal(fetch.length<=64,true);return{passed:true,buildPaths:[...build].sort(),fetchPaths:[...fetch].sort(),productRequiresBuild:true,noOtherLocalBuilds:true};
}
