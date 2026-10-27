import assert from "node:assert/strict";
import {checkCoverageContour} from "../bench/forward-coverage-records.mjs";
import {apply,solved} from "../bench/fixed-work-model.mjs";

const item={facelets:apply(solved,[0]),depth:1},events=[{type:"candidate",moves:[2],length:1,lower:1},{type:"measurement",nativeMs:1,profile:3,target:20,bound:1,status:1,moves:[2]},{type:"done",length:1,lower:1,nodes:20,optimal:1}],valid=checkCoverageContour(events,item,3);assert.equal(valid.independentReplays,1);
const mutations=[x=>x.pop(),x=>x.push({...x[2]}),x=>x[0].moves=[0],x=>x[1].moves=[0],x=>x[1].profile=1,x=>x[1].target=19,x=>x[1].status=0,x=>x[2].lower=2,x=>x[2].nodes=200001,x=>x[2].length=0,x=>x[2].optimal=0,x=>x[1].nativeMs=-1];for(const mutate of mutations){const copy=structuredClone(events);mutate(copy);assert.throws(()=>checkCoverageContour(copy,item,3),assert.AssertionError);}console.log(JSON.stringify({passed:true,recordControls:mutations.length,replayAndKnownOptimumChecked:true}));
