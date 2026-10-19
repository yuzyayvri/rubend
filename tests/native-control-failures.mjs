import assert from "node:assert/strict";
import {existsSync} from "node:fs";
import {once} from "node:events";
import {Engine} from "../apps/engine.mjs";
import {apply,solved} from "../apps/model.mjs";

const hard=apply(solved,[0,9,6,15,3,12,0,3,3,6,6,0,0,12,12,9,6,6,15,15,0,0,6,6,0,0]),rows=[];
for(const [name,text]of Object.entries({malformed:"x\n",empty:"\n",zero:"0\n",overflow:"4294967296\n",eof:null})){
  const engine=new Engine();let timer;
  try{
    await engine.ready(120000);const pid=engine.child.pid,directory=engine.directory,events=[];
    if(text===null){const closed=once(engine.owner.control,"close");engine.owner.control.end();await closed;}
    else await new Promise((done,reject)=>engine.owner.control.write(text,error=>error?reject(error):done()));
    await new Promise((done,reject)=>{
      timer=setTimeout(()=>reject(Error("Native control failure did not settle the active job")),3000);
      engine.solve({facelets:hard,mode:"exact",budgetMs:2000},event=>{
        events.push(event);
        if(event.type==="error")done();
        if(event.type==="done"||event.type==="invalid")reject(Error("Broken control falsely completed the job"));
      }).catch(reject);
    });
    clearTimeout(timer);assert.equal(engine.state,"failed");assert.match(engine.failure,text===null?/Engine control read failed: 32/:/Invalid engine control record/);
    await engine.close();assert.equal(existsSync(directory),false);assert.equal(existsSync(`/proc/${pid}`),false);
    rows.push({name,errorSettled:true,ipcRemoved:true,processRemoved:true,events:events.map(event=>event.type)});
  }finally{clearTimeout(timer);await engine.close();}
}
console.log(JSON.stringify({passed:true,rows,claim:"Real native control failures and cleanup, not fixture-worker behavior"}));
