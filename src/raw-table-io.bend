import Base
import ./main.bend as H
import ./tables.bend as T
import ./joint-cache.bend as Cache

def checked_digest(result: Cache.Digest) -> IO(Array<U32>):
  match result:
    case Cache.Digest{table, 2620826876}: IO.pure(Array<U32>, table)
    case _: IO.die(Array<U32>, 2, "Advanced table fingerprint mismatch")

def prepare(path: String) -> IO(Array<U32>):
  do IO<Array<U32>>:
    table : Array<U32> <- Cache.load_words(path, [0 : U32^29n], 8388608, 277136640)
    table : Array<U32> <- checked_digest(Cache.fingerprint_at(277136640n, Cache.Digest{table, 2166136261}, 8388608, 0))
    small : Array<U32> <- H.checked_table(Array.size(U32, T.generate()))
    return Cache.prefix(8388608n, Cache.Prefix{table, small}, 0)
