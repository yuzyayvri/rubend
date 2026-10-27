import assert from "node:assert/strict";
import {apply,solved} from "./fixed-work-model.mjs";

const uint=value=>assert.ok(Number.isInteger(value)&&value>=0&&value<=4294967295);
const time=value=>assert.ok(Number.isSafeInteger(value)&&value>=0);
const p95=values=>[...values].sort((a,b)=>a-b)[Math.ceil(values.length*0.95)-1];

export function scoreDeadlineRecords(records,cases){
  assert.deepEqual(records[0],{type:"ready"});
  assert.equal(new Set(cases.map(r=>r.id)).size,cases.length);
  let offset=1,replays=0,lateCandidates=0;
  const summaries=[];
  for(const row of cases){
    const begin=records[offset++];
    assert.deepEqual(begin,{type:"begin",id:row.id,seed:row.seed,budgetMs:row.budgetMs});
    let length=31,lower=0,nodes=0,tick=0,elapsed=0,pending=null,firstAnswerMs=null;
    let scored={length:31,lower:0,moves:[],elapsedMs:0},bestMoves=[];
    const curve=[];
    while(records[offset]?.type!=="done"){
      const record=records[offset++];assert.ok(record,"Missing deadline completion");assert.equal(record.id,row.id);
      if(record.type==="candidate"){
        assert.equal(pending,null,"Unpaired candidate");
        for(const key of["tick","length","lower","nodes","optimal"])uint(record[key]);
        assert.ok(record.length<length&&record.length<31);assert.ok(record.lower<=record.length);
        assert.ok(record.optimal===0||record.optimal===1);
        assert.equal(record.moves.length,record.length);record.moves.forEach(m=>{uint(m);assert.ok(m<18);});
        assert.equal(apply(row.facelets,record.moves),solved,"Wrong original-root replay");
        pending=record;replays++;continue;
      }
      assert.equal(record.type,"point");
      for(const key of["tick","length","lower","nodes","status"])uint(record[key]);time(record.elapsedMs);
      assert.ok([0,1,3].includes(record.status));assert.ok(record.length<=length&&record.lower>=lower&&record.lower<=record.length);
      assert.ok(record.nodes>=nodes&&record.tick>=tick&&record.elapsedMs>=elapsed);
      if(record.length<length){
        assert.ok(pending,"Point improvement lacks a certificate event");
        for(const key of["tick","length","lower","nodes"])assert.equal(record[key],pending[key]);
        assert.equal(pending.optimal,Number(record.status===1));bestMoves=pending.moves;
        if(record.elapsedMs<=row.budgetMs){if(firstAnswerMs===null)firstAnswerMs=record.elapsedMs;}else lateCandidates++;
      }else assert.equal(pending,null,"Candidate availability lost its improvement");
      pending=null;length=record.length;lower=record.lower;nodes=record.nodes;tick=record.tick;elapsed=record.elapsedMs;
      if(record.status===1){assert.ok(length<31);assert.equal(lower,length);}
      const point={...record,moves:bestMoves};curve.push(point);
      if(elapsed<=row.budgetMs)scored={length,lower,moves:bestMoves,elapsedMs:elapsed};
    }
    const done=records[offset++];assert.equal(done.id,row.id);assert.equal(pending,null);
    for(const key of["length","lower","nodes","originalNodes","seedNodes","ticks","accepted","fault","status"])uint(done[key]);time(done.elapsedMs);
    assert.equal(done.fault,0);assert.ok([0,1,3].includes(done.status));assert.equal(done.nodes,done.originalNodes+done.seedNodes);
    assert.equal(done.length,length);assert.equal(done.lower,lower);assert.ok(done.nodes>=nodes&&done.ticks>=tick&&done.elapsedMs>=elapsed);
    assert.ok(done.elapsedMs>=row.budgetMs||done.status!==0,"Native work ended before its deadline");
    assert.ok(done.ticks<50000);assert.ok(done.accepted<=done.ticks);
    if(row.seed===18){assert.equal(done.seedNodes,0);assert.equal(done.accepted,0);}
    assert.ok(done.nodes<=done.ticks*20000,"Fast work quantum changed");
    if(scored.length<31)assert.notEqual(firstAnswerMs,null);
    assert.ok(curve.length>0,"Missing initial observation");
    if(row.kind==="warmup")assert.equal(scored.length,row.depth,"Known-depth warmup failed");
    summaries.push({...row,...scored,firstAnswerMs,censoredLatencyMs:firstAnswerMs??row.budgetMs,covered:scored.length<31,work:done,curve,overshootMs:Math.max(0,done.elapsedMs-row.budgetMs)});
  }
  assert.equal(offset,records.length,"Unexpected trailing deadline records");
  return{summaries,replays,lateCandidates,errorCount:0,workSteps:summaries.reduce((n,r)=>n+r.work.nodes,0),seedSteps:summaries.reduce((n,r)=>n+r.work.seedNodes,0)};
}

