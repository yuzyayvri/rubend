import Base
import ../src/corner-table.bend as G
import ../src/joint-cache.bend as Cache

type Output is Data:
  Discard{}
  Save{moves_path: String, distance_path: String}

def flag(value: Bool) -> String:
  match value:
    case True{}: "true"
    case False{}: "false"

def finished(complete: Bool, count: U32, expanded: U32, maximum: U32, +space: G.Space, matrix_ms: Nat, initialize_ms: Nat, started: Nat) -> IO(Unit):
  do IO<Unit>:
    ended : Nat <- IO.now()
    IO.print("{\"generationComplete\":" ++ flag(complete) ++ ",\"audited\":false,\"states\":" ++ U32.show(count) ++ ",\"expanded\":" ++ U32.show(expanded) ++ ",\"expected\":" ++ U32.show(G.count(space)) ++ ",\"maximum\":" ++ U32.show(maximum) ++ ",\"matrixMs\":" ++ Nat.show(matrix_ms) ++ ",\"initializeMs\":" ++ Nat.show(initialize_ms) ++ ",\"workMs\":" ++ Nat.show(Nat.sub(ended, started)) ++ ",\"purpose\":\"Bounded generation feasibility only; no engine integration\"}")

def result(state: G.Build, +space: G.Space, matrix_ms: Nat, initialize_ms: Nat, started: Nat) -> IO(Unit):
  match state:
    case G.CornerComplete{moves, table, +count, maximum}: finished(U32.is_eq(count, G.count(space)), count, count, maximum, space, matrix_ms, initialize_ms, started)
    case G.CornerReady{moves, table, queue, head, tail, maximum}: finished(False{}, tail, head, maximum, space, matrix_ms, initialize_ms, started)
    case G.CornerWork{moves, table, queue, head, tail, x, y, move, depth, maximum}: finished(False{}, tail, head, maximum, space, matrix_ms, initialize_ms, started)
    case _: IO.die(Unit, 2, "Corner generation rejected a bound or failed geometry")

def initialized(state: G.Build, +space: G.Space, fuel: Nat, matrix_ms: Nat, started: Nat) -> IO(Unit):
  match state:
    case G.CornerReady{moves, table, queue, head, tail, maximum}:
      do IO<Unit>:
        +ready : Nat <- IO.now()
        result(G.run(fuel, G.CornerReady{moves, table, queue, head, tail, maximum}, space), space, matrix_ms, Nat.sub(ready, started), ready)
    case _: IO.die(Unit, 2, "Corner initial geometry failed")

def moved(read: Array<U32> & U32, +space: G.Space, fuel: Nat, started: Nat) -> IO(Unit):
  match read:
    case Tuple{moves, 1048576}:
      do IO<Unit>:
        +ready : Nat <- IO.now()
        initialized(G.start(moves, space), space, fuel, Nat.sub(ready, started), ready)
    case _: IO.die(Unit, 2, "Corner transition geometry failed")

def run(+space: G.Space, fuel: Nat) -> IO(Unit):
  do IO<Unit>:
    started : Nat <- IO.now()
    moved(Array.size(U32, G.transitions()), space, fuel, started)

def saved(output: Output, moves: Array<U32>, table: Array<U32>, space: G.Space) -> IO(Unit):
  match output:
    case Discard{}: IO.pure(Unit, Unit{})
    case Save{moves_path, distance_path}:
      do IO<Unit>:
        moves : Array<U32> <- Cache.save(moves_path, moves, 765126)
        table : Array<U32> <- Cache.save(distance_path, table, (G.count(space) / 4 : U32))
        IO.pure(Unit, Unit{})

def audited(state: G.Audit, +space: G.Space, output: Output, matrix_ms: Nat, generation_ms: Nat, started: Nat) -> IO(Unit):
  match state:
    case G.CornerAudited{moves, table, +count, maximum, total}:
      do IO<Unit>:
        +ended : Nat <- IO.now()
        IO.print("{\"generationComplete\":true,\"audited\":true,\"states\":" ++ U32.show(count) ++ ",\"edges\":" ++ U32.show((count * 18 : U32)) ++ ",\"maximum\":" ++ U32.show(maximum) ++ ",\"distanceSum\":" ++ Nat.show(total) ++ ",\"matrixMs\":" ++ Nat.show(matrix_ms) ++ ",\"generationMs\":" ++ Nat.show(generation_ms) ++ ",\"auditMs\":" ++ Nat.show(Nat.sub(ended, started)) ++ "}")
        saved(output, moves, table, space)
    case G.CornerAuditFailed{index, move, code}: IO.die(Unit, 2, "Corner audit failed at " ++ U32.show(index) ++ "/" ++ U32.show(move) ++ " code " ++ U32.show(code))
    case _: IO.die(Unit, 2, "Corner audit did not complete")

def generated(state: G.Build, +space: G.Space, output: Output, matrix_ms: Nat, started: Nat) -> IO(Unit):
  match state:
    case G.CornerComplete{moves, table, count, maximum}:
      do IO<Unit>:
        +ended : Nat <- IO.now()
        audited(G.audit(G.CornerComplete{moves, table, count, maximum}, space), space, output, matrix_ms, Nat.sub(ended, started), ended)
    case _: IO.die(Unit, 2, "Corner generation did not complete")

