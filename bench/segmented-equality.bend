import Base
import ../src/segmented-table.bend as R
import ../src/segmented-table-io.bend as A
import ../src/raw-table-io.bend as Legacy

type Check is Type:
  SegmentCheck{legacy: Array<U32>, table: R.Table, index: U32}
  SegmentMismatch{index: U32, expected: U32, actual: U32}

def compared(ok: Bool, legacy: Array<U32>, table: R.Table, +index: U32, expected: U32, actual: U32) -> Check:
  match ok:
    case True{}: SegmentCheck{legacy, table, (index + 1 : U32)}
    case False{}: SegmentMismatch{index, expected, actual}

def segmented(read: R.Table & U32, legacy: Array<U32>, index: U32, +expected: U32) -> Check:
  match read:
    case Tuple{table, +actual}: compared(U32.is_eq(actual, expected), legacy, table, index, expected, actual)

def old_read(read: Array<U32> & U32, table: R.Table, +index: U32) -> Check:
  match read:
    case Tuple{legacy, expected}: segmented(R.get(table, index), legacy, index, expected)

def check(fuel: Nat, state: Check) -> Check:
  match fuel state:
    case 1n+p SegmentCheck{legacy, table, +index}: check(p, old_read(legacy[index], table, index))
    case _ state: state

def report(state: Check) -> IO(Unit):
  match state:
    case SegmentCheck{legacy, table, 285525248}: IO.print("{\"passed\":true,\"wordsCompared\":285525248,\"prefixWords\":8388608,\"rawWords\":277136640,\"legacyPhysicalWords\":536870912,\"segmentedPhysicalWords\":293601280}")
    case SegmentMismatch{index, expected, actual}: IO.die(Unit, 2, "Segment mismatch at " ++ U32.show(index) ++ " expected " ++ U32.show(expected) ++ " got " ++ U32.show(actual))
    case _: IO.die(Unit, 2, "Segment comparison incomplete")

def args(values: List<String>) -> IO(Unit):
  match values:
    case Con{program, Con{+path, Nil{}}}:
      do IO<Unit>:
        legacy : Array<U32> <- Legacy.prepare(path)
        table : R.Table <- A.prepare(path)
        report(check(285525248n, SegmentCheck{legacy, table, 0}))
    case _: IO.die(Unit, 2, "Expected audited raw-cache path")

def main() -> IO(Unit):
  do IO<Unit>:
    values : List<String> <- IO.args()
    args(values)
