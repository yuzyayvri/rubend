import Base
import ./fixed-work.bend as F
import ./search-observer.bend as D
import ../src/search.bend as S
import ../src/portfolio.bend as P
import ../src/model.bend as M
import ../src/cubie.bend as C
import ../src/main.bend as H

def count_text(fuel: Nat, read: Array<Nat> & Nat, +index: U32, acc: +List<String>) -> Array<Nat> & String:
  match fuel read:
    case 0n Tuple{counts, value}: (counts, "[" ++ String.join(List.reverse(&2, String, acc), ",") ++ "]")
    case 1n+p Tuple{counts, value}: count_text(p, Array.get(Nat, counts, (index + 1 : U32)), (index + 1 : U32), Nat.show(value) <> acc)

def emit_text(read: Array<Nat> & String, id: String, request: U32, slice: U32) -> IO(Array<Nat>):
  match read:
    case Tuple{counts, text}:
      do IO<Array<Nat>>:
        IO.print("{\"type\":\"diagnostic\",\"id\":\"" ++ id ++ "\",\"request\":" ++ U32.show(request) ++ ",\"slice\":" ++ U32.show(slice) ++ ",\"counts\":" ++ text ++ "}")
        return counts

def emit(sound: Bool, counts: Array<Nat>, id: String, request: U32, slice: U32) -> IO(Array<Nat>):
  match sound:
    case True{}: emit_text(count_text(18n, Array.get(Nat, counts, 0), 0, Nil{}), id, request, slice)
    case False{}: IO.die(Array<Nat>, 2, "Diagnostic prediction disagrees with actual search")

def snapshots(fuel: Nat, +id: String, +original: M.Cube, +initial: U32, +index: U32, state: D.Session) -> IO(Array<U32>):
  match fuel state:
    case 0n D.Session{P.Session{table, entries, root, best, length, lower, nodes, request, status}, counts, sound}:
      do IO<Array<U32>>:
        F.snapshot(id, original, initial, index, entries, root, best, length, lower, nodes, request, status)
        counts : Array<Nat> <- emit(sound, counts, id, initial, index)
        return table
    case 1n+p D.Session{P.Session{table, +entries, +root, +best, +length, +lower, +nodes, +request, +status}, counts, +sound}:
      do IO<Array<U32>>:
        F.snapshot(id, original, initial, index, entries, root, best, length, lower, nodes, request, status)
        counts : Array<Nat> <- emit(sound, counts, id, initial, index)
        snapshots(p, id, original, initial, (index + 1 : U32), D.advance(D.Session{P.Session{table, entries, root, best, length, lower, nodes, request, status}, counts, sound}))

def solve(valid: C.Validation, +original: M.Cube, id: String, +request: U32, slices: U32, table: Array<U32>, profile: S.Profile) -> IO(Array<U32>):
  match valid:
    case C.Valid{root}: snapshots(U32.to_nat(slices), id, original, request, 0, D.Session{P.initialize(table, original, root, P.request_mode(U32.is_eq(request, 2)), profile), D.empty_counts(), True{}})
    case _: IO.die(Array<U32>, 2, "Invalid diagnostic cube")

def parsed(value: Maybe<&2, M.Cube>, id: String, request: Maybe<&2, U32>, slices: Maybe<&2, U32>, table: Array<U32>, profile: S.Profile) -> IO(Array<U32>):
  match value request slices:
    case Some{+original} Some{request} Some{slices}: solve(C.validate(original), original, id, request, slices, table, profile)
    case _ _ _: IO.die(Array<U32>, 2, "Invalid diagnostic request")

def command(args: +List<String>, table: Array<U32>, profile: S.Profile) -> IO(Array<U32>):
  match args:
    case Con{id, Con{text, Con{request, Con{slices, Nil{}}}}}: parsed(M.from_list(H.colors(text)), id, U32.read(request), U32.read(slices), table, profile)
    case _: IO.die(Array<U32>, 2, "Expected diagnostic request fields")

def commands(lines: +List<String>, table: Array<U32>, +profile: S.Profile) -> IO(Array<U32>):
  match lines:
    case Nil{}: IO.pure(Array<U32>, table)
    case Con{SNil{}, rest}: commands(rest, table, profile)
    case Con{line, rest}:
      do IO<Array<U32>>:
        table : Array<U32> <- command(String.split(line, Chr{9}), table, profile)
        commands(rest, table, profile)

def start(args: List<String>) -> IO(Unit):
  match args:
    case Con{program, Con{+tier, Con{path, Nil{}}}}:
      do IO<Unit>:
        table : Array<U32> <- F.load(String.eq(tier, "raw"))
        file : File <- IO.try(File, File.open(path, "r"))
        read : File & Result<&1, &1, U32 & String, String> <- File.read(file, 4096)
        text : String <- F.read_requests(16n, "", read)
        table : Array<U32> <- commands(String.split(text, Chr{10}), table, S.raw_profile(String.eq(tier, "raw")))
        IO.pure(Unit, Unit{})
    case _: IO.die(Unit, 2, "Expected light|raw and diagnostic request file")

def main() -> IO(Unit):
  do IO<Unit>:
    args : List<String> <- IO.args()
    start(args)
