import assert from "node:assert/strict";
import Control from "../build/worker-control.mjs";

function reference(text,state,id){
  if(state.$==="Malformed")return {$:"Malformed"};
  let {value,digits,matched}=state;
  for(const character of text){
    if(character==="\n"){
      if(digits===0||value===0)return {$:"Malformed"};
      matched||=value===id;value=0;digits=0;
    }else{
      if(!/^[0-9]$/.test(character)||digits>=10)return {$:"Malformed"};
      const next=BigInt(value)*10n+BigInt(character);if(next>4294967295n)return {$:"Malformed"};
      value=Number(next);digits++;
    }
  }
  return {$:"Scanned",value,digits,matched};
}
let seed=0x197da3b1,cases=0;
const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed;};
const texts=["","42","4","2\n","99\n42\n","4294967295\n","4294967296\n","0\n","\n","0000000001\n","00000000001\n","x\n","42\nx","-1\n"];
for(let round=0;round<1000;round++){
  const id=random()||1,text=round<texts.length?texts[round]:Array.from({length:1+random()%8},()=>String(random()||1)+"\n").join("");
  let actual={$:"Scanned",value:0,digits:0,matched:false},expected={...actual};
  for(let at=0;at<text.length||at===0;){
    const width=1+random()%64,part=text.slice(at,at+width);
    actual=Control.chunk(part,actual,id);expected=reference(part,expected,id);assert.deepEqual(actual,expected);cases++;
    if(text.length===0)break;at+=width;
  }
}
for(const id of[1,42,4294967295])for(const text of[texts[4],String(id)+"\n",String(id)]){
  const initial={$:"Scanned",value:0,digits:0,matched:false};assert.deepEqual(Control.chunk(text,initial,id),reference(text,initial,id));cases++;
}
console.log(JSON.stringify({passed:true,cases,independentDecimalParser:true,fragmentStatesCompared:true,malformedAbsorbing:true}));
