import assert from "node:assert/strict";
import {readFileSync,writeFileSync} from "node:fs";
import {createHash} from "node:crypto";

const budget=Number(process.argv[2]),output=process.argv[3];assert.ok(Number.isInteger(budget)&&budget>0&&budget<=117567450&&output);
const metaBytes=readFileSync("build/evidence/h0-meta-v1.raw"),native=readFileSync("build/evidence/h0-table-v1.raw"),hash=b=>createHash("sha256").update(b).digest("hex");
assert.equal(hash(metaBytes),"b6f6a7b08bcddf7f06fd9edbd28622d504ee15e5fde9b1b6880a881032811438");assert.equal(hash(native),"9353ed8327ddb3121587674439cba73be9390dcc8984eae9629af93fbd8f1085");
const meta=new Uint32Array(metaBytes.length/4);for(let i=0;i<meta.length;i++)meta[i]=metaBytes.readUInt32LE(i*4);
const classes=3393,edges=34650,count=classes*edges,goal=meta[4],distance=new Uint8Array(count+2).fill(255),queue=new Uint32Array(count);
const stabilizers=Array.from({length:classes},(_,c)=>Array.from({length:48},(_,s)=>s).filter(s=>s<32?(meta[528384+c]>>>s)&1:(meta[532480+c]>>>(s-32))&1));
let head=0,tail=1,maximum=0,assignmentsCompared=1;distance[goal]=0;queue[0]=goal;assert.equal(native[goal],0);
const started=performance.now();
for(;head<tail&&head<budget&&tail<count;head++){
  const index=queue[head],c=Math.floor(index/edges),e=index%edges,depth=distance[index]+1;
  for(let move=0;move<18;move++){
    const packed=meta[536576+c*18+move],nextClass=packed&65535,moved=meta[602112+e*18+move],nextEdge=meta[1228800+moved*48+(packed>>>16)],target=nextClass*edges+nextEdge;
    if(distance[target]!==255)continue;
    for(const sym of stabilizers[nextClass]){
      const member=nextClass*edges+meta[1228800+nextEdge*48+sym];
      if(distance[member]!==255){assert.equal(distance[member],depth);continue;}
      assert.ok(tail<count);assert.equal(native[member],depth,"Independent BFS disagrees at "+member);assignmentsCompared++;
      distance[member]=depth;queue[tail++]=member;maximum=Math.max(maximum,depth);
    }
  }
}
const elapsedMs=performance.now()-started,complete=tail===count;
if(complete)assert.ok(native.equals(distance),"Full independent BFS bytes differ");
const report={format:"rubend-h0-independent-bfs-v1",passed:true,complete,expanded:head,visited:tail,assignmentsCompared,maximum,elapsedMs,budget,forecastSeconds:elapsedMs/1000/budget*count*3+120,sourceSha256:hash(readFileSync(new URL(import.meta.url))),inputHashes:{metadata:hash(metaBytes),native:hash(native)},implementation:"Test-only JavaScript BFS with predecoded complete stabilizer lists; verified component metadata is shared input, not an independent derivation of cube rules",independentReview:false};
writeFileSync(output,JSON.stringify(report,null,2)+"\n",{flag:"wx"});console.log(JSON.stringify(report));
