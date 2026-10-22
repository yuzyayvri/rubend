import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {notationScroll} from "../apps/web/notation-rail.mjs";
await import("./ui-markup.mjs");

const css=readFileSync("apps/web/style.css","utf8"),html=readFileSync("apps/web/index.html","utf8"),main=readFileSync("apps/web/main.mjs","utf8");
for(const text of["A LITTLE CHAOS","Every turn has a way home","Find the way home","Time well spent","One turn closer"]){assert.equal((html+main).includes(text),false,"Obsolete marketing copy: "+text);}
for(const region of["specimen","console","sequence"])assert.ok(html.includes('class="'+region+'"'));
function palette(pattern){const values={};for(const m of css.matchAll(pattern))for(const c of m[1].matchAll(/--([a-z-]+):\s*(#[a-f0-9]{6})/gi))values[c[1]]=c[2];return values;}
const light=palette(/:root\{([^}]+)\}/g),dark={...light,...palette(/html\[data-theme=dark\]\{([^}]+)\}/g)};
function luminance(hex){const channels=[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4);return channels[0]*.2126+channels[1]*.7152+channels[2]*.0722;}
const ratios=[];for(const [theme,p]of Object.entries({light,dark}))for(const [foreground,background]of[["ink","paper"],["muted","paper"],["on-accent","accent"]]){const values=[luminance(p[foreground]),luminance(p[background])].sort((a,b)=>a-b),ratio=(values[1]+.05)/(values[0]+.05);assert.ok(ratio>=4.5,theme+" "+foreground+"/"+background+" contrast is "+ratio);ratios.push({theme,foreground,background,ratio});}
assert.ok(main.includes('localStorage.getItem("rubend-theme")??"light"'));assert.ok(html.includes('aria-valuetext="2 seconds"'));assert.ok(main.includes('setAttribute("aria-valuetext"'));
for(const [args,expected]of[[[0,0,52,343],0],[[100,120,52,343],100],[[100,40,52,343],40],[[0,988,52,343],697],[[697,1,52,343],1],[[0,52,52,52],52]])assert.equal(notationScroll(...args),expected);
console.log(JSON.stringify({passed:true,themeContrastPairs:ratios,obsoleteCopyAbsent:true,controllerContract:true,scope:"Static checks, not a complete accessibility audit"}));
