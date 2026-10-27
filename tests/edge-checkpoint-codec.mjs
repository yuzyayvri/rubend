import assert from "node:assert/strict";
import {writeFileSync} from "node:fs";
import {resolve} from "node:path";
import {pathToFileURL} from "node:url";
import {array,list} from "../apps/model.mjs";
import {decodeCheckpointPacket} from "../bench/edge-checkpoint-record.mjs";

assert.equal(process.argv.length,4);const C=(await import(pathToFileURL(resolve(process.argv[2])))).default;
const expected=[0,0,1,0,0,0,...Array(10559).fill(255)],actual=C.start(3,0,0);assert.equal(expected.length,10565);
let originalFailure;try{array(actual);}catch(error){originalFailure=error;}
assert.ok(originalFailure instanceof Error);assert.match(originalFailure.message,/List limit exceeded/);
assert.deepEqual(decodeCheckpointPacket(actual,3),expected);
const rows=[
  {name:"short",value:list(Array(28).fill(0)),message:/Truncated checkpoint list/},
  {name:"long",value:list(Array(30).fill(0)),message:/exceeds its exact geometry/},
  {name:"invalid-tag",value:{$:"Other"},message:/Truncated checkpoint list/},
  {name:"invalid-tail",value:list(Array(29).fill(0)),message:/invalid tail/},
  {name:"non-u32",value:list([-1,...Array(28).fill(0)]),message:/non-U32/}
];
let tail=rows[3].value;for(let i=0;i<28;i++)tail=tail.tail;tail.tail={$:"Other"};
for(const row of rows)assert.throws(()=>decodeCheckpointPacket(row.value,1),row.message,row.name);
const cycle={$:"Con",head:0};cycle.tail=cycle;assert.throws(()=>decodeCheckpointPacket(cycle,1),/exceeds its exact geometry/);
for(const count of[0,4,5,6,7,4294967295])assert.throws(()=>decodeCheckpointPacket(actual,count),/Only tiny packet counts/);
assert.deepEqual(decodeCheckpointPacket(C.start(1,0,0),1),[0,0,1,0,0,0,...Array(23).fill(255)]);
const result={passed:true,format:"rubend-edge-checkpoint-codec-regression-v1",actualThreeEdgePacketLength:expected.length,originalFailure:originalFailure.message,oldUiLimitUnchanged:true,fullActualPacketDecoded:true,malformedListControls:rows.length+1,unsupportedCountControls:6,geometryBounded:true};
writeFileSync(resolve(process.argv[3]),JSON.stringify(result,null,2)+"\n",{flag:"wx"});console.log(JSON.stringify(result));
