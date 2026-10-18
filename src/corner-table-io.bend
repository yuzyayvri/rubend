import Base
import ./tables.bend as T
import ./joint-cache.bend as Cache

def joint_digest(result: Cache.Digest) -> IO(Array<U32>):
  match result:
    case Cache.Digest{table, 2620826876}: IO.pure(Array<U32>, table)
    case _: IO.die(Array<U32>, 2, "Joint table fingerprint mismatch")

def corner_digest(result: Cache.Digest) -> IO(Array<U32>):
  match result:
    case Cache.Digest{table, 3472661170}: IO.pure(Array<U32>, table)
    case _: IO.die(Array<U32>, 2, "Corner table fingerprint mismatch")

def small_table(read: Array<U32> & U32) -> IO(Array<U32>):
  match read:
    case Tuple{table, 8388608}: IO.pure(Array<U32>, table)
    case _: IO.die(Array<U32>, 2, "Small table generation was incomplete")

def prepare(joint: String, corner: String) -> IO(Array<U32>):
  do IO<Array<U32>>:
    table : Array<U32> <- Cache.load_words(joint, [0 : U32^29n], 8388608, 277136640)
    table : Array<U32> <- joint_digest(Cache.fingerprint_at(277136640n, Cache.Digest{table, 2166136261}, 8388608, 0))
    small : Array<U32> <- small_table(Array.size(U32, T.generate()))
    table : Array<U32> = Cache.prefix(8388608n, Cache.Prefix{table, small}, 0)
    table : Array<U32> <- Cache.load_words(corner, table, 285525248, 22044960)
    corner_digest(Cache.fingerprint_at(22044960n, Cache.Digest{table, 2166136261}, 285525248, 0))

def table() -> IO(Array<U32>):
  do IO<Array<U32>>:
    joint : String <- IO.try(String, IO.get_env("RUBEND_JOINT_CACHE"))
    corner : String <- IO.try(String, IO.get_env("RUBEND_CORNER_CACHE"))
    prepare(joint, corner)
