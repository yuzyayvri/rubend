import Base
import ../src/h0-table.bend as B
import ../src/h0-meta.bend as M
import ../src/h0-classes.bend as G
import ../src/h0-edge-table.bend as E
import ../src/joint-cache.bend as Cache
import ../src/h0-table-audit.bend as A
import ./h0-access-probe.bend as P

def saved(data: Array<U32>, maximum: U32, sum: Nat, generation_ms: Nat, audit_ms: Nat, started: Nat) -> IO(Unit):
  do IO<Unit>:
    ended : Nat <- IO.now()
    IO.print("{\"complete\":true,\"audited\":true,\"entries\":117567450,\"maximum\":" ++ U32.show(maximum) ++ ",\"sum\":" ++ Nat.show(sum) ++ ",\"generationMs\":" ++ Nat.show(generation_ms) ++ ",\"auditMs\":" ++ Nat.show(audit_ms) ++ ",\"saveMs\":" ++ Nat.show(Nat.sub(ended, started)) ++ "}")

def audited(state: A.Audit, generation_ms: Nat, started: Nat, path: String) -> IO(Unit):
  match state:
    case A.H0TAAudited{meta, data, maximum, sum}:
      do IO<Unit>:
        +ended : Nat <- IO.now()
        data : Array<U32> <- Cache.save(path, data, 29391863)
        saved(data, maximum, sum, generation_ms, Nat.sub(ended, started), ended)
    case A.H0TAFailed{index, code}: IO.die(Unit, 2, "H0 audit failed " ++ U32.show(index) ++ " code " ++ U32.show(code))
    case _: IO.die(Unit, 2, "H0 audit incomplete")

def full_generated(state: B.Build, +started: Nat, path: String) -> IO(Unit):
  match state:
    case B.H0TComplete{meta, data, +expanded, maximum}:
      do IO<Unit>:
        +ended : Nat <- IO.now()
        IO.print("{\"generated\":true,\"audited\":false,\"expanded\":" ++ U32.show(expanded) ++ ",\"generationMs\":" ++ Nat.show(Nat.sub(ended, started)) ++ "}")
        audited(A.run(117567451n, A.start(B.H0TComplete{meta, data, expanded, maximum})), Nat.sub(ended, started), ended, path)
    case B.H0TFailed{index, code}: IO.die(Unit, 2, "H0 generation failed " ++ U32.show(index) ++ " code " ++ U32.show(code))
    case _: IO.die(Unit, 2, "H0 generation incomplete")

def probed(state: P.Probe, expanded: U32, visited: U32, generation_ms: Nat, started: Nat) -> IO(Unit):
  match state:
    case P.H0Probe{meta, data, seed, checksum, known, reads}:
      do IO<Unit>:
        ended : Nat <- IO.now()
        IO.print("{\"complete\":false,\"audited\":false,\"expanded\":" ++ U32.show(expanded) ++ ",\"visited\":" ++ U32.show(visited) ++ ",\"generationMs\":" ++ Nat.show(generation_ms) ++ ",\"probeMs\":" ++ Nat.show(Nat.sub(ended, started)) ++ ",\"probeNodes\":1000000,\"probeReads\":" ++ U32.show(reads) ++ ",\"knownReads\":" ++ U32.show(known) ++ ",\"checksum\":" ++ U32.show(checksum) ++ "}")

def probe_generated(state: B.Build, started: Nat) -> IO(Unit):
  match state:
    case B.H0TWork{meta, data, queue, head, tail, limit, maximum}:
      do IO<Unit>:
        +ended : Nat <- IO.now()
        probed(P.run(1000000n, P.H0Probe{meta, data, 20261018, 0, 0, 0}), head, tail, Nat.sub(ended, started), ended)
    case _: IO.die(Unit, 2, "Expected an incomplete feasibility prefix")

