import { spawn, spawnSync } from "node:child_process";
import { EventEmitter } from "node:events";
import { resolve } from "node:path";
import { performance } from "node:perf_hooks";
import { mkdtempSync, createWriteStream, unlinkSync, rmdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { validate, apply, solved } from "./model.mjs";

export class Engine extends EventEmitter {
  constructor({binary=process.env.RUBEND_BINARY??resolve("build/rubend"),cancelTimeoutMs=500,stopTimeoutMs=1000,eventProtocol="solver"}={}) {
    super();
    if(!["solver","fixed-work"].includes(eventProtocol))throw Error("Invalid engine event protocol");
    this.eventProtocol=eventProtocol;
    this.generation=0;
    this.closed=false;
    this.failure=null;
    this.job=null;
    this.serial=0;
    this.binary=binary;
    this.cancelTimeoutMs=cancelTimeoutMs;
    this.stopTimeoutMs=stopTimeoutMs;
    this.start();
  }
  setState(state) {
    this.state=state;
    this.available=state==="ready"||state==="searching";
  }
  start() {
    if(this.closed)return;
    const generation=++this.generation;
    this.setState("initializing");
    this.failure=null;
    this.cooperative=false;
    const directory=mkdtempSync(resolve(tmpdir(),"rubend-")),fifo=resolve(directory,"input"),controlFifo=resolve(directory,"control");
    this.directory=directory;
    const made=spawnSync("mkfifo",["--mode=600",fifo,controlFifo],{encoding:"utf8"});
    if(made.status!==0){for(const path of[fifo,controlFifo])try{unlinkSync(path);}catch{}rmdirSync(directory);throw Error(`Cannot create engine pipes: ${made.stderr}`);}
    const input=createWriteStream(fifo,{flags:"r+"}),control=createWriteStream(controlFifo,{flags:"r+"});
    const child=spawn("stdbuf",["-oL","-eL",this.binary,fifo,"--threads","1"],{stdio:["ignore","pipe","pipe"],env:{...process.env,BEND_NO_TELEMETRY:"1",RUBEND_CONTROL_FIFO:controlFifo}});
    const owner={child,input,control,generation,directory,expectedStop:false};
    this.owner=owner;this.child=child;this.input=input;
    for(const stream of[input,control])stream.on("error",error=>{if(this.owner===owner&&!this.closed&&!owner.expectedStop)this.fail(error.message);});
    let buffer="",stderr="";
    child.stderr.on("data",data=>{stderr=(stderr+data).slice(-4000);});
    child.stdout.on("data",data=>{
      if(this.owner!==owner||owner.expectedStop||this.closed)return;
      buffer+=data;
      if(buffer.length>128*1024)return this.fail("Engine output exceeded its limit.");
      for(;;){
        const cut=buffer.indexOf("\n");if(cut<0)break;
        const line=buffer.slice(0,cut);buffer=buffer.slice(cut+1);
        try{this.receive(JSON.parse(line));}
        catch(error){this.fail(`Engine protocol failure: ${error.message}`);return;}
      }
    });
    child.on("error",error=>{if(this.owner===owner&&!owner.expectedStop&&!this.closed)this.fail(error.message);});
    owner.stopped=new Promise(done=>child.once("close",()=>{
      input.destroy();control.destroy();
      for(const path of[fifo,controlFifo])try{unlinkSync(path);}catch{}
      try{rmdirSync(directory);}catch{}
      done();
    }));
    this.childStopped=owner.stopped;
    child.on("exit",(code,signal)=>{
      if(this.owner!==owner||owner.expectedStop||this.closed)return;
      this.fail(`Native engine stopped (${signal??code}). ${stderr}`);
    });
  }
  stopOwner(owner) {
    if(owner.stopping)return owner.stopping;
    owner.expectedStop=true;
    const killTimer=setTimeout(()=>owner.child.kill("SIGKILL"),this.stopTimeoutMs);
    owner.child.kill("SIGTERM");
    owner.stopping=owner.stopped.finally(()=>clearTimeout(killTimer));
    return owner.stopping;
  }
  clearJob() {
    const job=this.job;
    if(job){clearTimeout(job.timer);job.signal?.removeEventListener("abort",job.abort);}
    this.job=null;
    return job;
  }
  receive(event) {
    if(!event||typeof event!=="object"||typeof event.type!=="string")throw Error("Invalid engine event");
    if(event.type==="ready") {
      if(this.state!=="initializing")throw Error("Unexpected engine readiness");
      if(event.protocol!==undefined&&!(event.protocol===2&&event.jobIds===true&&event.cancel===true))throw Error("Unsupported engine protocol");
      this.cooperative=event.protocol===2;
      this.setState("ready");this.emit("ready");return;
    }
    if(event.type==="initializing")return;
    if(this.cooperative&&(!Number.isInteger(event.jobId)||event.jobId<1||event.jobId>0xffffffff))throw Error("Invalid engine job identity");
    if(this.cancelWait&&event.jobId===this.cancelWait.id&&["cancelled","done","invalid"].includes(event.type)){this.cancelWait.resolve(true);return;}
    const job=this.job;
    if(!job||(this.cooperative&&event.jobId!==job.id))return;
    const previousLower=job.lower;
    if(!["candidate","progress","done","invalid"].includes(event.type)&&!(this.eventProtocol==="fixed-work"&&["snapshot","measurement"].includes(event.type)))throw Error("Unknown engine event");
    if(event.type==="candidate") {
      if(!Array.isArray(event.moves)||event.moves.length!==event.length||event.length>30||event.moves.some(m=>!Number.isInteger(m)||m<0||m>=18))throw Error("Invalid candidate shape");
      if(apply(job.facelets,event.moves)!==solved)throw Error("Candidate replay mismatch");
      if(event.length>job.bestLength)throw Error("Candidate quality regressed");
      if(!Number.isInteger(event.lower)||event.lower<job.lower||event.lower>event.length)throw Error("Invalid lower bound");
      job.bestLength=event.length;job.best=event.moves;job.lower=event.lower;
    }
    if(event.type==="progress"||event.type==="done") {
      if(!Number.isInteger(event.lower)||event.lower<job.lower||event.lower>job.bestLength)throw Error("Lower bound regressed");
      job.lower=event.lower;
    }
    if(event.type==="done"&&event.length!==job.bestLength)throw Error("Terminal length does not match the verified incumbent");
    if(event.optimal&&(!job.best||event.lower!==job.bestLength))throw Error("Unsubstantiated optimality status");
    if(event.type==="progress"){
      const now=performance.now();if(now-job.lastProgress<50&&event.lower===previousLower)return;job.lastProgress=now;
    }
    event.elapsedMs=Math.round(performance.now()-job.started);
    if(event.type==="done"||event.type==="invalid"){this.clearJob();this.setState("ready");}
    job.onEvent(event);
  }
  async ready(timeout=10000,signal) {
    signal?.throwIfAborted();
    if(this.closed)throw Error("Engine is closed");
    if(this.failure)throw Error(this.failure);
    if(this.available)return;
    await new Promise((resolveReady,reject)=>{
      const clean=()=>{clearTimeout(timer);this.off("ready",done);this.off("unavailable",failed);signal?.removeEventListener("abort",aborted);};
      const done=()=>{clean();resolveReady();};
      const failed=()=>{clean();reject(Error(this.failure??"Engine stopped during initialization"));};
      const aborted=()=>{clean();reject(signal.reason);};
      const timer=setTimeout(()=>{clean();reject(Error("Engine did not initialize"));},timeout);
      this.once("ready",done);this.once("unavailable",failed);signal?.addEventListener("abort",aborted,{once:true});
    });
  }
  async solve({facelets,mode="fast",budgetMs=2000},onEvent,{signal}={}) {
    validate(facelets);
    if(!["fast","exact"].includes(mode)||!Number.isInteger(budgetMs)||budgetMs<50||budgetMs>30000)throw Error("Invalid search budget or mode");
    if(this.job)throw Error("The engine is already working.");
    await this.ready(10000,signal);
    signal?.throwIfAborted();
    if(this.closed||!this.available)throw Error("Engine is unavailable");
    if(this.job)throw Error("The engine is already working.");
    if(this.serial>=0xffffffff)throw Error("Engine job identity limit reached");
    const job={id:++this.serial,facelets,mode,budgetMs,onEvent,signal,bestLength:31,best:null,lower:0,started:performance.now(),lastProgress:-Infinity};
    this.job=job;this.setState("searching");
    job.abort=()=>{if(this.job===job)this.cancel();};
    signal?.addEventListener("abort",job.abort,{once:true});
    job.timer=setTimeout(()=>{
      if(this.job===job){job.onEvent({type:"done",reason:"time_limit",optimal:0,lower:job.lower,length:job.bestLength});this.cancel();}
    },budgetMs+2000);
    this.input.write(`${facelets}\t${mode}\t${budgetMs}${this.cooperative?`\t${job.id}`:""}\n`);
    return ()=>this.job===job?this.cancel():Promise.resolve();
  }
  cancel() {
    if(this.cancelling)return this.job?this.cancelling.then(()=>this.cancel()):this.cancelling;
    if(!this.job)return Promise.resolve();
    const job=this.clearJob(),owner=this.owner;
    this.setState("cancelling");
    this.cancelling=(async()=>{
      let acknowledged=false;
      if(this.cooperative){
        acknowledged=await new Promise(resolve=>{
          const timer=setTimeout(()=>resolve(false),this.cancelTimeoutMs);
          this.cancelWait={id:job.id,resolve:ok=>{clearTimeout(timer);resolve(ok);}};
          owner.control.write(`${job.id}\n`);
        });
        this.cancelWait=null;
      }
      if(this.closed||this.failure)return;
      if(acknowledged){this.setState("ready");this.emit("ready");return;}
      await this.stopOwner(owner);
      if(this.closed)return;
      this.start();
      try{await this.ready();}catch(error){if(!this.closed)this.fail(error.message);}
    })().finally(()=>{this.cancelling=null;});
    return this.cancelling;
  }
  fail(message) {
    if(this.closed||this.state==="failed")return;
    const job=this.clearJob();
    this.failure=message;this.setState("failed");
    this.cancelWait?.resolve(false);
    this.stopOwner(this.owner);
    this.emit("unavailable");
    if(job)job.onEvent({type:"error",message});
  }
  close() {
    if(this.closing)return this.closing;
    this.closed=true;const job=this.clearJob();this.setState("closed");
    this.cancelWait?.resolve(false);this.emit("unavailable");
    this.closing=this.stopOwner(this.owner).then(()=>this.cancelling);
    if(job)job.onEvent({type:"error",message:"Engine is closed"});
    return this.closing;
  }
}
