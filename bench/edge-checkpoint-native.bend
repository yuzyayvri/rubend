import Base
import ./edge-checkpoint.bend as C

def byte_string(values: +List<U32>) -> String:
  match values:
    case Nil{}: SNil{}
    case Con{head, rest}: SCon{Chr{head}, byte_string(rest)}

def numbers(parts: +List<String>, out: +List<U32>) -> Maybe<&2, +List<U32>>:
  match parts:
    case Nil{}: Some{List.reverse(&2, U32, out)}
    case Con{head, rest}:
      do Maybe<&2, +List<U32>>:
        value : U32 <- U32.read(head)
        numbers(rest, value <> out)

def texts(values: +List<U32>) -> +List<String>:
  match values:
    case Nil{}: Nil{}
    case Con{head, rest}: U32.show(head) <> texts(rest)

def emit(values: +List<U32>) -> IO(Unit):
  match values:
    case Nil{}: IO.die(Unit, 2, "Invalid checkpoint packet")
    case Con{head, rest}: IO.print("{\"packet\":[" ++ String.join(texts(head <> rest), ",") ++ "]}")

def resume(values: Maybe<&2, +List<U32>>) -> IO(Unit):
  match values:
    case Some{Con{count, Con{depth, Con{reached, Con{expanded, values}}}}}:
      emit(C.resume_admitted(count, depth, reached, expanded, values, 1))
    case _: IO.die(Unit, 2, "Invalid checkpoint fields")

def received(valid: Bool, bytes: +List<U32>, crash: Bool) -> IO(Unit):
  match valid crash:
    case True{} True{}: IO.die(Unit, 2, "Injected native checkpoint failure")
    case True{} False{}: resume(numbers(String.split(String.trim(byte_string(bytes)), Chr{44}), Nil{}))
    case _ _: IO.die(Unit, 2, "Checkpoint byte count mismatch")

def eof(read: File & Result<&1, &1, U32 & String, +List<U32>>, +bytes: +List<U32>, length: U32, crash: Bool) -> IO(Unit):
  match read:
    case Tuple{file, Done{Nil{}}}:
      do IO<Unit>:
        File.close(file)
        received(C.sized(bytes, length), bytes, crash)
    case Tuple{file, result}:
      do IO<Unit>:
        File.close(file)
        IO.die(Unit, 2, "Checkpoint has trailing data or read failure")

def contents(read: File & Result<&1, &1, U32 & String, +List<U32>>, length: U32, crash: Bool) -> IO(Unit):
  match read:
    case Tuple{file, Done{bytes}}:
      do IO<Unit>:
        rest : File & Result<&1, &1, U32 & String, +List<U32>> <- File.read_bytes(file, 1)
        eof(rest, bytes, length, crash)
    case Tuple{file, result}:
      do IO<Unit>:
        File.close(file)
        IO.die(Unit, 2, "Checkpoint read failed")

def opened(valid: Bool, path: String, +length: U32, crash: Bool) -> IO(Unit):
  match valid:
    case False{}: IO.die(Unit, 2, "Invalid checkpoint byte limit or action")
    case True{}:
      do IO<Unit>:
        file : File <- IO.try(File, File.open(path, "r"))
        read : File & Result<&1, &1, U32 & String, +List<U32>> <- File.read_bytes(file, (length + 1 : U32))
        contents(read, length, crash)

def length(value: Maybe<&2, U32>, path: String, +action: String) -> IO(Unit):
  match value:
    case None{}: IO.die(Unit, 2, "Invalid checkpoint byte length")
    case Some{+size}: opened(U32.is_gt(size, 0) && U32.is_le(size, 65536) && (String.eq(action, "resume") || String.eq(action, "fail")), path, size, String.eq(action, "fail"))

def command(args: List<String>) -> IO(Unit):
  match args:
    case Con{program, Con{path, Con{size, Con{action, Nil{}}}}}: length(U32.read(size), path, action)
    case _: IO.die(Unit, 2, "Expected checkpoint path, byte length and action")

def main() -> IO(Unit):
  do IO<Unit>:
    args : List<String> <- IO.args()
    command(args)
