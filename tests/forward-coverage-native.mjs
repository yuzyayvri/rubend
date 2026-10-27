import assert from "node:assert/strict";
import {readFileSync,writeFileSync,existsSync} from "node:fs";
import {resolve} from "node:path";
import {Engine} from "../apps/engine.mjs";
import {apply,solved} from "../bench/fixed-work-model.mjs";
import {checkCoverageContour} from "../bench/forward-coverage-records.mjs";
import {loadCorpus} from "../bench/corpus.mjs";
import {fileHash} from "../bench/bounded-file-hash.mjs";
import {nativeIdentity} from "../bench/startup-measure.mjs";

assert.equal(process.argv.length,4);const directory=resolve(process.argv[2]),output=resolve(process.argv[3]),cache=resolve(".cache/joint/phase1-v1.raw"),expected="2ccfd40fdc0cf4769c58d9646f6b0ea787571ce5200b5d124c8f17dcc70f73b5";assert.equal(fileHash(cache),expected);const layers=[[solved]],seen=new Set([solved]),shallow=[{id:"depth-0-0",facelets:solved,depth:0}];
for(let depth=1;depth<=3;depth++){const layer=[];for(const root of layers[depth-1])for(let move=0;move<18;move++){const cube=apply(root,[move]);if(seen.has(cube))continue;seen.add(cube);layer.push(cube);shallow.push({id:"depth-"+depth+"-"+String(layer.length-1),facelets:cube,depth});}layers.push(layer);}assert.deepEqual(layers.map(x=>x.length),[1,18,243,3240]);
let fourth=0;outer:for(const root of layers[3])for(let move=0;move<18;move++){const cube=apply(root,[move]);if(seen.has(cube))continue;seen.add(cube);shallow.push({id:"depth-4-"+fourth,facelets:cube,depth:4});if(++fourth===256)break outer;}assert.equal(shallow.length,3758);
const cases=[...shallow,...loadCorpus("pilot").slice(0,4),...loadCorpus("development").slice(0,4)],protectedCases=shallow.slice(0,262),report={passed:false,format:"rubend-forward-coverage-native-v1",oracle:"Independent integer sticker-geometry BFS, complete depths0..3 and first256 distinct depth4 roots",layers:[1,18,243,3240],depth4:256,shallowCases:3758,deepCases:8,fuel:200000,target:20,cacheSha256:expected,workers:[],rows:[],errors:[],productionIntegrated:false,performanceAcceptance:false,formalTargetOrLoadedDataClaim:false,releaseHoldoutOpened:false,independentReview:false};
Object.assign(process.env,{RUBEND_JOINT_CACHE:cache,RUBEND_CONTOUR_TARGET:"20"});
try{
  for(const[profile,policy]of[[3,"inverse-three"],[0,"forward"]])for(const label of["control","candidate"]){
    process.env.RUBEND_CONTOUR_PROFILE=policy;const binary=resolve(directory,label),engine=new Engine({binary,eventProtocol:"fixed-work"}),worker={label,profile,binary,binarySha256:fileHash(binary),directory:engine.directory,identity:null,shutdown:null};report.workers.push(worker);
    try{
      await engine.ready(120000);worker.identity=nativeIdentity(engine.child.pid);assert.ok(worker.identity);
      for(const item of(profile===3?cases:protectedCases)){
        const events=[];await new Promise((done,reject)=>{engine.solve({facelets:item.facelets,mode:"exact",budgetMs:30000},e=>{events.push(e);if(["error","invalid"].includes(e.type))reject(Error(JSON.stringify(e)));else if(e.type==="done")done();}).catch(reject);});const state=checkCoverageContour(events,item,profile);if(profile===0&&label==="candidate")assert.deepEqual(state,report.rows.find(r=>r.label==="control"&&r.profile===0&&r.id===item.id).state,"Unselected profile behavior changed");report.rows.push({label,profile,id:item.id,facelets:item.facelets,knownOptimum:item.depth??null,state});
      }
    }finally{
      let forced=false;const timer=setTimeout(()=>{forced=true;engine.child?.kill("SIGKILL");},3000);try{await engine.close();}finally{clearTimeout(timer);}worker.shutdown={forced:forced||engine.child?.signalCode==="SIGKILL",exitCode:engine.child?.exitCode,signal:engine.child?.signalCode,ipcRemoved:!existsSync(engine.directory),ownerGone:!worker.identity||nativeIdentity(worker.identity.pid)?.startTicks!==worker.identity.startTicks};assert.equal(worker.shutdown.forced,false);assert.ok((worker.shutdown.exitCode===0&&worker.shutdown.signal===null)||(worker.shutdown.exitCode===null&&worker.shutdown.signal==="SIGTERM"));assert.equal(worker.shutdown.ipcRemoved,true);assert.equal(worker.shutdown.ownerGone,true);
    }
    writeFileSync(output+"."+profile+"-"+label+".json",JSON.stringify({passed:true,worker,rows:report.rows.filter(r=>r.profile===profile&&r.label===label)})+"\n",{flag:"wx"});
  }
  assert.equal(report.rows.length,8056);assert.equal(fileHash(cache),expected);report.independentReplays=report.rows.reduce((n,r)=>n+r.state.independentReplays,0);report.protectedProfileRows=524;report.allOwnersAndIpcGone=report.workers.every(w=>w.shutdown?.ownerGone&&w.shutdown?.ipcRemoved&&!w.shutdown?.forced);report.passed=true;
}catch(error){report.errors.push(String(error.stack??error));}finally{writeFileSync(output,JSON.stringify(report)+"\n",{flag:"wx"});}
console.log(JSON.stringify({passed:report.passed,rows:report.rows.length,independentReplays:report.independentReplays??null,ownersGone:report.allOwnersAndIpcGone??false,errors:report.errors,performanceAcceptance:false}));if(!report.passed)process.exitCode=1;
