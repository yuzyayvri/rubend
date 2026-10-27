import assert from "node:assert/strict";
import {readFileSync,writeFileSync} from "node:fs";
import {resolve} from "node:path";
import {pathToFileURL} from "node:url";
import {array} from "../apps/model.mjs";
import Coordinate from "../build/coordinates.mjs";
import {randomSource} from "./support.mjs";

const pack=(xs,bits)=>xs.reduce((word,value,i)=>(word|(value<<(i*bits)))>>>0,0);

assert.equal(process.argv.length,7);const [P,...bad]=await Promise.all(process.argv.slice(2,5).map(async p=>(await import(pathToFileURL(resolve(p)))).default)),manifest=JSON.parse(readFileSync(process.argv[5],"utf8")),random=randomSource("rubend-slice-coordinate-v1"),choose=(n,k)=>{if(k>4||k>n)return 0;let v=1;for(let i=1;i<=k;i++)v=v*(n-i+1)/i;return v;},rank=mask=>{let at=1,acc=0;for(let i=0;i<12;i++)if((mask>>>i)&1)acc+=choose(i,at++);return(494-acc)>>>0;},mutations=bad.map(()=>null);let codecs=0,masks=0,coordinateChecks=0;
assert.equal(manifest.placements.length,495);const seen=new Set();for(const p of manifest.placements){assert.equal(p.mask.toString(2).replaceAll("0","").length,4);assert.equal(rank(p.mask),p.rank);assert.deepEqual(array(P.test_codec(p.rank)),[p.rank,p.mask,p.rank,p.mask,p.rank]);seen.add(p.mask);assert.equal(p.rank===0,p.mask===3840);codecs++;for(let j=0;j<bad.length;j++)if(!mutations[j]){const observed=array(bad[j].test_codec(p.rank));if(JSON.stringify(observed)!==JSON.stringify([p.rank,p.mask,p.rank,p.mask,p.rank]))mutations[j]={rank:p.rank,mask:p.mask,observed};}}
assert.equal(seen.size,495);const vectors=[Array.from({length:12},(_,i)=>i*2),Array(12).fill(0),Array(12).fill(23)];for(let i=0;i<2000;i++)vectors.push(Array.from({length:12},()=>random(24)));
for(const edges of vectors){const pieces=edges.map(n=>Math.floor(n/2)),expectedMask=pieces.reduce((v,p,i)=>v|(p>=8?1<<i:0),0),expected=rank(expectedMask),cube={$:"Cubie",cp:1985229328,co:0,ep:pack(pieces.slice(0,8),4),eh:pack(pieces.slice(8),4),eo:pack(edges.map(n=>n%2),1)};assert.equal(P.test_mask(...edges),expectedMask);masks++;assert.equal(P.test_actual(...edges),expected);assert.equal(P.test_expected(...edges),expected);assert.equal(Coordinate.encode({$:"Slice"},cube),expected);coordinateChecks++;for(let j=0;j<bad.length;j++)if(!mutations[j]){const observed=bad[j].test_actual(...edges);if(observed!==expected)mutations[j]={edges,expectedMask,expected,observed};}}
for(let mask=0;mask<4096;mask++)assert.equal(P.test_rank(mask),Coordinate.slice_rank_loop(12,mask,0,1,0));
assert.ok(mutations.every(Boolean),"Both candidate coordinate corruptions must have counterexamples");writeFileSync(resolve(process.argv[6]),JSON.stringify({passed:true,seed:"rubend-slice-coordinate-v1",codecs,masks,coordinateChecks,rankComparisons:4096,mutations,sampleEvidenceOnly:true,productionCoordinateModule:manifest.productionCoordinateModule,legalMaskCoverageProved:false,fullJointTargetProved:false,loadedAdmissibilityProved:false,independentReview:false})+"\n",{flag:"wx"});console.log(JSON.stringify({passed:true,codecs,masks,coordinateChecks,rankComparisons:4096,actualMutantsRejected:mutations.length}));
