import assert from "node:assert/strict";
import {spawnSync} from "node:child_process";
import {mkdtempSync,writeFileSync,readFileSync,rmSync,mkdirSync,copyFileSync} from "node:fs";
import {tmpdir} from "node:os";
import {join,resolve} from "node:path";
import vm from "node:vm";

const directory=mkdtempSync(join(tmpdir(),"rubend-word-io-")),value=i=>(Math.imul(i,2654435761)^2779096485)>>>0;
const record={passed:false,cases:[],javascriptFaultInjection:false};
try{
  const bytes=Buffer.alloc(262144*4);for(let i=0;i<262144;i++)bytes.writeUInt32LE(value(i),i*4);
  const full=join(directory,"full.raw"),short=join(directory,"short.raw"),empty=join(directory,"empty.raw");writeFileSync(full,bytes);writeFileSync(short,bytes.subarray(0,17));writeFileSync(empty,Buffer.alloc(0));
  copyFileSync("build/word-io-test.js","build/word-io-test.cjs");
  const programs=[{name:"native",program:resolve("build/word-io-test"),prefix:[]},{name:"javascript",program:process.execPath,prefix:[resolve("build/word-io-test.cjs")]}];
  if(process.argv.includes("--wrapped"))programs.push({name:"native-interrupted-short-reads",program:resolve("build/word-io-wrapped-test"),prefix:[]});
  if(process.argv.includes("--sanitized"))programs.push({name:"native-sanitized",program:resolve("build/word-io-sanitized-test"),prefix:[]});
  for(const backend of programs)for(const item of [{file:full,offset:17,count:70001,loaded:true},{file:full,offset:13,count:262144,loaded:true},{file:short,offset:0,count:5,loaded:false},{file:empty,offset:0,count:1,loaded:false},{file:full,offset:0,count:0,loaded:false},{file:full,offset:0,count:262145,loaded:false},{file:full,offset:4294967295,count:17,loaded:false},{file:full,offset:524288,count:1,loaded:false}]){
    const result=spawnSync(backend.program,[...backend.prefix,item.file,String(item.offset),String(item.count),...(backend.name==="javascript"?[]:["--threads","1"])],{encoding:"utf8",timeout:15000,maxBuffer:1048576});
    assert.equal(result.status,0,`${backend.name}: ${result.stderr}`);const parsed=JSON.parse(result.stdout.trim());assert.equal(parsed.loaded,item.loaded);assert.ok(parsed.dataAndGuards||parsed.unchangedOnError);
    if(backend.name==="native-interrupted-short-reads"&&item.loaded){const injected=JSON.parse(result.stderr.trim());assert.equal(injected.injectedInterruptions,1);assert.ok(injected.shortReadCalls>0);}
    record.cases.push({backend:backend.name,offset:item.offset,count:item.count,loaded:item.loaded});
  }
  let reader,calls=0,at=0;
  const stream=bytes.subarray(0,513*4),context={Buffer,Array,Number,Math,Unit:"Unit",read_words:"read_words",CID:x=>x,io_eff:(id,f)=>{reader=f;},io_tup:(fst,snd)=>({fst,snd}),io_done:done=>({done}),io_fail:fail=>({fail}),require:name=>{assert.equal(name,"fs");return {readSync:(fd,buffer,offset,count)=>{calls++;if(calls===1)throw Object.assign(Error("interrupted"),{code:"EINTR"});const n=Math.min(count,7,stream.length-at);stream.copy(buffer,offset,at,at+n);at+=n;return n;}};}};
  vm.runInNewContext(readFileSync("src/word-read.js","utf8"),context);const table=Array(1024).fill(0xdeadbeef),result=reader(7,table,17,513);assert.equal(result.snd.snd.fail,undefined);assert.ok(calls>2);
  for(let i=0;i<table.length;i++)assert.equal(table[i],i>=17&&i<530?value(i-17):0xdeadbeef);
  record.javascriptFaultInjection=true;record.passed=true;console.log(JSON.stringify({passed:true,cases:record.cases.length,javascriptFaultInjection:true}));
}finally{rmSync(directory,{recursive:true,force:true});mkdirSync("build/evidence",{recursive:true});writeFileSync("build/evidence/word-io-test.json",JSON.stringify(record,null,2)+"\n");}
