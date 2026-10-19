import Base
import ./control-io.bend as ControlIO

type Context is Type:
  Detached{}
  Attached{file: File, value: U32, digits: U32}

type Byte is Data:
  More{value: U32, digits: U32}
  Send{id: U32}
  Bad{}

def digit(valid: Bool, code: U32, value: U32, digits: U32) -> Byte:
  match valid:
    case True{}: More{(value * 10 + code - 48 : U32), (digits + 1 : U32)}
    case False{}: Bad{}

def newline(valid: Bool, value: U32) -> Byte:
  match valid:
    case True{}: Send{value}
    case False{}: Bad{}

def byte(+code: U32, +value: U32, +digits: U32) -> Byte:
  match code:
    case 10: newline(U32.is_gt(digits, 0) && U32.is_gt(value, 0), value)
    case _:
      digit(U32.is_ge(code, 48) && U32.is_le(code, 57) && U32.is_lt(digits, 10) && (U32.is_lt(value, 429496729) || (U32.is_eq(value, 429496729) && U32.is_le(code, 53))), code, value, digits)

type Scan is Data:
  Scanned{value: U32, digits: U32, matched: Bool}
  Malformed{}

def deliver(step: Byte, id: U32, matched: Bool) -> Scan:
  match step:
    case More{value, digits}: Scanned{value, digits, matched}
    case Send{received}: Scanned{0, 0, matched || U32.is_eq(id, received)}
    case Bad{}: Malformed{}

def chunk(text: String, state: Scan, +id: U32) -> Scan:
  match text state:
    case _ Malformed{}: Malformed{}
    case SNil{} state: state
    case SCon{Chr{code}, rest} Scanned{value, digits, matched}:
      chunk(rest, deliver(byte(code, value, digits), id, matched), id)

def open_result(result: Result<&1, &1, U32 & String, String>) -> IO(Context):
  match result:
    case Fail{error}: IO.pure(Context, Detached{})
    case Done{path}:
      do IO<Context>:
        file : File <- IO.try(File, ControlIO.open_reader(path))
        return Attached{file, 0, 0}

def open() -> IO(Context):
  do IO<Context>:
    result : Result<&1, &1, U32 & String, String> <- IO.get_env("RUBEND_CONTROL_FIFO")
    open_result(result)

def tag(id: U32) -> String:
  ",\"jobId\":" ++ U32.show(id)

def ready(context: Context) -> IO(Context):
  match context:
    case Detached{}:
      do IO<Context>:
        IO.print("{\"type\":\"ready\"}")
        return Detached{}
    case Attached{file, value, digits}:
      do IO<Context>:
        IO.print("{\"type\":\"ready\",\"protocol\":2,\"jobIds\":true,\"cancel\":true}")
        return Attached{file, value, digits}

def scanned(state: Scan, file: File) -> IO(Context & Bool):
  match state:
    case Scanned{value, digits, matched}: IO.pure(Context & Bool, (Attached{file, value, digits}, matched))
    case Malformed{}: IO.die(Context & Bool, 2, "Invalid engine control record")

def polled(read: File & Result<&1, &1, U32 & String, String>, value: U32, digits: U32, id: U32) -> IO(Context & Bool):
  match read:
    case Tuple{file, Done{text}}: scanned(chunk(text, Scanned{value, digits, False{}}, id), file)
    case Tuple{file, Fail{Tuple{code, message}}}: IO.die(Context & Bool, 2, "Engine control read failed: " ++ U32.show(code))

def checkpoint(pulse: U32, id: U32, context: Context) -> IO(Context & Bool):
  match pulse context:
    case 0 Attached{file, value, digits}:
      do IO<Context & Bool>:
        read : File & Result<&1, &1, U32 & String, String> <- ControlIO.read_ready(file)
        polled(read, value, digits, id)
    case _ context: IO.pure(Context & Bool, (context, False{}))

def close(context: Context) -> IO(Unit):
  match context:
    case Detached{}: IO.pure(Unit, Unit{})
    case Attached{file, value, digits}: File.close(file)
