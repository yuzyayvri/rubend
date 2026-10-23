import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";

export const faceColors=["#f2f0e7","#ef6046","#2ab379","#f2ce47","#ef943d","#4d88dc"];
export const normals=[[0,1,0],[1,0,0],[0,0,1],[0,-1,0],[-1,0,0],[0,0,-1]];
const right=[[1,0,0],[0,0,-1],[1,0,0],[1,0,0],[0,0,1],[-1,0,0]];
const down=[[0,0,1],[0,-1,0],[0,-1,0],[0,0,-1],[0,-1,0],[0,-1,0]];
const faces="URFDLB";

export class FrameDriver {
  constructor(step,request=callback=>globalThis.requestAnimationFrame(callback),cancel=id=>globalThis.cancelAnimationFrame(id)){this.step=step;this.request=request;this.cancel=cancel;this.pending=null;this.dirty=false;this.state="idle";}
  queue(){
    if(this.pending!==null||this.state==="suspended"||this.state==="disposed")return;
    this.state="scheduled";
    const id=this.request(time=>{if(this.pending!==id)return;this.pending=null;this.state="running";const dirty=this.dirty;this.dirty=false;const again=this.step(time,dirty);if(this.state==="suspended"||this.state==="disposed")return;if(again||this.dirty)this.queue();else if(this.pending===null)this.state="idle";});
    this.pending=id;
  }
  invalidate(){if(this.state==="disposed")return;this.dirty=true;this.queue();}
  suspend(blocked){
    if(this.state==="disposed")return;
    if(blocked){if(this.pending!==null)this.cancel(this.pending);this.pending=null;this.state="suspended";}
    else{this.state=this.pending===null?"idle":"scheduled";this.invalidate();}
  }
  dispose(){if(this.pending!==null)this.cancel(this.pending);this.pending=null;this.dirty=false;this.state="disposed";}
}

export function renderLabel(stats){
  if(!stats)return "2D controls remain available without a 3D renderer.";
  if(stats.status==="lost")return "3D context lost. 2D controls remain available.";
  if(stats.status==="hidden")return "3D paused while the document is hidden.";
  if(stats.status==="idle")return "3D ready · idle.";
  if(stats.averageFrameMs)return `Rendering: ${(1000/stats.averageFrameMs).toFixed(0)} fps · p95 ${stats.p95FrameMs.toFixed(1)} ms · ${stats.frames} recent frames.`;
  return "3D ready.";
}

