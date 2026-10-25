import Base
import ./storage-pattern.bend as P
import ../src/joint-cache.bend as Cache

def output(table: Array<U32>, action: String, checksum: U32) -> IO(Unit):
  IO.print("{\"type\":\"invalid-synthetic-storage\",\"action\":\"" ++ action ++ "\",\"capacity\":67108864,\"words\":42577920,\"bytes\":170311680,\"checksum\":" ++ U32.show(checksum) ++ "}")

def save(state: Cache.Digest, action: String, path: String) -> IO(Unit):
  match state:
    case Cache.Digest{table, checksum}:
      do IO<Unit>:
        table : Array<U32> <- Cache.save(path, table, 42577920)
        output(table, action, checksum)

def checked(table: Array<U32>, action: String, path: String) -> IO(Unit):
  save(Cache.fingerprint(42577920n, Cache.Digest{table, 2166136261}, 0), action, path)

def command(args: List<String>) -> IO(Unit):
  match args:
    case Con{program, Con{"write", Con{path, Nil{}}}}:
      checked(P.fill(67108864n, [0 : U32^26n], 0), "write", path)
    case Con{program, Con{"rewrite", Con{input, Con{output, Nil{}}}}}:
      do IO<Unit>:
        table : Array<U32> <- Cache.load(input, [0 : U32^26n], 0, 42577920)
        checked(table, "rewrite", output)
    case _: IO.die(Unit, 2, "Expected synthetic write or rewrite paths")

def main() -> IO(Unit):
  do IO<Unit>:
    args : List<String> <- IO.args()
    command(args)
