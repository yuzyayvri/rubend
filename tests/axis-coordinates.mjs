import assert from "node:assert/strict";
import {writeFileSync} from "node:fs";
import {resolve} from "node:path";
import A from "../build/axis-coordinates.mjs";
import C from "../build/cubie.mjs";
import Q from "../build/coordinates.mjs";
import {randomSource,randomCube,faceletsOf} from "./support.mjs";

assert.equal(process.argv.length,3);const output=resolve(process.argv[2]);assert.ok(output.startsWith(resolve("build/evidence")+"/")||output.startsWith(resolve("build/experiments")+"/"));
let table=A.fresh();assert.equal(table.length,131072);const kinds=[{$:"Twist"},{$:"Flip"},{$:"Slice"}],bases=[0,39366,76230],counts=[2187,2048,495];let tableChecks=0;
for(let i=0;i<3;i++)for(let state=0;state<counts[i];state++)for(let m=0;m<18;m++){assert.equal(table[bases[i]+state*18+m],Q.transition(kinds[i],state,m));tableChecks++;}assert.equal(tableChecks,85140);
const rank=c=>A.all_words(c.cp,c.co,c.ep,c.eh,c.eo),random=randomSource("rubend-axis-coordinate-reuse-v1");let comparisons=0;
for(let root=0;root<1000;root++){let cube=root?randomCube(random):C.solved(),axes=rank(cube);for(let m=0;m<18;m++){const child=C.turn(m,cube),expected=rank(child),increment=A.increment(table,axes,m),baseline=A.rescan_words(increment.fst,axes.ud,cube.cp,cube.co,cube.ep,cube.eh,cube.eo,m);table=baseline.fst;assert.deepEqual(increment.snd,expected);assert.deepEqual(baseline.snd,expected);comparisons++;}for(let i=0;i<20;i++){const m=random(18);cube=C.turn(m,cube);const next=A.increment(table,axes,m);table=next.fst;axes=next.snd;assert.deepEqual(axes,rank(cube));comparisons++;}}
const origin=C.solved(),initial=rank(origin),expected=rank(C.turn(0,origin)),wrong=A.step_with_moves(table,initial,0,0,0);table=wrong.fst;assert.notDeepEqual(wrong.snd,expected);const saved=table[39366];assert.equal(saved,0);table[39366]=1;const corrupt=A.increment(table,initial,0);table=corrupt.fst;assert.notDeepEqual(corrupt.snd,expected);table[39366]=saved;
const result={format:"rubend-axis-coordinate-correctness-v1",passed:true,transitionEntries:tableChecks,coordinateComparisons:comparisons,uniformRoots:999,walkLength:20,transitionStorageBytes:524288,wrongFrameMapping:{origin:faceletsOf(origin),move:0,expected,observed:wrong.snd},corruptTransition:{index:39366,expected,observed:corrupt.snd},productionIntegrated:false,extraFrameAllocationMeasured:false,conditionalProbeCostMeasured:false,performanceClaim:false,independentReview:false};writeFileSync(output,JSON.stringify(result,null,2)+"\n",{flag:"wx"});console.log(JSON.stringify(result));
