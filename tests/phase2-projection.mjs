import assert from "node:assert/strict";
import {writeFileSync} from "node:fs";
import {resolve} from "node:path";
import {pathToFileURL} from "node:url";
import {puzzles} from "cubing/puzzles";
import Cubie from "../build/cubie.mjs";
import {array,moveNames} from "../apps/model.mjs";
import {cornerMap,edgeMap,randomSource} from "./support.mjs";

assert.equal(process.argv.length,7);const[P,...bad]=await Promise.all(process.argv.slice(2,6).map(async p=>(await import(pathToFileURL(resolve(p)))).default)),output=resolve(process.argv[6]),puzzle=await puzzles["3x3x3"].kpuzzle(),moves=[0,1,2,4,7,9,10,11,13,16],back=xs=>xs.reduce((out,v,i)=>(out[v]=i,out),[]),cornerBack=back(cornerMap),edgeBack=back(edgeMap),pack=xs=>xs.reduce((v,x,i)=>(v|(x<<(4*i)))>>>0,0),unpack=(word,n)=>Array.from({length:n},(_,i)=>(word>>>(4*i))&15),parity=xs=>xs.reduce((p,x,i)=>p^xs.slice(i+1).reduce((s,y)=>s^Number(x>y),0),0),factorial=[1,1,2,6,24,120,720,5040,40320];
function permutation(rank){const available=Array.from({length:8},(_,i)=>i),out=[];for(let i=7;i>=0;i--){const digit=Math.floor(rank/factorial[i]);rank%=factorial[i];out.push(available.splice(digit,1)[0]);}return out;}
function permRank(xs){const available=Array.from({length:8},(_,i)=>i);let r=0;for(const x of xs){const at=available.indexOf(x);assert.ok(at>=0);r=r*available.length+at;available.splice(at,1);}return r;}
const choose=(n,k)=>k>n?0:factorial[n]/factorial[k]/factorial[n-k];
function cornerIndex(xs){let k=0,r=0;for(let i=0;i<8;i++)if(xs[i]<4)r+=choose(i,++k);assert.equal(k,4);return r*2+parity(xs);}
function project(cube){return[1,permRank(unpack(cube.ep,8)),cornerIndex(unpack(cube.cp,8))];}
const actions=moves.map(move=>{const t=puzzle.algToTransformation(moveNames[move]).transformationData;return{corners:cornerMap.map(i=>cornerBack[t.CORNERS.permutation[i]]),edges:edgeMap.slice(0,8).map(i=>edgeBack[t.EDGES.permutation[i]])};});for(const a of actions){assert.ok(a.edges.every(i=>i<8));}
const transitions=Array.from({length:140},(_,c)=>moves.map((_,m)=>P.test_corner_next(c,m))),counterexamples=bad.map(()=>null);let cornerCodecs=0,cornerActions=0,decodeChecks=0,projectionChecks=0,rejected=0;
const root=Cubie.solved(),odd=pack(permutation(1));assert.equal(P.test_corner_word(odd),1);assert.deepEqual(array(P.test_project(0,root.cp,root.co,root.ep,root.eh,root.eo)),[]);
for(let j=0;j<bad.length;j++){const word=bad[j].test_corner_word(odd),goal=array(bad[j].test_project(0,root.cp,root.co,root.ep,root.eh,root.eo)),action=bad[j].test_corner_next(0,0);if(word!==1)counterexamples[j]={kind:"corner-codec",rank:1,expected:1,observed:word};else if(goal.length)counterexamples[j]={kind:"goal-leak",goal:0,observed:goal};else if(action!==transitions[0][0])counterexamples[j]={kind:"corner-action",index:0,column:0,expected:transitions[0][0],observed:action};}
for(let rank=0;rank<40320;rank++){
  const cp=permutation(rank),word=pack(cp),index=cornerIndex(cp);assert.equal(P.test_corner_word(word),index,"Corner combination/parity mismatch");cornerCodecs++;
  for(let j=0;j<bad.length;j++)if(!counterexamples[j]){const seen=bad[j].test_corner_word(word);if(seen!==index)counterexamples[j]={kind:"corner-codec",rank,expected:index,observed:seen};}
  for(let column=0;column<10;column++){const expected=cornerIndex(actions[column].corners.map(i=>cp[i]));assert.equal(transitions[index][column],expected,"Corner action mismatch");cornerActions++;for(let j=0;j<bad.length;j++)if(!counterexamples[j]){const seen=bad[j].test_corner_next(index,column);if(seen!==expected)counterexamples[j]={kind:"corner-action",index,column,expected,observed:seen};}}
}
const random=randomSource("rubend-u04-phase2-projection-v1"),edgeRanks=[0,1,2,5,23,24,719,720,1000,5039,5040,10000,20000,30000,40000,40319];
for(const edges of edgeRanks)for(let corners=0;corners<140;corners++){
  const packet=array(P.test_decode(edges,corners));assert.equal(packet.length,6);const cube={$:"Cubie",cp:packet[1],co:packet[2],ep:packet[3],eh:packet[4],eo:packet[5]};assert.equal(Cubie.validate(Cubie.to_facelets(cube)).$,"Valid");assert.deepEqual(project(cube),[1,edges,corners]);assert.deepEqual(array(P.test_project(1,...packet.slice(1))),[1,edges,corners]);decodeChecks++;
  for(const goal of[0,2,99]){assert.deepEqual(array(P.test_project(goal,...packet.slice(1))),[]);rejected++;for(let j=0;j<bad.length;j++)if(!counterexamples[j]){const seen=array(bad[j].test_project(goal,...packet.slice(1)));if(seen.length)counterexamples[j]={kind:"goal-leak",goal,edges,corners,observed:seen};}}
}
let cube=Cubie.solved();
for(let i=0;i<512;i++){
  for(let n=0;n<32;n++)cube=Cubie.turn(moves[random(10)],cube);const current=project(cube);assert.deepEqual(array(P.test_project(1,cube.cp,cube.co,cube.ep,cube.eh,cube.eo)),current);
  for(let column=0;column<10;column++){const child=Cubie.turn(moves[column],cube),expected=project(child);assert.deepEqual(array(P.test_step(1,current[1],current[2],column)),expected);const cp=unpack(cube.cp,8),ep=unpack(cube.ep,8);assert.equal(expected[1],permRank(actions[column].edges.map(p=>ep[p])));assert.equal(expected[2],cornerIndex(actions[column].corners.map(p=>cp[p])));projectionChecks++;}
}
for(const [edges,corners]of[[40320,0],[0,140],[4294967295,0],[0,4294967295]]){assert.deepEqual(array(P.test_decode(edges,corners)),[]);assert.deepEqual(array(P.test_step(1,edges,corners,0)),[]);rejected+=2;}
for(const goal of[0,2,99]){assert.deepEqual(array(P.test_step(goal,0,0,0)),[]);rejected++;}assert.deepEqual(array(P.test_step(1,0,0,10)),[]);assert.equal(P.test_corner_next(140,0),4294967295);assert.equal(P.test_corner_next(0,10),4294967295);rejected+=3;
for(const outside of[3,6,12,15]){const c=Cubie.turn(outside,Cubie.solved());assert.deepEqual(array(P.test_project(1,c.cp,c.co,c.ep,c.eh,c.eo)),[]);rejected++;}
const solved= Cubie.solved();assert.deepEqual(array(P.test_project(1,solved.cp,65536,solved.ep,solved.eh,0)),[]);rejected++;
assert.ok(counterexamples.every(Boolean),"All three executable corruptions need counterexamples");const result={passed:true,format:"rubend-phase2-projection-check-v1",moves,cornerCodecs,cornerActions,decodeChecks,projectionChecks,rejected,counterexamples,cornerClasses:140,edgePermutations:40320,unreducedCombinedCardinality:5644800,checksumSeed:7,checksum:P.test_checksum(7),oracle:"Pinned cubing KPuzzle permutations, independent available-list ranking, colex combination rank and inversion parity",distanceTableGenerated:false,productionIntegrated:false,admissibilityProved:false,newDomainLaw:false,performanceAcceptance:false,independentReview:false};writeFileSync(output,JSON.stringify(result,null,2)+"\n",{flag:"wx"});console.log(JSON.stringify({passed:true,cornerCodecs,cornerActions,decodeChecks,projectionChecks,rejected,counterexamples:counterexamples.length}));
