import assert from "node:assert/strict";
import {spawn} from "node:child_process";
import {createInterface} from "node:readline";
import {fileURLToPath} from "node:url";

const memory=Buffer.alloc(64*1048576,1);if(process.argv[2]==="leaf"){
  console.log(JSON.stringify({ready:true,pid:process.pid,allocatedBytes:memory.length}));const input=createInterface({input:process.stdin});input.once("line",()=>{const started=performance.now();let checksum=0;while(performance.now()-started<150)for(let i=0;i<8192;i++)checksum=(checksum+memory[i])|0;console.log(JSON.stringify({done:true,checksum}));input.close();process.stdin.destroy();});
}else{
  const child=spawn(process.execPath,[fileURLToPath(import.meta.url),"leaf"],{stdio:["pipe","pipe","pipe"]});let text="";child.stdout.on("data",data=>{text+=data;if(text.includes('"ready":true')){console.log(JSON.stringify({ready:true,pid:process.pid,childPid:child.pid,allocatedBytes:memory.length}));child.stdout.removeAllListeners("data");child.stdout.on("data",chunk=>process.stdout.write(chunk));}});child.stderr.pipe(process.stderr);const input=createInterface({input:process.stdin});input.once("line",line=>{assert.equal(line,"go");child.stdin.end("go\n");input.close();process.stdin.destroy();});child.once("close",(code,signal)=>{assert.equal(signal,null);assert.equal(code,0);console.log(JSON.stringify({done:true,rootChecksum:memory[0]}));});
}
