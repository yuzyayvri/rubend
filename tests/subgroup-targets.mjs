import assert from "node:assert/strict";
import {writeFileSync} from "node:fs";
import {resolve} from "node:path";
import Cubie from "../build/cubie.mjs";
import Rotate from "../build/packed-symmetry.mjs";
import E from "../build/subgroup-exclusion.mjs";
import T from "../build/subgroup-targets.mjs";
import {randomSource,randomCube,randomSubgroupCube,faceletsOf} from "./support.mjs";
import {validate} from "../apps/model.mjs";

assert.equal(process.argv.length,3);const output=resolve(process.argv[2]);assert.ok(output.startsWith(resolve("build/evidence")+"/")||output.startsWith(resolve("build/experiments")+"/"));
const axes=[{$:"UD"},{$:"FB"},{$:"RL"}],positive=[0,0,0],random=randomSource("rubend-reference-targets-v1"),key=c=>[c.cp,c.co,c.ep,c.eh,c.eo].join(",");let states=0,closureTransitions=0;
const inside=(a,c)=>T.inside_words(axes[a],c.cp,c.co,c.ep,c.eh,c.eo);
function check(c){for(let a=0;a<3;a++){const value=inside(a,c);assert.equal(value,E.subgroup_axis(a,c));positive[a]+=value?1:0;}states++;}
for(let a=0;a<3;a++){assert.equal(T.member_index(axes[a],18),false);for(let m=0;m<18;m++){const member=T.member_index(axes[a],m);assert.equal(member,Boolean(E.subgroup_mask(a)&(1<<m)));assert.equal(inside(a,Cubie.turn(m,Cubie.solved())),member);}}
for(let i=0;i<2000;i++)check(randomCube(random));
for(let i=0;i<2000;i++){let c=randomSubgroupCube(random);for(let frame=0;frame<3;frame++){check(c);if(i<200)for(let a=0;a<3;a++)if(E.subgroup_axis(a,c))for(let m=0;m<18;m++)if(T.member_index(axes[a],m)){const next=Cubie.turn(m,c);assert.equal(E.subgroup_axis(a,next),true);assert.equal(inside(a,next),true);closureTransitions++;}c=Rotate.rotate(c);}}
const shallow=new Map([[key(Cubie.solved()),Cubie.solved()]]),layers=[[Cubie.solved()]];
for(let d=1;d<=3;d++){const layer=[];for(const c of layers[d-1])for(let m=0;m<18;m++){const next=Cubie.turn(m,c),k=key(next);if(!shallow.has(k)){shallow.set(k,next);layer.push(next);}}layers.push(layer);}assert.deepEqual(layers.map(l=>l.length),[1,18,243,3240]);for(const c of shallow.values())check(c);
for(const count of positive)assert.ok(count>=2000);assert.ok(closureTransitions>=6000);
const flipped={...Cubie.solved(),eo:(1<<8)|(1<<9)},reference=Cubie.to_facelets(flipped);assert.deepEqual(validate(faceletsOf(flipped)),flipped);assert.equal(E.subgroup_axis(0,flipped),false);assert.equal(inside(0,flipped),false);const withoutSliceOrientation=[0,1,2,3,5,6,7,8,27,28,29,30,32,33,34,35].every(i=>[0,3].includes(reference["s"+i]));assert.equal(withoutSliceOrientation,true);
const result={format:"rubend-reference-target-samples-v1",passed:true,states,uniformStates:2000,subgroupFrames:6000,shallowStates:3502,positiveByAxis:positive,closureTransitions,moveMembershipChecks:54,droppedSliceOrientationCounterexample:{cube:flipped,facelets:faceletsOf(flipped),correctTarget:false,mutatedTarget:true},formalReferenceTargetClosure:"checked separately by BendTT",formalPackedRefinement:false,formalLoadedDataAdmissibility:false,formalInverseReconstruction:false,productionIntegrated:false,independentReview:false};writeFileSync(output,JSON.stringify(result,null,2)+"\n",{flag:"wx"});console.log(JSON.stringify(result));
