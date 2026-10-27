import assert from "node:assert/strict";
import {readFileSync,writeFileSync,mkdirSync} from "node:fs";
import {resolve,relative} from "node:path";
import {fileHash} from "./reference-provenance.mjs";
import {withArtifactLease} from "../scripts/artifact-lease.mjs";

withArtifactLease();assert.equal(process.argv.length,3);const directory=resolve(process.argv[2]);assert.ok(directory.startsWith(resolve("build")+"/"));mkdirSync(directory,{recursive:true});const prior=resolve("build/experiments/u04-product-order-v1"),compile=JSON.parse(readFileSync(resolve(prior,"compile.json"),"utf8")),artifacts={},sourceHashes={},raw=resolve("build/experiments/u04-small-conditional-v1/product.raw");
function once(s,a,b){assert.equal(s.split(a).length,2,a);return s.replace(a,b);}
function relocate(source,base,overrides={}){return source.replace(/^import (\.[^\s]+\.bend) as (\w+)$/gm,(_,p,alias)=>{const target=overrides[p]??resolve(base,p),name=relative(directory,target);return"import "+(name.startsWith(".")?name:"./"+name)+" as "+alias;});}
function save(name,text){const path=resolve(directory,name);writeFileSync(path,text,{flag:"wx"});artifacts[path]=fileHash(path);return path;}
const input=resolve(prior,"generated/search-base.bend");assert.equal(fileHash(input),compile.artifacts[input]);const search=save("ordered-search.bend",relocate(readFileSync(input,"utf8"),resolve(prior,"generated"))),portfolio=save("ordered-portfolio.bend",relocate(readFileSync("src/portfolio.bend","utf8"),resolve("src"),{"./search.bend":search})),bounded=readFileSync("bench/bounded-portfolio.bend","utf8"),control=save("bounded-control.bend",relocate(bounded,resolve("bench"))),ordered=save("bounded-ordered.bend",relocate(bounded,resolve("bench"),{"../src/search.bend":search,"../src/portfolio.bend":portfolio}));
let worker=relocate(readFileSync("bench/move-order-worker.bend.in","utf8"),resolve("bench"),{"./LOCAL-SEARCH.bend":search,"./LOCAL-PORTFOLIO.bend":portfolio,"./LOCAL-CONTROL.bend":control,"./LOCAL-ORDERED.bend":ordered});
worker="import "+relative(directory,resolve("bench/phase2-product-order.bend"))+" as D\nimport "+relative(directory,resolve("src/joint-cache.bend"))+" as Cache\n"+worker;
worker=once(worker,"case Con{program, Con{path, Nil{}}}:","case Con{program, Con{path, Con{product, Nil{}}}}:");
worker=once(worker,'        IO.print("{\\"type\\":\\"ready\\"}")','        table : Array<U32> <- Cache.load(product, table, 5242880, 235200)\n        table : Array<U32> = D.prepare(table)\n        IO.print("{\\"type\\":\\"ready\\"}")');save("worker.bend",worker);
let runner=readFileSync("bench/move-order-study.mjs","utf8");runner=runner.replace(/from "(\.[^"\n]+\.mjs)"/g,(_,p)=>'from "'+relative(directory,resolve("bench",p))+'"');
runner=once(runner,'"bench/move-order-study-spec.json"','"bench/product-order-study-spec.json"');runner=once(runner,"[528,529,530,531,532,533,534,535]","[536,537,538,539,540,541,542,543]");
runner=once(runner,'["--threads","1","--gpu","off",path]',JSON.stringify(["--threads","1","--gpu","off"]).slice(0,-1)+",path,"+JSON.stringify(raw)+"]");save("study.mjs",runner);
for(const p of["bench/generate-product-order-study.mjs","bench/phase2-product-order.bend","bench/move-order-study.mjs","bench/move-order-worker.bend.in","bench/bounded-portfolio.bend","bench/product-order-study-spec.json","src/search.bend","src/portfolio.bend",input])sourceHashes[p]=fileHash(p);
save("generation.json",JSON.stringify({passed:true,format:"rubend-product-order-study-generation-v1",sourceHashes,artifacts,productRaw:raw,productRawSha256:fileHash(raw),sameNativeBinary:true,controlArmsShareImplementation:true,allArmsSharePreparedTable:true,existingProtocolAndScorerReused:true,setupExcludedFromRequestWall:true,exactAndReductionOrderingUnchanged:true,newPruning:false,productionIntegrated:false},null,2)+"\n");console.log(JSON.stringify({passed:true,files:Object.keys(artifacts).length}));
