const initialClipboardWrite=navigator.clipboard?.writeText;
document.addEventListener("DOMContentLoaded",async()=>{
  const output=document.createElement("output");output.id="rubend-test-clipboard-policy";output.hidden=true;document.body.append(output);
  let permission="unavailable";try{permission=(await navigator.permissions.query({name:"clipboard-write"})).state;}catch{}
  const sample=()=>{const policy=document.permissionsPolicy??document.featurePolicy;output.textContent=JSON.stringify({format:"rubend-observed-clipboard-policy-v1",observedAt:Date.now(),secure:isSecureContext,policyAllowed:policy?.allowsFeature("clipboard-write")??null,permission,clipboardWriteUnchanged:navigator.clipboard?.writeText===initialClipboardWrite});};sample();document.addEventListener("click",sample);setInterval(sample,100);
},{once:true});
