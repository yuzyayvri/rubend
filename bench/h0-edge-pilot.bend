import Base
import ../src/h0-edge-table.bend as G
import ../src/h0-edges.bend as E
import ../src/joint-cache.bend as Cache

def audited(state: G.Audit, path: String, generated: Nat, started: Nat) -> IO(Unit):
  match state:
    case G.E0Failed{index, code}: IO.die(Unit, 2, "H0 edge audit failed " ++ U32.show(index) ++ " code " ++ U32.show(code))
    case G.E0Audited{table}:
      do IO<Unit>:
        ended : Nat <- IO.now()
        IO.print("{\"placements\":34650,\"moves\":623700,\"symmetries\":1663200,\"commutations\":29937600,\"goal\":" ++ U32.show(E.index(E.goal())) ++ ",\"generationMs\":" ++ Nat.show(generated) ++ ",\"auditMs\":" ++ Nat.show(Nat.sub(ended, started)) ++ "}")
        table : Array<U32> <- Cache.save(path, table, 4194304)
        IO.pure(Unit, Unit{})
    case _: IO.die(Unit, 2, "Incomplete H0 edge audit")

def generated(table: Array<U32>, path: String, started: Nat) -> IO(Unit):
  do IO<Unit>:
    +ended : Nat <- IO.now()
    audited(G.audit(table), path, Nat.sub(ended, started), ended)

def run(path: String) -> IO(Unit):
  do IO<Unit>:
    started : Nat <- IO.now()
    generated(G.generate(), path, started)

def args(values: List<String>) -> IO(Unit):
  match values:
    case Con{program, Con{path, Nil{}}}: run(path)
    case _: IO.die(Unit, 2, "Expected a fresh edge output path")

def main() -> IO(Unit):
  do IO<Unit>:
    values : List<String> <- IO.args()
    args(values)
