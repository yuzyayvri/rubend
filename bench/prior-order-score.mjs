import assert from "node:assert/strict";

export function compareQuality(pairs){
  let wins=0,losses=0,ties=0;const rows=[];
  for(const pair of pairs){const {control:a,prior:b}=pair;assert.ok(a&&b);for(const r of[a,b]){assert.ok(r.length>=0&&r.length<=31);assert.ok(r.lower>=0&&r.lower<=r.length);assert.ok(r.nodes<=pair.budget);assert.ok(r.nodes===pair.budget||r.status!==0,"Unfinished request did not consume its fixed budget");}const coverageLoss=a.length<31&&b.length===31,coverageGain=a.length===31&&b.length<31,loss=coverageLoss||b.length>a.length||b.lower<a.lower||(a.status===1&&b.status!==1),gain=coverageGain||b.length<a.length||b.lower>a.lower||(a.status!==1&&b.status===1);if(loss)losses++;else if(gain)wins++;else ties++;rows.push({id:pair.id,budget:pair.budget,control:a,prior:b,loss,gain});}
  return{wins,losses,ties,rows,disposition:losses?"rejected-quality-floor":wins?"promising-fixed-work-only":"tie-fixed-work",qualityPromotion:false,deadlineQualityMeasured:false};
}
