import Base
import ./model.bend as M
import ./cubie.bend as C
import ./search.bend as S
import ./portfolio.bend as P
import ./tables.bend as T
import ./certificate.bend as Cert

def color(code: U32) -> U32:
  match code:
    case 48: 0
    case 49: 1
    case 50: 2
    case 51: 3
    case 52: 4
    case 53: 5
    case 85: 0
    case 82: 1
    case 70: 2
    case 68: 3
    case 76: 4
    case 66: 5
    case _: 255

def colors(text: String) -> +List<U32>:
  match text:
    case SNil{}:
      Nil{}
    case SCon{Chr{code}, rest}:
      color(code) <> colors(rest)

def to_moves(xs: +List<U32>) -> +List<M.Move>:
  match xs:
    case Nil{}:
      Nil{}
    case Con{x, rest}:
      M.from_index(x) <> to_moves(rest)

def move_text(xs: +List<U32>) -> +List<String>:
  match xs:
    case Nil{}:
      Nil{}
    case Con{x, rest}:
      U32.show(x) <> move_text(rest)

def candidate(ok: Bool, moves: +List<U32>, length: U32, lower: U32, nodes: U32, optimal: Bool) -> IO(Unit):
  match ok:
    case False{}:
      IO.die(Unit, 2, "Candidate replay failed")
    case True{}:
      IO.print("{\"type\":\"candidate\",\"moves\":[" ++ String.join(move_text(moves), ",") ++ "],\"length\":" ++ U32.show(length) ++ ",\"lower\":" ++ U32.show(lower) ++ ",\"nodes\":" ++ U32.show(nodes) ++ ",\"optimal\":" ++ U32.show(C.pick(optimal, 1, 0)) ++ "}")

def indices(xs: +List<M.Move>) -> +List<U32>:
  match xs:
    case Nil{}:
      Nil{}
    case Con{move, rest}:
      M.index(move) <> indices(rest)

def certified(-original: M.Cube, result: Maybe<&2, Cert.Certificate<original>>, length: U32, lower: U32, nodes: U32, optimal: Bool) -> IO(Unit):
  match result:
    case None{}:
      IO.die(Unit, 2, "Candidate certificate failed")
    case Some{certificate}:
      candidate(True{}, indices(Cert.moves(original, certificate)), length, lower, nodes, optimal)

def emit(changed: Bool, +original: M.Cube, +best: +List<U32>, length: U32, lower: U32, nodes: U32, optimal: Bool) -> IO(Unit):
  match changed:
    case False{}:
      IO.pure(Unit, Unit{})
    case True{}:
      +moves = List.reverse(&2, U32, best)
      certified(original, Cert.certify(original, to_moves(moves)), length, lower, nodes, optimal)

def service(fuel: Nat, active: Bool, state: P.Session, +original: M.Cube, +started: Nat, +budget: Nat, previous: U32, +profile: S.Profile) -> IO(Array<U32>):
  match fuel active state:
    case _ _ P.Session{table, tasks, root, best, length, lower, nodes, request, 4}:
      IO.die(Array<U32>, 2, "Transformed cube failed validation")
    case _ _ P.Session{table, tasks, root, best, length, lower, nodes, request, 5}:
      IO.die(Array<U32>, 2, "Lookup profile does not match loaded storage")
    case 1n+p True{} P.Session{table, tasks, root, +best, +length, +lower, +nodes, request, +status}:
      do IO<Array<U32>>:
        emit(U32.is_lt(length, previous) || U32.is_eq(status, 1), original, best, length, lower, nodes, U32.is_eq(status, 1))
        +now : Nat <- IO.now()
        IO.print("{\"type\":\"progress\",\"nodes\":" ++ U32.show(nodes) ++ ",\"lower\":" ++ U32.show(lower) ++ ",\"elapsedMs\":" ++ Nat.show(Nat.sub(now, started)) ++ "}")
        service(p, Nat.is_lt(now, Nat.add(started, budget)) && U32.is_eq(status, 0), P.advance(P.Session{table, tasks, root, best, length, lower, nodes, request, status}), original, started, budget, length, profile)
    case _ _ P.Session{table, tasks, root, best, +length, +lower, +nodes, request, +status}:
      do IO<Array<U32>>:
        emit(U32.is_lt(length, previous) || U32.is_eq(status, 1), original, best, length, lower, nodes, U32.is_eq(status, 1))
        IO.print("{\"type\":\"done\",\"length\":" ++ U32.show(length) ++ ",\"lower\":" ++ U32.show(lower) ++ ",\"nodes\":" ++ U32.show(nodes) ++ ",\"optimal\":" ++ U32.show(C.pick(U32.is_eq(status, 1), 1, 0)) ++ "}")
        return table

