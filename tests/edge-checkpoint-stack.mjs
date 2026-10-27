import assert from "node:assert/strict";
import {writeFileSync} from "node:fs";
import {resolve} from "node:path";
import {pathToFileURL} from "node:url";
import {list} from "../apps/model.mjs";
import {decodeCheckpointPacket} from "../bench/edge-checkpoint-record.mjs";

assert.equal(process.argv.length,5);
const [oldPath,currentPath,output]=process.argv.slice(2),[old,current]=await Promise.all([oldPath,currentPath].map(async p=>(await import(pathToFileURL(resolve(p)))).default));
const values=[0,...Array(10559).fill(255)],expected=[0,0,1,0,0,...values];
let originalFailure;try{old.resume_admitted(3,0,1,0,list(values),0);}catch(error){originalFailure=error;}
assert.ok(originalFailure instanceof RangeError);assert.match(originalFailure.message,/Maximum call stack size exceeded/);assert.match(originalFailure.stack,/List\$length/);
assert.deepEqual(decodeCheckpointPacket(current.resume_admitted(3,0,1,0,list(values),0),3),expected);
const lengths=[10559,10561],refusals=[];for(const length of lengths){const value=current.resume_admitted(3,0,1,0,list(Array(length).fill(255)),0);assert.equal(value.$,"Nil");refusals.push(length);}
const result={passed:true,format:"rubend-edge-checkpoint-stack-regression-v1",actualValues:values.length,actualPacketValues:expected.length,originalFailure:originalFailure.message,originalLocation:"Generated Base List.length",defaultNodeStackUnchanged:true,boundedTailCheckPasses:true,wrongLengthsRefused:refusals};
writeFileSync(resolve(output),JSON.stringify(result,null,2)+"\n",{flag:"wx"});console.log(JSON.stringify(result));
