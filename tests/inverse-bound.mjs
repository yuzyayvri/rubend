import assert from "node:assert/strict";
import {puzzles} from "cubing/puzzles";
import {KPattern} from "cubing/kpuzzle";
import Cubie from "../build/cubie.mjs";
import Guards from "../build/inverse-bound-test.mjs";
import {randomCube,randomSource,patternData,faceletsOf} from "./support.mjs";
import {apply,solved,validate} from "../apps/model.mjs";

assert.equal(Guards.checks(),true);
const puzzle=await puzzles["3x3x3"].kpuzzle(),random=randomSource("rubend-inverse-oracle-v1");
for(let i=0;i<2000;i++){
  const cube=randomCube(random),transformation=new KPattern(puzzle,patternData(cube)).experimentalToTransformation();
  assert.ok(transformation);
  assert.deepEqual(patternData(Cubie.inverse(cube)),transformation.invert().toKPattern().patternData);
}
const states=new Map([[solved,[]]]),layers=[[solved]];
for(let depth=1;depth<=4;depth++){
  const layer=[];
  for(const facelets of layers[depth-1])for(let move=0;move<18;move++){
    const next=apply(facelets,[move]);
    if(!states.has(next)){states.set(next,[...states.get(facelets),move]);layer.push(next);}
  }
  layers.push(layer);
}
assert.deepEqual(layers.map(x=>x.length),[1,18,243,3240,43239]);
for(const [facelets,path] of states){
  const inverse=faceletsOf(Cubie.inverse(validate(facelets))),expected=apply(solved,path.toReversed().map(m=>3*Math.floor(m/3)+2-m%3));
  assert.equal(inverse,expected);
  assert.equal(states.get(inverse)?.length,path.length);
}
console.log(JSON.stringify({passed:true,syntheticGoalGuards:true,independentInversePatterns:2000,independentShallowInverses:states.size,oracle:"cubing@0.66.0 KPuzzle and independent facelet BFS"}));
