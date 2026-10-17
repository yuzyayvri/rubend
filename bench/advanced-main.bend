import Base
import ../src/main.bend as H
import ../src/tables.bend as T
import ../src/joint-cache.bend as Cache

def checked_digest(result: Cache.Digest) -> IO(Array<U32>):
  match result:
    case Cache.Digest{table, 2620826876}: IO.pure(Array<U32>, table)
    case _: IO.die(Array<U32>, 2, "Advanced table fingerprint mismatch")

def table() -> IO(Array<U32>):
  do IO<Array<U32>>:
    path : String <- IO.try(String, IO.get_env("RUBEND_JOINT_CACHE"))
    table : Array<U32> <- Cache.load_words(path, [0 : U32^29n], 0, 277136640)
    table : Array<U32> <- checked_digest(Cache.fingerprint(277136640n, Cache.Digest{table, 2166136261}, 0))
    small : Array<U32> <- H.checked_table(Array.size(U32, T.generate()))
    return Cache.prefix(8388608n, Cache.Prefix{Cache.shift(277136640n, table, 277136640, 8388608), small}, 0)

def worker(file: File) -> IO(Unit):
  do IO<Unit>:
    IO.print("{\"type\":\"initializing\"}")
    table : Array<U32> <- table()
    IO.print("{\"type\":\"ready\"}")
    read : File & Result<&1, &1, U32 & String, String> <- File.read(file, 4096)
    H.worker_loop(1000000n, table, read)

def command(args: List<String>) -> IO(Unit):
  match args:
    case Con{program, Con{path, Nil{}}}:
      do IO<Unit>:
        file : File <- IO.try(File, File.open(path, "r"))
        worker(file)
    case Con{program, Con{text, Con{mode, Con{budget, Nil{}}}}}:
      do IO<Unit>:
        table : Array<U32> <- table()
        table : Array<U32> <- H.command_budget(U32.read(budget), text, mode, table)
        IO.pure(Unit, Unit{})
    case _: IO.die(Unit, 2, "Experimental advanced engine: expected worker pipe or facelets/mode/budget")

def main() -> IO(Unit):
  do IO<Unit>:
    args : List<String> <- IO.args()
    command(args)
