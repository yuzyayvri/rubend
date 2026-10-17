const fs=require("node:fs"),read=fs.readSync,close=fs.closeSync;
const path=process.env.RUBEND_TEST_MUTATION_PATH;
let total=0,mutated=false,closed=false;
const matches=fd=>{try{const a=fs.fstatSync(fd),b=fs.statSync(path);return a.dev===b.dev&&a.ino===b.ino;}catch{return false;}};
fs.readSync=function(fd,...args){const selected=path&&matches(fd),n=read.call(this,fd,...args);if(selected){total+=n;if(!mutated&&total>=Number(process.env.RUBEND_TEST_MUTATION_AT)){mutated=true;if(process.env.RUBEND_TEST_MUTATION==="short")fs.truncateSync(path,total);else fs.appendFileSync(path,Buffer.from([1]));}}return n;};
fs.closeSync=function(fd){if(path&&matches(fd))closed=true;return close.call(this,fd);};
process.on("exit",()=>{if(path)process.stderr.write(JSON.stringify({mutated,closed,total})+"\n");});
