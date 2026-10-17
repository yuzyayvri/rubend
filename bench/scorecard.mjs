import assert from "node:assert/strict";
import {apply,solved,validate} from "../apps/model.mjs";

const integer=(x,min,max)=>Number.isSafeInteger(x)&&x>=min&&x<=max;
const mean=xs=>xs.length?xs.reduce((a,b)=>a+b,0)/xs.length:null;
const p95=xs=>xs.length?[...xs].sort((a,b)=>a-b)[Math.ceil(xs.length*.95)-1]:null;

function inspect(record,item,optimum){
  assert.ok(["fast","exact"].includes(record.mode));
  assert.ok(integer(record.budgetMs,1,30000));
  assert.equal(record.facelets,item.facelets,"Input changed");
  assert.ok(["ok","error"].includes(record.status));
  assert.ok(Array.isArray(record.events));
  if(record.status==="error"){
    assert.equal(typeof record.error,"string");assert.ok(record.error.length);
    return {id:item.id,facelets:item.facelets,mode:record.mode,budgetMs:record.budgetMs,error:record.error,candidates:[],bounds:[],optimalMs:null,optimum};
  }
  assert.ok(record.events.length,"Missing terminal event");
  let elapsed=0,lower=0,best=31,optimalMs=null,ended=false;
  const candidates=[],bounds=[];
  for(const event of record.events){
    assert.equal(ended,false,"Event after terminal");
    assert.ok(["candidate","progress","done"].includes(event.type),"Unexpected event");
    assert.ok(integer(event.elapsedMs,elapsed,Number.MAX_SAFE_INTEGER),"Event clock regressed");
    elapsed=event.elapsedMs;
    assert.ok(integer(event.lower,lower,30),"Lower bound regressed");
    lower=event.lower;
    bounds.push({elapsedMs:elapsed,lower});
    if(event.type==="candidate"){
      assert.ok(integer(event.length,0,30)&&event.length<=best,"Candidate regressed");
      assert.equal(event.moves?.length,event.length);
      assert.equal(apply(item.facelets,event.moves),solved,"Invalid candidate replay");
      if(optimum!==null)assert.ok(event.length>=optimum,"Answer contradicts known optimum");
      best=event.length;candidates.push({elapsedMs:elapsed,length:best,moves:event.moves});
    }
    assert.ok(lower<=best,"Lower exceeds verified incumbent");
    if(optimum!==null)assert.ok(lower<=optimum,"Lower contradicts known optimum");
    if(event.optimal!==undefined)assert.ok(event.optimal===0||event.optimal===1,"Invalid optimal flag");
    if(event.optimal===1){
      assert.ok(candidates.length&&lower===best,"Unsubstantiated optimal label");
      optimalMs??=elapsed;
    }
    if(event.type==="done"){
      assert.notEqual(event.reason,"time_limit","Host emergency stop is not native completion");
      assert.equal(event.length,best,"Terminal length mismatch");
      assert.ok(event.optimal===0||event.optimal===1);
      assert.ok(optimalMs===null||event.optimal===1,"Optimal label regressed");
      ended=true;
    }
  }
  assert.ok(ended,"Missing native done");
  return {id:item.id,facelets:item.facelets,mode:record.mode,budgetMs:record.budgetMs,error:null,candidates,bounds,optimalMs,optimum};
}

