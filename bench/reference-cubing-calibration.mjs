import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {puzzles} from "cubing/puzzles";
import {KPattern} from "cubing/kpuzzle";
import {experimentalSolve3x3x3IgnoringCenters,setSearchDebug} from "cubing/search";
import {apply,solved,validate,moveNames} from "../apps/model.mjs";
import {patternData} from "../tests/support.mjs";
import {parseReferenceHtm} from "./final-comparison-records.mjs";
import {apply as independentApply} from "./fixed-work-model.mjs";

assert.equal(process.argv.length,3);const cases=JSON.parse(readFileSync(process.argv[2],"utf8"));assert.equal(cases.format,"rubend-reference-calibration-cases-v1");assert.equal(cases.cases.length,7);setSearchDebug({logPerf:false});const puzzle=await puzzles["3x3x3"].kpuzzle(),watchdog=setTimeout(()=>{process.stderr.write("Reference calibration watchdog expired\n");process.exit(2);},60000),shape=p=>Object.fromEntries(["CORNERS","EDGES"].map(k=>[k,{pieces:p.patternData[k].pieces,orientation:p.patternData[k].orientation}]));let failures=0;
try{for(const item of cases.cases){const record={id:item.id,solver:"cubing-min2phase",status:"error",moves:null,algorithm:null,error:null};try{const facelets=apply(solved,item.scramble),pattern=new KPattern(puzzle,patternData(validate(facelets))),fromMoves=puzzle.defaultPattern().applyAlg(item.scramble.map(m=>moveNames[m]).join(" "));assert.deepEqual(shape(pattern),shape(fromMoves));const algorithm=await experimentalSolve3x3x3IgnoringCenters(pattern),text=algorithm.toString(),moves=parseReferenceHtm(text);assert.ok(moves.length<=30);assert.equal(apply(facelets,moves),solved);assert.equal(independentApply(facelets,moves),solved);assert.deepEqual(shape(pattern.applyAlg(text)),shape(puzzle.defaultPattern()));Object.assign(record,{status:"verified",facelets,algorithm:text,moves,length:moves.length,bendReplay:true,independentReplay:true,kpuzzleReplay:true,optimality:"unestablished",formalOptimality:false});}catch(error){record.error=String(error.stack??error);failures++;}process.stdout.write("RUBEND_REFERENCE "+JSON.stringify(record)+"\n");}}finally{clearTimeout(watchdog);}if(failures)process.exitCode=1;
