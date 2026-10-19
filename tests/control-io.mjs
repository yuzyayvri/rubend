import assert from "node:assert/strict";
import fs from "node:fs";
import {tmpdir} from "node:os";
import {resolve} from "node:path";
import {spawnSync} from "node:child_process";
import vm from "node:vm";
import {createRequire} from "node:module";

const directory=fs.mkdtempSync(resolve(tmpdir(),"rubend-control-io-")),fifo=resolve(directory,"control"),wrapped=process.argv.includes("--wrapped"),javascript=process.argv.includes("--bun");
assert.ok(!wrapped||!javascript,"Native syscall injection is not a Bun mode");
const executable=javascript?(process.env.RUBEND_BUN??"bun"):resolve(wrapped?"build/control-io-wrapped-test":"build/control-io-test"),cases=[];
if(javascript)fs.copyFileSync("build/control-io-test.js","build/control-io-test.cjs");
let keeper;
try{
  assert.equal(spawnSync("mkfifo",["--mode=600",fifo]).status,0);keeper=fs.openSync(fifo,fs.constants.O_RDWR|fs.constants.O_NONBLOCK);
  function native(name,args,lines,fault){
    const result=spawnSync(executable,javascript?[resolve("build/control-io-test.cjs"),...args]:[...args,"--threads","1"],{encoding:"utf8",timeout:2000,env:{...process.env,RUBEND_CONTROL_TEST_FAULT:fault??""}});
    assert.ifError(result.error);assert.equal(result.status,0,result.stderr);assert.deepEqual(result.stdout.trim().split("\n"),lines,name);
    const calls=wrapped?JSON.parse(result.stderr.trim()):null;
    if(calls){assert.ok(calls.largestRead<=64);if(["flags","descriptor"].includes(fault))assert.equal(calls.controlReadCalls,0);}
    cases.push({name,backend:javascript?"bun":"native",fault:fault??null,readCalls:calls?.controlReadCalls??null});
  }
  native("empty-ready",[fifo],["ok 0","ok 0","ok 0"]);
  fs.writeSync(keeper,Buffer.alloc(130,120));native("bounded-chunks",[fifo],["ok 64","ok 64","ok 2"]);
  native("blocking-handle-rejected",[fifo,"blocking"],["error 22","error 22","error 22"]);
  native("missing",[resolve(directory,"missing")],["open-error 2"]);
  native("empty-path",[""],["open-error 22"]);
  native("oversized-path",["x".repeat(4097)],["open-error 22"]);
  const regular=resolve(directory,"regular");fs.writeFileSync(regular,"not a control FIFO");native("regular-file-rejected",[regular],["open-error 22"]);
  if(wrapped)for(const [fault,line]of Object.entries({again:"ok 0",interrupt:"ok 0",read:"error 5",eof:"error 32",oversize:"error 5",flags:"error 22",descriptor:"error 9"}))native("injected-"+fault,[fifo],[line,line,line],fault);
  const effects={},require=createRequire(import.meta.url),constants=fs.constants;
  let fault=null,readCalls=0;
  const proxy={...fs,readSync(...args){readCalls++;if(fault==="again"||fault==="interrupt"||fault==="read")throw Object.assign(Error("injected"),{code:{again:"EAGAIN",interrupt:"EINTR",read:"EIO"}[fault],errno:fault==="read"?-5:-4});if(fault==="oversize")return 65;return fs.readSync(...args);}};
  const context={Buffer,process,open_reader:"open_reader",read_ready:"read_ready",require:name=>name==="fs"?proxy:require(name),CID:name=>name,io_eff:(name,fn)=>effects[name]=fn,io_done:value=>({ok:true,value}),io_fail:code=>({ok:false,code}),io_tup:(file,result)=>({file,result}),io_sys:()=>({fcntl(fd){if(fault==="flags")return 0;if(fault==="descriptor")return -1;return parseInt(fs.readFileSync(`/proc/self/fdinfo/${fd}`,"utf8").match(/^flags:\s+([0-7]+)/m)[1],8);},errno:()=>9})};
  for(const path of["src/control-open.js","src/control-read.js"])vm.runInNewContext(fs.readFileSync(path,"utf8"),context,{filename:path});
  const opened=effects.open_reader(fifo);assert.equal(opened.ok,true);const fd=opened.value;
  try{
    let result=effects.read_ready(fd);assert.equal(result.file,fd);assert.equal(result.result.ok,true);assert.equal(result.result.value,"");
    fs.writeSync(keeper,Buffer.alloc(130,120));for(const length of[64,64,2]){result=effects.read_ready(fd);assert.equal(result.file,fd);assert.equal(result.result.ok,true);assert.equal(result.result.value,"x".repeat(length));}
    for(const [mode,expected]of Object.entries({again:{ok:true,value:""},interrupt:{ok:true,value:""},read:{ok:false,code:5},oversize:{ok:false,code:5},flags:{ok:false,code:22},descriptor:{ok:false,code:9}})){
      fault=mode;readCalls=0;result=effects.read_ready(fd);assert.equal(result.file,fd);assert.equal(JSON.stringify(result.result),JSON.stringify(expected));if(["flags","descriptor"].includes(mode))assert.equal(readCalls,0);cases.push({name:"injected-"+mode,backend:"javascript",readCalls});
    }
    fault=null;
  }finally{fs.closeSync(fd);}
  for(const path of["", "x".repeat(4097), "a\0b"]){const rejected=effects.open_reader(path);assert.equal(rejected.ok,false);assert.equal(rejected.code,22);}
  const descriptors=fs.readdirSync("/proc/self/fd").length;
  assert.equal(effects.open_reader(regular).code,22);assert.equal(fs.readdirSync("/proc/self/fd").length,descriptors,"Rejecting a regular file leaked its descriptor");
  fs.closeSync(keeper);keeper=undefined;
  native("eof",[fifo],["error 32","error 32","error 32"]);
  const ended=effects.open_reader(fifo);assert.equal(ended.ok,true);try{assert.equal(effects.read_ready(ended.value).result.code,32);}finally{fs.closeSync(ended.value);}
  assert.equal(constants.O_NONBLOCK>0,true);
  const bun=javascript?spawnSync(executable,["--version"],{encoding:"utf8"}):null;if(bun)assert.equal(bun.status,0);
  console.log(JSON.stringify({passed:true,cases,boundedReadBytes:64,emptyIsNotEof:true,bunVersion:bun?.stdout.trim()??null,javascriptFcntlAdapter:"VM fault checks use actual Linux fdinfo flags. Bun-mode CLI cases exercise the compiled FFI path separately."}));
}finally{if(keeper!==undefined)fs.closeSync(keeper);fs.rmSync(directory,{recursive:true,force:true});}
