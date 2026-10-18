import Base
import ./segmented-table.bend as R
import ./tables.bend as T
import ./joint-cache.bend as Cache
import ./word-io.bend as W

def read_segment(fuel: Nat, state: File & Array<U32>, +index: U32, +remaining: U32) -> IO(File & Array<U32>):
  match fuel state remaining:
    case _ state 0: IO.pure(File & Array<U32>, state)
    case 1n+p Tuple{file, table} remaining:
      do IO<File & Array<U32>>:
        +count : U32 = Cache.word_limit(U32.is_gt(remaining, 262144), remaining)
        result : File & (Array<U32> & Result<&1, &1, U32 & String, Unit>) <- W.read_words(file, table, index, count)
        state : File & Array<U32> <- Cache.read_words_result(result)
        read_segment(p, state, (index + count : U32), (remaining - count : U32))
    case _ Tuple{file, table} _: Cache.failed(File & Array<U32>, file, "Segment read fuel exhausted")

def checked_digest(result: R.Digest) -> IO(R.Table):
  match result:
    case R.SegmentDigest{table, 2620826876}: IO.pure(R.Table, table)
    case _: IO.die(R.Table, 2, "Segmented joint fingerprint mismatch")

def prefix_checked(read: Array<U32> & U32, lower: Array<U32>, upper: Array<U32>) -> IO(R.Table):
  match read:
    case Tuple{prefix, 8388608}: checked_digest(R.fingerprint(277136640n, R.SegmentDigest{R.RawSegments{prefix, lower, upper}, 2166136261}, 0))
    case _: IO.die(R.Table, 2, "Segmented prefix generation incomplete")

def upper_loaded(read: File & Array<U32>, lower: Array<U32>) -> IO(R.Table):
  match read:
    case Tuple{file, upper}:
      do IO<R.Table>:
        upper : Array<U32> <- Cache.finished(file, upper, 277136640)
        prefix_checked(Array.size(U32, T.generate()), lower, upper)

def lower_loaded(read: File & Array<U32>) -> IO(R.Table):
  match read:
    case Tuple{file, lower}:
      do IO<R.Table>:
        upper : File & Array<U32> <- read_segment(8192n, (file, [0 : U32^24n]), 0, 8701184)
        upper_loaded(upper, lower)

def prepare(path: String) -> IO(R.Table):
  do IO<R.Table>:
    file : File <- IO.try(File, File.open(path, "r"))
    size : File & Result<&1, &1, U32 & String, U32> <- File.size(file)
    file : File <- Cache.sized(size, 277136640)
    lower : File & Array<U32> <- read_segment(8192n, (file, [0 : U32^28n]), 0, 268435456)
    lower_loaded(lower)

def table() -> IO(R.Table):
  do IO<R.Table>:
    path : String <- IO.try(String, IO.get_env("RUBEND_JOINT_CACHE"))
    prepare(path)
