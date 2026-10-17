import Base
import ../src/main.bend as H
import ../src/model.bend as M
import ../src/cubie.bend as C
import ../src/search.bend as S
import ../src/portfolio.bend as P
import ../src/tables.bend as T
import ./advanced-main.bend as A

def numbers(xs: +List<U32>) -> String:
  "[" ++ String.join(H.move_text(xs), ",") ++ "]"

def cube(value: C.Cubie) -> String:
  match value:
    case C.Cubie{a, b, c, d, e}: numbers([a, b, c, d, e])

def frame(value: S.Frame) -> String:
  match value:
    case S.Node{root, a, b, c, left, previous, next, phase, path, length}:
      "[0," ++ cube(root) ++ "," ++ numbers([a, b, c, left, previous, next, phase, length]) ++ "," ++ numbers(path) ++ "]"
    case S.Retry{root, a, b, c, depth, previous, path, length}:
      "[1," ++ cube(root) ++ "," ++ numbers([a, b, c, depth, previous, length]) ++ "," ++ numbers(path) ++ "]"

def frames(xs: +List<S.Frame>) -> +List<String>:
  match xs:
    case Nil{}: Nil{}
    case Con{x, rest}: frame(x) <> frames(rest)

def meta(value: S.Meta) -> String:
  match value:
    case S.Meta{root, p1, ceiling, best, length, mode, bound, lower, nodes, status, +profile}:
      "[" ++ cube(root) ++ "," ++ numbers([p1, ceiling, length, mode, bound, lower, nodes, status]) ++ "," ++ numbers(best) ++ "]"

def tasks(xs: +List<P.Task>) -> +List<String>:
  match xs:
    case Nil{}: Nil{}
    case Con{P.Task{axis, stack, state}, rest}:
      ("[" ++ U32.show(axis) ++ "," ++ meta(state) ++ ",[" ++ String.join(frames(stack), ",") ++ "]]") <> tasks(rest)

def snapshot(+id: String, +original: M.Cube, initial_request: U32, slice: U32, entries: +List<P.Task>, root: C.Cubie, +best: +List<U32>, +length: U32, +lower: U32, +nodes: U32, request: U32, +status: U32) -> IO(Unit):
  do IO<Unit>:
    H.emit(U32.is_lt(length, 31), original, best, length, lower, nodes, U32.is_eq(status, 1))
    IO.print("{\"type\":\"snapshot\",\"id\":\"" ++ id ++ "\",\"request\":" ++ U32.show(initial_request) ++ ",\"slice\":" ++ U32.show(slice) ++ ",\"nodes\":" ++ U32.show(nodes) ++ ",\"moves\":" ++ numbers(List.reverse(&2, U32, best)) ++ ",\"length\":" ++ U32.show(length) ++ ",\"lower\":" ++ U32.show(lower) ++ ",\"status\":" ++ U32.show(status) ++ ",\"state\":[" ++ cube(root) ++ "," ++ U32.show(request) ++ ",[" ++ String.join(tasks(entries), ",") ++ "]]}")

def snapshots(fuel: Nat, +id: String, +original: M.Cube, +initial_request: U32, +slice: U32, state: P.Session) -> IO(Array<U32>):
  match fuel state:
    case 0n P.Session{table, entries, root, best, length, lower, nodes, request, status}:
      do IO<Array<U32>>:
        snapshot(id, original, initial_request, slice, entries, root, best, length, lower, nodes, request, status)
        return table
    case 1n+p P.Session{table, +entries, +root, +best, +length, +lower, +nodes, +request, +status}:
      do IO<Array<U32>>:
        snapshot(id, original, initial_request, slice, entries, root, best, length, lower, nodes, request, status)
        snapshots(p, id, original, initial_request, (slice + 1 : U32), P.advance(P.Session{table, entries, root, best, length, lower, nodes, request, status}))

def solve(valid: C.Validation, +original: M.Cube, id: String, +request: U32, slices: U32, table: Array<U32>, +profile: S.Profile) -> IO(Array<U32>):
  match valid:
    case C.Valid{root}: snapshots(U32.to_nat(slices), id, original, request, 0, P.initialize(table, original, root, request, profile))
    case _: IO.die(Array<U32>, 2, "Invalid fixed-work cube")

def parsed(value: Maybe<&2, M.Cube>, id: String, request: Maybe<&2, U32>, slices: Maybe<&2, U32>, table: Array<U32>, +profile: S.Profile) -> IO(Array<U32>):
  match value request slices:
    case Some{+original} Some{request} Some{slices}: solve(C.validate(original), original, id, request, slices, table, profile)
    case _ _ _: IO.die(Array<U32>, 2, "Invalid fixed-work request")

def command(args: +List<String>, table: Array<U32>, +profile: S.Profile) -> IO(Array<U32>):
  match args:
    case Con{id, Con{text, Con{request, Con{slices, Nil{}}}}}: parsed(M.from_list(H.colors(text)), id, U32.read(request), U32.read(slices), table, profile)
    case _: IO.die(Array<U32>, 2, "Expected id, facelets, request, slices")

def read_requests(fuel: Nat, acc: String, read: File & Result<&1, &1, U32 & String, String>) -> IO(String):
  match fuel read:
    case _ Tuple{file, Done{SNil{}}}:
      do IO<String>:
        File.close(file)
        return acc
    case 1n+p Tuple{file, Done{text}}:
      do IO<String>:
        read : File & Result<&1, &1, U32 & String, String> <- File.read(file, 4096)
        read_requests(p, acc ++ text, read)
    case _ Tuple{file, result}:
      do IO<String>:
        File.close(file)
        IO.die(String, 2, "Fixed-work request file read failed or exceeded 64 KiB")

def commands(lines: +List<String>, table: Array<U32>, +profile: S.Profile) -> IO(Array<U32>):
  match lines:
    case Nil{}: IO.pure(Array<U32>, table)
    case Con{SNil{}, rest}: commands(rest, table, profile)
    case Con{line, rest}:
      do IO<Array<U32>>:
        table : Array<U32> <- command(String.split(line, Chr{9}), table, profile)
        commands(rest, table, profile)

def load(raw: Bool) -> IO(Array<U32>):
  match raw:
    case True{}: A.table()
    case False{}: H.checked_table(Array.size(U32, T.generate()))

def start(args: List<String>) -> IO(Unit):
  match args:
    case Con{program, Con{+tier, Con{path, Nil{}}}}:
      do IO<Unit>:
        table : Array<U32> <- load(String.eq(tier, "raw"))
        file : File <- IO.try(File, File.open(path, "r"))
        read : File & Result<&1, &1, U32 & String, String> <- File.read(file, 4096)
        text : String <- read_requests(16n, "", read)
        table : Array<U32> <- commands(String.split(text, Chr{10}), table, S.raw_profile(String.eq(tier, "raw")))
        IO.pure(Unit, Unit{})
    case _: IO.die(Unit, 2, "Expected light|raw and request file")

def main() -> IO(Unit):
  do IO<Unit>:
    args : List<String> <- IO.args()
    start(args)
