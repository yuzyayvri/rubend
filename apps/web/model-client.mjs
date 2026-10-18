export class ModelClient {
  constructor(worker,{timeoutMs=10000,onFailure=()=>{}}={}) {
    if(!Number.isInteger(timeoutMs)||timeoutMs<1||timeoutMs>30000)throw Error("Invalid cube-worker timeout");
    this.worker=worker;
    this.timeoutMs=timeoutMs;
    this.onFailure=onFailure;
    this.state="active";
    this.pending=new Map();
    this.serial=0;
    this.onMessage=event=>this.receive(event.data);
    this.onError=event=>{event.preventDefault();this.fail(Error(event.message||"Cube worker stopped"));};
    this.onMessageError=()=>this.fail(Error("Cube worker sent an unreadable response"));
    worker.addEventListener("message",this.onMessage);
    worker.addEventListener("error",this.onError);
    worker.addEventListener("messageerror",this.onMessageError);
  }
  request(type,data={}) {
    if(this.state!=="active")return Promise.reject(Error("Cube worker is unavailable. Reload to recover."));
    if(this.serial>=Number.MAX_SAFE_INTEGER)return Promise.reject(Error("Cube worker request limit reached"));
    return new Promise((resolve,reject)=>{
      const id=++this.serial;
      const timer=setTimeout(()=>this.fail(Error("Cube worker did not respond")),this.timeoutMs);
      this.pending.set(id,{resolve,reject,timer});
      try{this.worker.postMessage({...data,id,type});}
      catch(error){this.pending.delete(id);clearTimeout(timer);reject(error);}
    });
  }
  receive(data) {
    if(!data||!Number.isSafeInteger(data.id)||data.id<1)return this.fail(Error("Invalid cube-worker response"));
    const pending=this.pending.get(data.id);
    if(!pending)return;
    if("error" in data) {
      if(typeof data.error!=="string")return this.fail(Error("Invalid cube-worker error"));
      this.pending.delete(data.id);clearTimeout(pending.timer);pending.reject(Error(data.error));return;
    }
    if(typeof data.facelets!=="string"||!/^[URFDLB]{54}$/.test(data.facelets)||!Array.isArray(data.moves)||data.moves.some(m=>!Number.isInteger(m)||m<0||m>=18)||typeof data.solved!=="boolean")return this.fail(Error("Invalid cube-worker result"));
    this.pending.delete(data.id);clearTimeout(pending.timer);
    pending.resolve({facelets:data.facelets,moves:data.moves,solved:data.solved});
  }
  stop(state,error) {
    if(this.state!=="active")return;
    this.state=state;
    this.worker.removeEventListener("message",this.onMessage);
    this.worker.removeEventListener("error",this.onError);
    this.worker.removeEventListener("messageerror",this.onMessageError);
    const pending=[...this.pending.values()];this.pending.clear();
    for(const p of pending){clearTimeout(p.timer);p.reject(error);}
    this.worker.terminate();
  }
  fail(error) {
    if(this.state!=="active")return;
    const failure=Error(`${error.message}. Reload to restore cube controls.`,{cause:error});
    this.stop("failed",failure);this.onFailure(failure);
  }
  close() {this.stop("closed",Error("Cube worker was closed"));}
}
