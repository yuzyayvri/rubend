import assert from "node:assert/strict";
import {readFileSync,writeFileSync,mkdirSync,existsSync} from "node:fs";
import {resolve,dirname} from "node:path";
import {createHash} from "node:crypto";
import {sourceSnapshotPath} from "./source-snapshot.mjs";

assert.equal(process.argv.length,4,"Expected frozen-build.json fresh-probe-directory");
const metadata=JSON.parse(readFileSync(process.argv[2],"utf8")),directory=resolve(process.argv[3]),snapshot=sourceSnapshotPath(metadata),hash=x=>createHash("sha256").update(x).digest("hex");
assert.equal(metadata.entry,"bench/advanced-main.bend");assert.ok(directory.startsWith(resolve("build/experiments")+"/"));assert.equal(existsSync(directory),false);
const sources={};
for(const [name,expected]of Object.entries(metadata.sourceHashes)){const bytes=readFileSync(resolve(snapshot,name));assert.equal(hash(bytes),expected);sources[name]=bytes;}
const original=sources["src/main.bend"].toString("utf8"),start=original.indexOf("def choose_controlled("),end=original.indexOf("def solve_controlled(");
assert.ok(start>0&&end>start);assert.ok(original.slice(start,end).includes("choose_controlled(cancelled, table"));
const service=`def advance_unless(cancelled: Bool, state: P.Session) -> P.Session:
  match cancelled:
    case True{}: state
    case False{}: P.advance(state)

def service_controlled(fuel: Nat, active: Bool, cancelled: Bool, state: P.Session, +original: M.Cube, +started: Nat, +budget: Nat, previous: U32, +profile: S.Profile, +control: Control.Context, +pulse: U32) -> IO(Array<U32>):
  match fuel active cancelled state:
    case _ _ _ P.Session{table, tasks, root, best, length, lower, nodes, request, S.InvalidTransform{}}:
      IO.die(Array<U32>, 2, "Transformed cube failed validation")
    case _ _ _ P.Session{table, tasks, root, best, length, lower, nodes, request, S.ProfileMismatch{}}:
      IO.die(Array<U32>, 2, "Lookup profile does not match loaded storage")
    case _ _ True{} P.Session{table, tasks, root, best, length, lower, nodes, request, status}:
      do IO<Array<U32>>:
        IO.print("{\\"type\\":\\"cancelled\\"" ++ Control.tag(control) ++ "}")
        return table
    case 1n+p True{} False{} P.Session{table, tasks, root, +best, +length, +lower, +nodes, request, +status}:
      do IO<Array<U32>>:
        emit_for(U32.is_lt(length, previous) || S.is_optimal(status), original, best, length, lower, nodes, S.is_optimal(status), Control.tag(control))
        +now : Nat <- IO.now()
        IO.print("{\\"type\\":\\"progress\\",\\"nodes\\":" ++ U32.show(nodes) ++ ",\\"lower\\":" ++ U32.show(lower) ++ Control.tag(control) ++ "}")
        +cancelled : Bool <- Control.checkpoint(pulse, control)
        service_controlled(p, Nat.is_lt(now, Nat.add(started, budget)) && S.is_running(status), cancelled, advance_unless(cancelled, P.Session{table, tasks, root, best, length, lower, nodes, request, status}), original, started, budget, length, profile, control, ((pulse + 1) .&. 7 : U32))
    case _ _ _ P.Session{table, tasks, root, best, +length, +lower, +nodes, request, +status}:
      do IO<Array<U32>>:
        emit_for(U32.is_lt(length, previous) || S.is_optimal(status), original, best, length, lower, nodes, S.is_optimal(status), Control.tag(control))
        IO.print("{\\"type\\":\\"done\\",\\"length\\":" ++ U32.show(length) ++ ",\\"lower\\":" ++ U32.show(lower) ++ ",\\"nodes\\":" ++ U32.show(nodes) ++ ",\\"optimal\\":" ++ U32.show(C.pick(S.is_optimal(status), 1, 0)) ++ Control.tag(control) ++ "}")
        return table

`;
let transformed=original.slice(0,start)+service+original.slice(end);
const initializer="service_controlled(U32.to_nat(C.pick(P.is_fast(request), 180000, 60000)), True{}, P.initialize(";
assert.equal(transformed.split(initializer).length,2);transformed=transformed.replace(initializer,initializer.replace("True{}, P.initialize(","True{}, False{}, P.initialize("));
sources["src/main.bend"]=Buffer.from(transformed);
for(const [name,bytes]of Object.entries(sources)){const target=resolve(directory,name);mkdirSync(dirname(target),{recursive:true});writeFileSync(target,bytes,{flag:"wx"});}
const record={format:"rubend-control-tail-probe-v1",sourceBuild:metadata,originalMainSha256:hash(original),changedMainSha256:hash(transformed),entry:resolve(directory,metadata.entry),hypothesis:"Pass cancellation into the tail state and conditionally advance the intact affine session without a higher-order table continuation",claim:"Throwaway compiler probe. Not a verified runtime or promotion."};
writeFileSync(resolve(directory,"probe.json"),JSON.stringify(record,null,2)+"\n",{flag:"wx"});console.log(JSON.stringify(record));