def audit_moves(read: Array<U32> & U32, +space: G.Space, output: Output, started: Nat) -> IO(Unit):
  match read:
    case Tuple{moves, 1048576}:
      do IO<Unit>:
        +ended : Nat <- IO.now()
        generated(G.generate(moves, space), space, output, Nat.sub(ended, started), ended)
    case _: IO.die(Unit, 2, "Corner transition geometry failed")

def run_audit(+space: G.Space, output: Output) -> IO(Unit):
  do IO<Unit>:
    started : Nat <- IO.now()
    audit_moves(Array.size(U32, G.transitions()), space, output, started)

def full_audit_chunks(fuel: Nat, state: G.Audit, output: Output, matrix_ms: Nat, generation_ms: Nat, started: Nat) -> IO(Unit):
  match fuel state:
    case _ G.CornerAudited{moves, table, count, maximum, total}:
      audited(G.CornerAudited{moves, table, count, maximum, total}, G.FullCorners{}, output, matrix_ms, generation_ms, started)
    case 1n+p G.CornerAudit{moves, table, +index, maximum, total}:
      do IO<Unit>:
        IO.print("{\"phase\":\"corner_audit\",\"rows\":" ++ U32.show(index) ++ "}")
        full_audit_chunks(p, G.audit_run(1000000n, G.CornerAudit{moves, table, index, maximum, total}, G.FullCorners{}), output, matrix_ms, generation_ms, started)
    case _ G.CornerAuditFailed{index, move, code}: audited(G.CornerAuditFailed{index, move, code}, G.FullCorners{}, output, matrix_ms, generation_ms, started)
    case _ _: IO.die(Unit, 2, "Full corner audit chunk budget exhausted")

def full_build_chunks(fuel: Nat, state: G.Build, output: Output, matrix_ms: Nat, started: Nat) -> IO(Unit):
  match fuel state:
    case _ G.CornerComplete{moves, table, +count, +maximum}:
      do IO<Unit>:
        +ended : Nat <- IO.now()
        IO.print("{\"phase\":\"corner_generation_done\",\"states\":" ++ U32.show(count) ++ ",\"maximum\":" ++ U32.show(maximum) ++ "}")
        full_audit_chunks(90n, G.begin_audit(G.CornerComplete{moves, table, count, maximum}, G.FullCorners{}), output, matrix_ms, Nat.sub(ended, started), ended)
    case 1n+p G.CornerReady{moves, table, queue, +head, +tail, +maximum}:
      do IO<Unit>:
        IO.print("{\"phase\":\"corner_generation\",\"expanded\":" ++ U32.show(head) ++ ",\"visited\":" ++ U32.show(tail) ++ ",\"maximumSeen\":" ++ U32.show(maximum) ++ "}")
        full_build_chunks(p, G.run(20000000n, G.CornerReady{moves, table, queue, head, tail, maximum}, G.FullCorners{}), output, matrix_ms, started)
    case 1n+p G.CornerWork{moves, table, queue, +head, +tail, x, y, move, depth, +maximum}:
      do IO<Unit>:
        IO.print("{\"phase\":\"corner_generation\",\"expanded\":" ++ U32.show(head) ++ ",\"visited\":" ++ U32.show(tail) ++ ",\"maximumSeen\":" ++ U32.show(maximum) ++ "}")
        full_build_chunks(p, G.run(20000000n, G.CornerWork{moves, table, queue, head, tail, x, y, move, depth, maximum}, G.FullCorners{}), output, matrix_ms, started)
    case _ _: IO.die(Unit, 2, "Full corner build failed or chunk budget exhausted")

def full_moves(read: Array<U32> & U32, output: Output, started: Nat) -> IO(Unit):
  match read:
    case Tuple{moves, 1048576}:
      do IO<Unit>:
        +ended : Nat <- IO.now()
        full_build_chunks(89n, G.start(moves, G.FullCorners{}), output, Nat.sub(ended, started), ended)
    case _: IO.die(Unit, 2, "Corner transition geometry failed")

def run_full(output: Output) -> IO(Unit):
  do IO<Unit>:
    started : Nat <- IO.now()
    full_moves(Array.size(U32, G.transitions()), output, started)

def command(args: List<String>) -> IO(Unit):
  match args:
    case Con{program, Con{"perm", Nil{}}}: run(G.Permutation{}, 806401n)
    case Con{program, Con{"probe", Nil{}}}: run(G.FullCorners{}, 20000000n)
    case Con{program, Con{"audit", Nil{}}}: run_audit(G.Permutation{}, Discard{})
    case Con{program, Con{"audit", Con{moves_path, Con{distance_path, Nil{}}}}}: run_audit(G.Permutation{}, Save{moves_path, distance_path})
    case Con{program, Con{"full-audit", Con{moves_path, Con{distance_path, Nil{}}}}}: run_full(Save{moves_path, distance_path})
    case _: IO.die(Unit, 2, "Expected perm, bounded probe, permutation audit, or full-audit with fresh output paths")

def main() -> IO(Unit):
  do IO<Unit>:
    args : List<String> <- IO.args()
    command(args)
