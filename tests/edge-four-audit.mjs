import assert from "node:assert/strict";
import {readFileSync,writeFileSync} from "node:fs";
import {resolve} from "node:path";
import {pathToFileURL} from "node:url";
import {puzzles} from "cubing/puzzles";
import {array,moveNames} from "../apps/model.mjs";
import {edgeMap} from "./support.mjs";
import {fileHash} from "../bench/reference-provenance.mjs";

assert.equal(process.argv.length,5);const [modulePath,generationPath,output]=process.argv.slice(2),E=(await import(pathToFileURL(resolve(modulePath)))).default,generation=JSON.parse(readFileSync(generationPath,"utf8"));assert.equal(generation.passed,true);
const count=4,size=12*11*10*9*16,patterns=[[0,2,4,6],[1,3,5,7]];assert.equal(size,190080);assert.equal(E.test_size(4),size);
const puzzle=await puzzles["3x3x3"].kpuzzle(),back=[];edgeMap.forEach((p,i)=>back[p]=i);const actions=moveNames.map(m=>{const data=puzzle.algToTransformation(m).transformationData.EDGES;return Array.from({length:12},(_,p)=>{const at=data.permutation.indexOf(edgeMap[p]);return{position:back[at],flip:data.orientationDelta[at]};});});
function rank(positions,orientation){const available=Array.from({length:12},(_,i)=>i);let value=0;for(const position of positions){const digit=available.indexOf(position);assert.ok(digit>=0);value=value*available.length+digit;available.splice(digit,1);}return value*16+orientation;}
function decode(index){const available=Array.from({length:12},(_,i)=>i),weights=[990,90,9,1],positions=[];let value=Math.floor(index/16);for(const weight of weights){const digit=Math.floor(value/weight);value%=weight;positions.push(available.splice(digit,1)[0]);}return{positions,orientation:index%16};}
const edges=new Uint32Array(size*18);let codecChecks=0,transitionChecks=0;
for(let index=0;index<size;index++){
  const state=decode(index);assert.equal(rank(state.positions,state.orientation),index);assert.deepEqual(array(E.test_codec(count,index)),[index,state.orientation,...state.positions]);codecChecks++;
  for(let move=0;move<18;move++){
    let orientation=state.orientation;const positions=state.positions.map((p,i)=>{const action=actions[move][p];orientation^=action.flip<<i;return action.position;}),next=rank(positions,orientation);assert.ok(next>=0&&next<size);assert.equal(E.test_next(count,index,move),next,"Four-edge transition mismatch");edges[index*18+move]=next;transitionChecks++;
  }
}
const rows=[],reference=[];
function verify(row,values,distances){
  assert.equal(row.complete,1);assert.equal(row.bad,0);assert.equal(row.reached,size);assert.equal(row.expanded,size);assert.equal(row.allocatedWords,262144);assert.equal(row.goal,rank(patterns[row.pattern],0),"Four-edge goal mismatch");assert.equal(values.length,size,"Four-edge payload size mismatch");
  const histogram=[];let decreasing=0,edgeChecks=0,inverseChecks=0;
  for(let index=0;index<size;index++){
    const value=values[index];assert.equal(value,distances[index],"Four-edge distance mismatch at "+index);assert.ok(value<255);assert.equal(value===0,index===row.goal);histogram[value]=(histogram[value]??0)+1;let descent=value===0;
    for(let move=0;move<18;move++){const next=edges[index*18+move],inverse=Math.floor(move/3)*3+2-move%3;assert.equal(edges[next*18+inverse],index);inverseChecks++;assert.ok(Math.abs(value-values[next])<=1);if(values[next]===value-1)descent=true;edgeChecks++;}
    assert.ok(descent);if(value>0)decreasing++;
  }
  assert.equal(row.depth,histogram.length-1);return{pattern:row.pattern,goal:row.goal,states:size,edgeChecks,inverseChecks,decreasing,diameter:histogram.length-1,histogram};
}
for(const row of generation.rows){
  assert.equal(fileHash(row.payload),row.payloadSha256);const values=new Uint8Array(readFileSync(row.payload)),distances=new Uint8Array(size).fill(255),queue=new Uint32Array(size);let head=0,tail=1;const goal=rank(patterns[row.pattern],0);queue[0]=goal;distances[goal]=0;
  while(head<tail){const index=queue[head++];for(let move=0;move<18;move++){const next=edges[index*18+move];if(distances[next]===255){distances[next]=distances[index]+1;queue[tail++]=next;}}}
  assert.equal(tail,size);rows.push(verify(row,values,distances));reference.push({row,values,distances});
}
const base=reference[0],wrong=base.values.slice();wrong[0]=(wrong[0]+1)%255;const controls=[{name:"changed-byte",row:base.row,values:wrong,diagnostic:/distance mismatch/},{name:"missing-byte",row:base.row,values:base.values.slice(0,-1),diagnostic:/payload size mismatch/},{name:"wrong-goal",row:{...base.row,goal:(base.row.goal+1)%size},values:base.values,diagnostic:/goal mismatch/}],rejections=[];
for(const c of controls){let failure;try{verify(c.row,c.values,base.distances);}catch(error){failure=error;}assert.ok(failure instanceof assert.AssertionError,c.name);assert.match(failure.message,c.diagnostic);rejections.push({name:c.name,diagnostic:failure.message});}
const result={passed:true,format:"rubend-four-edge-audit-v1",oracle:"Pinned cubing KPuzzle actions, independent available-slot rank and forward-weight decoder, full FIFO BFS",patterns,codecChecks,transitionChecks,rows,recordCorruptions:rejections,sourceHashes:{[resolve(modulePath)]:fileHash(resolve(modulePath)),[resolve(generationPath)]:fileHash(resolve(generationPath))},payloads:Object.fromEntries(generation.rows.map(r=>[r.payload,r.payloadSha256])),auditedStates:rows.reduce((s,r)=>s+r.states,0),auditedEdges:rows.reduce((s,r)=>s+r.edgeChecks,0),wholeFourEdgeGraphsChecked:true,fourEdgeTablesGenerated:true,fullSixEdgeBuild:false,np05Proved:false,productionIntegrated:false,performanceAcceptance:false,releaseHoldoutOpened:false,independentReview:false};
writeFileSync(resolve(output),JSON.stringify(result,null,2)+"\n",{flag:"wx"});console.log(JSON.stringify({passed:true,codecChecks,transitionChecks,auditedStates:result.auditedStates,auditedEdges:result.auditedEdges,diameters:rows.map(r=>r.diameter),recordCorruptions:rejections.length}));
