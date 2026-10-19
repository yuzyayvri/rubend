import Base
import ./advanced-main.bend as A
import ../src/main.bend as H
import ../src/search.bend as S
import ../src/worker-control.bend as Control

def worker(file: File) -> IO(Unit):
  do IO<Unit>:
    IO.print("{\"type\":\"initializing\"}")
    table : Array<U32> <- A.table()
    control : Control.Context <- Control.open()
    control : Control.Context <- Control.ready(control)
    read : File & Result<&1, &1, U32 & String, String> <- File.read(file, 4096)
    H.worker_loop_controlled(1000000n, table, read, S.RawInverseThree{}, control)

def command(args: List<String>) -> IO(Unit):
  match args:
    case Con{program, Con{path, Nil{}}}:
      do IO<Unit>:
        file : File <- IO.try(File, File.open(path, "r"))
        worker(file)
    case Con{program, Con{text, Con{mode, Con{budget, Nil{}}}}}:
      do IO<Unit>:
        table : Array<U32> <- A.table()
        table : Array<U32> <- H.command_budget(U32.read(budget), text, mode, table, S.RawInverseThree{})
        IO.pure(Unit, Unit{})
    case _: IO.die(Unit, 2, "Experimental inverse engine: expected worker pipe or facelets/mode/budget")

def main() -> IO(Unit):
  do IO<Unit>:
    args : List<String> <- IO.args()
    command(args)
