import assert from "node:assert/strict";
import {readFileSync,writeFileSync,existsSync} from "node:fs";
import {resolve} from "node:path";
import {fileURLToPath} from "node:url";
import {fileHash} from "./bounded-file-hash.mjs";

export function inspectFlatProfile(text,source,filename){
  assert.match(text,/^Flat profile:/);assert.match(text,/Index by function name/);const lines=source.split("\n"),entries=[];
  for(const line of text.split("\n")){const m=line.match(/^\s*(\d+\.\d+)\s+(\d+\.\d+)\s+(\d+\.\d+)\s/);if(!m)continue;const n=line.match(/\s([^\s()]+)(?: \(([^():]+):(\d+) @ ([0-9a-f]+)\))?$/);assert.ok(n,line);if(n[2]){assert.equal(n[2],filename);assert.ok(Number(n[3])>0&&Number(n[3])<=lines.length);}entries.push({selfPercent:Number(m[1]),cumulativeSeconds:Number(m[2]),selfSeconds:Number(m[3]),symbol:n[1],line:n[3]?Number(n[3]):null});}
  assert.ok(entries.length>0);const sum=entries.reduce((n,e)=>n+e.selfPercent,0);assert.ok(sum>=98&&sum<=102);const bySymbol={};for(const e of entries)bySymbol[e.symbol]=(bySymbol[e.symbol]??0)+e.selfPercent;
  return{flatEntries:entries.length,roundedPercentSum:sum,sampledSeconds:entries.at(-1).cumulativeSeconds,packedNibbleDecodePercent:bySymbol.spin_16??0,blockAccessPercent:(bySymbol.blk_at??0)+(bySymbol.blk_read??0),top:entries.slice(0,12).map(e=>({...e,source:e.line?lines.slice(Math.max(0,e.line-2),e.line+2).join("\n"):null})),bySymbol,initializationAndInstrumentationIncluded:true,hardwareMemoryStallNotMeasured:true,releaseTimings:false};
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  assert.equal(process.argv.length,4);const directory=resolve(process.argv[2]),output=resolve(process.argv[3]),read=p=>JSON.parse(readFileSync(p,"utf8")),input=read(directory+"/input.json"),profiles=read(directory+"/profiles.json");assert.equal(profiles.passed,true);assert.equal(existsSync(output),false);
  const results=profiles.profiles.map(p=>{const c=input.profiles[p.arm];assert.equal(fileHash(c.sourceCPath),c.sourceCSha256);assert.equal(fileHash(p.path),p.sha256);assert.equal(fileHash(p.gmonPath),p.gmonSha256);return{arm:p.arm,profilePath:p.path,profileSha256:p.sha256,gmonPath:p.gmonPath,gmonSha256:p.gmonSha256,sourceCPath:c.sourceCPath,sourceCSha256:c.sourceCSha256,...inspectFlatProfile(p.gprof,readFileSync(c.sourceCPath,"utf8"),p.arm+".c")};});assert.deepEqual(results.map(r=>r.arm),["control","candidate"]);
  writeFileSync(output,JSON.stringify({passed:true,profiles:results,fullGprofRead:true,topSourceLinesInspected:true,scope:"Instrumented whole native process including initialization. Symbol-level source association, not a hardware bandwidth or pure search attribution.",performanceAcceptance:false},null,2)+"\n",{flag:"wx"});console.log(JSON.stringify({passed:true,profiles:results.map(({arm,flatEntries,packedNibbleDecodePercent,blockAccessPercent})=>({arm,flatEntries,packedNibbleDecodePercent,blockAccessPercent}))}));
}
