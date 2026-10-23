import assert from "node:assert/strict";
import {readFileSync,writeFileSync,mkdirSync} from "node:fs";
import {resolve,relative} from "node:path";
import {withArtifactLease} from "../scripts/artifact-lease.mjs";

withArtifactLease();assert.equal(process.argv.length,4);const [mode,target]=process.argv.slice(2);assert.ok(["sources","native"].includes(mode));const directory=resolve(target);assert.ok(directory.startsWith(resolve("build")+"/"));mkdirSync(directory,{recursive:true});
if(mode==="sources"){
  const source=readFileSync("bench/premove-paths.bend","utf8").replace(/^import (\.\.?\/\S+\.bend) as /gm,(_,p)=>{const r=relative(directory,resolve("bench",p));return"import "+(r.startsWith(".")?r:"./"+r)+" as ";}),mutations=[["wrong-side","normalize(List.append(&2, U32, Y.to_global(variant, local), [M.index(move)]))","normalize(M.index(move) <> Y.to_global(variant, local))"],["wrong-frame","inverted(U32.is_ge(variant, 3), C.validate(Y.view((variant % 3 : U32), seeded(seed, cube))))","inverted(False{}, C.validate(Y.view((variant % 3 : U32), seeded(seed, cube))))"],["wrong-modulus","((move % 3 + head % 3 + 2) % 4 : U32)","((move % 3 + head % 3 + 2) % 3 : U32)"]];writeFileSync(resolve(directory,"premove-paths.bend"),source,{flag:"wx"});for(const[name,from,to]of mutations){assert.equal(source.split(from).length,2);writeFileSync(resolve(directory,name+".bend"),source.replace(from,to),{flag:"wx"});}console.log(JSON.stringify({generated:true,mutants:3}));process.exit();
}
const samples=JSON.parse(readFileSync(resolve(directory,"../samples.json"),"utf8"));assert.equal(samples.passed,true);assert.equal(samples.nativeCases,7296);const source=`import Base
import ./premove-paths.bend as E

type BackendCheck is Data:
  BackendCheck{checksum: U32, checks: U32}

def values(path: +List<U32>, sum: U32) -> U32:
  match path:
    case Nil{}: sum
    case Con{value, rest}: values(rest, (sum * 1664525 + value : U32))

def variants(fuel: Nat, +scramble: +List<U32>, +index: U32, sum: U32) -> U32:
  match fuel:
    case 0n: sum
    case 1n+rest:
      +seed = (index / 6 : U32)
      +variant = (index % 6 : U32)
      variants(rest, scramble, (index + 1 : U32), values(seed <> variant <> E.test_case(seed, variant, scramble), sum))

def roots(scrambles: +List<+List<U32>>, sum: U32, checks: U32) -> BackendCheck:
  match scrambles:
    case Nil{}: BackendCheck{sum, checks}
    case Con{scramble, rest}: roots(rest, variants(114n, scramble, 0, sum), (checks + 114 : U32))

def finish(result: BackendCheck) -> IO(Unit):
  match result:
    case BackendCheck{checksum, checks}:
      IO.print("{\\"checks\\":" ++ U32.show(checks) ++ ",\\"checksum\\":" ++ U32.show(checksum) ++ "}")

def main() -> IO(Unit):
  finish(roots(${JSON.stringify(samples.scrambles)}, 0, 0))
`;writeFileSync(resolve(directory,"native-paths.bend"),source,{flag:"wx"});console.log(JSON.stringify({generated:true,nativeCases:samples.nativeCases}));
