import assert from "node:assert/strict";
import {resolve} from "node:path";
import {pathToFileURL} from "node:url";
import {array} from "../apps/model.mjs";

assert.equal(process.argv.length,3);const T=(await import(pathToFileURL(resolve(process.argv[2])))).default,base=[0,2,1,2,3,5,12,4,0],point=array(T.test_capture(...base));assert.equal(point.length,15);assert.equal(point[0],0);assert.equal(point[1],17);assert.deepEqual(point.slice(7),[11,22,33,3,4,2,5,12]);const end=array(T.test_capture(18,...base.slice(1)));assert.deepEqual(end,[1,...point.slice(1)]);let rejected=0;for(const[index,value]of[[0,1],[0,17],[0,19],[1,0],[1,1],[2,0],[2,2],[3,0],[4,0],[6,5],[6,4],[7,6],[7,63],[8,1]]){const input=base.slice();input[index]=value;assert.deepEqual(array(T.test_capture(...input)),[]);rejected++;}console.log(JSON.stringify({passed:true,entryAndExhaustionDistinct:true,cachedCoordinatesIncluded:true,rejectedContexts:rejected,rootMasksAndIncumbentTruncationExcluded:true,noCachePruning:true}));
