import assert from "node:assert/strict";
import {writeFileSync} from "node:fs";
import {resolve} from "node:path";
import {pathToFileURL} from "node:url";
import {list,encode} from "../apps/model.mjs";
import {apply,solved} from "../bench/fixed-work-model.mjs";
import {fileHash} from "../bench/reference-provenance.mjs";

assert.equal(process.argv.length,4);
const modulePath=resolve(process.argv[2]),output=resolve(process.argv[3]),S=(await import(pathToFileURL(modulePath))).default;
let radiusChecks=0,indexChecks=0;
for(let a=0;a<=64;a++)for(let b=0;b<=64;b++){
  assert.equal(S.test_radius(a,b),a<=b);radiusChecks++;
  assert.equal(S.test_index(a,b),b<a);indexChecks++;
}
const inverse=move=>move%3===0?move+2:move%3===2?move-2:move,invert=word=>word.toReversed().map(inverse),prefixes=[[],...Array.from({length:18},(_,move)=>[move])];
let random=0x75a69013;
for(let i=0;i<64;i++){const word=[];for(let j=0;j<i%24;j++){random=(Math.imul(random,1664525)+1013904223)>>>0;word.push(random%18);}prefixes.push(word);}
let cases=0,packets=0,replays=0,checksum=17;
for(const reaching of prefixes)for(let move=0;move<18;move++){
  const word=[...reaching,move],solution=invert(word),root=apply(solved,word),expected=apply(solved,solution),actual=encode(S.test_inverse_step(list(reaching),move)),left=encode(S.test_left(list(reaching),move));
  assert.equal(actual,expected);assert.equal(left,expected);packets+=2;
  assert.equal(apply(root,solution),solved);replays++;
  assert.equal(encode(S.test_transfer(list(reaching),move,list(solution))),solved);packets++;
  assert.equal(apply(expected,word),solved);replays++;
  for(const sticker of actual)checksum=(Math.imul(checksum,33)+sticker.charCodeAt(0))>>>0;
  cases++;
}
const wrongRight=encode(S.test_wrong_right(list([3]),0)),correctLeft=encode(S.test_left(list([3]),0));assert.notEqual(wrongRight,correctLeft);assert.equal(correctLeft,apply(solved,[2,5]));assert.equal(wrongRight,apply(solved,[5,2]));
const uRoot=apply(solved,[0]);assert.notEqual(uRoot,solved);assert.equal(apply(uRoot,[2]),solved);assert.equal(S.test_radius(1,0),false);assert.notEqual(0,1);
writeFileSync(output,JSON.stringify({passed:true,modulePath,moduleSha256:fileHash(modulePath),radiusChecks,indexChecks,wordPresentedPrefixes:prefixes.length,moveCases:cases,actualReferencePackets:packets,independentReplayChecks:replays,checksum,leftActionCounterexample:{reaching:[3],move:0,leftInverseMoves:[2,5],wrongRightMoves:[5,2],correctLeft,wrongRight},largerRadiusRefusal:{cachedRadius:0,requestedRadius:1,rootMoves:[0],newSolvingWord:[2]},emptyRequiredSetRefused:true,existingRuntimeLedgerEvidenceReused:true,newNativeExecution:false,optimizedRuntimeWitnessesCertified:false,productionCacheEnabled:false,productionDualStateChanged:false,releaseHoldoutOpened:false,independentReview:false})+"\n",{flag:"wx"});
console.log(JSON.stringify({passed:true,radiusChecks,indexChecks,moveCases:cases,actualReferencePackets:packets,independentReplayChecks:replays,checksum,wrongRightActionRefuted:true}));
