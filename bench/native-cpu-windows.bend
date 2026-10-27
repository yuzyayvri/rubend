import Base
import ../src/main.bend as H
import ../src/model.bend as M
import ../src/cubie.bend as C
import ../src/search.bend as S
import ../src/portfolio.bend as P
import ../src/tables.bend as T
import ./fixed-work.bend as F
import ./native-cpu-work.bend as W
import ./process-cpu.bend as CPU

def clock(enabled: Bool) -> IO(U32 & U32):
  match enabled:
    case True{}: IO.try(U32 & U32, CPU.sample(0))
    case False{}: IO.pure(U32 & U32, (0, 0))

def window(enabled: Bool, phase: String, id: String, before: U32 & U32, after: U32 & U32, elapsed: Nat) -> IO(Unit):
  match before after:
    case Tuple{bs, bn} Tuple{es, en}:
      IO.print("{\"type\":\"cpu-window\",\"phase\":\"" ++ phase ++ "\",\"id\":\"" ++ id ++ "\",\"enabled\":" ++ U32.show(C.pick(enabled, 1, 0)) ++ ",\"before\":[" ++ U32.show(bs) ++ "," ++ U32.show(bn) ++ "],\"after\":[" ++ U32.show(es) ++ "," ++ U32.show(en) ++ "],\"wallMs\":" ++ Nat.show(elapsed) ++ "}")

def finish(state: P.Session, +original: M.Cube, +id: String, +request: U32, +slices: U32, +enabled: Bool, before: U32 & U32, started: Nat) -> IO(Array<U32>):
  match state:
    case P.Session{table, entries, root, best, length, lower, nodes, mode, status}:
      do IO<Array<U32>>:
        F.snapshot(id, original, request, slices, entries, root, best, length, lower, nodes, mode, status)
        after : U32 & U32 <- clock(enabled)
        ended : Nat <- IO.now()
        window(enabled, "request", id, before, after, Nat.sub(ended, started))
        return table

def solve(valid: C.Validation, +original: M.Cube, id: String, +request: U32, +slices: U32, table: Array<U32>, enabled: Bool, before: U32 & U32, started: Nat) -> IO(Array<U32>):
  match valid:
    case C.Valid{root}:
      finish(W.work(U32.to_nat(slices), P.initialize(table, original, root, P.request_mode(U32.is_eq(request, 2)), S.Light{})), original, id, request, slices, enabled, before, started)
    case _: IO.die(Array<U32>, 2, "Invalid CPU-window cube")

def parsed(value: Maybe<&2, M.Cube>, id: String, request: U32, slices: U32, table: Array<U32>, enabled: Bool, before: U32 & U32, started: Nat) -> IO(Array<U32>):
  match value:
    case Some{+original}: solve(C.validate(original), original, id, request, slices, table, enabled, before, started)
    case _: IO.die(Array<U32>, 2, "Invalid CPU-window facelets")

def admitted(ok: Bool, id: String, text: String, request: U32, slices: U32, table: Array<U32>, +enabled: Bool) -> IO(Array<U32>):
  match ok:
    case True{}:
      do IO<Array<U32>>:
        before : U32 & U32 <- clock(enabled)
        started : Nat <- IO.now()
        parsed(M.from_list(H.colors(text)), id, request, slices, table, enabled, before, started)
    case False{}: IO.die(Array<U32>, 2, "Invalid CPU-window limits")

def numbers(id: String, text: String, request: Maybe<&2, U32>, slices: Maybe<&2, U32>, table: Array<U32>, enabled: Bool) -> IO(Array<U32>):
  match request slices:
    case Some{+request} Some{+slices}:
      admitted((U32.is_eq(request, 0) || U32.is_eq(request, 2)) && U32.is_le(slices, 20), id, text, request, slices, table, enabled)
    case _ _: IO.die(Array<U32>, 2, "Invalid CPU-window numbers")

def command(args: +List<String>, table: Array<U32>, enabled: Bool) -> IO(Array<U32>):
  match args:
    case Con{id, Con{text, Con{request, Con{slices, Nil{}}}}}:
      numbers(id, text, U32.read(request), U32.read(slices), table, enabled)
    case _: IO.die(Array<U32>, 2, "Expected CPU-window request")

def commands(lines: +List<String>, table: Array<U32>, +enabled: Bool) -> IO(Array<U32>):
  match lines:
    case Nil{}: IO.pure(Array<U32>, table)
    case Con{SNil{}, rest}: commands(rest, table, enabled)
    case Con{line, rest}:
      do IO<Array<U32>>:
        table : Array<U32> <- command(String.split(line, Chr{9}), table, enabled)
        commands(rest, table, enabled)

def initialized(read: Array<U32> & U32, +enabled: Bool, before: U32 & U32, started: Nat) -> IO(Array<U32>):
  match read:
    case Tuple{table, size}:
      do IO<Array<U32>>:
        IO.print("{\"type\":\"initialized\",\"capacity\":" ++ U32.show(size) ++ "}")
        after : U32 & U32 <- clock(enabled)
        ended : Nat <- IO.now()
        window(enabled, "initialization", "init", before, after, Nat.sub(ended, started))
        return table

def worker(path: String, +enabled: Bool) -> IO(Unit):
  do IO<Unit>:
    file : File <- IO.try(File, File.open(path, "r"))
    read : File & Result<&1, &1, U32 & String, String> <- File.read(file, 4096)
    text : String <- F.read_requests(16n, "", read)
    before : U32 & U32 <- clock(enabled)
    started : Nat <- IO.now()
    table : Array<U32> <- H.checked_table(Array.size(U32, T.generate()))
    table : Array<U32> <- initialized(Array.size(U32, table), enabled, before, started)
    table : Array<U32> <- commands(String.split(text, Chr{10}), table, enabled)
    IO.pure(Unit, Unit{})

def start(args: List<String>) -> IO(Unit):
  match args:
    case Con{program, Con{"on", Con{path, Nil{}}}}: worker(path, True{})
    case Con{program, Con{"off", Con{path, Nil{}}}}: worker(path, False{})
    case _: IO.die(Unit, 2, "Expected on|off and CPU-window requests")

def main() -> IO(Unit):
  do IO<Unit>:
    args : List<String> <- IO.args()
    start(args)
