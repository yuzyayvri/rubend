import assert from "node:assert/strict";
import {readFileSync,writeFileSync,mkdirSync} from "node:fs";
import {resolve} from "node:path";
import {createHash} from "node:crypto";
import {withArtifactLease} from "../scripts/artifact-lease.mjs";

withArtifactLease();assert.equal(process.argv.length,3);const directory=resolve(process.argv[2]);assert.ok(directory.startsWith(resolve("build")+"/"));mkdirSync(directory,{recursive:true});
const source=readFileSync("apps/web/scene.mjs","utf8"),hash=text=>createHash("sha256").update(text).digest("hex"),plan=JSON.parse(readFileSync("build/evidence/u06-gui-demand-v1-plan.json","utf8"));assert.equal(hash(source),plan.sourceHashes["apps/web/scene.mjs"]);
const before="    this.cube.clear();this.parts=[];this.stickers=[];",after=`    this.cube.clear();
    if(this.parts.length){
      for(const part of this.parts){const [x,y,z]=part.userData.xyz;part.position.set(x*1.02,y*1.02,z*1.02);part.quaternion.identity();part.scale.set(1,1,1);this.cube.add(part);}
      for(let i=0;i<this.stickers.length;i++)this.stickers[i].material=this.stickerMaterials[faces.indexOf(facelets[i])];
      this.frameDriver.invalidate();return;
    }
    this.parts=[];this.stickers=[];`;
assert.equal(source.split(before).length,2);const candidate=source.replace(before,after);function mutate(from,to){assert.equal(candidate.split(from).length,2);return candidate.replace(from,to);}
const variants={control:source,candidate,rebuild:mutate("if(this.parts.length)","if(false)"),color:mutate("this.stickers[i].material=this.stickerMaterials[faces.indexOf(facelets[i])]","this.stickers[i].material=this.stickers[i].material"),parent:mutate("this.cube.add(part);","")},sources={};
for(const[name,text]of Object.entries(variants)){const path=resolve(directory,name+".mjs");writeFileSync(path,text,{flag:"wx"});sources[path]=hash(text);}
writeFileSync(resolve(directory,"manifest.json"),JSON.stringify({passed:true,baseSceneSha256:hash(source),sources,privatePrototype:true,productChanged:false,performanceAcceptance:false})+"\n",{flag:"wx"});console.log(JSON.stringify({generated:true,variants:Object.keys(variants),productChanged:false}));
