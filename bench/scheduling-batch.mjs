import assert from "node:assert/strict";
import {readFileSync,writeFileSync,mkdirSync,existsSync} from "node:fs";
import {resolve,relative,dirname} from "node:path";
import {spawnSync} from "node:child_process";
import {createHash} from "node:crypto";
import {inputs} from "../scripts/manifest.mjs";
import {apply,solved} from "./fixed-work-model.mjs";

const [mode,target]=process.argv.slice(2);assert.ok(["prepare","build","short-first","exact-reserve"].includes(mode));assert.equal(process.argv.length,4);
const directory=resolve(target);assert.ok(directory.startsWith(resolve("build/experiments")+"/"));
const hash=bytes=>createHash("sha256").update(bytes).digest("hex"),read=path=>JSON.parse(readFileSync(path,"utf8")),before=inputs();
const policies={reference:"C.pick(S.is_exact(mode), 60000, 20000)","short-first":"C.pick(S.is_exact(mode), 60000, C.pick(U32.is_eq(length, 31), 5000, 20000))","exact-reserve":"C.pick(S.is_exact(mode), 120000, C.pick(is_fast(request) || is_waiting(request), 20000, 10000))"};
function run(program,args,options={}){const result=spawnSync(program,args,{cwd:process.cwd(),env:process.env,encoding:"utf8",timeout:options.timeout??180000,maxBuffer:33554432});assert.ifError(result.error);assert.equal(result.status,0,program+" "+args.join(" ")+"\n"+result.stderr+"\n"+result.stdout.slice(-2000));return result.stdout;}
function once(text,from,to){assert.equal(text.split(from).length,2,"Scheduling transform anchor changed: "+from);return text.replace(from,to);}
function imports(text,path,locals=new Set()){return text.replace(/^import \.\/([a-z0-9-]+\.bend) as ([A-Za-z]+)$/gm,(_,file,alias)=>"import "+(locals.has(file)?"./"+file:relative(dirname(path),resolve("src",file)))+" as "+alias);}
function emit(path,text){mkdirSync(dirname(path),{recursive:true});writeFileSync(path,text,{flag:"wx"});}
function prepare(){
  const original={portfolio:readFileSync("src/portfolio.bend","utf8"),main:readFileSync("src/main.bend","utf8"),entry:readFileSync("bench/inverse-main.bend","utf8")},outputs={};
  for(const [id,body]of Object.entries(policies)){
    const base=resolve(directory,"sources",id),portfolioPath=resolve(base,"portfolio.bend"),mainPath=resolve(base,"main.bend"),entryPath=resolve(base,"entry.bend");
    let portfolio=once(original.portfolio,"S.run(U32.to_nat(C.pick(S.is_exact(mode), 60000, 20000)),","S.run(U32.to_nat(slice_fuel(request, mode, length)),");
    portfolio=once(portfolio,"def run_slice(","def slice_fuel(+request: Request, mode: S.Stage, +length: U32) -> U32:\n  "+body+"\n\ndef run_slice(");
    portfolio=imports(portfolio,portfolioPath);const main=imports(original.main,mainPath,new Set(["portfolio.bend"]));
    let entry=once(original.entry,"import ../src/main.bend as H","import ./main.bend as H");
    entry=once(entry,"import ./advanced-main.bend as A","import "+relative(base,resolve("bench/advanced-main.bend"))+" as A");
    entry=entry.replace(/^import \.\.\/src\/([a-z0-9-]+\.bend) as ([A-Za-z]+)$/gm,(_,file,alias)=>"import "+relative(base,resolve("src",file))+" as "+alias);
    for(const [path,text]of[[portfolioPath,portfolio],[mainPath,main],[entryPath,entry]]){emit(path,text);outputs[relative(process.cwd(),path)]=hash(text);}
  }
  const fixturePath=resolve(directory,"sources/budget-check.bend"),aliases=["A","B","D"],cases=[];
  let fixture="import Base\nimport "+relative(dirname(fixturePath),resolve("src/search.bend"))+" as S\n";
  for(const [index,id]of Object.keys(policies).entries()){
    const alias=aliases[index];fixture+="import ./"+id+"/portfolio.bend as "+alias+"\n";
    for(const [request,stage,length]of[["Fast","Improve",31],["Fast","Improve",20],["ExactWaiting","Improve",31],["ExactActive","Improve",20],["ExactActive","ExactContour",20]])cases.push(alias+".slice_fuel("+alias+"."+request+"{}, S."+stage+"{}, "+length+")");
  }
  fixture+='\ndef texts(values: +List<U32>) -> +List<String>:\n  match values:\n    case Nil{}: Nil{}\n    case Con{value, rest}: U32.show(value) <> texts(rest)\n\ndef main() -> IO(Unit):\n  IO.print("[" ++ String.join(texts(['+cases.join(", ")+']), ",") ++ "]")\n';emit(fixturePath,fixture);outputs[relative(process.cwd(),fixturePath)]=hash(fixture);
  const manifest={format:"rubend-scheduling-pilot-v1",sourceHashes:Object.fromEntries(["src/portfolio.bend","src/main.bend","bench/inverse-main.bend"].map(path=>[path,hash(readFileSync(path))])),outputHashes:outputs,policies,defaultSolverChanged:false};
  emit(resolve(directory,"source-manifest.json"),JSON.stringify(manifest,null,2)+"\n");return manifest;
}
if(mode==="prepare"){assert.equal(existsSync(directory),false);mkdirSync(directory);prepare();assert.deepEqual(inputs(),before);console.log(JSON.stringify({passed:true,preparedOnly:true,directory}));process.exit();}
if(mode==="build"){
  const manifest=prepare();mkdirSync(resolve(directory,"bin"));
  const fixture=resolve(directory,"sources/budget-check.bend"),fixtureBinary=resolve(directory,"bin/budget-check");
  run("bend",[fixture,"-o",fixtureBinary]);const observed=JSON.parse(run(fixtureBinary,["--threads","1"]));assert.deepEqual(observed,[20000,20000,20000,20000,60000,5000,20000,5000,20000,60000,20000,20000,20000,10000,120000]);
  for(const value of observed)assert.ok(value>0&&value<=120000);
  for(const id of Object.keys(policies)){
    const entry=resolve(directory,"sources",id,"entry.bend"),binary=resolve(directory,"bin",id);
    run("bend",[resolve(directory,"sources",id,"portfolio.bend"),"--verdict"]);
    run(process.execPath,["bench/build-experiment.mjs",entry,binary]);run("bend",[entry,"-o",binary+".c"]);run(process.execPath,["scripts/check-array-mode.mjs",binary+".c"]);
    const env={...process.env,RUBEND_BINARY:binary,RUBEND_JOINT_CACHE:"/home/yuzy/rubend/.cache/joint/phase1-v1.raw"};
    const life=spawnSync(process.execPath,["tests/native-lifecycle.mjs"],{encoding:"utf8",env,timeout:120000,maxBuffer:4194304});assert.ifError(life.error);assert.equal(life.status,0,life.stderr);process.stdout.write(life.stdout);
  }
  run(process.execPath,["scripts/check.mjs"]);emit(resolve(directory,"build-result.json"),JSON.stringify({passed:true,manifest,budgets:observed,policies:Object.keys(policies),independentReview:false},null,2)+"\n");
}else{
  const manifest=read(resolve(directory,"source-manifest.json"));for(const [path,expected]of Object.entries(manifest.outputHashes))assert.equal(hash(readFileSync(path)),expected);
  const config=read("build/evidence/r06-quality-config-v5.json"),base=config.profiles[0];config.profiles=["reference",mode].map(id=>({...base,id,binary:resolve(directory,"bin",id),buildMetadata:resolve(directory,"bin",id+".json"),env:{RUBEND_JOINT_CACHE:base.cache}}));
  const configPath=resolve(directory,mode+"-config.json"),reportPath=resolve(directory,mode+"-report.json");emit(configPath,JSON.stringify(config,null,2)+"\n");
  const reportText=run(process.execPath,["bench/warm-compare.mjs",configPath],{timeout:580000}),report=JSON.parse(reportText);assert.equal(report.passed,true);assert.equal(report.counts.errors,0);assert.equal(report.counts.successfulJobs,1750);emit(reportPath,reportText);
  let replays=0;for(const round of report.rounds)for(const job of round.jobs)for(const event of job.events)if(event.type==="candidate"){assert.equal(apply(job.facelets,event.moves),solved,"Independent scheduling replay failed");replays++;}
  const score=JSON.parse(run(process.execPath,["bench/score-warm.mjs","--report",reportPath]));emit(resolve(directory,mode+"-score.json"),JSON.stringify(score,null,2)+"\n");
  emit(resolve(directory,mode+"-result.json"),JSON.stringify({passed:true,nativeJobs:1750,independentCandidateReplays:replays,score,claim:"Scheduling treatment only. A passing native run is not policy acceptance; inspect all quality and latency gates.",independentReview:false},null,2)+"\n");
  console.log(JSON.stringify({passed:true,policy:mode,jobs:1750,independentReplays:replays,groups:Object.fromEntries(Object.entries(score.groups).map(([group,value])=>[group,value.comparison]))}));
}
assert.deepEqual(inputs(),before,"Core source changed during scheduling checks");
