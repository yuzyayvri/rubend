import assert from "node:assert/strict";
import {readFileSync,writeFileSync,mkdirSync} from "node:fs";
import {resolve,relative} from "node:path";
import {createHash} from "node:crypto";
import {withArtifactLease} from "../scripts/artifact-lease.mjs";

withArtifactLease();assert.equal(process.argv.length,3);const directory=resolve(process.argv[2]);assert.ok(directory.startsWith(resolve("build")+"/"));mkdirSync(directory,{recursive:true});const original=readFileSync("bench/phase2-projection.bend","utf8"),hash=text=>createHash("sha256").update(text).digest("hex");
const source=original.replace(/^import (\.\.[^\s]+\.bend) as (\w+)$/gm,(_,path,alias)=>{const p=relative(directory,resolve("bench",path));return "import "+(p.startsWith(".")?p:"./"+p)+" as "+alias;});
function mutate(from,to){assert.equal(source.split(from).length,2);return source.replace(from,to);}
const variants={base:source,parity:mutate(" + C.parity(8n, word, 0, 8, 0, 0) : U32)"," + 0 : U32)"),goal:mutate("case S.Subgroup{} C.Valid{+cube}:","case _ C.Valid{+cube}:"),action:mutate("C.turn(Q.phase2_move(column), decode_known(0, index))","C.turn(Q.phase2_move(U32.mod(U32.add(column, 1), 10)), decode_known(0, index))")},sources={};
for(const[name,text]of Object.entries(variants)){const path=resolve(directory,name+".bend");writeFileSync(path,text,{flag:"wx"});sources[path]=hash(text);}
writeFileSync(resolve(directory,"manifest.json"),JSON.stringify({passed:true,format:"rubend-phase2-projection-generation-v1",sourceSha256:hash(original),sources,cornerClasses:140,edgePermutations:40320,unreducedCombinedCardinality:5644800,distanceTableGenerated:false,newDomainLaw:false,productionIntegrated:false})+"\n",{flag:"wx"});console.log(JSON.stringify({generated:true,variants:Object.keys(variants),distanceTableGenerated:false}));
