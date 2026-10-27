import assert from "node:assert/strict";
import {readFileSync,writeFileSync,mkdirSync} from "node:fs";
import {resolve} from "node:path";
import {withArtifactLease} from "../scripts/artifact-lease.mjs";

withArtifactLease();assert.equal(process.argv.length,3);const directory=resolve(process.argv[2]);assert.ok(directory.startsWith(resolve("build")+"/"));mkdirSync(directory,{recursive:true});let page=readFileSync("bench/render-demand-page.mjs","utf8");
function one(from,to){assert.equal(page.split(from).length,2);page=page.replace(from,to);}
one('import {CubeScene,faceColors} from "../apps/web/scene.mjs";','import {CubeScene,faceColors} from "rubend:retained-scene";');
one('from "../apps/model.mjs"','from "rubend:render-model"');one('from "./render-demand-spec.json"','from "rubend:retention-spec"');
one('function state(){const s=snapshot();return{meshes:s.meshes.length,groups:s.groups.length,canonicalColors:colors()};}',`function pose(){scene.cube.updateMatrixWorld(true);return scene.parts.length===26&&scene.stickers.length===54&&scene.cube.children.length===26&&scene.parts.every(part=>part.parent===scene.cube&&part.position.toArray().every((v,i)=>Math.abs(v-part.userData.xyz[i]*1.02)<1e-10)&&part.quaternion.toArray().every((v,i)=>Math.abs(v-(i===3?1:0))<1e-10)&&part.scale.toArray().every(v=>v===1));}
function state(){const s=snapshot();return{meshes:s.meshes.length,groups:s.groups.length,canonicalColors:colors(),canonicalPose:pose()};}`);
assert.equal(page.split("canonicalColors:colors(),animating:scene.animating").length,3);page=page.replaceAll("canonicalColors:colors(),animating:scene.animating","canonicalColors:colors(),canonicalPose:pose(),animating:scene.animating");
one("restoredObserved:scene.lost===false,canonicalColors:colors()","restoredObserved:scene.lost===false,canonicalColors:colors(),canonicalPose:pose()");
one("yes({ms:performance.now()-started,canonicalColors:colors()})","yes({ms:performance.now()-started,canonicalColors:colors(),canonicalPose:pose()})");
page=page.replaceAll('"demand"','"retained"').replaceAll("rubend-render-demand-comparison-v1","rubend-render-retained-comparison-v1");one("productChanged:true","productChanged:false");
const path=resolve(directory,"page.mjs");writeFileSync(path,page,{flag:"wx"});console.log(JSON.stringify({generated:true,path,canonicalPoseAudits:true,productChanged:false}));
