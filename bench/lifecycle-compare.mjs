import assert from "node:assert/strict";
import {createHash} from "node:crypto";
import {createReadStream,existsSync,readFileSync,statSync} from "node:fs";
import {resolve,isAbsolute} from "node:path";
import {fileURLToPath} from "node:url";
import {Engine} from "../apps/engine.mjs";
import {validate,solved} from "../apps/model.mjs";
import {nativeIdentity,sampleNativeRss} from "./startup-measure.mjs";

const distribution=values=>{if(!values.length)return null;const sorted=[...values].sort((a,b)=>a-b);return {count:sorted.length,median:sorted[Math.floor(sorted.length/2)],minimum:sorted[0],maximum:sorted.at(-1),p95:sorted[Math.ceil(sorted.length*.95)-1]};};
function identity(path){const s=statSync(path,{bigint:true});assert.ok(s.isFile(),"Expected regular input file");return [s.dev,s.ino,s.size,s.mtimeNs,s.ctimeNs,s.mode].map(String);}
async function seal(path){const before=identity(path),hash=createHash("sha256");let bytes=0;for await(const chunk of createReadStream(path)){bytes+=chunk.length;hash.update(chunk);}assert.deepEqual(identity(path),before,"Input changed during hashing");return {identity:before,bytes,sha256:hash.digest("hex")};}
async function request(engine,facelets,work){
  const events=[];
  await new Promise((done,reject)=>{
    const timer=setTimeout(()=>reject(Error("Lifecycle request watchdog")),5000);
    engine.solve({facelets,mode:"exact",budgetMs:30000},event=>{
      events.push(structuredClone(event));
      if(["invalid","error"].includes(event.type)){clearTimeout(timer);reject(Error(JSON.stringify(event)));}
      if(work&&event.type==="done"){clearTimeout(timer);reject(Error("Selected cancellation case completed before the work checkpoint"));}
      if(work?event.type==="progress"&&event.nodes>=100000:event.type==="done"){
        clearTimeout(timer);
        if(!work){assert.ok(events.some(e=>e.type==="candidate"&&e.length===0));assert.equal(event.optimal,1);assert.equal(event.lower,0);}
        done();
      }
    }).catch(error=>{clearTimeout(timer);reject(error);});
  });
  return events;
}
export async function compareLifecycle(config,configPath){
  const result={format:"rubend-lifecycle-comparison-v1",passed:false,startedAt:new Date().toISOString(),config,rounds:[],errors:[],seals:{},afterSeals:{},conditions:{clock:"Host monotonic time from cancel request through usable readiness. Startup is separate and uses warm files.",work:"Cancellation waits for at least 100000 native search work steps. These are not node expansions.",limits:"External run-limited resource receipt required. No concurrent builds.",claim:"Local lifecycle only. No search-throughput, strength, or formal completeness claim."}};
  try{
    assert.deepEqual(Object.keys(config).sort(),["cases","iterations","profiles"]);assert.equal(config.iterations,5);
    assert.equal(config.profiles.length,2);assert.equal(new Set(config.profiles.map(p=>p.id)).size,2);assert.equal(config.cases.length,3);
    for(const item of config.cases){assert.deepEqual(Object.keys(item).sort(),["facelets","id"]);validate(item.facelets);}
    assert.equal(new Set(config.cases.map(item=>item.id)).size,3);
    const root=fileURLToPath(new URL("../",import.meta.url));
    const paths=[configPath,...["bench/lifecycle-compare.mjs","bench/startup-measure.mjs","apps/engine.mjs","apps/model.mjs","build/model.mjs","build/cubie.mjs","build/notation.mjs"].map(p=>resolve(root,p))];
    for(const p of config.profiles){
      assert.deepEqual(Object.keys(p).sort(),["binary","buildMetadata","cache","cacheBytes","cacheSha256","cooperative","env","id"]);
      assert.match(p.id,/^[a-z0-9-]+$/);assert.equal(typeof p.cooperative,"boolean");
      for(const key of["binary","buildMetadata","cache"])assert.ok(isAbsolute(p[key]));
      assert.deepEqual(Object.keys(p.env),["RUBEND_JOINT_CACHE"]);assert.equal(p.env.RUBEND_JOINT_CACHE,p.cache);
      paths.push(p.binary,p.buildMetadata,p.cache);
    }
    assert.equal(config.profiles[0].cache,config.profiles[1].cache);
    assert.equal(config.profiles[0].cacheSha256,config.profiles[1].cacheSha256);
    assert.equal(config.profiles[0].cacheBytes,config.profiles[1].cacheBytes);
    for(const path of new Set(paths))result.seals[path]=await seal(path);
    assert.deepEqual(JSON.parse(readFileSync(configPath,"utf8")),config);
    for(const p of config.profiles){assert.equal(result.seals[p.cache].sha256,p.cacheSha256);assert.equal(result.seals[p.cache].bytes,p.cacheBytes);assert.equal(JSON.parse(readFileSync(p.buildMetadata,"utf8")).binarySha256,result.seals[p.binary].sha256);}
    for(let iteration=0;iteration<5;iteration++){
      const order=iteration%2?[...config.profiles].reverse():config.profiles;
      for(const profile of order){
        const row={iteration,profile:profile.id,status:"error",initializations:0,readyEvents:0,cycles:[],shutdown:null};result.rounds.push(row);
        const saved=Object.fromEntries(Object.keys(profile.env).map(k=>[k,process.env[k]]));Object.assign(process.env,profile.env);
        let engine;
        try{
          const launched=performance.now();engine=new Engine({binary:profile.binary});
          const receive=engine.receive.bind(engine);
          engine.receive=event=>{if(event?.type==="initializing")row.initializations++;if(event?.type==="ready")row.readyEvents++;receive(event);};
          await engine.ready(120000);row.startupMs=performance.now()-launched;assert.equal(engine.cooperative,profile.cooperative);
          const original=nativeIdentity(engine.child.pid);assert.ok(original);row.original=original;
          row.readyRss=sampleNativeRss(original,"ready",launched);
          for(const item of config.cases){
            const events=await request(engine,item.facelets,true),before=nativeIdentity(engine.child.pid),oldDirectory=engine.directory;
            const started=performance.now();await engine.cancel();await engine.ready(120000);const cancellationMs=performance.now()-started;
            const after=nativeIdentity(engine.child.pid);assert.ok(after);assert.equal(engine.failure,null);assert.equal(engine.state,"ready");
            const reused=before.pid===after.pid&&before.startTicks===after.startTicks;
            assert.equal(reused,profile.cooperative,"Cancellation fell back or unexpectedly retained a legacy process");
            if(!reused){assert.equal(nativeIdentity(before.pid),null);assert.equal(existsSync(oldDirectory),false);}
            const solvedEvents=await request(engine,solved,false);
            row.cycles.push({id:item.id,before,after,cancellationMs,reused,events,solvedEvents,rss:sampleNativeRss(after,"after-cancel",launched)});
          }
          assert.equal(row.initializations,profile.cooperative?1:4);assert.equal(row.readyEvents,row.initializations);row.status="ok";
        }catch(error){row.error=String(error);result.errors.push({iteration,profile:profile.id,error:String(error)});}
        finally{
          if(engine){const child=engine.child,directory=engine.directory;await engine.close();row.shutdown={pid:child.pid,signal:child.signalCode,ipcRemoved:!existsSync(directory),identityRemoved:nativeIdentity(child.pid)===null};if(!row.shutdown.ipcRemoved||!row.shutdown.identityRemoved||child.signalCode!=="SIGTERM"){row.status="error";result.errors.push({iteration,profile:profile.id,error:"Unclean lifecycle shutdown"});}}
          for(const [k,v]of Object.entries(saved))if(v===undefined)delete process.env[k];else process.env[k]=v;
        }
      }
    }
    for(const [path,before]of Object.entries(result.seals)){const after=await seal(path);result.afterSeals[path]=after;assert.deepEqual(after,before,"Lifecycle input changed during measurement");}
    result.passed=result.errors.length===0&&result.rounds.length===10&&result.rounds.every(r=>r.status==="ok");
    result.summary=Object.fromEntries(config.profiles.map(p=>{const rows=result.rounds.filter(r=>r.profile===p.id&&r.status==="ok");return [p.id,{successfulWorkers:rows.length,cycles:rows.flatMap(r=>r.cycles).length,initializations:rows.reduce((n,r)=>n+r.initializations,0),startupMs:distribution(rows.map(r=>r.startupMs)),cancelToUsableMs:distribution(rows.flatMap(r=>r.cycles.map(c=>c.cancellationMs)))}];}));
  }catch(error){result.errors.push({stage:"configuration-or-seal",error:String(error)});}
  return result;
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  assert.equal(process.argv.length,3);const path=resolve(process.argv[2]);
  const result=await compareLifecycle(JSON.parse(readFileSync(path,"utf8")),path);
  console.log(JSON.stringify(result,null,2));if(!result.passed)process.exitCode=1;
}
