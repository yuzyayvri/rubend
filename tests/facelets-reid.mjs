import assert from "node:assert/strict";
import {faceletsToReid,reidToFacelets} from "../bench/facelets-reid.mjs";
import {apply,solved} from "../bench/fixed-work-model.mjs";

assert.equal(faceletsToReid(solved),"UF UR UB UL DF DR DB DL FR FL BR BL UFR URB UBL ULF DRF DFL DLB DBR");const words=[[],...Array.from({length:18},(_,i)=>[i]),[3,0,5,2]];for(const word of words){const f=apply(solved,word);assert.equal(reidToFacelets(faceletsToReid(f)),f);}for(const f of["",solved.slice(1),"U".repeat(54),solved.replace("R","X")])assert.throws(()=>faceletsToReid(f));for(const r of["",faceletsToReid(solved)+" UF",faceletsToReid(solved).replace("UFR","UF"),faceletsToReid(solved).replace("UF ","XX ")])assert.throws(()=>reidToFacelets(r));console.log(JSON.stringify({passed:true,knownReidIdentity:true,roundtripLegalCases:words.length,invalidInputsRejected:8,legalityNotCertifiedBySerialization:true,nativeConventionProbeStillRequired:true}));
