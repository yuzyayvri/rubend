import Base
import ../src/main.bend as H
import ../src/model.bend as M
import ../src/cubie.bend as C
import ../src/search.bend as S
import ../src/portfolio.bend as P
import ./fixed-work.bend as F
import ./premove-paths.bend as E
import ./seed-bank.bend as Q

def bank_data(bank: Q.Bank) -> String:
  match bank:
    case Q.NoBank{}: "[0,0,31,3,[]]"
    case Q.Bank{Q.Lane{tasks, root, best, length, lower, nodes, request, status}}:
      "[1," ++ U32.show(nodes) ++ "," ++ U32.show(length) ++ "," ++ U32.show(S.completion_code(status)) ++ "," ++ F.numbers(best) ++ "]"

def cost(id: String, slice: U32, original_nodes: U32, bank: Q.Bank, ticks: U32, branch: U32, accepted: U32, fault: U32, elapsed: Nat) -> IO(Unit):
  IO.print("{\"type\":\"cost\",\"id\":\"" ++ id ++ "\",\"slice\":" ++ U32.show(slice) ++ ",\"originalNodes\":" ++ U32.show(original_nodes) ++ ",\"bank\":" ++ bank_data(bank) ++ ",\"ticks\":" ++ U32.show(ticks) ++ ",\"branch\":" ++ U32.show(branch) ++ ",\"accepted\":" ++ U32.show(accepted) ++ ",\"fault\":" ++ U32.show(fault) ++ ",\"nativeMs\":" ++ Nat.show(elapsed) ++ "}")

def snapshots(fuel: Nat, +id: String, +original: M.Cube, +initial_request: U32, +slice: U32, +budget: U32, state: Q.Session, started: Nat) -> IO(Array<U32>):
  match fuel state:
    case 0n Q.Session{table, spec, seed, Q.Lane{tasks, root, best, length, lower, +nodes, request, status}, +bank, ticks, branch, accepted, fault, profile}:
      do IO<Array<U32>>:
        ended : Nat <- IO.now()
        F.snapshot(id, original, initial_request, slice, tasks, root, best, length, lower, (nodes + Q.bank_nodes(bank) : U32), request, status)
        cost(id, slice, nodes, bank, ticks, branch, accepted, fault, Nat.sub(ended, started))
        return table
    case 1n+rest Q.Session{table, +spec, +seed, +main, +bank, +ticks, +branch, +accepted, +fault, +profile}:
      match main:
        case Q.Lane{+tasks, +root, +best, +length, +lower, +nodes, +request, +status}:
          do IO<Array<U32>>:
            ended : Nat <- IO.now()
            F.snapshot(id, original, initial_request, slice, tasks, root, best, length, lower, (nodes + Q.bank_nodes(bank) : U32), request, status)
            cost(id, slice, nodes, bank, ticks, branch, accepted, fault, Nat.sub(ended, started))
            next_started : Nat <- IO.now()
            snapshots(rest, id, original, initial_request, (slice + 1 : U32), budget, Q.advance(budget, Q.Session{table, spec, seed, main, bank, ticks, branch, accepted, fault, profile}), next_started)

def solve(valid: C.Validation, +original: M.Cube, id: String, +request: U32, slices: U32, seed: E.Seed, budget: U32, table: Array<U32>) -> IO(Array<U32>):
  match valid:
    case C.Valid{root}:
      do IO<Array<U32>>:
        started : Nat <- IO.now()
        snapshots(U32.to_nat(slices), id, original, request, 0, budget, Q.initialize(table, original, root, P.request_mode(U32.is_eq(request, 2)), seed, S.RawInverseThree{}), started)
    case _: IO.die(Array<U32>, 2, "Invalid seed-bank cube")

def parsed(value: Maybe<&2, M.Cube>, id: String, request: Maybe<&2, U32>, slices: Maybe<&2, U32>, seed: Maybe<&2, E.Seed>, budget: Maybe<&2, U32>, table: Array<U32>) -> IO(Array<U32>):
  match value request slices seed budget:
    case Some{+original} Some{request} Some{slices} Some{seed} Some{budget}:
      solve(C.validate(original), original, id, request, slices, seed, budget, table)
    case _ _ _ _ _: IO.die(Array<U32>, 2, "Invalid seed-bank request")

def seed_value(index: Maybe<&2, U32>) -> Maybe<&2, E.Seed>:
  match index:
    case Some{value}: E.parse_seed(value)
    case None{}: None{}

def command(args: +List<String>, table: Array<U32>) -> IO(Array<U32>):
  match args:
    case Con{id, Con{text, Con{request, Con{slices, Con{seed, Con{budget, Nil{}}}}}}}:
      parsed(M.from_list(H.colors(text)), id, U32.read(request), U32.read(slices), seed_value(U32.read(seed)), U32.read(budget), table)
    case _: IO.die(Array<U32>, 2, "Expected id, facelets, request, slices, seed, budget")

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
        table : Array<U32> <- F.load(True{})
        file : File <- IO.try(File, File.open(path, "r"))
        read : File & Result<&1, &1, U32 & String, String> <- File.read(file, 4096)
        text : String <- F.read_requests(16n, "", read)
        table : Array<U32> <- commands(String.split(text, Chr{10}), table)
        IO.pure(Unit, Unit{})
    case _: IO.die(Unit, 2, "Expected seed-bank request file")

def main() -> IO(Unit):
  do IO<Unit>:
    args : List<String> <- IO.args()
    start(args)
