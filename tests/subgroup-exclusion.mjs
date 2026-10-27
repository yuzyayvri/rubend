import assert from "node:assert/strict";
import {writeFileSync,openSync,readSync,closeSync,statSync,createReadStream} from "node:fs";
import {createHash} from "node:crypto";
import {resolve} from "node:path";
import {puzzles} from "cubing/puzzles";
import {KPattern} from "cubing/kpuzzle";
import Cubie from "../build/cubie.mjs";
import E from "../build/subgroup-exclusion.mjs";
import {moveNames} from "../apps/model.mjs";
import {cornerMap,edgeMap,randomCube,randomSource,patternData,faceletsOf} from "./support.mjs";

const depth=Number(process.argv[2]),output=resolve(process.argv[3]??"invalid");assert.equal(process.argv.length,4);assert.ok([2,4].includes(depth));assert.ok(output.startsWith(resolve("build/evidence")+"/")||output.startsWith(resolve("build/experiments")+"/"));
const cache=resolve(".cache/joint/phase1-v1.raw"),cacheSha256="2ccfd40fdc0cf4769c58d9646f6b0ea787571ce5200b5d124c8f17dcc70f73b5";
const identity=()=>{const s=statSync(cache,{bigint:true});return["dev","ino","size","mtimeNs","ctimeNs"].map(k=>String(s[k]));},before=identity();assert.equal(before[2],"1108546560");
async function cacheHash(){const h=createHash("sha256");for await(const bytes of createReadStream(cache))h.update(bytes);return h.digest("hex");}
assert.equal(await cacheHash(),cacheSha256);assert.deepEqual(identity(),before);
const puzzle=await puzzles["3x3x3"].kpuzzle(),transforms=moveNames.map(m=>puzzle.algToTransformation(m)),inverse=m=>Math.floor(m/3)*3+2-m%3,key=c=>[c.cp,c.co,c.ep,c.eh,c.eo].join(","),pack=(xs,bits)=>xs.reduce((v,x,i)=>(v|(x<<(i*bits)))>>>0,0);
const back=map=>map.reduce((xs,x,i)=>(xs[x]=i,xs),[]),cb=back(cornerMap),eb=back(edgeMap);
function cubie(pattern){const d=pattern.patternData,cp=cornerMap.map(i=>cb[d.CORNERS.pieces[i]]),co=cornerMap.map(i=>d.CORNERS.orientation[i]),ep=edgeMap.map(i=>eb[d.EDGES.pieces[i]]),eo=edgeMap.map(i=>d.EDGES.orientation[i]);return{$:"Cubie",cp:pack(cp,4),co:pack(co,2),ep:pack(ep.slice(0,8),4),eh:pack(ep.slice(8),4),eo:pack(eo,1)};}
assert.deepEqual(cubie(puzzle.defaultPattern()),Cubie.solved());
const random=randomSource("rubend-u02-subgroup-preflight-v1");
for(let i=0;i<1000;i++){const c=randomCube(random),p=new KPattern(puzzle,patternData(c));assert.deepEqual(cubie(p),c);const t=p.experimentalToTransformation();assert.ok(t);assert.deepEqual(cubie(t.invert().toKPattern()),Cubie.inverse(c));}
const allMoves=(1<<18)-1,halfMoves=moveNames.reduce((mask,_,m)=>mask|(m%3===1?1<<m:0),0),masks=[];
for(let axis=0;axis<3;axis++){let mask=0;for(let move=0;move<18;move++){if(E.subgroup_axis(axis,Cubie.turn(move,Cubie.solved())))mask|=1<<move;}assert.equal(mask,E.subgroup_mask(axis));for(let m=0;m<18;m++)assert.equal(Boolean(mask&(1<<m)),Boolean(mask&(1<<inverse(m))));assert.equal(mask&halfMoves,halfMoves);masks.push(mask);}
assert.equal(masks.reduce((a,b)=>a|b),allMoves);assert.equal(masks.reduce((a,b)=>a&b),halfMoves);
const first={cube:Cubie.solved(),pattern:puzzle.defaultPattern(),depth:0,first:0,last:0},states=new Map([[key(first.cube),first]]),layers=[[first]];let oracleEdges=0;
for(let level=1;level<=depth;level++){const layer=[];for(const parent of layers[level-1])for(let m=0;m<18;m++){const pattern=parent.pattern.applyTransformation(transforms[m]),c=cubie(pattern);assert.deepEqual(c,Cubie.turn(m,parent.cube));oracleEdges++;const k=key(c);let n=states.get(k);if(!n){n={cube:c,pattern,depth:level,first:0,last:0};states.set(k,n);layer.push(n);}if(n.depth===level){n.first|=1<<inverse(m);n.last|=parent.depth?parent.last:1<<inverse(m);}}layers.push(layer);}
assert.deepEqual(layers.map(l=>l.length),[1,18,243,3240,43239].slice(0,depth+1));
const fd=openSync(cache,"r"),word=Buffer.alloc(4),memo=new Map();let reads=0;
function lookup(index){assert.ok(Number.isSafeInteger(index)&&index>=0&&index<2217093120);if(!memo.has(index)){assert.equal(readSync(fd,word,0,4,Math.floor(index/8)*4),4);memo.set(index,(word.readUInt32LE()>>>(4*(index%8)))&15);reads++;}return memo.get(index);}
function bounds(c){const q=E.forward_indices(c);return[q.ud,q.fb,q.rl].map(lookup);}
const f=h=>({$:"ForwardBounds",ud:h[0],fb:h[1],rl:h[2]}),inv=h=>({$:"InverseBounds",ud:h[0],fb:h[1],rl:h[2]}),bits=(h,r,ms=masks)=>h.reduce((b,v,i)=>b|(v>=r?ms[i]:0),0),witness=(n,h,extra={})=>({depth:n.depth,facelets:faceletsOf(n.cube),bounds:h,firstMoves:n.first,lastMoves:n.last,...extra});
const mutations={forwardMaskAsFirst:null,wrongAxisMask:null,childResidualOffByOne:null,zeroDepthRaise:null},rows=layers.map((_,level)=>({depth:level,states:0,raised:0,finalExcludedMoves:0,firstExcludedMoves:0}));
let shortestDagEdges=0,checked=0,inverseSamples=0;
try{for(const n of states.values()){
  const h=bounds(n.cube),inverseCube=Cubie.inverse(n.cube),ih=bounds(inverseCube);for(const b of[...h,...ih])assert.ok(b<=n.depth);assert.equal(states.get(key(inverseCube))?.depth,n.depth);
  if(checked%128===0){const t=n.pattern.experimentalToTransformation();assert.ok(t);assert.deepEqual(cubie(t.invert().toKPattern()),inverseCube);inverseSamples++;}
  const fm=E.forward_exclusions(n.depth,f(h)).bits,im=E.inverse_exclusions(n.depth,inv(ih)).bits,lower=E.full_cube_lower(f(h)),maximum=Math.max(...h);assert.equal(fm&n.last,0,"Forward exclusion removed a shortest last move");assert.equal(im&n.first,0,"Inverse exclusion removed a shortest first move");assert.ok(lower>=maximum&&lower<=n.depth,"Raised lower bound exceeds the independent optimum");assert.equal(E.forward_exclusions(0,f(h)).bits,0);assert.equal(E.forward_exclusions(n.depth+1,f(h)).bits,0);assert.equal(E.inverse_exclusions(n.depth+1,inv(ih)).bits,0);
  for(let m=0;m<18;m++)assert.equal(E.allows_first({$:"FirstMask",bits:im},m),!(im&(1<<m)));
  if(!mutations.forwardMaskAsFirst&&(fm&n.first))mutations.forwardMaskAsFirst=witness(n,h,{mutatedMask:fm});
  const wrong=bits(h,n.depth,[masks[0],masks[2],masks[1]]);if(n.depth&&!mutations.wrongAxisMask&&(wrong&n.last))mutations.wrongAxisMask=witness(n,h,{mutatedMask:wrong});
  const off=bits(h,Math.max(0,n.depth-1));if(n.depth&&!mutations.childResidualOffByOne&&(off&n.last))mutations.childResidualOffByOne=witness(n,h,{mutatedMask:off});
  if(n.depth===0){const mutatedMask=bits(h,0),mutatedLower=maximum+(mutatedMask===allMoves?1:0);assert.ok(mutatedLower>n.depth);mutations.zeroDepthRaise=witness(n,h,{mutatedMask,mutatedLower,actualDepth:n.depth});}
  const row=rows[n.depth];row.states++;row.raised+=lower>maximum?1:0;row.finalExcludedMoves+=fm.toString(2).replaceAll("0","").length;row.firstExcludedMoves+=im.toString(2).replaceAll("0","").length;shortestDagEdges+=n.first.toString(2).replaceAll("0","").length;checked++;
}}finally{closeSync(fd);}
if(depth===4)for(const[name,value]of Object.entries(mutations))assert.ok(value,"Mutation has no reproduced counterexample: "+name);
assert.equal(E.full_cube_lower(f([0,0,0])),0);assert.equal(E.forward_exclusions(1,f([15,1,1])).bits,0);assert.equal(E.full_cube_lower(f([15,1,1])),0);assert.equal(E.allows_first({$:"FirstMask",bits:0},18),false);
assert.deepEqual(identity(),before);assert.equal(await cacheHash(),cacheSha256);assert.deepEqual(identity(),before);
const result={format:"rubend-subgroup-exclusion-preflight-v1",passed:true,depth,states:states.size,oracle:"cubing@0.66.0 KPuzzle shortest-path DAG, all shortest first/last move unions",oracleEdges,shortestDagEdges,independentUniformInverses:1000,shallowInverseSamples:inverseSamples,subgroupMasks:masks,uniqueCacheProbes:reads,cacheSha256,rows,mutations,formalNp01To03Proofs:false,productionIntegrated:false,performanceClaim:false,independentReview:false};writeFileSync(output,JSON.stringify(result,null,2)+"\n",{flag:"wx"});console.log(JSON.stringify(result));
