import Base
import ../src/main.bend as H
import ../src/model.bend as M
import ../src/cubie.bend as C
import ../src/search.bend as S
import ../src/portfolio.bend as P
import ./fixed-work.bend as F
import ./premove-paths.bend as E
import ./seed-bank.bend as Q

type Timed is Type:
  Active{state: Q.Session}
  Finished{state: Q.Session, elapsed: Nat}

def point(changed: Bool, id: String, tick: U32, length: U32, lower: U32, nodes: U32, status: S.Completion, elapsed: Nat) -> IO(Unit):
  match changed:
    case False{}: IO.pure(Unit, Unit{})
    case True{}:
      IO.print("{\"type\":\"point\",\"id\":\"" ++ id ++ "\",\"tick\":" ++ U32.show(tick) ++ ",\"length\":" ++ U32.show(length) ++ ",\"lower\":" ++ U32.show(lower) ++ ",\"nodes\":" ++ U32.show(nodes) ++ ",\"status\":" ++ U32.show(S.completion_code(status)) ++ ",\"elapsedMs\":" ++ Nat.show(elapsed) ++ "}")

def next(active: Bool, state: Q.Session, elapsed: Nat) -> Timed:
  match active:
    case True{}: Active{Q.advance(4294967295, state)}
    case False{}: Finished{state, elapsed}

def finish(state: Q.Session, id: String, elapsed: Nat) -> IO(Array<U32>):
  match state:
    case Q.Session{table, original, seed, Q.Lane{tasks, root, best, length, lower, +nodes, request, status}, +bank, ticks, branch, accepted, fault, profile}:
      do IO<Array<U32>>:
        IO.print("{\"type\":\"done\",\"id\":\"" ++ id ++ "\",\"length\":" ++ U32.show(length) ++ ",\"lower\":" ++ U32.show(lower) ++ ",\"nodes\":" ++ U32.show((nodes + Q.bank_nodes(bank) : U32)) ++ ",\"originalNodes\":" ++ U32.show(nodes) ++ ",\"seedNodes\":" ++ U32.show(Q.bank_nodes(bank)) ++ ",\"ticks\":" ++ U32.show(ticks) ++ ",\"accepted\":" ++ U32.show(accepted) ++ ",\"fault\":" ++ U32.show(fault) ++ ",\"status\":" ++ U32.show(S.completion_code(status)) ++ ",\"elapsedMs\":" ++ Nat.show(elapsed) ++ "}")
        return table

def loop(fuel: Nat, +id: String, +started: Nat, +budget: Nat, +previous_length: U32, previous_lower: U32, phase: Timed) -> IO(Array<U32>):
  match fuel phase:
    case _ Finished{state, elapsed}: finish(state, id, elapsed)
    case 0n Active{state}: IO.die(Array<U32>, 2, "Deadline probe fuel exhausted")
    case 1n+rest Active{Q.Session{table, +original, +seed, +main, +bank, +ticks, +branch, +accepted, +fault, +profile}}:
      match main:
        case Q.Lane{tasks, root, +best, +length, +lower, +nodes, request, +status}:
          do IO<Array<U32>>:
            H.emit_for(U32.is_lt(length, previous_length), original, best, length, lower, (nodes + Q.bank_nodes(bank) : U32), S.is_optimal(status), ",\"id\":\"" ++ id ++ "\",\"tick\":" ++ U32.show(ticks))
            available : Nat <- IO.now()
            point(U32.is_eq(ticks, 0) || U32.is_lt(length, previous_length) || U32.is_gt(lower, previous_lower) || S.is_optimal(status), id, ticks, length, lower, (nodes + Q.bank_nodes(bank) : U32), status, Nat.sub(available, started))
            +now : Nat <- IO.now()
            loop(rest, id, started, budget, length, lower, next(Nat.is_lt(now, Nat.add(started, budget)) && Q.running(main) && U32.is_eq(fault, 0), Q.Session{table, original, seed, main, bank, ticks, branch, accepted, fault, profile}, Nat.sub(now, started)))

def solve(valid: C.Validation, +original: M.Cube, +id: String, +seed: E.Seed, +code: U32, +budget: U32, table: Array<U32>) -> IO(Array<U32>):
  match valid:
    case C.Valid{root}:
      do IO<Array<U32>>:
        IO.print("{\"type\":\"begin\",\"id\":\"" ++ id ++ "\",\"seed\":" ++ U32.show(code) ++ ",\"budgetMs\":" ++ U32.show(budget) ++ "}")
        started : Nat <- IO.now()
        loop(50000n, id, started, U32.to_nat(budget), 31, 0, Active{Q.initialize(table, original, root, P.Fast{}, seed, S.RawInverseThree{})})
    case _: IO.die(Array<U32>, 2, "Invalid deadline cube")

def admitted(active: Bool, value: Maybe<&2, M.Cube>, id: String, code: U32, seed: Maybe<&2, E.Seed>, budget: U32, table: Array<U32>) -> IO(Array<U32>):
  match active value seed:
    case True{} Some{+original} Some{seed}: solve(C.validate(original), original, id, seed, code, budget, table)
    case _ _ _: IO.die(Array<U32>, 2, "Invalid deadline request")

def parsed(value: Maybe<&2, M.Cube>, id: String, code: Maybe<&2, U32>, budget: Maybe<&2, U32>, table: Array<U32>) -> IO(Array<U32>):
  match code budget:
    case Some{+code} Some{+budget}:
      admitted((U32.is_eq(code, 3) || U32.is_eq(code, 18)) && U32.is_le(budget, 2000), value, id, code, E.parse_seed(code), budget, table)
    case _ _: IO.die(Array<U32>, 2, "Invalid deadline numbers")

def command(args: +List<String>, table: Array<U32>) -> IO(Array<U32>):
  match args:
    case Con{id, Con{text, Con{seed, Con{budget, Nil{}}}}}:
      parsed(M.from_list(H.colors(text)), id, U32.read(seed), U32.read(budget), table)
    case _: IO.die(Array<U32>, 2, "Expected id, facelets, seed, deadline")

def commands(lines: +List<String>, table: Array<U32>) -> IO(Array<U32>):
  match lines:
    case Nil{}: IO.pure(Array<U32>, table)
    case Con{SNil{}, rest}: commands(rest, table)
    case Con{line, rest}:
      do IO<Array<U32>>:
        table : Array<U32> <- command(String.split(line, Chr{9}), table)
        commands(rest, table)

def start(args: List<String>) -> IO(Unit):
  match args:
    case Con{program, Con{path, Nil{}}}:
      do IO<Unit>:
        file : File <- IO.try(File, File.open(path, "r"))
        read : File & Result<&1, &1, U32 & String, String> <- File.read(file, 4096)
        text : String <- F.read_requests(16n, "", read)
        table : Array<U32> <- F.load(True{})
        IO.print("{\"type\":\"ready\"}")
        table : Array<U32> <- commands(String.split(text, Chr{10}), table)
        IO.pure(Unit, Unit{})
    case _: IO.die(Unit, 2, "Expected deadline request file")

def main() -> IO(Unit):
  do IO<Unit>:
    args : List<String> <- IO.args()
    start(args)
