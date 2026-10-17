import {createReadStream,statSync,mkdirSync,writeFileSync,readFileSync} from "node:fs";
import {createHash} from "node:crypto";
import assert from "node:assert/strict";
import {fileURLToPath} from "node:url";
import {resolve} from "node:path";

export class BlockLayouts {
  constructor(){this.count=0;this.layouts=[32,64,128,256,512].map(block=>({block,minimum:15,maximum:0,used:0,blocks:0,narrow:0,wide:0,payloadWords:0,rangeHistogram:Array(16).fill(0)}));}
  feed(chunk){
    assert.equal(chunk.length%16,0);
    for(let at=0;at<chunk.length;at+=16){
      let minimum=15,maximum=0;
      for(let offset=at;offset<at+16;offset++){
        const byte=chunk[offset],a=byte&15,b=byte>>>4;
        minimum=Math.min(minimum,a,b);maximum=Math.max(maximum,a,b);
      }
      assert.ok(maximum<=12);
      for(const layout of this.layouts){
        layout.minimum=Math.min(layout.minimum,minimum);layout.maximum=Math.max(layout.maximum,maximum);layout.used+=32;
        if(layout.used===layout.block){
          const range=layout.maximum-layout.minimum,wide=range>3;layout.blocks++;layout[wide?"wide":"narrow"]++;layout.rangeHistogram[range]++;layout.payloadWords+=layout.block/(wide?8:16);layout.minimum=15;layout.maximum=0;layout.used=0;
        }
      }
      this.count+=32;
    }
  }
  finish(){return this.layouts.map(({minimum,maximum,used,...layout})=>{assert.equal(used,0);const words=8388608+layout.blocks+layout.payloadWords;return {...layout,words,logicalBytes:words*4,allocationBytes:2**Math.ceil(Math.log2(words))*4,wideFraction:layout.wide/layout.blocks};});}
}

if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  const path=process.argv[2]??".cache/joint/phase1-v1.raw",entries=2217093120;assert.equal(statSync(path).size,entries/2);
  const layouts=new BlockLayouts(),hash=createHash("sha256"),started=performance.now();
  for await(const chunk of createReadStream(path,{highWaterMark:8388608})){hash.update(chunk);layouts.feed(chunk);}
  const sha256=hash.digest("hex");assert.equal(sha256,"2ccfd40fdc0cf4769c58d9646f6b0ea787571ce5200b5d124c8f17dcc70f73b5");assert.equal(layouts.count,entries);
  const result={format:"rubend-lossless-block-layout-v1",sourceSha256:sha256,profilerSha256:createHash("sha256").update(readFileSync(fileURLToPath(import.meta.url))).digest("hex"),entries,elapsedMs:Math.round(performance.now()-started),scheme:"One metadata word per block; two-bit deltas from minimum when range <= 3, otherwise exact four-bit values; word-aligned variable payload.",records:layouts.finish()};
  mkdirSync("build/evidence",{recursive:true});writeFileSync(process.env.RUBEND_LAYOUT_OUTPUT??"build/evidence/block-layout.json",JSON.stringify(result,null,2)+"\n");console.log(JSON.stringify(result));
}
