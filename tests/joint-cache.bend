import Base
import ../src/joint-cache.bend as Cache

type Test is Type:
  Test{table: Array<U32>, valid: Bool}

def value(+index: U32) -> U32:
  ((index * 2654435761) .^. 2779096485 : U32)

def fill(fuel: Nat, table: Array<U32>, +index: U32) -> Array<U32>:
  match fuel:
    case 0n: table
    case 1n+p:
      table[index] <- value(index)
      fill(p, table, (index + 1 : U32))

def compare(read: Array<U32> & U32, index: U32) -> Test:
  match read:
    case Tuple{table, actual}: Test{table, U32.is_eq(actual, value(index))}

def check(fuel: Nat, state: Test, +index: U32) -> Test:
  match fuel state:
    case 1n+p Test{table, True{}}: check(p, compare(table[index], index), (index + 1 : U32))
    case _ state: state

def report(state: Test) -> IO(Unit):
  match state:
    case Test{table, True{}}: IO.print("{\"cacheRoundtrip\":true,\"words\":70001}")
    case _: IO.die(Unit, 2, "Cache roundtrip mismatch")

def prefix_value(index: U32) -> U32:
  ((index * 2246822519) .^. 12345 : U32)

def prefix_fill(fuel: Nat, table: Array<U32>, +index: U32) -> Array<U32>:
  match fuel:
    case 0n: table
    case 1n+p:
      table[index] <- prefix_value(index)
      prefix_fill(p, table, (index + 1 : U32))

def shifted_value(read: Array<U32> & U32, index: U32) -> Test:
  match read:
    case Tuple{table, word}: Test{table, U32.is_eq(word, value(index))}

def check_shifted(fuel: Nat, state: Test, +index: U32) -> Test:
  match fuel state:
    case 1n+p Test{table, True{}}: check_shifted(p, shifted_value(table[(index + 4096 : U32)], index), (index + 1 : U32))
    case _ state: state

def prefixed_value(read: Array<U32> & U32, index: U32) -> Test:
  match read:
    case Tuple{table, word}: Test{table, U32.is_eq(word, prefix_value(index))}

def check_prefix(fuel: Nat, state: Test, +index: U32) -> Test:
  match fuel state:
    case 1n+p Test{table, True{}}: check_prefix(p, prefixed_value(table[index], index), (index + 1 : U32))
    case _ state: state

def relocated(state: Test) -> IO(Unit):
  match state:
    case Test{table, True{}}: IO.print("{\"overlapMoveAndPrefix\":true,\"movedWords\":70001,\"prefixWords\":4096}")
    case _: IO.die(Unit, 2, "Cache relocation mismatch")

def command(args: List<String>) -> IO(Unit):
  match args:
    case Con{program, Con{"shift", Nil{}}}:
      relocated(check_prefix(4096n, check_shifted(70001n, Test{Cache.prefix(4096n, Cache.Prefix{Cache.shift(70001n, fill(70001n, [0 : U32^17n], 0), 70001, 4096), prefix_fill(4096n, [0 : U32^12n], 0)}, 0), True{}}, 0), 0))
    case Con{program, Con{"write", Con{path, Nil{}}}}:
      do IO<Unit>:
        table : Array<U32> <- Cache.save(path, fill(70001n, [0 : U32^17n], 0), 70001)
        IO.pure(Unit, Unit{})
    case Con{program, Con{"read", Con{path, Nil{}}}}:
      do IO<Unit>:
        table : Array<U32> <- Cache.load(path, [0 : U32^17n], 0, 70001)
        report(check(70001n, Test{table, True{}}, 0))
    case _: IO.die(Unit, 2, "Expected write|read and a cache path")

def main() -> IO(Unit):
  do IO<Unit>:
    args : List<String> <- IO.args()
    command(args)
