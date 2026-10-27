import Base
import ./partition-ledger-fixtures.bend as F

def texts(values: +List<U32>) -> +List<String>:
  match values:
    case Nil{}: Nil{}
    case Con{value, rest}: U32.show(value) <> texts(rest)

def cases(fuel: Nat, +which: U32, +seed: U32) -> IO(Unit):
  match fuel:
    case 0n: IO.pure(Unit, Unit{})
    case 1n+rest:
      do IO<Unit>:
        IO.print("[" ++ String.join(texts(F.test_scenario(which, seed)), ",") ++ "]")
        cases(rest, (which + 1 : U32), seed)

def parsed(seed: Maybe<&2, U32>) -> IO(Unit):
  match seed:
    case Some{value}: cases(10n, 0, value)
    case None{}: IO.die(Unit, 2, "Expected scope epoch")

def start(args: List<String>) -> IO(Unit):
  match args:
    case Con{program, Con{seed, Nil{}}}: parsed(U32.read(seed))
    case _: IO.die(Unit, 2, "Expected scope epoch")

def main() -> IO(Unit):
  do IO<Unit>:
    args : List<String> <- IO.args()
    start(args)
