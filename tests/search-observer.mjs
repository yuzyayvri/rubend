import assert from "node:assert/strict";
import {checkCounters,contract} from "../bench/diagnostic-check.mjs";

const row=(slice,counts)=>({type:"diagnostic",id:"fixture",request:2,slice,counts:contract.fields.map(name=>counts[name]??0)});
const records=[row(0,{}),row(1,{workSteps:1,reductionSteps:1,expanded:1,considered:1,legalAttempts:1,admitted:1,logicalTransitionReads:3,logicalPairReads:2})];
const snapshots=[{id:"fixture",request:2,slice:0,nodes:0},{id:"fixture",request:2,slice:1,nodes:1}];
assert.equal(checkCounters(records,snapshots,"light").length,1);
let rejected=0;
function reject(change,message){
  const values=structuredClone(records),states=structuredClone(snapshots);
  change(values,states);
  assert.throws(()=>checkCounters(values,states,"light"),message);rejected++;
}
const set=(r,name,value)=>{r.counts[contract.fields.indexOf(name)]=value;};
reject(v=>v.pop(),/Diagnostic coverage/);
reject(v=>v[1].id="other",/Diagnostic identity/);
reject(v=>v[1].counts.pop(),/Counter schema/);
reject(v=>set(v[1],"workSteps",1.5),/Non-integer counter/);
reject(v=>set(v[1],"workSteps",2),/Work-step counter/);
reject(v=>set(v[1],"reductionSteps",0),/Phase accounting/);
reject(v=>set(v[1],"considered",2),/Canonical accounting/);
reject(v=>set(v[1],"admitted",0),/Admission accounting/);
reject(v=>set(v[1],"logicalTransitionReads",2),/Transition accounting/);
reject(v=>set(v[1],"logicalPairReads",1),/Pair accounting/);
reject(v=>set(v[1],"expanded",2),/Expansion accounting/);
reject(v=>set(v[1],"logicalJointEstimates",1),/Light profile used joint/);
console.log(JSON.stringify({passed:true,counterConservation:true,logicalProbeAccounting:true,rejectedFixtures:rejected}));