def result(state: B.Build, initialize_ms: Nat, started: Nat) -> IO(Unit):
  match state:
    case B.H0TFailed{index, code}: IO.die(Unit, 2, "H0 prefix failed " ++ U32.show(index) ++ " code " ++ U32.show(code))
    case B.H0TWork{meta, data, queue, head, tail, limit, maximum}:
      do IO<Unit>:
        ended : Nat <- IO.now()
        IO.print("{\"complete\":false,\"audited\":false,\"expanded\":" ++ U32.show(head) ++ ",\"visited\":" ++ U32.show(tail) ++ ",\"maximum\":" ++ U32.show(maximum) ++ ",\"initializeMs\":" ++ Nat.show(initialize_ms) ++ ",\"workMs\":" ++ Nat.show(Nat.sub(ended, started)) ++ "}")
    case B.H0TComplete{meta, data, expanded, maximum}:
      do IO<Unit>:
        ended : Nat <- IO.now()
        IO.print("{\"complete\":true,\"audited\":false,\"expanded\":" ++ U32.show(expanded) ++ ",\"visited\":117567450,\"maximum\":" ++ U32.show(maximum) ++ ",\"initializeMs\":" ++ Nat.show(initialize_ms) ++ ",\"workMs\":" ++ Nat.show(Nat.sub(ended, started)) ++ "}")

def initialized(state: B.Build, nodes: U32, started: Nat) -> IO(Unit):
  do IO<Unit>:
    +ended : Nat <- IO.now()
    result(B.run(U32.to_nat(nodes), state), Nat.sub(ended, started), ended)

def dispatch(mode: String, meta: M.Audit, nodes: U32) -> IO(Unit):
  match mode:
    case "probe":
      do IO<Unit>:
        started : Nat <- IO.now()
        probe_generated(B.run(U32.to_nat(nodes), B.start(meta)), started)
    case "full":
      do IO<Unit>:
        started : Nat <- IO.now()
        full_generated(B.run(117567451n, B.start(meta)), started, "build/evidence/h0-table-v1.raw")
    case _:
      do IO<Unit>:
        started : Nat <- IO.now()
        initialized(B.start(meta), nodes, started)

def loaded(corners: Array<U32>, edges: Array<U32>, actual: Array<U32>, nodes: U32, mode: String) -> IO(Unit):
  dispatch(mode, M.audit(actual, G.audit(G.ClassComplete{corners, 3393, 153090}), E.audit(edges)), nodes)

def run(corner_path: String, edge_path: String, meta_path: String, nodes: U32, mode: String) -> IO(Unit):
  do IO<Unit>:
    corners : Array<U32> <- Cache.load_words(corner_path, [4294967295 : U32^20n], 0, 1048576)
    edges : Array<U32> <- Cache.load_words(edge_path, [4294967295 : U32^22n], 0, 4194304)
    actual : Array<U32> <- Cache.load_words(meta_path, [4294967295 : U32^22n], 0, 2892000)
    loaded(corners, edges, actual, nodes, mode)

def parsed(value: Maybe<&2, U32>, corner_path: String, edge_path: String, meta_path: String, mode: String) -> IO(Unit):
  match value:
    case Some{nodes}: run(corner_path, edge_path, meta_path, nodes, mode)
    case None{}: IO.die(Unit, 2, "Invalid node budget")

def args(values: List<String>) -> IO(Unit):
  match values:
    case Con{program, Con{corner_path, Con{edge_path, Con{meta_path, Con{nodes, Nil{}}}}}}: parsed(U32.read(nodes), corner_path, edge_path, meta_path, "prefix")
    case Con{program, Con{corner_path, Con{edge_path, Con{meta_path, Con{nodes, Con{mode, Nil{}}}}}}}: parsed(U32.read(nodes), corner_path, edge_path, meta_path, mode)
    case _: IO.die(Unit, 2, "Expected class, edge, metadata paths and node budget")

def main() -> IO(Unit):
  do IO<Unit>:
    values : List<String> <- IO.args()
    args(values)
