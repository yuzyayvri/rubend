import assert from "node:assert/strict";
import {pathToFileURL} from "node:url";
import * as THREE from "three";
import {RoundedBoxGeometry} from "three/addons/geometries/RoundedBoxGeometry.js";
import {apply,solved,faces} from "../apps/model.mjs";

assert.equal(process.argv.length,4);const module=await import(pathToFileURL(process.argv[2])),retained=process.argv[3]==="retained";assert.ok(["retained","control"].includes(process.argv[3]));
const scene=Object.create(module.CubeScene.prototype);let invalidations=0;Object.assign(scene,{parts:[],stickers:[],cube:new THREE.Group(),bodyGeometry:new RoundedBoxGeometry(.98,.98,.98,3,.065),stickerGeometry:new RoundedBoxGeometry(.83,.83,.035,3,.05),bodyMaterial:new THREE.MeshStandardMaterial(),stickerMaterials:module.faceColors.map(color=>new THREE.MeshStandardMaterial({color})),frameDriver:{invalidate(){invalidations++;}},lost:false,animating:false});
let facelets=solved,sets=0,turns=0;const snapshots=[];
function state(){scene.cube.updateMatrixWorld(true);assert.equal(scene.parts.length,26);assert.equal(scene.stickers.length,54);assert.equal(scene.cube.children.length,26,"Cubie parent drifted");for(const part of scene.parts){assert.ok(part.parent===scene.cube,"Cubie parent drifted");part.position.toArray().forEach((v,i)=>assert.ok(Math.abs(v-part.userData.xyz[i]*1.02)<1e-10,"Cubie position drifted"));part.quaternion.toArray().forEach((v,i)=>assert.ok(Math.abs(v-(i===3?1:0))<1e-10,"Cubie quaternion drifted"));assert.deepEqual(part.scale.toArray(),[1,1,1]);}assert.ok(scene.stickers.every((s,i)=>"#"+s.material.color.getHexString()===module.faceColors[faces.indexOf(facelets[i])]),"Canonical sticker colors drifted");const meshes=[];scene.cube.traverse(o=>{if(o.isMesh)meshes.push(o.uuid);});assert.equal(meshes.length,80);return{meshes,groups:scene.parts.map(p=>p.uuid)};}
function compare(before,after){const meshes=after.meshes.filter(id=>!before.meshes.includes(id)).length,groups=after.groups.filter(id=>!before.groups.includes(id)).length;assert.equal(meshes,retained?0:80,"Expected stable mesh identities");assert.equal(groups,retained?0:26,"Expected stable group identities");snapshots.push({newMeshes:meshes,newGroups:groups});}
scene.set(facelets);let previous=state();const initial=previous;
for(const moves of[[],[0],[3,0,5,2],Array.from({length:18},(_,i)=>i)]){facelets=apply(facelets,moves);const before=invalidations;scene.set(facelets);assert.equal(invalidations,before+1,"Set must invalidate the rendered scene");const next=state();compare(previous,next);previous=next;sets++;}
const savedRaf=globalThis.requestAnimationFrame,savedPerformance=Object.getOwnPropertyDescriptor(globalThis,"performance");let callbacks=[],clock=0;globalThis.requestAnimationFrame=fn=>{callbacks.push(fn);return callbacks.length;};Object.defineProperty(globalThis,"performance",{configurable:true,value:{now:()=>clock}});
try{for(let move=0;move<18;move++){
  facelets=apply(facelets,[move]);clock=move*1000;const pending=scene.turn(move,facelets,100);assert.equal(scene.animating,true);assert.equal(scene.parts.filter(p=>p.parent!==scene.cube).length,9,"Animated layer must contain nine cubies");assert.equal(callbacks.length,1);callbacks.shift()(clock+50);assert.equal(callbacks.length,1);callbacks.shift()(clock+200);await pending;assert.equal(callbacks.length,0);assert.equal(scene.animating,false);const next=state();compare(previous,next);previous=next;turns++;
}}finally{globalThis.requestAnimationFrame=savedRaf;Object.defineProperty(globalThis,"performance",savedPerformance);}
scene.lost=true;facelets=apply(facelets,[17]);await scene.turn(17,facelets,100);compare(previous,state());sets++;
if(retained){assert.deepEqual(state().meshes,initial.meshes);assert.deepEqual(state().groups,initial.groups);}
for(const material of[scene.bodyMaterial,...scene.stickerMaterials])material.dispose();scene.bodyGeometry.dispose();scene.stickerGeometry.dispose();
console.log(JSON.stringify({passed:true,retained,sets,animatedTurns:turns,finalPoseAudits:snapshots.length,initialMeshes:80,initialGroups:26,snapshots,invalidations,webglUsed:false,productChanged:false,performanceAcceptance:false}));
