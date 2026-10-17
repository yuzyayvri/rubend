import Base
import ../src/tables.bend as Tables

def report(read: Array<U32> & U32, a: Nat, b: Nat) -> IO(Unit):
  match read:
    case Tuple{table, size}:
      IO.print("tables " ++ Nat.show(Nat.sub(b, a)) ++ " " ++ U32.show(size))

def main() -> IO(Unit):
  do IO<Unit>:
    a : Nat <- IO.now()
    table : Array<U32> = Tables.generate()
    b : Nat <- IO.now()
    report(Array.size(U32, table), a, b)
