import assert from "node:assert/strict";

export function vcubeSmallVariants(source){
  assert.equal(typeof source,"string");const notice="/* Modified for Rubend comparison on 2026-10-26: enable upstream 104 and 108 variants; search logic and supplied bases are unchanged. */\n",changes=[['\t//solver_variant::S<nx::EP1, nx::EO4,   7>(104),','\tsolver_variant::S<nx::EP1, nx::EO4,   7>(104),'],['\t//solver_variant::S<nx::EP1, nx::EO8,   8>(108),','\tsolver_variant::S<nx::EP1, nx::EO8,   8>(108),']];
  assert.ok(source.startsWith("/* This file is part of vcube.\n"));assert.equal(source.includes(notice),false);let generated=source;for(const[before,after]of changes){assert.equal(generated.split(before).length,2,"Upstream variant declaration changed");generated=generated.replace(before,after);}return{source:notice+generated,notice,changes,coordinates:[{id:104,base:7,tableBytes:20336640},{id:108,base:8,tableBytes:325386240}],searchLogicModified:false};
}
