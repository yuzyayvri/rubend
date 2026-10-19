import Base
import ../src/control-io.bend as ControlIO

def show(read: File & Result<&1, &1, U32 & String, String>) -> IO(File):
  match read:
    case Tuple{file, Done{text}}:
      do IO<File>:
        IO.print("ok " ++ Nat.show(String.length(text)))
        return file
    case Tuple{file, Fail{Tuple{code, message}}}:
      do IO<File>:
        IO.print("error " ++ U32.show(code))
        return file

def reads(fuel: Nat, file: File) -> IO(Unit):
  match fuel:
    case 0n: File.close(file)
    case 1n+p:
      do IO<Unit>:
        read : File & Result<&1, &1, U32 & String, String> <- ControlIO.read_ready(file)
        file : File <- show(read)
        reads(p, file)

def opened(result: Result<&1, &1, U32 & String, File>) -> IO(Unit):
  match result:
    case Done{file}: reads(3n, file)
    case Fail{Tuple{code, message}}: IO.print("open-error " ++ U32.show(code))

def command(args: List<String>) -> IO(Unit):
  match args:
    case Con{program, Con{path, Con{mode, Nil{}}}}:
      do IO<Unit>:
        result : Result<&1, &1, U32 & String, File> <- File.open(path, "r")
        opened(result)
    case Con{program, Con{path, Nil{}}}:
      do IO<Unit>:
        result : Result<&1, &1, U32 & String, File> <- ControlIO.open_reader(path)
        opened(result)
    case _: IO.die(Unit, 2, "Expected control IO fixture path")

def main() -> IO(Unit):
  do IO<Unit>:
    args : List<String> <- IO.args()
    command(args)