def solve(valid: C.Validation, +original: M.Cube, +request: U32, budget: U32, table: Array<U32>, +profile: S.Profile) -> IO(Array<U32>):
  match valid:
    case C.Invalid{code}:
      do IO<Array<U32>>:
        IO.print("{\"type\":\"invalid\",\"code\":" ++ U32.show(code) ++ "}")
        return table
    case C.Valid{cube}:
      do IO<Array<U32>>:
        started : Nat <- IO.now()
        service(U32.to_nat(C.pick(U32.is_eq(request, 0), 180000, 60000)), True{}, P.initialize(table, original, cube, request, profile), original, started, U32.to_nat(budget), 31, profile)

def parsed(result: Maybe<&2, M.Cube>, request: U32, budget: U32, table: Array<U32>, +profile: S.Profile) -> IO(Array<U32>):
  match result:
    case None{}:
      do IO<Array<U32>>:
        IO.print("{\"type\":\"invalid\",\"code\":6}")
        return table
    case Some{+cube}:
      solve(C.validate(cube), cube, request, budget, table, profile)

def command_budget(limit: Maybe<&2, U32>, text: String, mode: String, table: Array<U32>, +profile: S.Profile) -> IO(Array<U32>):
  match limit:
    case None{}:
      do IO<Array<U32>>:
        IO.print("{\"type\":\"invalid\",\"code\":7}")
        return table
    case Some{+budget}:
      parsed(M.from_list(colors(text)), C.pick(String.eq(mode, "exact"), 2, 0), C.pick(U32.is_ge(budget, 1) && U32.is_le(budget, 60000), budget, 5000), table, profile)

def worker_command(args: +List<String>, table: Array<U32>, +profile: S.Profile) -> IO(Array<U32>):
  match args:
    case Con{text, Con{mode, Con{limit, Nil{}}}}:
      command_budget(U32.read(limit), text, mode, table, profile)
    case _:
      do IO<Array<U32>>:
        IO.print("{\"type\":\"invalid\",\"code\":7}")
        return table

def worker_loop(fuel: Nat, table: Array<U32>, read: File & Result<&1, &1, U32 & String, String>, +profile: S.Profile) -> IO(Unit):
  match fuel read:
    case 1n+p Tuple{file, Done{SCon{head, rest}}}:
      do IO<Unit>:
        table : Array<U32> <- worker_command(String.split(String.trim(SCon{head, rest}), Chr{9}), table, profile)
        read : File & Result<&1, &1, U32 & String, String> <- File.read(file, 4096)
        worker_loop(p, table, read, profile)
    case _ Tuple{file, result}:
      File.close(file)

def checked_table(read: Array<U32> & U32) -> IO(Array<U32>):
  match read:
    case Tuple{table, 8388608}:
      IO.pure(Array<U32>, table)
    case _:
      IO.die(Array<U32>, 2, "Lookup table generation was incomplete")

def worker(file: File) -> IO(Unit):
  do IO<Unit>:
    IO.print("{\"type\":\"initializing\"}")
    table : Array<U32> <- checked_table(Array.size(U32, T.generate()))
    IO.print("{\"type\":\"ready\"}")
    read : File & Result<&1, &1, U32 & String, String> <- File.read(file, 4096)
    worker_loop(1000000n, table, read, S.Light{})

def command(args: List<String>) -> IO(Unit):
  match args:
    case Con{program, Con{text, Con{mode, Con{limit, Nil{}}}}}:
      do IO<Unit>:
        table : Array<U32> <- checked_table(Array.size(U32, T.generate()))
        table : Array<U32> <- command_budget(U32.read(limit), text, mode, table, S.Light{})
        IO.pure(Unit, Unit{})
    case Con{program, Con{worker_arg, Nil{}}}:
      do IO<Unit>:
        file : File <- IO.try(File, File.open(worker_arg, "r"))
        worker(file)
    case _:
      IO.print("Rubend: pass 54 URFDLB facelets, fast|exact, and a millisecond budget.")

def main() -> IO(Unit):
  do IO<Unit>:
    args : List<String> <- IO.args()
    command(args)
