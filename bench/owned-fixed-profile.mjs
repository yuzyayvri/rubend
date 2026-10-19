import assert from "node:assert/strict";
import {readFileSync,writeFileSync,mkdirSync,existsSync,readdirSync} from "node:fs";
import {resolve} from "node:path";
import {spawnSync} from "node:child_process";
import {createHash} from "node:crypto";
import {Engine} from "../apps/engine.mjs";
import {parseCpu} from "./fixed-time-compare.mjs";

assert.equal(process.argv.length,4,"Expected frozen timer-build.json and fresh diagnostic directory");
const metadataPath=resolve(process.argv[2]),directory=resolve(process.argv[3]),hash=bytes=>createHash("sha256").update(bytes).digest("hex");assert.ok(directory.startsWith(resolve("build/experiments")+"/"));assert.equal(existsSync(directory),false);mkdirSync(directory);
const build=JSON.parse(readFileSync(metadataPath,"utf8"));assert.equal(build.format,"rubend-fixed-timer-build-v1");
const frozen=metadataPath.replace(/\.json$/,"-sources"),entry=resolve(frozen,"bench/fixed-timer.bend");assert.equal(hash(readFileSync(entry)),build.entrySha256);
for(const [path,expected]of Object.entries(build.sourceHashes))assert.equal(hash(readFileSync(resolve(frozen,path))),expected);
const c=resolve(directory,"profile.c"),binary=resolve(directory,"profile"),commands=[],record={format:"rubend-owned-fixed-profile-v1",passed:false,build,commands,jobs:[],claim:"One instrumented native diagnostic, not release timings, speed adjudication, or promotion evidence.",independentReview:false};
function run(program,args){const result=spawnSync(program,args,{encoding:"utf8",timeout:120000,maxBuffer:4194304});commands.push({program,args,status:result.status,stderr:result.stderr});assert.ifError(result.error);assert.equal(result.status,0,result.stderr);return result.stdout;}
try{
  run("bend",[entry,"-o",c]);run("clang",["-O2","-pg","-g",c,"-o",binary,"-lpthread","-lm"]);record.cSha256=hash(readFileSync(c));record.binarySha256=hash(readFileSync(binary));
  const gmon=resolve(directory,"gmon"),saved=process.env.GMON_OUT_PREFIX;process.env.GMON_OUT_PREFIX=gmon;
  const engine=new Engine({binary,eventProtocol:"fixed-work"}),facelets=JSON.parse(readFileSync("bench/fixed-work-cases.json","utf8")).cases.find(item=>item.id==="superflip").facelets;
  try{
    await engine.ready(120000);const pid=engine.child.pid;record.pid=pid;record.before=parseCpu(readFileSync("/proc/"+pid+"/stat","utf8"),pid);
    for(let index=0;index<10;index++){
      const events=[];await new Promise((done,reject)=>{const timer=setTimeout(()=>reject(Error("Instrumented fixed-work watchdog")),30000);engine.solve({facelets,mode:"exact",budgetMs:10000},event=>{try{events.push(event);if(["error","invalid"].includes(event.type))throw Error(JSON.stringify(event));if(event.type==="done"){clearTimeout(timer);assert.notEqual(event.reason,"time_limit");done();}}catch(error){clearTimeout(timer);reject(error);}}).catch(error=>{clearTimeout(timer);reject(error);});});
      assert.equal(engine.child.pid,pid);const snapshot=events.find(event=>event.type==="snapshot"),done=events.at(-1);assert.ok(snapshot);assert.ok(snapshot.nodes>=100000);assert.equal(snapshot.nodes,done.nodes);const {elapsedMs,...semantic}=snapshot;if(index)assert.deepEqual(semantic,record.jobs[0]);record.jobs.push(semantic);
    }
    record.after=parseCpu(readFileSync("/proc/"+pid+"/stat","utf8"),pid);assert.equal(record.before.startTicks,record.after.startTicks);
    engine.owner.expectedStop=true;
    await new Promise((done,reject)=>engine.owner.input.end(error=>error?reject(error):done()));
    let timeout;try{await Promise.race([engine.childStopped,new Promise((done,reject)=>{timeout=setTimeout(()=>reject(Error("Profile worker did not exit after input EOF")),5000);})]);}finally{clearTimeout(timeout);}
    assert.equal(engine.child.exitCode,0);assert.equal(engine.child.signalCode,null);record.gracefulProfileFlush=true;
  }finally{await engine.close();if(saved===undefined)delete process.env.GMON_OUT_PREFIX;else process.env.GMON_OUT_PREFIX=saved;}
  const files=readdirSync(directory).filter(name=>name.startsWith("gmon."));assert.equal(files.length,1);const profile=run("gprof",["--brief","--line",binary,resolve(directory,files[0])]);writeFileSync(resolve(directory,"profile.txt"),profile,{flag:"wx"});record.profileSha256=hash(profile);record.profileHead=profile.split("\n").slice(0,60);record.passed=true;
}catch(error){record.error=String(error.stack??error);}
finally{for(const [path,expected]of Object.entries(build.sourceHashes))assert.equal(hash(readFileSync(resolve(frozen,path))),expected);assert.equal(hash(readFileSync(entry)),build.entrySha256);writeFileSync(resolve(directory,"result.json"),JSON.stringify(record,null,2)+"\n",{flag:"wx"});}
console.log(JSON.stringify({passed:record.passed,error:record.error??null,profileHead:record.profileHead??[],result:resolve(directory,"result.json")}));if(!record.passed)process.exitCode=1;
