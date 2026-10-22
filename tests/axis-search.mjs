import assert from "node:assert/strict";
import {readFileSync,writeFileSync,createReadStream,existsSync} from "node:fs";
import {resolve} from "node:path";
import {createHash} from "node:crypto";
import {Engine} from "../apps/engine.mjs";
import {apply,solved} from "../apps/model.mjs";
import {loadCorpus} from "../bench/corpus.mjs";

export function compareStates(control,candidate){
  assert.deepEqual(candidate,control,"Native fixed-work state disagreement");
}
if(process.argv[2]==="--unit"){
  assert.equal(process.argv.length,3);
  const state={snapshot:[[1,2,3],[[0,[7,8],[1,2,3],[0,3]],[0,[8,7],[3,2,1],[3,0]]]],done:{length:31,lower:9,nodes:4096,optimal:0},measurement:{profile:3,target:12,bound:9,status:0,moves:[]}};
  compareStates(state,structuredClone(state));
  for(const mutate of [x=>x.done.nodes++,x=>x.done.lower++,x=>x.measurement.moves.push(1),x=>x.snapshot[1].reverse(),x=>x.snapshot[1][0][1][0]++]){
    const bad=structuredClone(state);mutate(bad);assert.throws(()=>compareStates(state,bad),/Native fixed-work state disagreement/);
  }
  assert.throws(()=>compareStates(state,undefined));
  console.log(JSON.stringify({passed:true,comparisonNegativeControls:6}));
  process.exit();
}
assert.equal(process.argv.length,4);
const directory=resolve(process.argv[2]),output=resolve(process.argv[3]);
assert.ok(directory.startsWith(resolve("build")+"/")&&output.startsWith(resolve("build")+"/"));
const cache=resolve(".cache/joint/phase1-v1.raw"),expected="2ccfd40fdc0cf4769c58d9646f6b0ea787571ce5200b5d124c8f17dcc70f73b5";
async function cacheHash(){const h=createHash("sha256");for await(const c of createReadStream(cache))h.update(c);return h.digest("hex");}
assert.equal(await cacheHash(),expected);
const shallow=JSON.parse(readFileSync("build/evidence/startup-fixed-raw-shallow.json","utf8")).cases;
assert.equal(shallow.length,163);
const cases=[...shallow,...loadCorpus("pilot").slice(0,8),...loadCorpus("development").slice(0,8)],target=12;
Object.assign(process.env,{RUBEND_JOINT_CACHE:cache,RUBEND_CONTOUR_PROFILE:"inverse-three",RUBEND_CONTOUR_TARGET:String(target)});
const report={format:"rubend-axis-search-functional-v1",passed:false,fuel:4096,target,cacheSha256:expected,releaseHoldoutOpened:false,workers:[],results:[],errors:[],performanceClaim:false,productionIntegrated:false,independentReview:false};
try{
  for(const label of ["control","candidate","audit"]){
    const binary=resolve(directory,label+"-check"),engine=new Engine({binary,eventProtocol:"fixed-work"});
    const worker={label,binary,pid:engine.child?.pid,directory:engine.directory,shutdown:null};report.workers.push(worker);
    try{
      await engine.ready(120000);worker.pid=engine.child.pid;
      for(const item of cases){
        const events=[];
        await new Promise((done,reject)=>{
          engine.solve({facelets:item.facelets,mode:"exact",budgetMs:30000},e=>{
            events.push(e);if(["error","invalid"].includes(e.type))reject(Error(JSON.stringify(e)));else if(e.type==="done")done();
          }).catch(reject);
        });
        assert.ok(events.every(e=>["snapshot","measurement","candidate","done"].includes(e.type)));
        const select=type=>{const xs=events.filter(e=>e.type===type);assert.equal(xs.length,1);const {elapsedMs,...value}=xs[0];return value;};
        const {type:dt,...done}=select("done"),{type:mt,nativeMs,...measurement}=select("measurement"),snapshot=select("snapshot").state;
        assert.equal(measurement.profile,3);assert.equal(measurement.target,target);assert.ok([0,1].includes(measurement.status));
        assert.equal(done.optimal,measurement.status===1?1:0);assert.equal(done.lower,measurement.bound);
        assert.ok(Number.isInteger(done.nodes)&&done.nodes>0&&done.nodes<=4096);
        assert.ok(done.lower>=0&&done.lower<=done.length&&done.length<=31);
        const complete=done.lower>=target||done.optimal===1;
        if(!complete)assert.equal(done.nodes,4096);
        const answers=events.filter(e=>e.type==="candidate");
        if(done.length<31){assert.equal(answers.length,1);assert.equal(measurement.moves.length,done.length);assert.equal(apply(item.facelets,measurement.moves),solved);assert.deepEqual(answers[0].moves,measurement.moves);}
        else{assert.equal(answers.length,0);assert.deepEqual(measurement.moves,[]);assert.equal(done.optimal,0);}
        if(item.depth!==undefined){assert.equal(done.optimal,1);assert.equal(done.length,item.depth);assert.equal(done.lower,item.depth);}
        const state={snapshot,done,measurement};
        if(label!=="control")compareStates(report.results.find(r=>r.label==="control"&&r.id===item.id).state,state);
        report.results.push({label,id:item.id,facelets:item.facelets,complete,state});
      }
    }finally{
      let forced=false;const timer=setTimeout(()=>{forced=true;engine.child?.kill("SIGKILL");},1000);
      try{await engine.close();}finally{clearTimeout(timer);}
      worker.shutdown={forced,exitCode:engine.child?.exitCode,signal:engine.child?.signalCode,ipcRemoved:!existsSync(engine.directory)};
      assert.equal(forced,false);assert.equal(worker.shutdown.ipcRemoved,true);
    }
  }
  report.passed=true;
}catch(e){report.errors.push(String(e.stack??e));}
finally{
  try{assert.equal(await cacheHash(),expected);}catch(e){report.passed=false;report.errors.push(String(e));}
  report.checkedCases=cases.length;report.auditVisits=report.results.filter(r=>r.label==="audit").reduce((n,r)=>n+r.state.done.nodes,0);
  writeFileSync(output,JSON.stringify(report)+"\n",{flag:"wx"});
}
console.log(JSON.stringify({passed:report.passed,cases:report.checkedCases,auditVisits:report.auditVisits,errors:report.errors,performanceClaim:false}));
if(!report.passed)process.exitCode=1;
