import Base
import ../src/segmented-table.bend as R
import ../src/segmented-table-io.bend as A

def completed(table: R.Table) -> IO(Unit):
  IO.print("Unexpected segmented loader success")

def run(mode: String, path: String) -> IO(Unit):
  match mode:
    case "fingerprint":
      do IO<Unit>:
        table : R.Table <- A.checked_digest(R.SegmentDigest{R.RawSegments{[0 : U32^0n], [0 : U32^0n], [0 : U32^0n]}, 0})
        completed(table)
    case "file":
      do IO<Unit>:
        table : R.Table <- A.prepare(path)
        completed(table)
    case _: IO.die(Unit, 2, "Unknown segmented loader fixture")

def args(values: List<String>) -> IO(Unit):
  match values:
    case Con{program, Con{mode, Con{path, Nil{}}}}: run(mode, path)
    case _: IO.die(Unit, 2, "Expected loader mode and file path")

def main() -> IO(Unit):
  do IO<Unit>:
    values : List<String> <- IO.args()
    args(values)
