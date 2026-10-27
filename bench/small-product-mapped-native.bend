import Base
import ./small-product-mapped.bend as M
import ../src/joint-cache.bend as Cache

def output(result: M.MapDigest) -> IO(Unit):
  match result:
    case M.MapDigest{M.MapReady{table}, checksum, entries}:
      IO.print("{\"format\":\"rubend-small-product-mapped-v1\",\"entries\":" ++ U32.show(entries) ++ ",\"checksum\":" ++ U32.show(checksum) ++ "}")
    case _: IO.die(Unit, 2, "Mapped cache not ready")

def start(args: List<String>) -> IO(Unit):
  match args:
    case Con{program, Con{path, Nil{}}}:
      do IO<Unit>:
        table : Array<U32> <- Cache.load(path, [255 : U32^19n], 0, 235200)
        output(M.test_digest(M.prepare(table), 17))
    case _: IO.die(Unit, 2, "Expected audited product words")

def main() -> IO(Unit):
  do IO<Unit>:
    args : List<String> <- IO.args()
    start(args)
