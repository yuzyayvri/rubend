import Base
import ../src/h0-table.bend as B
import ../src/h0-table-audit.bend as A
import ../src/h0-meta.bend as M
import ../src/h0-classes.bend as G
import ../src/h0-edge-table.bend as E
import ../src/joint-cache.bend as Cache

def output(state: A.Audit) -> IO(Unit):
  match state:
    case A.H0TAFailed{index, code}: IO.print("{\"failed\":true,\"index\":" ++ U32.show(index) ++ ",\"code\":" ++ U32.show(code) ++ "}")
    case A.H0TAWork{meta, data, index, goal, maximum, sum}: IO.print("{\"failed\":false,\"complete\":false,\"index\":" ++ U32.show(index) ++ "}")
    case _: IO.die(Unit, 2, "Unexpected audit result")

def altered_neighbor(read: Array<U32> & U32, data: Array<U32>) -> A.Audit:
  match read:
    case Tuple{meta, target}: A.run(1n, A.H0TAWork{meta, B.put(data, target, 4), 0, 450429, 0, 0n})

def fixture(meta: Array<U32>, mode: U32) -> A.Audit:
  match mode:
    case 0: A.start(B.H0TWork{meta, [4294967295 : U32^25n], [0 : U32^6n], 0, 1, 64, 0})
    case 1: A.start(B.H0TComplete{meta, [4294967295 : U32^6n], 0, 0})
    case 2: A.start(B.H0TComplete{meta, [4294967295 : U32^25n], 0, 0})
    case 3: A.run(1n, A.start(B.H0TComplete{meta, B.put([4294967295 : U32^25n], 450429, 0), 0, 0}))
    case 4: A.run(1n, A.H0TAWork{meta, [0 : U32^25n], 0, 450429, 0, 0n})
    case 5: altered_neighbor(B.neighbor(meta, 0, 0, 0), B.put([16843009 : U32^25n], 450429, 0))
    case 6: A.run(1n, A.H0TAWork{meta, B.put([16843009 : U32^25n], 450429, 0), 10000000, 450429, 0, 0n})
    case 7: A.run(1n, A.H0TAWork{meta, B.put([4294967295 : U32^25n], 117567450, 0), 117567450, 450429, 0, 0n})
    case 8: A.orbits(A.H0TANode{meta, B.put([16843009 : U32^25n], (1612 * 34650 + 28646 : U32), 2), (1612 * 34650 + 14376 : U32), 450429, 1, 0n, 1, True{}})
    case 9: A.run(1n, A.H0TAWork{meta, B.put([16843009 : U32^25n], 450429, 0), 450429, 450429, 0, 0n})
    case _: A.H0TAFailed{0, 99}

def admitted(state: M.Audit, mode: U32) -> IO(Unit):
  match state:
    case M.H0MAudited{meta}: output(fixture(meta, mode))
    case _: IO.die(Unit, 2, "Metadata rejected")

def loaded(corners: Array<U32>, edges: Array<U32>, actual: Array<U32>, mode: U32) -> IO(Unit):
  admitted(M.audit(actual, G.audit(G.ClassComplete{corners, 3393, 153090}), E.audit(edges)), mode)

def run(corner_path: String, edge_path: String, meta_path: String, mode: U32) -> IO(Unit):
  do IO<Unit>:
    corners : Array<U32> <- Cache.load_words(corner_path, [4294967295 : U32^20n], 0, 1048576)
    edges : Array<U32> <- Cache.load_words(edge_path, [4294967295 : U32^22n], 0, 4194304)
    actual : Array<U32> <- Cache.load_words(meta_path, [4294967295 : U32^22n], 0, 2892000)
    loaded(corners, edges, actual, mode)

def parsed(value: Maybe<&2, U32>, corner_path: String, edge_path: String, meta_path: String) -> IO(Unit):
  match value:
    case Some{mode}: run(corner_path, edge_path, meta_path, mode)
    case None{}: IO.die(Unit, 2, "Invalid fixture mode")

def args(values: List<String>) -> IO(Unit):
  match values:
    case Con{program, Con{corner_path, Con{edge_path, Con{meta_path, Con{mode, Nil{}}}}}}: parsed(U32.read(mode), corner_path, edge_path, meta_path)
    case _: IO.die(Unit, 2, "Expected three metadata paths and fixture mode")

def main() -> IO(Unit):
  do IO<Unit>:
    values : List<String> <- IO.args()
    args(values)
