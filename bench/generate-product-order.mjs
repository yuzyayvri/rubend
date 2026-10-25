import assert from "node:assert/strict";
import {readFileSync,writeFileSync,mkdirSync} from "node:fs";
import {resolve,relative,dirname} from "node:path";
import {execFileSync} from "node:child_process";
import {fileHash} from "./reference-provenance.mjs";
import {withArtifactLease} from "../scripts/artifact-lease.mjs";

withArtifactLease();assert.equal(process.argv.length,3);const directory=resolve(process.argv[2]);assert.ok(directory.startsWith(resolve("build")+"/"));mkdirSync(directory,{recursive:true});const legacy=resolve(directory,"existing"),artifacts={};
execFileSync(process.execPath,["bench/generate-phase2-move-order.mjs",legacy],{stdio:"inherit"});
function once(s,a,b){assert.equal(s.split(a).length,2,a);return s.replace(a,b);}
function imports(s,origin){return s.replace(/^import (\.[^\s]+\.bend) as (\w+)$/gm,(_,p,a)=>{const name=relative(directory,resolve(dirname(origin),p));return"import "+(name.startsWith(".")?name:"./"+name)+" as "+a;});}
function save(name,text){const path=resolve(directory,name);writeFileSync(path,text,{flag:"wx"});artifacts[path]=fileHash(path);return path;}
const input=resolve(legacy,"search-base.bend"),original=readFileSync(input,"utf8"),routed=imports(original,input),candidate=once(routed,"O.cursor(U32.is_eq(next, 0)","D.cursor(U32.is_eq(next, 0)"),header="import "+relative(directory,resolve("bench/phase2-product-order.bend"))+" as D\n";
assert.equal(original.match(/O\.cursor\(/g).length,1);assert.equal(candidate.includes("D.project("),false);save("search-base.bend",header+candidate);
const bad=imports(readFileSync(resolve(legacy,"search-goal.bend"),"utf8"),resolve(legacy,"search-goal.bend"));save("search-goal.bend",header+once(bad,"O.cursor(U32.is_eq(next, 0)","D.cursor(U32.is_eq(next, 0)"));
let check=imports(readFileSync(resolve(legacy,"check-base.bend"),"utf8"),resolve(legacy,"check-base.bend"));
check=once(check,"import ./existing/search-base.bend as B","import ./SEARCH.bend as B");
check=header+"import "+relative(directory,resolve("bench/phase2-small-product.bend"))+" as E\nimport "+relative(directory,resolve("src/joint-cache.bend"))+" as Cache\n"+check;
const start=check.indexOf("def score_final("),end=check.indexOf("\ndef score_trials(",start);assert.ok(start>0&&end>start);
check=check.slice(0,start)+`def score_final(read: Array<U32> & U32, observed: U32, errors: U32) -> Trial:
  match read:
    case Tuple{table, value}: Trial{table, (errors + Bool.to_u32(U32.is_ne(observed, value)) : U32), 0}

def score_observed(read: Array<U32> & U32, +child: C.Cubie, errors: U32) -> Trial:
  match read:
    case Tuple{table, observed}:
      score_final(table[(5242880 + E.encode_known(child) : U32)], observed, errors)
`+check.slice(end);
check=once(check,"O.score(table, a, b, c, column)","D.score(table, a, b, c, column)");
check=once(check,"def main() -> IO(Unit):\n  output(trials(4800n, score_trials(160n, Trial{T.generate(), 0, 0}, 0), 0))",`def start(args: List<String>) -> IO(Unit):
  match args:
    case Con{program, Con{path, Nil{}}}:
      do IO<Unit>:
        table : Array<U32> <- Cache.load(path, T.generate(), 5242880, 235200)
        output(trials(4800n, score_trials(160n, Trial{D.prepare(table), 0, 0}, 0), 0))
    case _: IO.die(Unit, 2, "Expected audited product words")

def main() -> IO(Unit):
  do IO<Unit>:
    args : List<String> <- IO.args()
    start(args)`);
for(const name of["base","goal"])save("check-"+name+".bend",once(check,"import ./SEARCH.bend as B","import ./search-"+name+".bend as B"));
const source=readFileSync("bench/phase2-product-order.bend","utf8"),variants={base:source,corners:once(source,"P.corner_index(word)","((P.corner_index(word) + 1) % 140 : U32)"),edges:once(source,"E.edge_index(C.Cubie{1985229328, 0, word, 47768, 0})","((E.edge_index(C.Cubie{1985229328, 0, word, 47768, 0}) + 1) % 1680 : U32)"),distance:once(source,"value, 0))","(value + 1 : U32), 0))")};
for(const[name,text]of Object.entries(variants))save("product-"+name+".bend",imports(text,resolve("bench/phase2-product-order.bend")));
const prior=JSON.parse(readFileSync(resolve(legacy,"manifest.json"),"utf8"));Object.assign(artifacts,prior.sources);
save("manifest.json",JSON.stringify({passed:true,format:"rubend-product-order-generation-v1",sourceHashes:Object.fromEntries(["src/search.bend","bench/generate-product-order.mjs","bench/generate-phase2-move-order.mjs","bench/phase2-product-order.bend","bench/phase2-move-order.bend","bench/phase2-move-check.bend.in","bench/phase2-move-scan.bend.in"].map(p=>[p,fileHash(p)])),artifacts,frameLayoutChanged:false,newPruning:false,productionIntegrated:false,comparison:"Only existing ordered Search cursor's score collector changes. Every bound, transition, admission and completion function is unchanged."},null,2)+"\n");
console.log(JSON.stringify({passed:true,artifacts:Object.keys(artifacts).length,newPruning:false}));
