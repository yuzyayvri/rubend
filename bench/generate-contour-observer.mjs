import assert from "node:assert/strict";
import {readFileSync,writeFileSync,mkdirSync} from "node:fs";
import {resolve,relative} from "node:path";
import {withArtifactLease} from "../scripts/artifact-lease.mjs";

withArtifactLease();assert.equal(process.argv.length,3);const directory=resolve(process.argv[2]);assert.ok(directory.startsWith(resolve("build")+"/"));mkdirSync(directory,{recursive:true});
const importPath=p=>{const r=relative(directory,resolve(p));return r.startsWith(".")?r:"./"+r;};
let source=readFileSync("bench/fixed-work.bend","utf8").replace(/^import (\.\.?\/\S+\.bend) as /gm,(_,p)=>"import "+importPath(resolve("bench",p))+" as ");source=source.replace("import Base\n","import Base\nimport "+importPath("bench/portfolio-observer.bend")+" as O\n");
const events=`def emit_events(events: +List<O.ContourEvent>, +id: String, +slice: U32) -> IO(Unit):
  match events:
    case Nil{}: IO.pure(Unit, Unit{})
    case Con{O.ContourEvent{axis, before, after}, rest}:
      do IO<Unit>:
        IO.print("{\\"type\\":\\"contour\\",\\"id\\":\\"" ++ id ++ "\\",\\"slice\\":" ++ U32.show(slice) ++ ",\\"axis\\":" ++ U32.show(axis) ++ ",\\"before\\":" ++ meta(before) ++ ",\\"after\\":" ++ meta(after) ++ "}")
        emit_events(rest, id, slice)

`;
assert.equal(source.split("def snapshots(").length,2);source=source.replace("def snapshots(",events+"def snapshots(");
const original=`    case 1n+p P.Session{table, +entries, +root, +best, +length, +lower, +nodes, +request, +status}:
      do IO<Array<U32>>:
        snapshot(id, original, initial_request, slice, entries, root, best, length, lower, nodes, request, status)
        snapshots(p, id, original, initial_request, (slice + 1 : U32), P.advance(P.Session{table, entries, root, best, length, lower, nodes, request, status}))`;
assert.equal(source.split(original).length,2);source=source.replace(original,`    case 1n+p Tuple{P.Session{table, +entries, +root, +best, +length, +lower, +nodes, +request, +status}, events}:
      do IO<Array<U32>>:
        emit_events(events, id, slice)
        snapshot(id, original, initial_request, slice, entries, root, best, length, lower, nodes, request, status)
        snapshots(p, id, original, initial_request, (slice + 1 : U32), O.advance(P.Session{table, entries, root, best, length, lower, nodes, request, status}))`);
source=source.replace("state: P.Session) -> IO(Array<U32>):","state: P.Session & +List<O.ContourEvent>) -> IO(Array<U32>):").replace("case 0n P.Session{table, entries, root, best, length, lower, nodes, request, status}:\n      do IO<Array<U32>>:","case 0n Tuple{P.Session{table, entries, root, best, length, lower, nodes, request, status}, events}:\n      do IO<Array<U32>>:\n        emit_events(events, id, slice)");
const initial="P.initialize(table, original, root, P.request_mode(U32.is_eq(request, 2)), profile)";assert.equal(source.split(initial).length,2);source=source.replace(initial,"("+initial+", Nil{})");
const anchor='S.raw_profile(String.eq(tier, "raw"))';assert.equal(source.split(anchor).length,2);source=source.replace(anchor,'selected_profile(String.eq(tier, "raw"))').replace("def start(args:","def selected_profile(raw: Bool) -> S.Profile:\n  match raw:\n    case True{}: S.RawInverseThree{}\n    case False{}: S.Light{}\n\ndef start(args:");
writeFileSync(resolve(directory,"contour-observer.bend"),source,{flag:"wx"});console.log(JSON.stringify({generated:true,directory,productionChanged:false}));
