import Base
import ../src/main.bend as H
import ../src/search.bend as S
import ../src/raw-table-io.bend as Raw

def table() -> IO(Array<U32>):
  do IO<Array<U32>>:
    path : String <- IO.try(String, IO.get_env("RUBEND_JOINT_CACHE"))
    Raw.prepare(path)

def worker(file: File) -> IO(Unit):
  do IO<Unit>:
    IO.print("{\"type\":\"initializing\"}")
    table : Array<U32> <- table()
    IO.print("{\"type\":\"ready\"}")
    read : File & Result<&1, &1, U32 & String, String> <- File.read(file, 4096)
    H.worker_loop(1000000n, table, read, S.RawJoint{})

def command(args: List<String>) -> IO(Unit):
  match args:
    case Con{program, Con{path, Nil{}}}:
      do IO<Unit>:
        file : File <- IO.try(File, File.open(path, "r"))
        worker(file)
    case Con{program, Con{text, Con{mode, Con{budget, Nil{}}}}}:
      do IO<Unit>:
        table : Array<U32> <- table()
        table : Array<U32> <- H.command_budget(U32.read(budget), text, mode, table, S.RawJoint{})
        IO.pure(Unit, Unit{})
    case _: IO.die(Unit, 2, "Experimental advanced engine: expected worker pipe or facelets/mode/budget")

def main() -> IO(Unit):
  do IO<Unit>:
    args : List<String> <- IO.args()
    command(args)
