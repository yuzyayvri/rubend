import Base
import ./partition-prefix.bend as P

def emit(value: P.PrefixStats, mask: U32, depth: U32) -> IO(Unit):
  match value:
    case P.PrefixStats{count, checksum}:
      IO.print("{\"mask\":" ++ U32.show(mask) ++ ",\"depth\":" ++ U32.show(depth) ++ ",\"count\":" ++ U32.show(count) ++ ",\"checksum\":" ++ U32.show(checksum) ++ "}")

def depths(fuel: Nat, +depth: U32, +mask: U32, +seed: U32) -> IO(Unit):
  match fuel:
    case 0n: IO.pure(Unit, Unit{})
    case 1n+rest:
      do IO<Unit>:
        emit(P.test_stats(mask, depth, seed), mask, depth)
        depths(rest, (depth + 1 : U32), mask, seed)

def masks(fuel: Nat, +mask: U32, +seed: U32) -> IO(Unit):
  match fuel:
    case 0n: IO.pure(Unit, Unit{})
    case 1n+rest:
      do IO<Unit>:
        depths(5n, 0, mask, seed)
        masks(rest, (mask + 1 : U32), seed)

def parsed(seed: Maybe<&2, U32>) -> IO(Unit):
  match seed:
    case Some{value}: masks(4n, 6, value)
    case None{}: IO.die(Unit, 2, "Expected checksum seed")

def start(args: List<String>) -> IO(Unit):
  match args:
    case Con{program, Con{seed, Nil{}}}: parsed(U32.read(seed))
    case _: IO.die(Unit, 2, "Expected checksum seed")

def main() -> IO(Unit):
  do IO<Unit>:
    args : List<String> <- IO.args()
    start(args)
