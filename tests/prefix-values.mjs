import assert from "node:assert/strict";
import {list,array} from "../apps/model.mjs";
import {prefixValues} from "../bench/prefix-values.mjs";

const census=Array.from({length:43254},(_,i)=>i);assert.throws(()=>array(list(census)),/List limit exceeded/);assert.deepEqual(prefixValues(list(census),4),census,"The four-move census must not use the app move-list limit");
const maximum=18**4;assert.equal(prefixValues(list(Array.from({length:maximum},(_,i)=>i)),4).length,maximum);assert.throws(()=>prefixValues(list(Array.from({length:maximum+1},(_,i)=>i%maximum)),4),/Prefix list limit/);
const cycle={$:"Con",head:0};cycle.tail=cycle;assert.throws(()=>prefixValues(cycle,4),/Prefix list limit/);for(const depth of[-1,5,NaN])assert.throws(()=>prefixValues({$:"Nil"},depth));for(const value of[-1,18,NaN,"0"])assert.throws(()=>prefixValues(list([value]),1));for(const value of[null,{},{$:"Con",head:0,tail:null}])assert.throws(()=>prefixValues(value,1));assert.deepEqual(prefixValues(list([0]),0),[0]);assert.throws(()=>prefixValues(list([0,0]),0),/Prefix list limit/);
console.log(JSON.stringify({passed:true,censusEntries:43254,fullWordLimit:maximum,applicationLimitUnchanged:true,boundaryAndMalformedControls:13}));
