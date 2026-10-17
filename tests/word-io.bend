import Base
import ../src/word-io.bend as W

type Check is Type:
  Check{table: Array<U32>, valid: Bool}

def choose(inside: Bool, value: U32) -> U32:
  match inside:
    case True{}: value
    case False{}: 3735928559

def expected(loaded: Bool, +index: U32, +offset: U32, +count: U32) -> U32:
  match loaded:
    case False{}: 3735928559
    case True{}: choose(U32.is_ge(index, offset) && U32.is_lt(index, (offset + count : U32)), (((index - offset) * 2654435761) .^. 2779096485 : U32))

def checked(read: Array<U32> & U32, loaded: Bool, index: U32, offset: U32, count: U32) -> Check:
  match read:
    case Tuple{table, value}: Check{table, U32.is_eq(value, expected(loaded, index, offset, count))}

def check(fuel: Nat, state: Check, +loaded: Bool, +index: U32, +offset: U32, +count: U32) -> Check:
  match fuel state:
    case 1n+p Check{table, True{}}: check(p, checked(table[index], loaded, index, offset, count), loaded, (index + 1 : U32), offset, count)
    case _ state: state

def report(state: Check, loaded: Bool) -> IO(Unit):
  match state loaded:
    case Check{table, True{}} True{}: IO.print("{\"loaded\":true,\"dataAndGuards\":true}")
    case Check{table, True{}} False{}: IO.print("{\"loaded\":false,\"unchangedOnError\":true}")
    case _ _: IO.die(Unit, 2, "Word IO mutated unexpected values")

def received(result: File & (Array<U32> & Result<&1, &1, U32 & String, Unit>), +offset: U32, +count: U32) -> IO(Unit):
  match result:
    case Tuple{file, Tuple{table, Done{unit}}}:
      do IO<Unit>:
        File.close(file)
        report(check(524288n, Check{table, True{}}, True{}, 0, offset, count), True{})
    case Tuple{file, Tuple{table, Fail{error}}}:
      do IO<Unit>:
        File.close(file)
        report(check(524288n, Check{table, True{}}, False{}, 0, offset, count), False{})

def parsed(path: String, offset: Maybe<&2, U32>, count: Maybe<&2, U32>) -> IO(Unit):
  match offset count:
    case Some{+offset} Some{+count}:
      do IO<Unit>:
        file : File <- IO.try(File, File.open(path, "r"))
        result : File & (Array<U32> & Result<&1, &1, U32 & String, Unit>) <- W.read_words(file, [3735928559 : U32^19n], offset, count)
        received(result, offset, count)
    case _ _: IO.die(Unit, 2, "Invalid offset/count")

def command(args: List<String>) -> IO(Unit):
  match args:
    case Con{program, Con{path, Con{offset, Con{count, Nil{}}}}}: parsed(path, U32.read(offset), U32.read(count))
    case _: IO.die(Unit, 2, "Expected path, offset, word count")

def main() -> IO(Unit):
  do IO<Unit>:
    args : List<String> <- IO.args()
    command(args)
