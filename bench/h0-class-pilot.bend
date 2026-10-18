import Base
import ../src/h0-classes.bend as G
import ../src/joint-cache.bend as Cache

def audited(state: G.Audit, classes: U32, visited: U32, generated: Nat, started: Nat, path: String) -> IO(Unit):
  match state:
    case G.ClassAuditFailed{index, code}: IO.die(Unit, 2, "H0 class audit failed " ++ U32.show(index) ++ " code " ++ U32.show(code))
    case G.ClassAudited{table, checked}:
      do IO<Unit>:
        ended : Nat <- IO.now()
        IO.print("{\"classes\":" ++ U32.show(classes) ++ ",\"visited\":" ++ U32.show(visited) ++ ",\"rawRoundtrips\":" ++ U32.show(checked) ++ ",\"generationMs\":" ++ Nat.show(generated) ++ ",\"auditMs\":" ++ Nat.show(Nat.sub(ended, started)) ++ ",\"stabilizerAudit\":true}")
        table : Array<U32> <- Cache.save(path, table, 1048576)
        IO.pure(Unit, Unit{})
    case _: IO.die(Unit, 2, "Unexpected H0 class audit state")

def generated(state: G.Build, started: Nat, path: String) -> IO(Unit):
  match state:
    case G.ClassFailed{index, code}: IO.die(Unit, 2, "H0 class generation failed " ++ U32.show(index) ++ " code " ++ U32.show(code))
    case G.ClassComplete{table, +classes, +visited}:
      do IO<Unit>:
        +ended : Nat <- IO.now()
        IO.print("{\"phase\":\"generated\",\"classes\":" ++ U32.show(classes) ++ ",\"visited\":" ++ U32.show(visited) ++ "}")
        audited(G.audit(G.ClassComplete{table, classes, visited}), classes, visited, Nat.sub(ended, started), ended, path)
    case _: IO.die(Unit, 2, "Incomplete H0 class generation")

def run(path: String) -> IO(Unit):
  do IO<Unit>:
    started : Nat <- IO.now()
    generated(G.generate(), started, path)

def arguments(args: List<String>) -> IO(Unit):
  match args:
    case Con{program, Con{path, Nil{}}}: run(path)
    case _: IO.die(Unit, 2, "Expected a fresh output path")

def main() -> IO(Unit):
  do IO<Unit>:
    args : List<String> <- IO.args()
    arguments(args)
