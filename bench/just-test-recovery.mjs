import assert from "node:assert/strict";

export function deriveTestRecovery(recipe,failedCommand){
  const lines=recipe.split("\n"),starts=lines.flatMap((line,i)=>line==="test: build"?[i]:[]);assert.equal(starts.length,1,"Expected one test recipe with build dependency");
  const start=starts[0]+1;let end=start;while(end<lines.length&&(!lines[end].trim()||/^\s/.test(lines[end])))end++;
  const body=lines.slice(start,end).filter(line=>line.trim());assert.ok(body.length>0);for(const line of body)assert.match(line,/^    [^-@#\s]/,"Unsupported test command shape");
  const commands=body.map(line=>line.slice(4)),matches=commands.flatMap((line,i)=>line===failedCommand?[i]:[]);assert.equal(matches.length,1,"Failure command must occur exactly once");const at=matches[0],failedLine=lines.indexOf("    "+failedCommand,start)+1;
  return{failedCommand,failedLine,prefix:commands.slice(0,at),remaining:commands.slice(at),source:"recover:\n"+body.slice(at).join("\n")+"\n"};
}
