import assert from "node:assert/strict";
import {readFileSync,writeFileSync,mkdirSync} from "node:fs";
import {resolve,relative,dirname} from "node:path";
import {withArtifactLease} from "../scripts/artifact-lease.mjs";

withArtifactLease();assert.equal(process.argv.length,3);const directory=resolve(process.argv[2]);assert.ok(directory.startsWith(resolve("build")+"/"));mkdirSync(directory,{recursive:true});const spec=JSON.parse(readFileSync("bench/roadmap-native-spec.json","utf8"));assert.equal(spec.format,"rubend-roadmap-native-spec-v1");const relocate=(source,base)=>source.replace(/^import (\S+\.bend) as /gm,(_,p)=>{const path=p.startsWith("/")?p:resolve(base,p),name=relative(directory,path);return"import "+(name.startsWith(".")?name:"./"+name)+" as ";});
assert.ok(Number.isInteger(spec.edge.iterations)&&spec.edge.iterations>=100000&&spec.edge.iterations<=1000000);assert.ok(Number.isInteger(spec.edge.cycles)&&spec.edge.cycles>=5&&spec.edge.cycles<=7);assert.equal(spec.edge.profileCycles,1);
const original=resolve("build/experiments/u03-edge-pattern-v1/generated/edge-pattern.bend");writeFileSync(resolve(directory,"edge-pattern.bend"),relocate(readFileSync(original,"utf8"),dirname(original)),{flag:"wx"});
const common=`import Base
import ./edge-pattern.bend as E

type WorkSample is Data:
  WorkSample{checksum: U32, steps: U32}

def work(fuel: Nat, +count: U32, +size: U32, +rank: U32, +step: U32, checksum: U32) -> WorkSample:
  match fuel:
    case 0n: WorkSample{checksum, step}
    case 1n+rest:
      +next = E.test_next(count, rank, (step % 18 : U32))
      +sum = (checksum * 1664525 + next : U32)
      work(rest, count, size, ((rank * 1664525 + sum + 1013904223 : U32) % size : U32), (step + 1 : U32), sum)

def finish(result: WorkSample, +cohort: U32, +count: U32, started: Nat) -> IO(Unit):
  match result:
    case WorkSample{checksum, steps}:
      do IO<Unit>:
        ended : Nat <- IO.now()
        IO.print("{\\"cohort\\":" ++ U32.show(cohort) ++ ",\\"count\\":" ++ U32.show(count) ++ ",\\"steps\\":" ++ U32.show(steps) ++ ",\\"checksum\\":" ++ U32.show(checksum) ++ ",\\"nativeMs\\":" ++ Nat.show(Nat.sub(ended, started)) ++ "}")

def counts(fuel: Nat, +count: U32, +cohort: U32) -> IO(Unit):
  match fuel:
    case 0n: IO.pure(Unit, Unit{})
    case 1n+rest:
      do IO<Unit>:
        started : Nat <- IO.now()
        finish(work(${spec.edge.iterations}n, count, E.test_size(count), 0, 0, 0), cohort, count, started)
        counts(rest, (count + 1 : U32), cohort)

def cohorts(fuel: Nat, +cohort: U32) -> IO(Unit):
  match fuel:
    case 0n: IO.pure(Unit, Unit{})
    case 1n+rest:
      do IO<Unit>:
        counts(6n, 1, cohort)
        cohorts(rest, (cohort + 1 : U32))

`;
for(const [name,repeats]of[["edge-native",spec.edge.cycles],["edge-profile",spec.edge.profileCycles]])writeFileSync(resolve(directory,name+".bend"),common+"def main() -> IO(Unit):\n  cohorts("+repeats+"n, 0)\n",{flag:"wx"});
let fixed=relocate(readFileSync("bench/fixed-work.bend","utf8"),resolve("bench"));const anchor='S.raw_profile(String.eq(tier, "raw"))';assert.equal(fixed.split(anchor).length,2);fixed=fixed.replace(anchor,'selected_profile(String.eq(tier, "raw"))');assert.equal(fixed.split("def start(args:").length,2);fixed=fixed.replace("def start(args:","def selected_profile(raw: Bool) -> S.Profile:\n  match raw:\n    case True{}: S.RawInverseThree{}\n    case False{}: S.Light{}\n\ndef start(args:");writeFileSync(resolve(directory,"ordering-control.bend"),fixed,{flag:"wx"});console.log(JSON.stringify({generated:true,directory,nativeIterations:100000,cohorts:5,orderingProfile:"RawInverseThree",productionChanged:false}));
