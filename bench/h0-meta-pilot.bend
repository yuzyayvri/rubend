import Base
import ../src/h0-classes.bend as G
import ../src/h0-edge-table.bend as E
import ../src/h0-meta.bend as M
import ../src/joint-cache.bend as Cache

def assembled(state: M.Build, path: String) -> IO(Unit):
  match state:
    case M.H0MFailed{index, code}: IO.die(Unit, 2, "H0 metadata failed " ++ U32.show(index) ++ " code " ++ U32.show(code))
    case M.H0MComplete{meta}:
      do IO<Unit>:
        meta : Array<U32> <- Cache.save(path, meta, M.words())
        IO.print("{\"complete\":true,\"words\":2892000,\"classes\":3393,\"edges\":34650,\"entries\":117567450}")
    case _: IO.die(Unit, 2, "Incomplete H0 metadata")

def edges(table: Array<U32>, corners: G.Audit, path: String) -> IO(Unit):
  assembled(M.generate(corners, E.audit(table)), path)

def corners(table: Array<U32>, edge_path: String, path: String) -> IO(Unit):
  do IO<Unit>:
    edge_table : Array<U32> <- Cache.load_words(edge_path, [4294967295 : U32^22n], 0, 4194304)
    edges(edge_table, G.audit(G.ClassComplete{table, 3393, 153090}), path)

def run(corner_path: String, edge_path: String, path: String) -> IO(Unit):
  do IO<Unit>:
    corner_table : Array<U32> <- Cache.load_words(corner_path, [4294967295 : U32^20n], 0, 1048576)
    corners(corner_table, edge_path, path)

def args(values: List<String>) -> IO(Unit):
  match values:
    case Con{program, Con{corner_path, Con{edge_path, Con{path, Nil{}}}}}: run(corner_path, edge_path, path)
    case _: IO.die(Unit, 2, "Expected class input, edge input, and fresh metadata output")

def main() -> IO(Unit):
  do IO<Unit>:
    values : List<String> <- IO.args()
    args(values)
