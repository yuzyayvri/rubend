import Base
import ../src/main.bend as H
import ../src/search.bend as S
import ../src/tables.bend as T
import ../src/joint-cache.bend as Cache
import ../src/worker-control.bend as Control

def checked_digest(result: Cache.Digest) -> IO(Array<U32>):
  match result:
    case Cache.Digest{table, 3919871918}: IO.pure(Array<U32>, table)
    case _: IO.die(Array<U32>, 2, "Block table fingerprint mismatch")

def table() -> IO(Array<U32>):
  do IO<Array<U32>>:
    path : String <- IO.try(String, IO.get_env("RUBEND_BLOCK_CACHE"))
    table : Array<U32> <- Cache.load_words(path, [0 : U32^28n], 8388608, 185625504)
    table : Array<U32> <- checked_digest(Cache.fingerprint_at(185625504n, Cache.Digest{table, 2166136261}, 8388608, 0))
    small : Array<U32> <- H.checked_table(Array.size(U32, T.generate()))
    return Cache.prefix(8388608n, Cache.Prefix{table, small}, 0)

def worker(file: File) -> IO(Unit):
  do IO<Unit>:
    IO.print("{\"type\":\"initializing\"}")
    table : Array<U32> <- table()
    +control : Control.Context <- Control.open()
    Control.ready(control)
    read : File & Result<&1, &1, U32 & String, String> <- File.read(file, 4096)
    H.worker_loop_controlled(1000000n, table, read, S.BlockJoint{}, control)

def command(args: List<String>) -> IO(Unit):
  match args:
    case Con{program, Con{path, Nil{}}}:
      do IO<Unit>:
        file : File <- IO.try(File, File.open(path, "r"))
        worker(file)
    case Con{program, Con{text, Con{mode, Con{budget, Nil{}}}}}:
      do IO<Unit>:
        table : Array<U32> <- table()
        table : Array<U32> <- H.command_budget(U32.read(budget), text, mode, table, S.BlockJoint{})
        IO.pure(Unit, Unit{})
    case _: IO.die(Unit, 2, "Experimental block engine: expected worker pipe or facelets/mode/budget")

def main() -> IO(Unit):
  do IO<Unit>:
    args : List<String> <- IO.args()
    command(args)
