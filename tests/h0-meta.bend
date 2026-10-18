import Base
import ../src/h0-meta.bend as M
import ../src/h0-classes.bend as G
import ../src/h0-edge-table.bend as E
import ../src/joint-cache.bend as Cache

def report(state: M.Audit) -> IO(Unit):
  match state:
    case M.H0MAudited{table}: IO.print("{\"audited\":true,\"words\":2892000}")
    case M.H0MAuditFailed{index, code}: IO.die(Unit, 2, "H0 metadata audit rejected " ++ U32.show(index) ++ " code " ++ U32.show(code))
    case _: IO.die(Unit, 3, "H0 metadata audit incomplete")

def mutation(mode: U32, table: Array<U32>) -> Array<U32>:
  match mode:
    case 1: table[0] <- 0
    case 2: table[15] <- 4294967295
    case 3: table[M.stabilizers_lo()] <- 0
    case 4: table[M.corner_moves()] <- 4294967295
    case 5: table[M.edge_moves()] <- 4294967295
    case 6: table[M.edge_symmetries()] <- 4294967295
    case 7: [0 : U32^10n]
    case _: table

def checked(mode: U32, actual: Array<U32>, corners: G.Audit, edges: E.Audit) -> IO(Unit):
  match mode:
    case 8: report(M.audit(actual, G.ClassAuditFailed{0, 6}, edges))
    case 9: report(M.audit(actual, corners, E.E0Failed{0, 7}))
    case mode: report(M.audit(mutation(mode, actual), corners, edges))

def inputs(actual: Array<U32>, corners: Array<U32>, edges: Array<U32>, mode: U32) -> IO(Unit):
  checked(mode, actual, G.audit(G.ClassComplete{corners, 3393, 153090}), E.audit(edges))

def run(corner_path: String, edge_path: String, actual_path: String, mode: U32) -> IO(Unit):
  do IO<Unit>:
    corners : Array<U32> <- Cache.load_words(corner_path, [4294967295 : U32^20n], 0, 1048576)
    edges : Array<U32> <- Cache.load_words(edge_path, [4294967295 : U32^22n], 0, 4194304)
    actual : Array<U32> <- Cache.load_words(actual_path, [4294967295 : U32^22n], 0, 2892000)
    inputs(actual, corners, edges, mode)

def parsed(value: Maybe<&2, U32>, corner_path: String, edge_path: String, actual_path: String) -> IO(Unit):
  match value:
    case Some{mode}: run(corner_path, edge_path, actual_path, mode)
    case None{}: IO.die(Unit, 2, "Invalid metadata audit mode")

def args(values: List<String>) -> IO(Unit):
  match values:
    case Con{program, Con{corner_path, Con{edge_path, Con{actual_path, Con{mode, Nil{}}}}}}: parsed(U32.read(mode), corner_path, edge_path, actual_path)
    case _: IO.die(Unit, 2, "Expected class, edge, metadata paths and mode")

def main() -> IO(Unit):
  do IO<Unit>:
    values : List<String> <- IO.args()
    args(values)
