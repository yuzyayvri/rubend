import Base
import ../src/h0-distances.bend as D
import ../src/joint-cache.bend as Cache

def report(state: D.Audit) -> IO(Unit):
  match state:
    case D.H0DAudited{moves, table, maximum, sum}: IO.print("{\"audited\":true,\"maximum\":" ++ U32.show(maximum) ++ ",\"sum\":" ++ U32.show(sum) ++ "}")
    case D.H0DAuditFailed{index, code}: IO.die(Unit, 2, "H0 distance audit rejected " ++ U32.show(index) ++ " code " ++ U32.show(code))
    case _: IO.die(Unit, 3, "H0 distance audit incomplete")

def flat_raw(fuel: Nat, table: Array<U32>, +index: U32) -> Array<U32>:
  match fuel:
    case 0n: table
    case 1n+p:
      table[(300000 + index : U32)] <- 1
      flat_raw(p, table, (index + 1 : U32))

def flat_class(fuel: Nat, table: Array<U32>, +index: U32) -> Array<U32>:
  match fuel:
    case 0n: table
    case 1n+p:
      table[(600000 + index : U32)] <- 1
      flat_class(p, table, (index + 1 : U32))

def mutate(mode: U32, moves: Array<U32>, table: Array<U32>) -> D.Build:
  match mode:
    case 0: D.DComplete{moves, table, 3393, 9}
    case 1:
      table[300023] <- 1
      D.DComplete{moves, table, 3393, 9}
    case 2:
      table[300000] <- 4294967295
      D.DComplete{moves, table, 3393, 9}
    case 3:
      table[600000] <- 0
      D.DComplete{moves, table, 3393, 9}
    case 4:
      table[300000] <- 254
      table[600000] <- 254
      D.DComplete{moves, table, 3393, 9}
    case 5:
      moves[0] <- 2187
      D.DComplete{moves, table, 3393, 9}
    case 6:
      table = flat_class(3393n, flat_raw(153090n, table, 0), 0)
      table[300023] <- 0
      table[600012] <- 0
      D.DComplete{moves, table, 3393, 9}
    case 7: D.DComplete{moves, [0 : U32^10n], 3393, 9}
    case 8: D.DComplete{[0 : U32^10n], table, 3393, 9}
    case _: D.DComplete{moves, table, 153090, 9}

def loaded(table: Array<U32>, mode: U32) -> IO(Unit):
  report(D.audit(mutate(mode, D.transitions(), table)))

def run(path: String, mode: U32) -> IO(Unit):
  do IO<Unit>:
    table : Array<U32> <- Cache.load_words(path, [4294967295 : U32^20n], 0, 1048576)
    loaded(table, mode)

def parsed(value: Maybe<&2, U32>, path: String) -> IO(Unit):
  match value:
    case Some{mode}: run(path, mode)
    case None{}: IO.die(Unit, 2, "Invalid audit mode")

def args(values: List<String>) -> IO(Unit):
  match values:
    case Con{program, Con{path, Con{mode, Nil{}}}}: parsed(U32.read(mode), path)
    case _: IO.die(Unit, 2, "Expected H0 distances and audit mode")

def main() -> IO(Unit):
  do IO<Unit>:
    values : List<String> <- IO.args()
    args(values)
