const output=document.createElement("output");output.id="rubend-test-diagnostics";output.hidden=true;document.body.append(output);
let ticks=0;
function sample(){output.textContent=JSON.stringify({format:"rubend-dom-diagnostics-v1",ticks:++ticks,visibility:document.visibilityState,observedAt:Date.now(),diagnostics:typeof window.rubendDiagnostics==="function"?window.rubendDiagnostics():null});}
sample();setInterval(sample,100);
new MutationObserver(changes=>{if(changes.some(change=>change.target!==output&&!output.contains(change.target)))sample();}).observe(document.body,{childList:true,subtree:true,attributes:true,characterData:true});
