const deniedClipboard=async()=>{throw Error("Deliberate clipboard denial");};
Object.defineProperty(navigator,"clipboard",{configurable:true,value:{writeText:deniedClipboard}});
if(rubendTestFallback){
  const original=HTMLCanvasElement.prototype.getContext;
  HTMLCanvasElement.prototype.getContext=function(kind,...args){return /webgl/i.test(kind)?null:original.call(this,kind,...args);};
}
document.addEventListener("DOMContentLoaded",()=>{
  const status=document.createElement("output");status.id="rubend-test-clipboard-status";status.hidden=true;document.body.append(status);const sample=()=>{status.textContent=JSON.stringify({fixtureMethodIntact:navigator.clipboard.writeText===deniedClipboard});};sample();setInterval(sample,100);
  if(rubendTestFallback)return;
  const canvas=document.querySelector("#canvas-host canvas"),extension=canvas?.getContext("webgl2")?.getExtension("WEBGL_lose_context");
  const group=document.createElement("aside");group.setAttribute("aria-label","Acceptance test controls");
  for(const [id,label,action]of[["rubend-test-lose-context","Lose renderer context",()=>extension.loseContext()],["rubend-test-restore-context","Restore renderer context",()=>extension.restoreContext()]]){
    const button=document.createElement("button");button.id=id;button.type="button";button.textContent=label;button.disabled=!extension;button.onclick=action;group.append(button);
  }
  document.body.append(group);
},{once:true});
