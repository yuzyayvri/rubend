import assert from "node:assert/strict";
import {existsSync,readdirSync,readlinkSync,readFileSync} from "node:fs";
import {Engine} from "../apps/engine.mjs";
import {apply,solved} from "../apps/model.mjs";

const hard=apply(solved,[0,9,6,15,3,12,0,3,3,6,6,0,0,12,12,9,6,6,15,15,0,0,6,6,0,0]);
const engine=new Engine(),observations=[];
async function search(facelets,doneType){
  let cancel;
  const events=[];
  const promise=new Promise((done,reject)=>{
    const timer=setTimeout(()=>reject(Error("Native lifecycle event timeout")),5000);
    engine.solve({facelets,mode:"exact",budgetMs:30000},event=>{
      events.push(event);
      if(["invalid","error"].includes(event.type)){clearTimeout(timer);reject(Error(JSON.stringify(event)));}
      if(event.type===doneType){clearTimeout(timer);done(events);}
    }).then(value=>{cancel=value;},reject);
  });
  await promise;assert.equal(typeof cancel,"function");return events;
}
try{
  await engine.ready();assert.equal(engine.cooperative,true);
  const pid=engine.child.pid,generation=engine.generation,directory=engine.directory;
  const descriptorCount=readdirSync(`/proc/${pid}/fd`).length;
  const controlFiles=readdirSync(`/proc/${pid}/fd`).filter(fd=>readlinkSync(`/proc/${pid}/fd/${fd}`)===`${directory}/control`);
  assert.equal(controlFiles.length,1);
  const flags=parseInt(readFileSync(`/proc/${pid}/fdinfo/${controlFiles[0]}`,"utf8").match(/^flags:\s+([0-7]+)/m)[1],8);
  assert.ok(flags&0o4000,"The single-owned control descriptor must be nonblocking");
  for(let round=0;round<5;round++){
    await search(hard,"progress");
    const started=performance.now();await engine.cancel();
    observations.push({round,cancelMs:performance.now()-started,pid:engine.child.pid,generation:engine.generation});
    assert.equal(engine.child.pid,pid);assert.equal(engine.generation,generation);assert.equal(engine.state,"ready");
    const events=await search(solved,"done");assert.equal(events.at(-1).optimal,1);assert.equal(events.find(e=>e.type==="candidate").length,0);
    assert.equal(readdirSync(`/proc/${pid}/fd`).length,descriptorCount,"A retained worker leaked descriptors across jobs");
  }
  await search(hard,"progress");
  const id=engine.job.id,control=engine.owner.control,write=control.write.bind(control);
  control.write=text=>{
    assert.equal(text,`${id}\n`);write(`${id-1}\n`);
    for(const character of text)write(character);
    return true;
  };
  await engine.cancel();
  control.write=write;
  assert.equal(engine.child.pid,pid);assert.equal(engine.generation,generation);
  await engine.close();assert.equal(existsSync(directory),false);assert.equal(existsSync(`/proc/${pid}`),false);
  console.log(JSON.stringify({passed:true,observations,sameTableOwner:true,fragmentedAndStaleControl:true,ipcRemoved:true,singleNonblockingControlOwner:true,stableDescriptorCount:true,claim:"Functional cancellation observations, not a baseline speed comparison"}));
}finally{await engine.close();}
