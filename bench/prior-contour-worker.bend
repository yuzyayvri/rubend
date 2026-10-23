import Base
import ../src/main.bend as H
import ../src/model.bend as M
import ../src/cubie.bend as C
import ../src/search.bend as S
import ../src/portfolio.bend as P
import ./fixed-work.bend as F
import ./prior-contour-policy.bend as Q

def cost(+id: String, slice: U32, book: Q.Book, elapsed: Nat) -> IO(Unit):
  match book:
    case Q.Book{history, remaining, rounds, reorders, served}:
      IO.print("{\"type\":\"cost\",\"id\":\"" ++ id ++ "\",\"slice\":" ++ U32.show(slice) ++ ",\"remaining\":" ++ U32.show(remaining) ++ ",\"rounds\":" ++ U32.show(rounds) ++ ",\"reorders\":" ++ U32.show(reorders) ++ ",\"served\":" ++ U32.show(served) ++ ",\"nativeMs\":" ++ Nat.show(elapsed) ++ "}")

def snapshots(fuel: Nat, +id: String, +original: M.Cube, +initial_request: U32, +slice: U32, +ordered: Bool, +budget: U32, state: P.Session & Q.Book, started: Nat) -> IO(Array<U32>):
  match fuel state:
    case 0n Tuple{P.Session{table, entries, root, best, length, lower, nodes, request, status}, book}:
      do IO<Array<U32>>:
        ended : Nat <- IO.now()
        F.snapshot(id, original, initial_request, slice, entries, root, best, length, lower, nodes, request, status)
        cost(id, slice, book, Nat.sub(ended, started))
        return table
    case 1n+rest Tuple{P.Session{table, +entries, +root, +best, +length, +lower, +nodes, +request, +status}, +book}:
      do IO<Array<U32>>:
        ended : Nat <- IO.now()
        F.snapshot(id, original, initial_request, slice, entries, root, best, length, lower, nodes, request, status)
        cost(id, slice, book, Nat.sub(ended, started))
        next_started : Nat <- IO.now()
        snapshots(rest, id, original, initial_request, (slice + 1 : U32), ordered, budget, Q.budget_advance(ordered, budget, (P.Session{table, entries, root, best, length, lower, nodes, request, status}, book)), next_started)

def solve(valid: C.Validation, +original: M.Cube, id: String, +request: U32, slices: U32, ordered: U32, budget: U32, table: Array<U32>) -> IO(Array<U32>):
  match valid:
    case C.Valid{root}:
      do IO<Array<U32>>:
        started : Nat <- IO.now()
        snapshots(U32.to_nat(slices), id, original, request, 0, U32.is_eq(ordered, 1), budget, (P.initialize(table, original, root, P.request_mode(U32.is_eq(request, 2)), S.RawInverseThree{}), Q.initial()), started)
    case _: IO.die(Array<U32>, 2, "Invalid task-order cube")

def parsed(value: Maybe<&2, M.Cube>, id: String, request: Maybe<&2, U32>, slices: Maybe<&2, U32>, ordered: Maybe<&2, U32>, budget: Maybe<&2, U32>, table: Array<U32>) -> IO(Array<U32>):
  match value request slices ordered budget:
    case Some{+original} Some{request} Some{slices} Some{ordered} Some{budget}: solve(C.validate(original), original, id, request, slices, ordered, budget, table)
    case _ _ _ _ _: IO.die(Array<U32>, 2, "Invalid task-order request")

def command(args: +List<String>, table: Array<U32>) -> IO(Array<U32>):
  match args:
    case Con{id, Con{text, Con{request, Con{slices, Con{ordered, Con{budget, Nil{}}}}}}}:
      parsed(M.from_list(H.colors(text)), id, U32.read(request), U32.read(slices), U32.read(ordered), U32.read(budget), table)
    case _: IO.die(Array<U32>, 2, "Expected id, facelets, request, slices, policy, budget")

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
    case _: IO.die(Unit, 2, "Expected task-order request file")

def main() -> IO(Unit):
  do IO<Unit>:
    args : List<String> <- IO.args()
    start(args)
