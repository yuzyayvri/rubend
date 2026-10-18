import Base
import ../src/h0-table.bend as B
import ../src/h0-meta.bend as M
import ../src/h0-classes.bend as G
import ../src/h0-edge-table.bend as E
import ../src/joint-cache.bend as Cache

def finish(ok: Bool) -> IO(Unit):
  match ok:
    case True{}: IO.pure(Unit, Unit{})
    case False{}: IO.die(Unit, 2, "Missing stabilizer-equivalent edge")

def read_value(read: Array<U32> & U32, +tail: U32) -> IO(Unit):
  match read:
    case Tuple{data, +value}:
      do IO<Unit>:
        IO.print("{\"equivalent\":" ++ U32.show(value) ++ ",\"orbitMembers\":" ++ U32.show(tail) ++ "}")
        finish(U32.is_eq(value, 5) && U32.is_gt(tail, 1) && U32.is_le(tail, 48))

def visited(state: B.Build) -> IO(Unit):
  match state:
    case B.H0TWork{meta, data, queue, head, tail, limit, maximum}: read_value(B.get(data, (1612 * 34650 + 28646 : U32)), tail)
    case _: IO.die(Unit, 3, "Orbit assignment unexpectedly failed")

def admitted(state: M.Audit) -> IO(Unit):
  match state:
    case M.H0MAudited{meta}: visited(B.visit((1612 * 34650 + 14376 : U32), 5, B.H0TWork{meta, [4294967295 : U32^25n], [0 : U32^6n], 0, 0, 64, 0}))
    case _: IO.die(Unit, 3, "Metadata did not validate")

def inputs(corners: Array<U32>, edges: Array<U32>, actual: Array<U32>) -> IO(Unit):
  admitted(M.audit(actual, G.audit(G.ClassComplete{corners, 3393, 153090}), E.audit(edges)))

def run(corner_path: String, edge_path: String, meta_path: String) -> IO(Unit):
  do IO<Unit>:
    corners : Array<U32> <- Cache.load_words(corner_path, [4294967295 : U32^20n], 0, 1048576)
    edges : Array<U32> <- Cache.load_words(edge_path, [4294967295 : U32^22n], 0, 4194304)
    actual : Array<U32> <- Cache.load_words(meta_path, [4294967295 : U32^22n], 0, 2892000)
    inputs(corners, edges, actual)

def args(values: List<String>) -> IO(Unit):
  match values:
    case Con{program, Con{corner_path, Con{edge_path, Con{meta_path, Nil{}}}}}: run(corner_path, edge_path, meta_path)
    case _: IO.die(Unit, 3, "Expected three metadata input paths")

def main() -> IO(Unit):
  do IO<Unit>:
    values : List<String> <- IO.args()
    args(values)
