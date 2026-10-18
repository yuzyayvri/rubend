import Base

type Context is Data:
  Detached{}
  Attached{id: U32, channel: Chan(U32)}

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

def deliver(step: Byte, +channel: Chan(U32)) -> IO(U32 & U32):
  match step:
    case More{value, digits}: IO.pure(U32 & U32, (value, digits))
    case Send{id}:
      do IO<U32 & U32>:
        sent : Result<&1, &1, U32, Unit> <- Chan.send(U32, channel, id)
        return (0, 0)
    case Bad{}: IO.die(U32 & U32, 2, "Invalid engine control record")

def reader(fuel: Nat, +channel: Chan(U32), read: File & Result<&1, &1, U32 & String, String>, state: U32 & U32) -> IO(Unit):
  match fuel read state:
    case 1n+p Tuple{file, Done{SCon{Chr{code}, SNil{}}}} Tuple{value, digits}:
      do IO<Unit>:
        parsed : U32 & U32 <- deliver(byte(code, value, digits), channel)
        next : File & Result<&1, &1, U32 & String, String> <- File.read(file, 1)
        reader(p, channel, next, parsed)
    case _ Tuple{file, result} _:
      do IO<Unit>:
        Chan.close(U32, channel)
        File.close(file)

def open_result(result: Result<&1, &1, U32 & String, String>) -> IO(Context):
  match result:
    case Fail{error}: IO.pure(Context, Detached{})
    case Done{path}:
      do IO<Context>:
        file : File <- IO.try(File, File.open(path, "r"))
        +channel : Chan(U32) <- Chan.new(U32, 32)
        IO.spawn(Unit, IO.bind(File & Result<&1, &1, U32 & String, String>, Unit, File.read(file, 1), read => reader(100000000n, channel, read, (0, 0))))
        return Attached{0, channel}

def open() -> IO(Context):
  do IO<Context>:
    result : Result<&1, &1, U32 & String, String> <- IO.get_env("RUBEND_CONTROL_FIFO")
    open_result(result)

def for_job(context: Context, id: U32) -> Context:
  match context:
    case Detached{}: Detached{}
    case Attached{old, channel}: Attached{id, channel}

def tag(context: Context) -> String:
  match context:
    case Detached{}: ""
    case Attached{id, channel}: ",\"jobId\":" ++ U32.show(id)

def ready(context: Context) -> IO(Unit):
  match context:
    case Detached{}: IO.print("{\"type\":\"ready\"}")
    case Attached{id, channel}: IO.print("{\"type\":\"ready\",\"protocol\":2,\"jobIds\":true,\"cancel\":true}")

def polled(result: Poll<&1, &1, Maybe<&1, U32>, Unit>, id: U32) -> IO(Bool):
  match result:
    case Wait{rest}: IO.pure(Bool, False{})
    case Ready{Some{received}}: IO.pure(Bool, U32.is_eq(id, received))
    case Ready{None{}}: IO.die(Bool, 2, "Engine control channel closed")

def poll(context: Context) -> IO(Bool):
  match context:
    case Detached{}: IO.pure(Bool, False{})
    case Attached{id, channel}:
      do IO<Bool>:
        result : Poll<&1, &1, Maybe<&1, U32>, Unit> <- Chan.try_recv(U32, channel, 0)
        polled(result, id)