function latency(rows){
  const covered=rows.filter(r=>r.covered),values=covered.map(r=>r.firstAnswerMs);
  return{count:rows.length,covered:covered.length,missing:rows.length-covered.length,p95Ms:covered.length===rows.length?p95(values):null,observedMinimumMs:values.length?Math.min(...values):null,observedMaximumMs:values.length?Math.max(...values):null,censoredMeanMs:rows.reduce((n,r)=>n+r.censoredLatencyMs,0)/rows.length};
}

function paired(rows,kind,cohorts){
  const selected=rows.filter(r=>r.kind===kind),pairs=[],groups=new Map();
  for(const control of selected.filter(r=>r.arm===0)){
    const candidate=selected.find(r=>r.arm===1&&r.baseId===control.baseId&&r.cohort===control.cohort);assert.ok(candidate);
    const loss=candidate.length>control.length||candidate.lower<control.lower,gain=!loss&&(candidate.length<control.length||candidate.lower>control.lower);
    const key=control.baseId,g=groups.get(key)??{id:key,cohorts:0,wins:0,losses:0};g.cohorts++;g.wins+=Number(gain);g.losses+=Number(loss);groups.set(key,g);
    pairs.push({id:key+"/"+control.cohort,budgetMs:control.budgetMs,control:{length:control.length,lower:control.lower,firstAnswerMs:control.firstAnswerMs},candidate:{length:candidate.length,lower:candidate.lower,firstAnswerMs:candidate.firstAnswerMs},gain,loss});
  }
  assert.equal(pairs.length*2,selected.length);for(const g of groups.values())assert.equal(g.cohorts,cohorts);
  return{pairs,wins:pairs.filter(r=>r.gain).length,losses:pairs.filter(r=>r.loss).length,repeatableWins:[...groups.values()].filter(g=>g.wins===cohorts&&g.losses===0).map(g=>g.id),groups:[...groups.values()]};
}

export function summarizeDeadlineScores(analysis,spec){
  const rows=analysis.summaries,confirmation=paired(rows,"confirmation",spec.cohorts),diagnostic=paired(rows,"diagnostic",spec.cohorts),aa=paired(rows,"aa",1);
  const latencyByBudget=spec.budgetsMs.map(budgetMs=>{
    const group=rows.filter(r=>r.kind==="confirmation"&&r.budgetMs===budgetMs),controls=rows.filter(r=>r.kind==="aa"&&r.budgetMs===budgetMs),control=latency(group.filter(r=>r.arm===0)),candidate=latency(group.filter(r=>r.arm===1)),a=latency(controls.filter(r=>r.arm===0)),b=latency(controls.filter(r=>r.arm===1));
    const spread=a.p95Ms===null||b.p95Ms===null?null:Math.abs(a.p95Ms-b.p95Ms)/Math.max(1,a.p95Ms,b.p95Ms),ratio=control.p95Ms===null||candidate.p95Ms===null?null:candidate.p95Ms/Math.max(1,control.p95Ms);
    return{budgetMs,control,candidate,aa:{control:a,copy:b,p95Spread:spread},firstAnswerP95Ratio:ratio};
  });
  const aaQualityStable=aa.pairs.every(p=>p.control.length===p.candidate.length&&p.control.lower===p.candidate.lower),aaTimingStable=latencyByBudget.every(r=>r.aa.p95Spread!==null&&r.aa.p95Spread<=spec.timingNoiseFraction),latencyFloor=latencyByBudget.every(r=>r.firstAnswerP95Ratio!==null&&r.firstAnswerP95Ratio<=1+spec.firstAnswerP95RegressionFraction);
  const disposition=confirmation.losses?"rejected-deadline-quality-floor":!aaQualityStable||!aaTimingStable?"inconclusive-noisy-control":!latencyFloor?"rejected-first-answer-floor":confirmation.repeatableWins.length?"confirmed-native-deadline-only":"unconfirmed-deadline-benefit";
  return{confirmation,diagnostic,aa,latencyByBudget,aaQualityStable,aaTimingStable,latencyFloor,disposition,performanceAcceptance:false,productIntegrated:false,releaseHoldoutOpened:false,independentReview:false};
}
