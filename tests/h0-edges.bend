import Base
import ../src/h0-edges.bend as E
import ../src/h0-edge-table.bend as G
import ../src/joint-cache.bend as Cache

def none(value: Maybe<&2, E.Edge>) -> Bool:
  match value:
    case None{}: True{}
    case Some{edge}: False{}

def report(state: G.Audit) -> IO(Unit):
  match state:
    case G.E0Audited{table}: IO.print("{\"audited\":true,\"placements\":34650,\"commutations\":29937600}")
    case G.E0Failed{index, code}: IO.die(Unit, 2, "H0 edge audit rejected " ++ U32.show(index) ++ " code " ++ U32.show(code))
    case _: IO.die(Unit, 3, "H0 edge audit incomplete")

def identity_sym(fuel: Nat, table: Array<U32>, +index: U32) -> Array<U32>:
  match fuel:
    case 0n: table
    case 1n+p:
      table[(G.sym_base() + index * 48 + 2 : U32)] <- index
      identity_sym(p, table, (index + 1 : U32))

def mutation(mode: U32, table: Array<U32>) -> Array<U32>:
  match mode:
    case 0: table
    case 1: table[0] <- 0
    case 2: table[G.moves_base()] <- 34650
    case 3: table[(G.moves_base() + 3 : U32)] <- 0
    case 4: table[G.sym_base()] <- 34650
    case 5: table[(G.sym_base() + 2 : U32)] <- 0
    case 6: identity_sym(34650n, table, 0)
    case _: [0 : U32^10n]

def loaded(table: Array<U32>, mode: U32) -> IO(Unit):
  report(G.audit(mutation(mode, table)))

def checked(ok: Bool, path: String, mode: U32) -> IO(Unit):
  match ok:
    case False{}: IO.die(Unit, 3, "H0 edge parser boundary failed")
    case True{}:
      do IO<Unit>:
        table : Array<U32> <- Cache.load_words(path, [4294967295 : U32^22n], 0, 4194304)
        loaded(table, mode)

def run(path: String, mode: U32) -> IO(Unit):
  checked(none(E.from_index(34650)) && none(E.from_index(4294967295)) && none(E.from_word(0)) && none(E.from_word(16777215)) && none(E.from_word(4294967295)), path, mode)

def parsed(value: Maybe<&2, U32>, path: String) -> IO(Unit):
  match value:
    case Some{mode}: run(path, mode)
    case None{}: IO.die(Unit, 2, "Invalid edge audit mode")

def args(values: List<String>) -> IO(Unit):
  match values:
    case Con{program, Con{path, Con{mode, Nil{}}}}: parsed(U32.read(mode), path)
    case _: IO.die(Unit, 2, "Expected edge path and audit mode")

def main() -> IO(Unit):
  do IO<Unit>:
    values : List<String> <- IO.args()
    args(values)
