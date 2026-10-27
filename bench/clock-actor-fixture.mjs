import {createInterface} from "node:readline";

const input=createInterface({input:process.stdin}),emit=(type,data={})=>process.stdout.write("RUBEND_ACTOR "+JSON.stringify({format:"rubend-node-actor-v1",type,...data})+"\n");let mode,job,timer;
input.on("line",line=>{const m=JSON.parse(line);if(m.type==="init"){mode=m.fixtureMode;if(mode==="no-ready")return;if(mode==="bad-ready")emit("ready",{backend:"wrong"});else emit("ready",{backend:m.backend});}
  else if(m.type==="request"){job=m;if(mode==="no-ready")return;if(mode==="bad-json"){process.stdout.write("RUBEND_ACTOR not-json\n");return;}if(mode==="bad-id"){emit("candidate",{id:m.id+1,moves:[2],optimal:false});return;}if(mode==="fake-proof"){emit("candidate",{id:m.id,moves:[2],optimal:true});return;}if(mode==="bad-moves"){emit("candidate",{id:m.id,moves:[18],optimal:false});return;}if(mode==="crash"){process.exit(7);return;}if(["hang","watchdog","restart"].includes(mode))return;
    const answer=()=>{emit("candidate",{id:m.id,moves:[2],optimal:false,lower:null});if(mode!=="incumbent-timeout")emit("done",{id:m.id,optimal:false});};if(mode==="late")timer=setTimeout(answer,m.budgetMs+40);else if(mode==="split-frame"){const text="RUBEND_ACTOR "+JSON.stringify({format:"rubend-node-actor-v1",type:"candidate",id:m.id,moves:[2],optimal:false})+"\n";process.stdout.write(text.slice(0,-1));timer=setTimeout(()=>{process.stdout.write("\n");emit("done",{id:m.id,optimal:false});},m.budgetMs+40);}else answer();}
  else if(m.type==="cancel"){if(["late","split-frame","watchdog"].includes(mode))return;clearTimeout(timer);emit("cancelled",{id:m.id,restartRequired:mode==="restart"});if(mode==="restart")finish();}
  else finish();});
function finish(){clearTimeout(timer);emit("closed");input.close();process.stdin.destroy();process.stdout.write("",()=>process.exit(0));}
input.on("close",()=>process.exit(0));