export function scorecard(cases,records,{deadlines,knownOptima=[]}={}){
  assert.ok(Array.isArray(cases)&&cases.length);
  assert.ok(Array.isArray(records)&&records.length===cases.length,"Every planned case needs a record");
  assert.ok(Array.isArray(deadlines)&&deadlines.length);
  assert.ok(deadlines.every((x,i)=>integer(x,1,30000)&&(i===0||x>deadlines[i-1])),"Deadlines must increase");
  const inputs=new Map(),optima=new Map(),jobs=new Map();
  for(const item of cases){
    assert.ok(typeof item.id==="string"&&item.id.length&&!inputs.has(item.id),"Duplicate/invalid case");
    validate(item.facelets);inputs.set(item.id,item);
  }
  for(const item of knownOptima){
    assert.ok(inputs.has(item.id)&&!optima.has(item.id),"Unknown/duplicate oracle case");
    assert.ok(integer(item.length,0,20));
    assert.ok(typeof item.source==="string"&&item.source.trim().length,"Oracle provenance required");
    optima.set(item.id,item);
  }
  for(const record of records){
    assert.ok(inputs.has(record.id)&&!jobs.has(record.id),"Unknown/duplicate record");
    const value=inspect(record,inputs.get(record.id),optima.get(record.id)?.length??null);
    assert.ok(deadlines.at(-1)<=value.budgetMs,"Requested observation exceeds job budget");
    jobs.set(record.id,value);
  }
  const observations=deadlines.map(deadlineMs=>{
    const values=cases.map(item=>{
      const job=jobs.get(item.id),best=job.candidates.filter(x=>x.elapsedMs<=deadlineMs).at(-1)??null;
      return {id:item.id,facelets:item.facelets,mode:job.mode,budgetMs:job.budgetMs,error:job.error,answered:best!==null,length:best?.length??null,lower:job.bounds.filter(x=>x.elapsedMs<=deadlineMs).at(-1)?.lower??0,firstMs:job.candidates[0]?.elapsedMs<=deadlineMs?job.candidates[0].elapsedMs:null,optimum:job.optimum,oracleSource:optima.get(item.id)?.source??null,optimal:job.optimalMs!==null&&job.optimalMs<=deadlineMs,exactTimeCappedMs:job.mode==="exact"?Math.min(job.optimalMs??deadlineMs,deadlineMs):null};
    });
    const answered=values.filter(x=>x.answered),known=values.filter(x=>x.optimum!==null),knownAnswered=known.filter(x=>x.answered),exact=values.filter(x=>x.mode==="exact");
    return {deadlineMs,planned:values.length,errors:values.filter(x=>x.error!==null).length,answered:answered.length,noAnswer:values.length-answered.length,meanAnsweredLength:mean(answered.map(x=>x.length)),p95FirstMs:p95(answered.map(x=>x.firstMs)),oracle:{eligible:known.length,answered:knownAnswered.length,meanAnsweredExcess:mean(knownAnswered.map(x=>x.length-x.optimum))},exact:{planned:exact.length,completed:exact.filter(x=>x.optimal).length,restrictedMeanMs:mean(exact.map(x=>x.exactTimeCappedMs))},cases:values};
  });
  return {format:"rubend-scorecard-v1",policy:"Errors invalidate promotion. Compare answer coverage before conditional lengths. Paired losses stay visible. Exact times include censored jobs at the common cutoff. Oracle excess uses only the provenance-tagged subset.",observations};
}

export function compareScorecards(baseline,candidate){
  assert.equal(baseline.format,"rubend-scorecard-v1");assert.equal(candidate.format,baseline.format);
  assert.deepEqual(candidate.observations.map(x=>x.deadlineMs),baseline.observations.map(x=>x.deadlineMs));
  return baseline.observations.map((before,index)=>{
    const after=candidate.observations[index],byId=new Map(after.cases.map(x=>[x.id,x]));
    assert.equal(byId.size,before.cases.length);
    const paired={wins:0,ties:0,losses:0,bothMissing:0,coverageGains:0,coverageLosses:0,lowerGains:0,lowerLosses:0};
    for(const a of before.cases){
      const b=byId.get(a.id);assert.ok(b);
      for(const key of ["facelets","mode","budgetMs","optimum","oracleSource"])assert.equal(b[key],a[key],"Comparison case contract changed");
      if(a.answered&&!b.answered)paired.coverageLosses++;
      else if(!a.answered&&b.answered)paired.coverageGains++;
      else if(!a.answered)paired.bothMissing++;
      else paired[b.length<a.length?"wins":b.length>a.length?"losses":"ties"]++;
      if(a.mode==="exact"&&b.lower!==a.lower)paired[b.lower>a.lower?"lowerGains":"lowerLosses"]++;
    }
    const invalid=before.errors>0||after.errors>0;
    const qualityFloorPassed=!invalid&&paired.coverageLosses===0&&paired.losses===0&&paired.lowerLosses===0&&after.exact.completed>=before.exact.completed;
    const improved=paired.coverageGains>0||paired.wins>0||paired.lowerGains>0||after.exact.completed>before.exact.completed;
    return {deadlineMs:before.deadlineMs,baselineAnswered:before.answered,candidateAnswered:after.answered,paired,qualityFloorPassed,verdict:invalid?"invalid":qualityFloorPassed?(improved?"improved":"tied"):"regressed-or-tradeoff"};
  });
}
