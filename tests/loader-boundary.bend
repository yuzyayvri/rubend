import Base
import ../src/joint-cache.bend as Cache

def digest(state: Cache.Digest) -> String:
  match state:
    case Cache.Digest{table, hash}: U32.show(hash)

def loaded(table: Array<U32>, +count: U32, +offset: U32) -> IO(Unit):
  IO.print("{\"loaded\":true,\"fingerprint\":" ++ digest(Cache.fingerprint_at(U32.to_nat(count), Cache.Digest{table, 2166136261}, offset, 0)) ++ "}")

def parsed(mode: String, path: String, offset: Maybe<&2, U32>, count: Maybe<&2, U32>) -> IO(Unit):
  match mode offset count:
    case "words" Some{+offset} Some{+count}:
      do IO<Unit>:
        table : Array<U32> <- Cache.load_words(path, [3735928559 : U32^20n], offset, count)
        loaded(table, count, offset)
    case "legacy" Some{+offset} Some{+count}:
      do IO<Unit>:
        table : Array<U32> <- Cache.load(path, [3735928559 : U32^20n], offset, count)
        loaded(table, count, offset)
    case _ _ _: IO.die(Unit, 2, "Invalid loader arguments")

def command(args: List<String>) -> IO(Unit):
  match args:
    case Con{program, Con{mode, Con{path, Con{offset, Con{count, Nil{}}}}}}: parsed(mode, path, U32.read(offset), U32.read(count))
    case _: IO.die(Unit, 2, "Expected mode path offset count")

def main() -> IO(Unit):
  do IO<Unit>:
    args : List<String> <- IO.args()
    command(args)
