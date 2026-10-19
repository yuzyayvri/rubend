import assert from "node:assert/strict";
import {readFileSync,writeFileSync,mkdirSync,existsSync} from "node:fs";
import {resolve} from "node:path";
import {createHash} from "node:crypto";
import {spawnSync} from "node:child_process";

assert.equal(process.argv.length,3,"Expected fresh probe directory");
const directory=resolve(process.argv[2]),hash=bytes=>createHash("sha256").update(bytes).digest("hex");
assert.ok(directory.startsWith(resolve("build/experiments")+"/"));assert.equal(existsSync(directory),false);mkdirSync(directory);
const read=`def emit(read: Array<U32> & U32) -> IO(Unit):
  match read:
    case Tuple{table, value}: IO.print(U32.show(value))

`;
const cases={
  plain:`    emit(Array.get(U32, [7 : U32*8n], 0))\n`,
  affine:`    channel : Chan(U32) <- Chan.new(U32, 1)\n    Chan.close(U32, channel)\n    emit(Array.get(U32, [7 : U32*8n], 0))\n`,
  reused:`    +channel : Chan(U32) <- Chan.new(U32, 1)\n    sent : Result<&1, &1, U32, Unit> <- Chan.send(U32, channel, 1)\n    Chan.close(U32, channel)\n    emit(Array.get(U32, [7 : U32*8n], 0))\n`
};
const rows=[];
for(const [name,body]of Object.entries(cases)){
  const source="import Base\n\n"+read+"def main() -> IO(Unit):\n  do IO<Unit>:\n"+body,entry=resolve(directory,name+".bend"),c=resolve(directory,name+".c"),binary=resolve(directory,name);
  writeFileSync(entry,source,{flag:"wx"});
  for(const output of[c,binary]){const result=spawnSync("bend",[entry,"-o",output],{encoding:"utf8",timeout:60000,maxBuffer:1048576});assert.equal(result.status,0,result.stdout+result.stderr);}
  const text=readFileSync(c,"utf8"),match=text.match(/^#define BLK_SHR ([01])$/m);assert.ok(match);
  const execution=spawnSync(binary,["--threads","1"],{encoding:"utf8",timeout:10000});assert.equal(execution.status,0,execution.stderr);assert.equal(execution.stdout.trim(),"7");
  rows.push({name,sourceSha256:hash(source),cSha256:hash(text),binarySha256:hash(readFileSync(binary)),sharedArrayMode:Number(match[1]),nativeOutput:execution.stdout.trim()});
}
const record={format:"rubend-channel-array-probe-v1",rows,claim:"Minimal compiler diagnosis only. Each native program prints7. No solver timing or promotion is inferred."};
writeFileSync(resolve(directory,"result.json"),JSON.stringify(record,null,2)+"\n",{flag:"wx"});console.log(JSON.stringify(record));
