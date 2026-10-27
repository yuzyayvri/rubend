import Base
import ../src/tables.bend as T
import ./edge-pattern-table.bend as V
import ./phase2-small-table.bend as P

def texts(values: +List<U32>) -> +List<String>:
  match values:
    case Nil{}: Nil{}
    case Con{value, rest}: U32.show(value) <> texts(rest)

def print_values(result: Array<U32> & +List<U32>, reached: U32, elapsed: Nat) -> IO(Unit):
  match result:
    case Tuple{array, values}:
      IO.print("{\"format\":\"rubend-phase2-small-table-v1\",\"reached\":" ++ U32.show(reached) ++ ",\"buildMs\":" ++ Nat.show(elapsed) ++ ",\"values\":[" ++ String.join(texts(values), ",") ++ "]}")

def finish(result: T.Breadth, started: Nat) -> IO(Unit):
  match result:
    case T.BEnd{table, reached}:
      do IO<Unit>:
        ended : Nat <- IO.now()
        print_values(V.values(235200n, 0, (table, Nil{})), reached, Nat.sub(ended, started))
    case _: IO.die(Unit, 2, "Small phase-two table did not exhaust its queue")

def main() -> IO(Unit):
  do IO<Unit>:
    started : Nat <- IO.now()
    finish(P.build(), started)
