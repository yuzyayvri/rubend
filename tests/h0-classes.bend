import Base
import ../src/h0-classes.bend as G
import ../src/joint-cache.bend as Cache

def report(state: G.Audit) -> IO(Unit):
  match state:
    case G.ClassAudited{table, checked}: IO.print("{\"audited\":true,\"checked\":" ++ U32.show(checked) ++ "}")
    case G.ClassAuditFailed{index, code}: IO.die(Unit, 2, "H0 audit rejected " ++ U32.show(index) ++ " code " ++ U32.show(code))
    case _: IO.die(Unit, 3, "H0 audit incomplete")

def missing_identity(read: Array<U32> & U32) -> G.Build:
  match read:
    case Tuple{table, word}:
      table[G.stabilizers_lo()] <- (word .&. 4294967294 : U32)
      G.ClassComplete{table, 3393, 153090}

def mutation(mode: U32, table: Array<U32>) -> G.Build:
  match mode:
    case 0: G.ClassComplete{table, 3393, 153090}
    case 1:
      table[0] <- 4294901760
      G.ClassComplete{table, 3393, 153090}
    case 2:
      table[G.representatives()] <- 153090
      G.ClassComplete{table, 3393, 153090}
    case 3: missing_identity(table[G.stabilizers_lo()])
    case 4:
      table[G.stabilizers_hi()] <- 65536
      G.ClassComplete{table, 3393, 153090}
    case 5: G.ClassComplete{[0 : U32^10n], 3393, 153090}
    case 6: G.ClassComplete{table, 3392, 153090}
    case _: G.ClassFailed{0, 255}

def loaded(table: Array<U32>, mode: U32) -> IO(Unit):
  report(G.audit(mutation(mode, table)))

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
    case _: IO.die(Unit, 2, "Expected input path and audit mode")

def main() -> IO(Unit):
  do IO<Unit>:
    values : List<String> <- IO.args()
    args(values)
