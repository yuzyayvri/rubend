import assert from "node:assert/strict";
import {readFileSync,writeFileSync,mkdirSync} from "node:fs";
import {resolve} from "node:path";
import {createHash} from "node:crypto";
import {withArtifactLease} from "../scripts/artifact-lease.mjs";

withArtifactLease();assert.equal(process.argv.length,3);const directory=resolve(process.argv[2]);assert.ok(directory.startsWith(resolve("build")+"/"));mkdirSync(directory,{recursive:true});const hash=p=>createHash("sha256").update(readFileSync(p)).digest("hex"),manifest=JSON.parse(readFileSync("bench/piece-cells.manifest.json","utf8"));for(const[p,h]of Object.entries(manifest.sourceHashes))assert.equal(hash(p),h);const names=[..."URFDLB"].flatMap(f=>[f,f+"2",f+"i"]),maps=manifest.kinds[1].maps.map(ms=>{const out=Array(12);ms.forEach((m,target)=>{assert.equal(out[m.source],undefined);out[m.source]={position:target,flip:m.rotations};});assert.ok(out.every(Boolean));return out;}),lines=["import Base","import "+resolve("src/model.bend")+" as M","import "+resolve("src/cubie.bend")+" as C","import "+resolve("bench/edge-pattern-coordinate.bend")+" as P",""];
for(const [name,field]of [["position","position"],["flip","flip"]])lines.push("def move_"+name+"(move: M.Move, position: U32) -> U32:","  match move position:",...maps.flatMap((ms,m)=>ms.map((v,p)=>"    case M."+names[m]+"{} "+p+": "+v[field])),"    case _ _: 0","");
lines.push(`def moved_positions(+move: M.Move, positions: +List<U32>) -> +List<U32>:
  match positions:
    case Nil{}: Nil{}
    case Con{head, rest}: move_position(move, head) <> moved_positions(move, rest)

def moved_orientations(+move: M.Move, positions: +List<U32>, +old: U32, +index: U32, acc: U32) -> U32:
  match positions:
    case Nil{}: acc
    case Con{head, rest}:
      moved_orientations(move, rest, old, (index + 1 : U32), (acc .|. ((C.bit(old, index) .^. move_flip(move, head) : U32) << U32.to_nat(index) : U32) : U32))

def turn(+move: M.Move, part: P.Part) -> P.Part:
  match part:
    case P.Part{+positions, orientations}: P.Part{moved_positions(move, positions), moved_orientations(move, positions, orientations, 0, 0)}

def project_positions(labels: +List<U32>, +ep: U32, +eh: U32) -> +List<U32>:
  match labels:
    case Nil{}: Nil{}
    case Con{head, rest}: C.edge_position(ep, eh, head) <> project_positions(rest, ep, eh)

def project_orientations(positions: +List<U32>, +eo: U32, +index: U32, acc: U32) -> U32:
  match positions:
    case Nil{}: acc
    case Con{head, rest}: project_orientations(rest, eo, (index + 1 : U32), (acc .|. (C.bit(eo, head) << U32.to_nat(index) : U32) : U32))

def projected(labels: +List<U32>, +ep: U32, +eh: U32, +eo: U32) -> P.Part:
  +positions = project_positions(labels, ep, eh)
  P.Part{positions, project_orientations(positions, eo, 0, 0)}

def report_part(+part: P.Part) -> +List<U32>:
  match part:
    case P.Part{+positions, orientations}: P.encode(part) <> orientations <> positions

def report(value: Maybe<&2, P.Part>) -> +List<U32>:
  match value:
    case None{}: Nil{}
    case Some{part}: report_part(part)

def next_rank(move: M.Move, value: Maybe<&2, P.Part>) -> U32:
  match value:
    case None{}: 4294967295
    case Some{part}: P.encode(turn(move, part))

def test_codec(count: U32, rank: U32) -> +List<U32>:
  report(P.decode(count, rank))

def test_next(count: U32, rank: U32, move: U32) -> U32:
  next_rank(M.from_index(move), P.decode(count, rank))

def test_project(labels: +List<U32>, ep: U32, eh: U32, eo: U32) -> U32:
  P.encode(projected(labels, ep, eh, eo))

def test_action(+move: U32, +position: U32) -> +List<U32>:
  [move_position(M.from_index(move), position), move_flip(M.from_index(move), position)]

def test_size(count: U32) -> U32:
  P.cardinality(count)
`);
const source=lines.join("\n"),path=resolve(directory,"edge-pattern.bend");writeFileSync(path,source,{flag:"wx"});writeFileSync(resolve(directory,"manifest.json"),JSON.stringify({format:"rubend-edge-pattern-preflight-v1",sourceHashes:Object.fromEntries(["src/model.bend","src/cubie.bend","bench/piece-cells.manifest.json","bench/edge-pattern-coordinate.bend"].map(p=>[p,hash(p)])),moves:18,positions:12,patterns:[[0,2,4,6,8,10],[1,3,5,7,9,11]],cardinalities:[24,528,10560,190080,3041280,42577920],outputSha256:hash(path),pdbGenerated:false,productionIntegrated:false,np05Proved:false,performanceClaim:false},null,2)+"\n",{flag:"wx"});console.log(JSON.stringify({generated:true,path,bytes:source.length,largeTableBuild:false}));
