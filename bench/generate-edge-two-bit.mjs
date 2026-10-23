import assert from "node:assert/strict";
import {readFileSync,writeFileSync,mkdirSync} from "node:fs";
import {resolve,relative} from "node:path";
import {createHash} from "node:crypto";
import {withArtifactLease} from "../scripts/artifact-lease.mjs";

withArtifactLease();assert.equal(process.argv.length,3);const directory=resolve(process.argv[2]);assert.ok(directory.startsWith(resolve("build")+"/"));mkdirSync(directory,{recursive:true});const original=readFileSync("bench/edge-two-bit.bend","utf8"),hash=b=>createHash("sha256").update(b).digest("hex"),source=original.replace(/^import (\.[^\s]+\.bend) as (\w+)$/gm,(_,path,alias)=>{const p=relative(directory,resolve("bench",path));return"import "+(p.startsWith(".")?p:"./"+p)+" as "+alias;});
function mutate(from,to){assert.equal(source.split(from).length,2,"Codec mutation anchor drifted");return source.replace(from,to);}
const variants={base:source,fallback:mutate("case 0: fallback","case 0: base"),saturation:mutate("C.pick(U32.is_gt(diff, 3), 3, diff)","diff"),block:mutate("read_fallback(fallback[(index / 64 : U32)]","read_fallback(fallback[(index / 128 : U32)]")},sources={};for(const[name,text]of Object.entries(variants)){const path=resolve(directory,name+".bend");writeFileSync(path,text,{flag:"wx"});sources[path]=hash(text);}
writeFileSync(resolve(directory,"manifest.json"),JSON.stringify({passed:true,format:"rubend-edge-two-bit-generation-v1",sourceSha256:hash(original),sources,newDomainLaw:false,productionIntegrated:false})+"\n",{flag:"wx"});
