import assert from "node:assert/strict";
import {readFileSync,writeFileSync,mkdirSync} from "node:fs";
import {resolve,relative,dirname} from "node:path";
import {createHash} from "node:crypto";
import {withArtifactLease} from "../scripts/artifact-lease.mjs";

withArtifactLease();assert.equal(process.argv.length,3);const directory=resolve(process.argv[2]);assert.ok(directory.startsWith(resolve("build")+"/"));mkdirSync(directory,{recursive:true});const sources={},generated={},hash=b=>createHash("sha256").update(b).digest("hex");
function source(path){const text=readFileSync(path,"utf8");sources[path]=hash(text);return text;}
function replace(text,from,to,count){assert.equal(text.split(from).length,count+1,"Frozen duration anchor changed");return text.replaceAll(from,to);}
function save(name,text){const path=resolve(directory,name);writeFileSync(path,text,{flag:"wx"});generated[path]=hash(text);}
const nativePath="bench/phase2-mapper-native.bend",native=replace(source(nativePath),"1000000n","50000000n",2).replace(/^import (\.[^\s]+\.bend) as (\w+)$/gm,(_,path,alias)=>{const relocated=relative(directory,resolve(dirname(nativePath),path));return"import "+(relocated.startsWith(".")?relocated:"./"+relocated)+" as "+alias;});
save("mapper-native.bend",native);save("mapper-oracle.mjs",replace(source("tests/phase2-mapper.mjs"),"1000000","50000000",2));save("mapper-cost.mjs",replace(source("bench/phase2-mapper-cost.mjs"),"stepsPerSample:1000000","stepsPerSample:50000000",1));
writeFileSync(resolve(directory,"manifest.json"),JSON.stringify({passed:true,format:"rubend-phase2-mapper-duration-generation-v1",sources,generated,iterations:50000000,cohorts:5,algorithmChanged:false,acceptanceFloorsChanged:false,productionIntegrated:false})+"\n",{flag:"wx"});console.log(JSON.stringify({generated:true,iterations:50000000,cohorts:5}));
