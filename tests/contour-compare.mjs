import assert from "node:assert/strict";
import {validateContour} from "../bench/contour-compare.mjs";
import {solved,apply} from "../apps/model.mjs";

const complete=[{type:"measurement",profile:3,nativeMs:100,target:15,bound:15,status:0,moves:[]},{type:"done",length:31,lower:15,nodes:2000,optimal:0}];
const item={id:"synthetic",facelets:apply(solved,[0,3])};
assert.equal(validateContour(complete,item,"inverse-three",15).complete,true);
const partial=structuredClone(complete);partial[0].bound=14;partial[1].lower=14;partial[1].nodes=20000000;
assert.equal(validateContour(partial,item,"inverse-three",15).complete,false);
const optimum=[{type:"candidate",moves:[],length:0,lower:0},{type:"measurement",profile:0,nativeMs:0,target:15,bound:0,status:1,moves:[]},{type:"done",length:0,lower:0,nodes:1,optimal:1}];
assert.equal(validateContour(optimum,{facelets:solved,depth:0},"forward",15).complete,true);
let rejected=0;
function reject(base,change,fixture=item,profile="inverse-three"){
  const events=structuredClone(base);change(events);assert.throws(()=>validateContour(events,fixture,profile,15));rejected++;
}
reject(complete,e=>e[0].profile=1);
reject(complete,e=>e[0].target=14);
reject(complete,e=>e[0].bound=14);
reject(complete,e=>e[0].status=5);
reject(complete,e=>e[1].reason="time_limit");
reject(complete,e=>e.pop());
reject(complete,e=>e.unshift({...e[0]}));
reject(complete,e=>e[1].lower=32);
reject(complete,e=>e[1].nodes=20000001);
reject(complete,e=>e[0].nativeMs=-1);
reject(partial,e=>e[1].nodes=19999999);
reject(complete,e=>{e[0].bound=16;e[1].lower=16;});
reject(complete,e=>{e[0].status=1;e[1].optimal=1;});
reject(optimum,e=>e.shift(),{facelets:solved,depth:0},"forward");
reject(optimum,e=>{},item,"forward");
reject(optimum,e=>{e[0].moves=[0];e[0].length=1;e[1].moves=[0];e[2].length=1;},{facelets:solved},"forward");
console.log(JSON.stringify({passed:true,completedAndCensoredAndOptimal:true,rejectedFixtures:rejected}));
