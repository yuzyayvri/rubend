import Base
import ../src/block-table.bend as B
import ../src/joint-cache.bend as Cache
import ./block-verify.bend as V

def source_checked(result: Cache.Digest) -> IO(Array<U32>):
  match result:
    case Cache.Digest{table, 2620826876}: IO.pure(Array<U32>, table)
    case _: IO.die(Array<U32>, 2, "Raw reference fingerprint mismatch")

def equal(result: V.Check) -> IO(Array<U32>):
  match result:
    case V.Check{source, packed, True{}, 1448581281}:
      do IO<Array<U32>>:
        IO.print("{\"type\":\"losslessEquality\",\"entries\":2217093120,\"passed\":true,\"entryFingerprint\":1448581281}")
        return packed
    case _: IO.die(Array<U32>, 2, "Lossless full-table comparison failed")

def identified(result: Cache.Digest) -> IO(Array<U32>):
  match result:
    case Cache.Digest{table, hash}:
      do IO<Array<U32>>:
        IO.print("{\"type\":\"blockIdentity\",\"wordFingerprint\":" ++ U32.show(hash) ++ ",\"words\":185625504,\"bytes\":742502016}")
        return table

def finish(state: B.Build, path: String, +started: Nat) -> IO(Unit):
  match state:
    case B.Build{source, packed, 150983424, True{}}:
      do IO<Unit>:
        now : Nat <- IO.now()
        IO.print("{\"type\":\"packed\",\"elapsedMs\":" ++ Nat.show(Nat.sub(now, started)) ++ "}")
        packed : Array<U32> <- equal(V.compare(2217093120n, V.Check{source, packed, True{}, 2166136261}, 0, 34642080))
        packed : Array<U32> <- identified(Cache.fingerprint(185625504n, Cache.Digest{packed, 2166136261}, 0))
        packed : Array<U32> <- Cache.save(path, packed, 185625504)
        ended : Nat <- IO.now()
        IO.print("{\"type\":\"blockCacheWritten\",\"elapsedMs\":" ++ Nat.show(Nat.sub(ended, started)) ++ "}")
    case _: IO.die(Unit, 2, "Unexpected block layout or incomplete conversion")

def command(args: List<String>) -> IO(Unit):
  match args:
    case Con{program, Con{input, Con{output, Nil{}}}}:
      do IO<Unit>:
        +started : Nat <- IO.now()
        source : Array<U32> <- Cache.load(input, [0 : U32^29n], 0, 277136640)
        source : Array<U32> <- source_checked(Cache.fingerprint(277136640n, Cache.Digest{source, 2166136261}, 0))
        loaded : Nat <- IO.now()
        IO.print("{\"type\":\"rawLoaded\",\"elapsedMs\":" ++ Nat.show(Nat.sub(loaded, started)) ++ "}")
        finish(B.build(34642080n, B.Build{source, [0 : U32^28n], 0, True{}}, 34642080, 0, 260046848), output, started)
    case _: IO.die(Unit, 2, "Expected raw input cache and new private output cache")

def main() -> IO(Unit):
  do IO<Unit>:
    args : List<String> <- IO.args()
    command(args)
