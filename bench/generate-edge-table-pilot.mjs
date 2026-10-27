import assert from "node:assert/strict";
import {readFileSync,writeFileSync,mkdirSync} from "node:fs";
import {resolve,relative,dirname} from "node:path";
import {withArtifactLease} from "../scripts/artifact-lease.mjs";

withArtifactLease();assert.equal(process.argv.length,3);const directory=resolve(process.argv[2]);assert.ok(directory.startsWith(resolve("build")+"/"));mkdirSync(directory,{recursive:true});const old=resolve("build/experiments/u03-edge-pattern-v1/generated/edge-pattern.bend"),guard=JSON.parse(readFileSync("build/experiments/u03-edge-pattern-v1/guard.json","utf8")),ref=JSON.parse(readFileSync("build/experiments/u03-edge-pattern-v1/samples.json","utf8"));assert.equal(guard.passed,true);assert.equal(ref.passed,true);
const path=p=>{const s=relative(directory,p);return s.startsWith(".")?s:"./"+s;};writeFileSync(resolve(directory,"edge-pattern.bend"),readFileSync(old,"utf8").replace(/^import (\S+\.bend) as /gm,(_,p)=>"import "+path(p.startsWith("/")?p:resolve(dirname(old),p))+" as "),{flag:"wx"});
const text=`import Base
import ./edge-pattern.bend as E
import ${path(resolve("bench/edge-pattern-table.bend"))} as T

def texts(values: +List<U32>) -> +List<String>:
  match values:
    case Nil{}: Nil{}
    case Con{value, rest}: U32.show(value) <> texts(rest)

def print_values(result: Array<U32> & +List<U32>, prefix: String) -> IO(Unit):
  match result:
    case Tuple{array, values}:
      IO.print(prefix ++ ",\\"values\\":[" ++ String.join(texts(values), ",") ++ "]}")

def finish_cells(cells: T.Cells, pattern: U32, +k: U32, goal: U32, mode: String, depth: U32, complete: U32, started: Nat) -> IO(Unit):
  match cells:
    case T.Cells{array, reached, expanded, bad}:
      do IO<Unit>:
        ended : Nat <- IO.now()
        print_values(T.values(U32.to_nat(E.test_size(k)), 0, (array, Nil{})), "{\\"mode\\":\\"" ++ mode ++ "\\",\\"pattern\\":" ++ U32.show(pattern) ++ ",\\"count\\":" ++ U32.show(k) ++ ",\\"goal\\":" ++ U32.show(goal) ++ ",\\"complete\\":" ++ U32.show(complete) ++ ",\\"depth\\":" ++ U32.show(depth) ++ ",\\"reached\\":" ++ U32.show(reached) ++ ",\\"expanded\\":" ++ U32.show(expanded) ++ ",\\"bad\\":" ++ U32.show(bad) ++ ",\\"nativeMs\\":" ++ Nat.show(Nat.sub(ended, started)))

def finish(result: T.Build, pattern: U32, k: U32, goal: U32, mode: String, started: Nat) -> IO(Unit):
  match result:
    case T.Active{cells, depth}: finish_cells(cells, pattern, k, goal, mode, depth, 0, started)
    case T.Finished{cells, depth, True{}}: finish_cells(cells, pattern, k, goal, mode, depth, 1, started)
    case T.Finished{cells, depth, False{}}: finish_cells(cells, pattern, k, goal, mode, depth, 0, started)

def bad_next(k: U32, index: U32, move: U32) -> U32:
  E.test_size(k)

def build(~next: U32 -> U32 -> U32 -> U32, fuel: Nat, +pilot: T.Pilot, pattern: U32, +goal: U32, mode: String) -> IO(Unit):
  do IO<Unit>:
    started : Nat <- IO.now()
    finish(T.run(~next, fuel, T.count(pilot), E.test_size(T.count(pilot)), T.initial(pilot, goal)), pattern, T.count(pilot), goal, mode, started)

def main() -> IO(Unit):
  do IO<Unit>:
`;
const calls=[];for(let pattern=0;pattern<2;pattern++)for(let k=1;k<=3;k++)calls.push(`    build(~E.test_next, 32n, T.${["One","Two","Three"][k-1]}{}, ${pattern}, ${ref.goals[pattern][k-1]}, "valid")`);calls.push('    build(~E.test_next, 1n, T.Three{}, 0, '+ref.goals[0][2]+', "partial")','    build(~E.test_next, 32n, T.Three{}, 0, 10560, "invalid-goal")','    build(~bad_next, 32n, T.Three{}, 0, '+ref.goals[0][2]+', "invalid-transition")');writeFileSync(resolve(directory,"edge-table-pilot.bend"),text+calls.join("\n")+"\n",{flag:"wx"});console.log(JSON.stringify({generated:true,directory,maximumEdges:3,fullDatabaseBuild:false}));
