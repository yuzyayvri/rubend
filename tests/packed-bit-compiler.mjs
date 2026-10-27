import assert from "node:assert/strict";
import {parse,simplify} from "../bench/packed-bit-compiler.mjs";

const evaluate=(node,word)=>typeof node==="boolean"?node:typeof node==="string"?Boolean((word>>>Number(node.slice(4)))&1):node[0]==="not"?!evaluate(node[1],word):node[0]==="and"?evaluate(node[1],word)&&evaluate(node[2],word):node[0]==="or"?evaluate(node[1],word)||evaluate(node[2],word):evaluate(node[1],word)!==evaluate(node[2],word);
let checks=0;
for(const [source,expected]of [["((word >> 4n) .&. 15 : U32)",w=>(w>>>4)&15],["(((word .&. 255 : U32) << 24n) .|. (word >> 24n) : U32)",w=>(((w&255)<<24)|(w>>>24))>>>0],["(word .^. 4294967295 : U32)",w=>(w^4294967295)>>>0]]){
  const bits=parse(source,["word"]),simple=bits.map(b=>simplify(b).value);
  for(const word of [0,1,255,256,2147483648,4294967295,305419896]){const pack=nodes=>nodes.reduce((n,b,i)=>n+(evaluate(b,word)?2**i:0),0);assert.equal(pack(bits),expected(word));assert.equal(pack(simple),expected(word));checks++;}
}
assert.throws(()=>parse("word + 1",["word"]));assert.throws(()=>parse("other",["word"]));assert.throws(()=>parse("word << word",["word"]));assert.throws(()=>simplify(["not","word0"]));
assert.throws(()=>parse("v1",["v1","v11"]),/Ambiguous bit variable names/);assert.throws(()=>parse("word",["word","word"]),/Ambiguous bit variable names/);assert.equal(parse("vA",Array.from({length:12},(_,i)=>"v"+String.fromCharCode(65+i)))[0],"vA0");
console.log(JSON.stringify({passed:true,semanticsChecks:checks,rejections:6}));
