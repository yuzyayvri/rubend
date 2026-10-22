import assert from "node:assert/strict";
import {readFileSync} from "node:fs";

const path=process.argv[2]??"apps/web/index.html",html=readFileSync(path,"utf8"),main=readFileSync("apps/web/main.mjs","utf8"),ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);assert.equal(ids.length,new Set(ids).size,"Duplicate UI ids");
for(const m of main.matchAll(/\$\("([^"]+)"\)/g))assert.ok(ids.includes(m[1]),"Missing controller target "+m[1]);
for(const id of["stage","canvas-host","edit-dialog","guide-dialog","export-dialog"])assert.ok(ids.includes(id));
assert.match(html,/<html lang="en">/);assert.match(html,/name="viewport"/);for(const id of["timeline","budget"])assert.match(html,new RegExp('id="'+id+'"[^>]*aria-label='));
console.log(JSON.stringify({passed:true,path,uniqueIds:ids.length,controllerTargetsPresent:true}));
