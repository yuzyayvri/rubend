import assert from "node:assert/strict";

export const text=n=>typeof n==="boolean"?(n?"True{}":"False{}"):typeof n==="string"?n:n[0]==="not"?"Bool.not("+text(n[1])+")":"Bool."+n[0]+"("+text(n[1])+", "+text(n[2])+")";
export const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
export function simplify(n){
  if(!Array.isArray(n))return{value:n,proof:"{==}"};
  assert.notEqual(n[0],"not","Unexpected nested negation in routing input");const [op,rawA,rawB]=n,a=simplify(rawA),b=simplify(rawB),middle=[op,a.value,b.value];let value=middle,step="{==}";
  if(typeof a.value==="boolean")value=op==="and"?(a.value?b.value:false):op==="or"?(a.value?true:b.value):(a.value?["not",b.value]:b.value);
  else if(typeof b.value==="boolean"){value=op==="and"?(b.value?a.value:false):op==="or"?(b.value?true:a.value):(b.value?["not",a.value]:a.value);step="L."+op+"_"+b.value+"("+text(a.value)+")";}
  const children=a.proof==="{==}"&&b.proof==="{==}"?"{==}":"L."+op+"_cong("+[text(rawA),text(rawB),text(a.value),text(b.value),a.proof,b.proof].join(", ")+")";
  return{value,proof:children==="{==}"?step:step==="{==}"?children:"Equal.trans(Bool, "+text(n)+", "+text(middle)+", "+text(value)+", "+children+", "+step+")"};
}
export function parse(source,variables=["cp","co","ep","eh","eo"]){
  const bitNames=variables.flatMap(v=>Array.from({length:32},(_,i)=>v+i));assert.equal(new Set(bitNames).size,bitNames.length,"Ambiguous bit variable names");
  const tokens=source.match(/\.\|\.|\.&\.|\.\^\.|<<|>>|[():]|\d+n?|[A-Za-z_][A-Za-z_0-9]*/g);assert.equal(tokens.join(""),source.replace(/\s/g,""),"Unsupported packing syntax");let at=0;
  const precedence={".|.":1,".^.":2,".&.":3,"<<":4,">>":4};
  function expression(min=0){
    let node;const token=tokens[at++];
    if(token==="("){node=expression();if(tokens[at]===":"){at++;assert.equal(tokens[at++],"U32");}assert.equal(tokens[at++],")");}
    else if(/^\d+n?$/.test(token))node={literal:Number(token.replace("n","")),bits:Array.from({length:32},(_,i)=>Boolean((Number(token.replace("n",""))>>>i)&1))};
    else{assert.ok(variables.includes(token));node={bits:Array.from({length:32},(_,i)=>token+i)};}
    while(precedence[tokens[at]]>=min){const op=tokens[at++],right=expression(precedence[op]+1);
      if(op==="<<"||op===">>"){assert.ok(Number.isInteger(right.literal)&&right.literal>=0);const shift=right.literal;node={bits:Array.from({length:32},(_,i)=>{const sourceIndex=op==="<<"?i-shift:i+shift;return sourceIndex<0||sourceIndex>=32?false:node.bits[sourceIndex];})};}
      else{const name={".|.":"or",".&.":"and",".^.":"xor"}[op];node={bits:node.bits.map((bit,i)=>[name,bit,right.bits[i]])};}
    }
    return node;
  }
  const result=expression();assert.equal(at,tokens.length);return result.bits;
}
export const word=xs=>xs.reduceRight((tail,bit)=>"WCon{"+bit+", "+tail+"}","WNil{}");
export const u32=xs=>"U32{"+word(xs)+"}";
export function extensionality(){
  const a=Array.from({length:32},(_,i)=>"a"+i),b=Array.from({length:32},(_,i)=>"b"+i),lines=[];
  lines.push("def bits_ext("+[...a.map(v=>"+"+v+": Bool"),...b.map(v=>"+"+v+": Bool"),...a.map((v,i)=>"e"+i+": {"+v+" == b"+i+" : Bool}")].join(", ")+") -> {"+u32(a)+" == "+u32(b)+" : U32}:");for(let i=0;i<32;i++)lines.push("  %e"+i+" : {"+u32(a)+" == "+u32(b.map((v,j)=>j<i?a[j]:j===i?"_":v))+" : U32}");lines.push("  {==}","");return lines;
}