export class CubeScene {
  constructor(host,onTurn){
    this.host=host;this.onTurn=onTurn;this.parts=[];this.stickers=[];this.animating=false;this.frames=[];this.lastFrame=0;
    this.scene=new THREE.Scene();
    this.camera=new THREE.PerspectiveCamera(32,1,.1,100);
    this.renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,powerPreference:"low-power"});
    this.renderer.setPixelRatio(Math.min(devicePixelRatio,2));
    this.renderer.shadowMap.enabled=true;
    this.renderer.shadowMap.type=THREE.PCFShadowMap;
    this.renderer.toneMapping=THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure=1.25;
    host.append(this.renderer.domElement);
    this.controls=new OrbitControls(this.camera,this.renderer.domElement);
    this.controls.enableDamping=true;this.controls.dampingFactor=.09;this.controls.enablePan=false;
    this.controls.minDistance=6.5;this.controls.maxDistance=18;
    this.controls.maxPolarAngle=Math.PI*.85;
    this.home();
    this.scene.add(new THREE.HemisphereLight(0xedfff3,0x3a4940,2.4));
    const key=new THREE.DirectionalLight(0xffffff,4);key.position.set(4,8,6);key.castShadow=true;key.shadow.mapSize.set(1024,1024);key.shadow.camera.left=-5;key.shadow.camera.right=5;key.shadow.camera.top=5;key.shadow.camera.bottom=-5;key.shadow.normalBias=.04;this.scene.add(key);
    const fill=new THREE.DirectionalLight(0xa1c9ff,1.1);fill.position.set(-5,1,-3);this.scene.add(fill);
    this.cube=new THREE.Group();this.scene.add(this.cube);
    const ground=new THREE.Mesh(new THREE.PlaneGeometry(200,200),new THREE.ShadowMaterial({opacity:.28}));ground.rotation.x=-Math.PI/2;ground.position.y=-2;ground.receiveShadow=true;this.scene.add(ground);
    this.bodyGeometry=new RoundedBoxGeometry(.98,.98,.98,3,.065);
    this.stickerGeometry=new RoundedBoxGeometry(.83,.83,.035,3,.05);
    this.bodyMaterial=new THREE.MeshStandardMaterial({color:0x131917,roughness:.33,metalness:.08});
    this.stickerMaterials=faceColors.map(color=>new THREE.MeshStandardMaterial({color,roughness:.27,metalness:.02}));
    this.raycaster=new THREE.Raycaster();this.pointer=new THREE.Vector2();
    this.renderer.domElement.addEventListener("pointerdown",e=>{this.down={x:e.clientX,y:e.clientY};});
    this.renderer.domElement.addEventListener("pointerup",e=>{
      if(this.animating||!this.down||Math.hypot(e.clientX-this.down.x,e.clientY-this.down.y)>5)return;
      const rect=this.renderer.domElement.getBoundingClientRect();this.pointer.set((e.clientX-rect.left)/rect.width*2-1,-(e.clientY-rect.top)/rect.height*2+1);
      this.raycaster.setFromCamera(this.pointer,this.camera);const hit=this.raycaster.intersectObjects(this.stickers)[0];
      if(hit)this.onTurn(hit.object.userData.face*3+(e.altKey?1:e.shiftKey?2:0));
    });
    this.onLost=e=>{e.preventDefault();this.lost=true;this.lastFrame=0;this.frameDriver.suspend(true);document.getElementById("fallback").hidden=false;};
    this.onRestored=()=>{this.lost=false;this.lastFrame=0;nextFrame=0;this.frameDriver.suspend(document.hidden);document.getElementById("fallback").hidden=true;};
    this.renderer.domElement.addEventListener("webglcontextlost",this.onLost);
    this.renderer.domElement.addEventListener("webglcontextrestored",this.onRestored);
    this.resize=new ResizeObserver(()=>{const {width,height}=host.getBoundingClientRect();if(!width||!height)return;this.frames=[];this.lastFrame=0;this.camera.aspect=width/height;this.camera.updateProjectionMatrix();this.renderer.setSize(width,height);this.frameDriver.invalidate();});this.resize.observe(host);
    let nextFrame=0;
    this.submittedFrames=0;
    this.frameDriver=new FrameDriver((time,dirty)=>{
      if(time<nextFrame-.1){this.frameDriver.invalidate();return false;}
      nextFrame=Math.max(nextFrame+1000/60,time-1000/60);
      const moved=this.controls.update();
      if(dirty||moved||this.animating){if(this.lastFrame)this.frames.push(time-this.lastFrame);this.lastFrame=time;if(this.frames.length>300)this.frames.shift();this.renderer.render(this.scene,this.camera);this.submittedFrames++;}
      if(!moved&&!this.animating)this.lastFrame=0;
      return moved||this.animating;
    });
    this.onChange=()=>this.frameDriver.invalidate();this.controls.addEventListener("change",this.onChange);
    this.onVisibility=()=>{this.lastFrame=0;nextFrame=0;this.frameDriver.suspend(document.hidden||this.lost);};document.addEventListener("visibilitychange",this.onVisibility);
    this.frameDriver.suspend(document.hidden);
  }
  home(){this.camera.position.set(6.7,5.4,7.8);this.controls?.target.set(0,-.1,0);this.controls?.update();this.frameDriver?.invalidate();}
  set(facelets){
    this.cube.clear();this.parts=[];this.stickers=[];
    const groups=new Map();
    for(let x=-1;x<=1;x++)for(let y=-1;y<=1;y++)for(let z=-1;z<=1;z++){
      if(x===0&&y===0&&z===0)continue;
      const group=new THREE.Group();group.position.set(x*1.02,y*1.02,z*1.02);group.userData.xyz=[x,y,z];
      const body=new THREE.Mesh(this.bodyGeometry,this.bodyMaterial);body.castShadow=true;body.receiveShadow=true;group.add(body);groups.set(`${x},${y},${z}`,group);this.parts.push(group);this.cube.add(group);
    }
    for(let f=0;f<6;f++)for(let s=0;s<9;s++){
      const n=normals[f],xyz=n.map((v,i)=>v+(s%3-1)*right[f][i]+(Math.floor(s/3)-1)*down[f][i]);
      const sticker=new THREE.Mesh(this.stickerGeometry,this.stickerMaterials[faces.indexOf(facelets[f*9+s])]);
      sticker.position.set(...n.map(v=>v*.503));sticker.quaternion.setFromUnitVectors(new THREE.Vector3(0,0,1),new THREE.Vector3(...n));
      sticker.castShadow=true;sticker.receiveShadow=true;sticker.userData.face=f;
      groups.get(xyz.join(",")).add(sticker);this.stickers.push(sticker);
    }
    this.frameDriver.invalidate();
  }
  async turn(move,facelets,duration){
    if(!duration||this.lost){this.set(facelets);return;}
    this.animating=true;this.frameDriver.invalidate();
    const group=new THREE.Group(),axis=new THREE.Vector3(...normals[Math.floor(move/3)]);
    this.cube.add(group);
    for(const part of this.parts)if(part.userData.xyz.reduce((s,v,i)=>s+v*axis.getComponent(i),0)===1)group.attach(part);
    const target=-Math.PI/2*[1,2,-1][move%3],start=performance.now();
    await new Promise(resolve=>{const tick=time=>{const t=Math.min(1,(time-start)/duration),smooth=t*t*(3-2*t);group.quaternion.setFromAxisAngle(axis,target*smooth);this.frameDriver.invalidate();if(t<1)requestAnimationFrame(tick);else resolve();};requestAnimationFrame(tick);});
    this.set(facelets);this.animating=false;
  }
  stats(){const values=this.frames.filter(v=>v<1000).sort((a,b)=>a-b);return {status:this.lost?"lost":document.hidden?"hidden":this.frameDriver.state==="idle"?"idle":"active",submittedFrames:this.submittedFrames,frames:values.length,averageFrameMs:values.length?values.reduce((a,b)=>a+b,0)/values.length:null,medianFrameMs:values[Math.floor(values.length/2)]??null,p95FrameMs:values[Math.floor(values.length*.95)]??null,drawCalls:this.renderer.info.render.calls};}
  dispose(){
    this.frameDriver.dispose();this.resize.disconnect();this.controls.removeEventListener("change",this.onChange);this.controls.dispose();document.removeEventListener("visibilitychange",this.onVisibility);
    this.renderer.domElement.removeEventListener("webglcontextlost",this.onLost);this.renderer.domElement.removeEventListener("webglcontextrestored",this.onRestored);
    const geometries=new Set([this.bodyGeometry,this.stickerGeometry]),materials=new Set([this.bodyMaterial,...this.stickerMaterials]);this.scene.traverse(o=>{if(o.geometry)geometries.add(o.geometry);if(o.material)for(const m of(Array.isArray(o.material)?o.material:[o.material]))materials.add(m);});for(const g of geometries)g.dispose();for(const m of materials)m.dispose();this.renderer.dispose();
  }
}
