import Base
import ../src/main.bend as H
import ../src/model.bend as M
import ../src/cubie.bend as C
import ./fixed-work.bend as F
import ./partition-worker-core.bend as W

def result(value: W.PartResult, +original: M.Cube, +id: String, +scope: String) -> IO(Array<U32>):
  match value:
    case W.PartExhausted{table, steps}:
      do IO<Array<U32>>:
        IO.print("{\"type\":\"result\",\"id\":\"" ++ id ++ "\",\"scope\":\"" ++ scope ++ "\",\"status\":\"exhausted\",\"stackEmpty\":true,\"length\":31,\"steps\":" ++ U32.show(steps) ++ "}")
        return table
    case W.PartFound{table, reverse, +length, +steps}:
      do IO<Array<U32>>:
        H.emit_for(True{}, original, reverse, length, 0, steps, False{}, ",\"id\":\"" ++ id ++ "\",\"scope\":\"" ++ scope ++ "\"")
        IO.print("{\"type\":\"result\",\"id\":\"" ++ id ++ "\",\"scope\":\"" ++ scope ++ "\",\"status\":\"found\",\"stackEmpty\":null,\"length\":" ++ U32.show(length) ++ ",\"steps\":" ++ U32.show(steps) ++ "}")
        return table
    case W.PartPartial{table, steps}:
      do IO<Array<U32>>:
        IO.print("{\"type\":\"result\",\"id\":\"" ++ id ++ "\",\"scope\":\"" ++ scope ++ "\",\"status\":\"partial\",\"stackEmpty\":false,\"length\":31,\"steps\":" ++ U32.show(steps) ++ "}")
        return table
    case W.PartRejected{table}: IO.die(Array<U32>, 2, "Partition input or search status refused")

def solve(valid: C.Validation, +original: M.Cube, +id: String, +scope: String, +kind: U32, +code: U32, +contour: U32, +depth: U32, +fuel: U32, table: Array<U32>) -> IO(Array<U32>):
  match valid:
    case C.Valid{+root}:
      do IO<Array<U32>>:
        IO.print("{\"type\":\"started\",\"id\":\"" ++ id ++ "\",\"scope\":\"" ++ scope ++ "\",\"root\":" ++ F.cube(root) ++ ",\"kind\":" ++ U32.show(kind) ++ ",\"code\":" ++ U32.show(code) ++ ",\"contour\":" ++ U32.show(contour) ++ ",\"depth\":" ++ U32.show(depth) ++ ",\"fuel\":" ++ U32.show(fuel) ++ ",\"goal\":2,\"profile\":3}")
        result(W.run(U32.to_nat(fuel), W.initialize(kind, table, root, contour, depth, code)), original, id, scope)
    case _: IO.die(Array<U32>, 2, "Invalid partition root")

def admitted(ok: Bool, value: Maybe<&2, M.Cube>, id: String, scope: String, kind: U32, code: U32, contour: U32, depth: U32, fuel: U32, table: Array<U32>) -> IO(Array<U32>):
  match ok value:
    case True{} Some{+original}: solve(C.validate(original), original, id, scope, kind, code, contour, depth, fuel, table)
    case _ _: IO.die(Array<U32>, 2, "Partition request refused")

def parsed(value: Maybe<&2, M.Cube>, id: String, scope: String, kind: Maybe<&2, U32>, code: Maybe<&2, U32>, contour: Maybe<&2, U32>, depth: Maybe<&2, U32>, fuel: Maybe<&2, U32>, table: Array<U32>) -> IO(Array<U32>):
  match kind code contour depth fuel:
    case Some{kind} Some{code} Some{contour} Some{depth} Some{+fuel}: admitted(U32.is_le(fuel, 4096), value, id, scope, kind, code, contour, depth, fuel, table)
    case _ _ _ _ _: IO.die(Array<U32>, 2, "Invalid partition numbers")

def command(args: +List<String>, table: Array<U32>) -> IO(Array<U32>):
  match args:
    case Con{id, Con{scope, Con{text, Con{kind, Con{code, Con{contour, Con{depth, Con{fuel, Nil{}}}}}}}}}: parsed(M.from_list(H.colors(text)), id, scope, U32.read(kind), U32.read(code), U32.read(contour), U32.read(depth), U32.read(fuel), table)
    case _: IO.die(Array<U32>, 2, "Expected scoped partition request")

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
        text : String <- F.read_requests(128n, "", read)
        table : Array<U32> <- F.load(True{})
        IO.print("{\"type\":\"ready\",\"goal\":2,\"profile\":3}")
        table : Array<U32> <- commands(String.split(text, Chr{10}), table)
        IO.pure(Unit, Unit{})
    case _: IO.die(Unit, 2, "Expected partition request file")

def main() -> IO(Unit):
  do IO<Unit>:
    args : List<String> <- IO.args()
    start(args)
