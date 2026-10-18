import assert from "node:assert/strict";
import {readFileSync,writeFileSync} from "node:fs";
import {createHash} from "node:crypto";

const corners=readFileSync(process.argv[2]??"build/evidence/h0-classes-v1.raw"),edges=readFileSync(process.argv[3]??"build/evidence/h0-edges-v1.raw"),distances=readFileSync(process.argv[4]??"build/evidence/h0-distances-v1.raw"),bytes=readFileSync(process.argv[5]??"build/evidence/h0-meta-v1.raw");
assert.equal(corners.length,4194304);assert.equal(edges.length,16777216);assert.equal(distances.length,4194304);assert.equal(bytes.length,11568000);
const c=i=>corners.readUInt32LE(i*4),e=i=>edges.readUInt32LE(i*4),d=i=>distances.readUInt32LE(i*4);
const masks=Array.from({length:256},(_,i)=>i).filter(mask=>mask.toString(2).replaceAll("0","").length===4);
const expected=new Uint32Array(2892000).fill(4294967295),keys=new Set();
for(let raw=0;raw<153090;raw++){const key=Math.floor(raw/70)*128+(masks[raw%70]&127);assert.ok(!keys.has(key));keys.add(key);expected[key]=c(raw);}
for(let i=0;i<7;i++)assert.ok(!keys.has(i));
for(let i=0;i<3393;i++){expected[524288+i]=c(262144+i);expected[528384+i]=c(524288+i);expected[532480+i]=c(786432+i);}
for(let id=0;id<3393;id++)for(let move=0;move<18;move++){
  const rep=c(262144+id),twist=d(800000+Math.floor(rep/70)*18+move),separation=d(800000+39366+(rep%70)*18+move);
  expected[536576+id*18+move]=c(twist*70+separation);
}
for(let i=0;i<623700;i++)expected[602112+i]=e(65536+i);
for(let i=0;i<1663200;i++)expected[1228800+i]=e(1048576+i);
const goal=(c(23)&65535)*34650+34629;assert.equal(goal,450429);expected.set([1,3393,34650,117567450,goal,2892000,48000001]);
for(let i=0;i<expected.length;i++)assert.equal(bytes.readUInt32LE(i*4),expected[i],"metadata word "+i);
const {records}=JSON.parse(readFileSync("tests/symmetry48-data.json","utf8"));
const canonical=(raw,edge)=>{const word=c(raw);return {class:word&65535,frame:word>>>16,edge:e(1048576+edge*48+(word>>>16))};};
let seed=69127,required=0,counterexample=null;
for(let sample=0;sample<2000;sample++){
  seed=(Math.imul(seed,1664525)+1013904223)>>>0;const raw=seed%153090;
  seed=(Math.imul(seed,1664525)+1013904223)>>>0;const edge=seed%34650,parent=canonical(raw,edge);
  for(let move=0;move<18;move++){
    const rawChild=d(800000+Math.floor(raw/70)*18+move)*70+d(800000+39366+(raw%70)*18+move),left=canonical(rawChild,e(65536+edge*18+move));
    const mapped=records[parent.frame].moves[move],childWord=expected[536576+parent.class*18+mapped],rightClass=childWord&65535,edgeMoved=expected[602112+parent.edge*18+mapped],rightEdge=expected[1228800+edgeMoved*48+(childWord>>>16)];
    assert.equal(left.class,rightClass);
    if(left.edge!==rightEdge){
      required++;const lo=expected[528384+left.class],hi=expected[532480+left.class];let witness=-1;
      for(let sym=0;sym<48;sym++)if((sym<32?(lo>>>sym)&1:(hi>>>(sym-32))&1)&&expected[1228800+rightEdge*48+sym]===left.edge){witness=sym;break;}
      assert.ok(witness>=0,"Product transition lost a stabilizer-equivalent edge");
      counterexample??={raw,edge,move,class:left.class,leftEdge:left.edge,rightEdge,symmetry:witness};
    }
  }
}
assert.ok(required>0);assert.throws(()=>assert.equal(counterexample.leftEdge,counterexample.rightEdge),assert.AssertionError);
const report={passed:true,logicalWordsCompared:expected.length,entries:117567450,goal,sparseEntries:keys.size,productMoveChecks:36000,stabilizerRequired:required,missingStabilizerCounterexample:counterexample,payloadSha256:createHash("sha256").update(bytes).digest("hex"),oracle:"Independent assembly from already checked component geometry/BFS data",independentReview:false};
writeFileSync("build/evidence/h0-meta-oracle.json",JSON.stringify(report,null,2)+"\n");console.log(JSON.stringify(report));
