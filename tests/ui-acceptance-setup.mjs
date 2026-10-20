import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {runInNewContext} from "node:vm";

const source=readFileSync("tests/fixtures/ui-acceptance-setup.js","utf8");
for(const fallback of[false,true]){
  class Canvas{getContext(kind){return kind;}}
  let callback;const navigator={};runInNewContext(source,{rubendTestFallback:fallback,navigator,HTMLCanvasElement:Canvas,setInterval(){},document:{createElement(){return{};},body:{append(){}},addEventListener(name,fn){assert.equal(name,"DOMContentLoaded");callback=fn;}}});
  const canvas=new Canvas();assert.equal(canvas.getContext("2d"),"2d");for(const kind of["webgl","webgl2","experimental-webgl"])assert.equal(canvas.getContext(kind),fallback?null:kind);await assert.rejects(navigator.clipboard.writeText("test"),/Deliberate clipboard denial/);assert.equal(typeof callback,"function");if(fallback)assert.equal(callback(),undefined);
}
console.log(JSON.stringify({passed:true,clipboardDeniedWithoutAccess:true,fallbackBlocksOnlyWebgl:true,normalWebglUnchanged:true,browserClaim:false}));
