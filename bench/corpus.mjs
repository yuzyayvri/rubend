import assert from "node:assert/strict";
import {createHash} from "node:crypto";
import {readFileSync,writeFileSync,mkdirSync} from "node:fs";
import {fileURLToPath} from "node:url";
import {resolve} from "node:path";
import {randomSource,randomCube,faceletsOf} from "../tests/support.mjs";

const directory=fileURLToPath(new URL("./corpora/",import.meta.url));
const specifications=[
  {name:"pilot",count:128,seed:"rubend-roadmap-pilot-v1"},
  {name:"development",count:1000,seed:"rubend-roadmap-development-v1"},
  {name:"release",count:10000,seed:"rubend-roadmap-release-v1"}
];
const sourcePaths=["bench/corpus.mjs","tests/support.mjs","src/cubie.bend","src/model.bend","apps/model.mjs"];
const digest=bytes=>createHash("sha256").update(bytes).digest("hex");
const sources=()=>Object.fromEntries(sourcePaths.map(p=>[p,digest(readFileSync(new URL("../"+p,import.meta.url)))]));

export function generateCorpora(){
  const seen=new Set(),corpora=[];
  for(const spec of specifications){
    const random=randomSource(spec.seed),states=Array.from({length:spec.count},()=>faceletsOf(randomCube(random)));
    for(const state of states){assert.match(state,/^[URFDLB]{54}$/);assert.ok(!seen.has(state),"Corpus overlap");seen.add(state);}
    const bytes=states.join("\n")+"\n";
    corpora.push({...spec,file:spec.name+".txt",bytes,sha256:digest(bytes)});
  }
  return {format:"rubend-corpora-v1",sampler:"SHA256 counter with rejection-sampled bounded draws, Fisher-Yates permutations, parity repair, constrained orientations",sourceHashes:sources(),corpora};
}

export function loadCorpus(name){
  const manifest=JSON.parse(readFileSync(resolve(directory,"manifest.json"),"utf8"));
  assert.equal(manifest.format,"rubend-corpora-v1");
  assert.deepEqual(Object.keys(manifest.sourceHashes).sort(),[...sourcePaths].sort());
  for(const hash of Object.values(manifest.sourceHashes))assert.match(hash,/^[a-f0-9]{64}$/);
  const spec=manifest.corpora.find(x=>x.name===name);
  const expected=specifications.find(x=>x.name===name);
  assert.ok(expected,"Unknown corpus");
  assert.ok(spec);assert.equal(spec.file,name+".txt");
  for(const key of ["count","seed"])assert.equal(spec[key],expected[key],"Corpus specification changed");
  const bytes=readFileSync(resolve(directory,spec.file));
  assert.equal(digest(bytes),spec.sha256,"Corpus hash mismatch");
  const states=bytes.toString("utf8").trimEnd().split("\n");
  assert.equal(states.length,spec.count);
  assert.equal(new Set(states).size,states.length);
  return states.map((facelets,id)=>{assert.match(facelets,/^[URFDLB]{54}$/);return {id:name+"-"+id,facelets};});
}

if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  assert.ok(process.argv.length===3&&["--check","--write"].includes(process.argv[2]),"Expected --check or --write");
  const generated=generateCorpora(),manifest={...generated,corpora:generated.corpora.map(({bytes,...spec})=>spec)};
  if(process.argv[2]==="--write"){
    mkdirSync(directory,{recursive:true});
    for(const spec of generated.corpora)writeFileSync(resolve(directory,spec.file),spec.bytes,{flag:"wx"});
    writeFileSync(resolve(directory,"manifest.json"),JSON.stringify(manifest,null,2)+"\n",{flag:"wx"});
  }else{
    const frozen=JSON.parse(readFileSync(resolve(directory,"manifest.json"),"utf8"));
    assert.deepEqual(frozen,{...manifest,sourceHashes:frozen.sourceHashes});
    for(const spec of generated.corpora)assert.equal(readFileSync(resolve(directory,spec.file),"utf8"),spec.bytes);
  }
  console.log(JSON.stringify({passed:true,corpora:manifest.corpora.map(({name,count,sha256})=>({name,count,sha256})),total:generated.corpora.reduce((sum,c)=>sum+c.count,0)}));
}
