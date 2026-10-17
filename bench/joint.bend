import Base
import ../src/joint-table.bend as J
import ../src/tables.bend as T
import ../src/joint-audit.bend as A
import ./joint-reference.bend as R
import ../src/joint-cache.bend as Cache

def audited(result: A.Check) -> IO(Array<U32>):
  match result:
    case A.Check{dist, moves, True{}, maximum, hash}:
      do IO<Array<U32>>:
        IO.print("{\"type\":\"packedAudit\",\"passed\":true,\"maximum\":" ++ U32.show(maximum) ++ ",\"fingerprint\":" ++ U32.show(hash) ++ "}")
        return dist
    case _: IO.die(Array<U32>, 2, "Packed graph audit failed")

def small_result(pair: J.Joint) -> IO(Unit):
  match pair:
    case J.Joint{dist, moves, added}:
      do IO<Unit>:
        dist : Array<U32> <- R.verify(dist)
        dist : Array<U32> <- audited(A.audit(J.Joint{dist, moves, added}, 1))
        IO.pure(Unit, Unit{})

def sweep_if(active: Bool, pair: J.Joint, +slices: U32, depth: U32) -> J.Joint:
  match active pair:
    case True{} J.Joint{dist, moves, added}: J.sweep(U32.to_nat((4478976 * slices : U32)), J.Joint{dist, moves, 0}, 0, slices, depth)
    case False{} pair: pair

def layers(fuel: Nat, active: Bool, pair: J.Joint, +slices: U32, +depth: U32, +before: U32, +started: Nat) -> IO(J.Joint):
  match fuel active pair:
    case 1n+p True{} J.Joint{dist, moves, +added}:
      do IO<J.Joint>:
        +total : U32 = (before + added : U32)
        +more : Bool = U32.is_lt(total, (4478976 * slices : U32)) && U32.is_gt(added, 0) && U32.is_lt(depth, 14)
        now : Nat <- IO.now()
        IO.print("{\"type\":\"layer\",\"depth\":" ++ U32.show(depth) ++ ",\"count\":" ++ U32.show(added) ++ ",\"total\":" ++ U32.show(total) ++ ",\"elapsedMs\":" ++ Nat.show(Nat.sub(now, started)) ++ "}")
        layers(p, more, sweep_if(more, J.Joint{dist, moves, added}, slices, depth), slices, (depth + 1 : U32), total, started)
    case _ _ pair: IO.pure(J.Joint, pair)

def start(large: Bool, path: String) -> IO(Unit):
  match large:
    case False{}:
      do IO<Unit>:
        started : Nat <- IO.now()
        pair : J.Joint <- layers(15n, True{}, J.Joint{J.put([4294967295 : U32^20n], 0, 0), T.transitions(), 1}, 1, 0, 0, started)
        small_result(pair)
    case True{}:
      do IO<Unit>:
        started : Nat <- IO.now()
        pair : J.Joint <- layers(15n, True{}, J.Joint{J.put([4294967295 : U32^29n], 0, 0), T.transitions(), 1}, 495, 0, 0, started)
        dist : Array<U32> <- audited(A.audit(pair, 495))
        dist : Array<U32> <- Cache.save(path, dist, 277136640)
        IO.print("{\"type\":\"cacheWritten\",\"bytes\":1108546560}")

def command(args: List<String>) -> IO(Unit):
  match args:
    case Con{program, Con{"large", Con{path, Nil{}}}}: start(True{}, path)
    case _: start(False{}, "")

def main() -> IO(Unit):
  do IO<Unit>:
    args : List<String> <- IO.args()
    command(args)
