import Base
import ./edge-two-bit.bend as P

def emit(+layout: P.Layout, +count: U32, +base: U32, +seed: U32) -> IO(Unit):
  IO.print("{\"count\":" ++ U32.show(count) ++ ",\"base\":" ++ U32.show(base) ++ ",\"entries\":" ++ U32.show(P.size(layout)) ++ ",\"checksum\":" ++ U32.show(P.synthetic(layout, base, seed)) ++ "}")

def bases(fuel: Nat, +base: U32, +seed: U32) -> IO(Unit):
  match fuel:
    case 0n: IO.pure(Unit, Unit{})
    case 1n+rest:
      do IO<Unit>:
        emit(P.One{}, 1, base, seed)
        emit(P.Two{}, 2, base, seed)
        emit(P.Three{}, 3, base, seed)
        bases(rest, (base + 1 : U32), seed)

def parsed(seed: Maybe<&2, U32>) -> IO(Unit):
  match seed:
    case Some{value}: bases(7n, 0, value)
    case None{}: IO.die(Unit, 2, "Expected checksum seed")

def start(args: List<String>) -> IO(Unit):
  match args:
    case Con{program, Con{seed, Nil{}}}: parsed(U32.read(seed))
    case _: IO.die(Unit, 2, "Expected checksum seed")

def main() -> IO(Unit):
  do IO<Unit>:
    args : List<String> <- IO.args()
    start(args)
