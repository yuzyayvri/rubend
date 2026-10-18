import Base
import ../src/h0-classes.bend as G
import ../src/h0-distances.bend as D
import ../src/joint-cache.bend as Cache

def saved(state: Array<U32> & Array<U32>, path: String) -> IO(Unit):
  match state:
    case Tuple{moves, table}:
      do IO<Unit>:
        table : Array<U32> <- Cache.save(path, table, 1048576)
        IO.pure(Unit, Unit{})

def audited(state: D.Audit, path: String, started: Nat) -> IO(Unit):
  match state:
    case D.H0DAuditFailed{index, code}: IO.die(Unit, 2, "H0 distance audit failed " ++ U32.show(index) ++ " code " ++ U32.show(code))
    case D.H0DAudited{moves, table, maximum, sum}:
      do IO<Unit>:
        ended : Nat <- IO.now()
        IO.print("{\"rawStates\":153090,\"classes\":3393,\"rawEdgesAudited\":2755620,\"maximum\":" ++ U32.show(maximum) ++ ",\"distanceSum\":" ++ U32.show(sum) ++ ",\"workMs\":" ++ Nat.show(Nat.sub(ended, started)) ++ ",\"rawClassDistancesEqual\":true}")
        saved(D.copy_moves(40626n, (moves, table), 0), path)
    case _: IO.die(Unit, 2, "Incomplete H0 distance audit")

def reduced(state: D.Build, path: String, started: Nat) -> IO(Unit):
  match state:
    case D.DComplete{moves, table, 3393, maximum}: audited(D.audit(D.DComplete{moves, table, 3393, maximum}), path, started)
    case D.DFailed{index, code}: IO.die(Unit, 2, "H0 reduced generation failed " ++ U32.show(index) ++ " code " ++ U32.show(code))
    case _: IO.die(Unit, 2, "Incomplete reduced H0 distances")

def raw(state: D.Build, path: String, started: Nat) -> IO(Unit):
  match state:
    case D.DComplete{moves, table, 153090, maximum}: reduced(D.generate(D.Reduced{}, moves, G.ClassAudited{table, 153090}), path, started)
    case D.DFailed{index, code}: IO.die(Unit, 2, "H0 raw generation failed " ++ U32.show(index) ++ " code " ++ U32.show(code))
    case _: IO.die(Unit, 2, "Incomplete raw H0 distances")

def classes(state: G.Audit, path: String) -> IO(Unit):
  match state:
    case G.ClassAudited{table, checked}:
      do IO<Unit>:
        started : Nat <- IO.now()
        raw(D.generate(D.Raw{}, D.transitions(), G.ClassAudited{table, checked}), path, started)
    case _: IO.die(Unit, 2, "H0 class audit failed before distances")

def args(values: List<String>) -> IO(Unit):
  match values:
    case Con{program, Con{path, Nil{}}}: classes(G.audit(G.generate()), path)
    case _: IO.die(Unit, 2, "Expected a fresh H0 distance output path")

def main() -> IO(Unit):
  do IO<Unit>:
    values : List<String> <- IO.args()
    args(values)
