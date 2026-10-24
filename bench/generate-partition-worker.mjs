import assert from "node:assert/strict";
import {readFileSync,writeFileSync,mkdirSync} from "node:fs";
import {resolve,relative} from "node:path";
import {createHash} from "node:crypto";
import {withArtifactLease} from "../scripts/artifact-lease.mjs";

withArtifactLease();assert.equal(process.argv.length,3);const directory=resolve(process.argv[2]);assert.ok(directory.startsWith(resolve("build")+"/"));mkdirSync(directory,{recursive:true});const original=readFileSync("bench/partition-worker-core.bend","utf8"),worker=readFileSync("bench/partition-worker.bend","utf8"),hash=x=>createHash("sha256").update(x).digest("hex"),artifacts={};
function relocate(source,overrides={}){return source.replace(/^import (\.[^\s]+\.bend) as (\w+)$/gm,(_,p,alias)=>{const path=overrides[p]??resolve("bench",p),name=relative(directory,path);return"import "+(name.startsWith(".")?name:"./"+name)+" as "+alias;});}
function one(text,from,to){assert.equal(text.split(from).length,2);return text.replace(from,to);}function save(name,text){const path=resolve(directory,name);writeFileSync(path,text,{flag:"wx"});artifacts[path]=hash(text);return path;}
const cores={base:original,partial:one(original,"PartPartial{table, steps}\n    case 1n+p PartActive", "PartExhausted{table, steps}\n    case 1n+p PartActive"),hit:one(original,"found(U32.is_lt(length, 31), S.Search", "found(False{}, S.Search")};for(const[name,source]of Object.entries(cores)){const path=save("core-"+name+".bend",relocate(source));if(name!=="hit")save("worker-"+name+".bend",relocate(worker,{"./partition-worker-core.bend":path}));}
writeFileSync(resolve(directory,"generation.json"),JSON.stringify({passed:true,format:"rubend-partition-worker-generation-v1",sourceSha256:hash(original),artifacts,partialCannotExhaustControl:true,hitBeforeEmptyControl:true,productionChanged:false,newDomainLaw:false})+"\n",{flag:"wx"});console.log(JSON.stringify({generated:true,files:Object.keys(artifacts).length}));
