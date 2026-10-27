import Base
import ../src/joint-cache.bend as Cache
import ./small-product-mapped.bend as M
import ./small-product-probe-work.bend as W

def finish(state: W.Work, mode: U32, seed: U32, initialized: Nat, started: Nat) -> IO(Array<U32> & M.MappedState):
  match state:
    case W.Work{records, cache, checksum, steps, mismatches, at}:
      do IO<Array<U32> & M.MappedState>:
        ended : Nat <- IO.now()
        IO.print("{\"format\":\"rubend-small-product-probe-cost-v1\",\"mode\":" ++ U32.show(mode) ++ ",\"seed\":" ++ U32.show(seed) ++ ",\"steps\":" ++ U32.show(steps) ++ ",\"checksum\":" ++ U32.show(checksum) ++ ",\"mismatches\":" ++ U32.show(mismatches) ++ ",\"initialChecksum\":957906193,\"initializationMs\":" ++ Nat.show(initialized) ++ ",\"nativeMs\":" ++ Nat.show(Nat.sub(ended, started)) ++ "}")
        return (records, cache)

def initialized(digest: M.MapDigest, records: Array<U32>, +mode: U32, fuel: U32, +seed: U32, init_started: Nat) -> IO(Unit):
  match digest:
    case M.MapDigest{cache, 957906193, 80640}:
      do IO<Unit>:
        init_ended : Nat <- IO.now()
        started : Nat <- IO.now()
        owners : Array<U32> & M.MappedState <- finish(W.calculate(mode, U32.to_nat(fuel), seed, records, cache), mode, seed, Nat.sub(init_ended, init_started), started)
        IO.pure(Unit, Unit{})
    case _: IO.die(Unit, 2, "Mapped initialization checksum mismatch")

def loaded(ok: Bool, product_path: String, records_path: String, mode: U32, fuel: U32, seed: U32) -> IO(Unit):
  match ok:
    case True{}:
      do IO<Unit>:
        started : Nat <- IO.now()
        table : Array<U32> <- Cache.load(product_path, [255 : U32^19n], 0, 235200)
        records : Array<U32> <- Cache.load(records_path, [0 : U32^18n], 0, 140481)
        initialized(M.test_digest(M.prepare(table), 17), records, mode, fuel, seed, started)
    case False{}: IO.die(Unit, 2, "Invalid cost mode or work budget")

def parsed(product_path: String, records_path: String, mode: Maybe<&2, U32>, fuel: Maybe<&2, U32>, seed: Maybe<&2, U32>) -> IO(Unit):
  match mode fuel seed:
    case Some{+mode} Some{+fuel} Some{seed}:
      loaded(U32.is_lt(mode, 2) && U32.is_gt(fuel, 0) && U32.is_le(fuel, 64000000), product_path, records_path, mode, fuel, seed)
    case _ _ _: IO.die(Unit, 2, "Expected numeric mode, work budget and seed")

def start(args: List<String>) -> IO(Unit):
  match args:
    case Con{program, Con{product_path, Con{records_path, Con{mode, Con{fuel, Con{seed, Nil{}}}}}}}:
      parsed(product_path, records_path, U32.read(mode), U32.read(fuel), U32.read(seed))
    case _: IO.die(Unit, 2, "Expected product, records, mode, work budget and seed")

def main() -> IO(Unit):
  do IO<Unit>:
    args : List<String> <- IO.args()
    start(args)
