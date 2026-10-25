import Base
import ./process-cpu.bend as P

def work(fuel: Nat, value: U32) -> U32:
  match fuel:
    case 0n: value
    case 1n+rest: work(rest, (value * 1664525 + 1013904223 : U32))

def combined(value: U32 & U32, sum: U32) -> U32:
  match value:
    case Tuple{seconds, nanos}: (sum * 33 + seconds + nanos : U32)

def samples(fuel: Nat, sum: U32) -> IO(U32):
  match fuel:
    case 0n: IO.pure(U32, sum)
    case 1n+rest:
      do IO<U32>:
        value : U32 & U32 <- IO.try(U32 & U32, P.sample(0))
        samples(rest, combined(value, sum))

def report(before: U32 & U32, after: U32 & U32, resolution: U32 & U32, mode: String, elapsed: Nat) -> IO(Unit):
  match before after resolution:
    case Tuple{bs, bn} Tuple{es, en} Tuple{rs, rn}:
      IO.print("{\"type\":\"cpu-window\",\"mode\":\"" ++ mode ++ "\",\"before\":[" ++ U32.show(bs) ++ "," ++ U32.show(bn) ++ "],\"after\":[" ++ U32.show(es) ++ "," ++ U32.show(en) ++ "],\"resolution\":[" ++ U32.show(rs) ++ "," ++ U32.show(rn) ++ "],\"wallMs\":" ++ Nat.show(elapsed) ++ "}")

def finish(mode: String, before: U32 & U32, resolution: U32 & U32, started: Nat) -> IO(Unit):
  do IO<Unit>:
    after : U32 & U32 <- IO.try(U32 & U32, P.sample(0))
    ended : Nat <- IO.now()
    report(before, after, resolution, mode, Nat.sub(ended, started))

def measured(mode: String, before: U32 & U32, resolution: U32 & U32, started: Nat) -> IO(Unit):
  match mode:
    case "work":
      do IO<Unit>:
        IO.print("{\"type\":\"work\",\"mode\":\"work\",\"iterations\":500000000,\"checksum\":" ++ U32.show(work(500000000n, 17)) ++ "}")
        finish("work", before, resolution, started)
    case "sleep":
      do IO<Unit>:
        IO.sleep(200)
        IO.print("{\"type\":\"work\",\"mode\":\"sleep\",\"iterations\":0,\"checksum\":0}")
        finish("sleep", before, resolution, started)
    case "samples":
      do IO<Unit>:
        checksum : U32 <- samples(100000n, 17)
        IO.print("{\"type\":\"work\",\"mode\":\"samples\",\"iterations\":100000,\"checksum\":" ++ U32.show(checksum) ++ "}")
        finish("samples", before, resolution, started)
    case _: IO.die(Unit, 2, "Unknown CPU fixture mode")

def invalid(result: Result<&1, &1, U32 & String, U32 & U32>) -> IO(Unit):
  match result:
    case Fail{Tuple{code, message}}: IO.print("{\"type\":\"refused\",\"code\":" ++ U32.show(code) ++ "}")
    case _: IO.die(Unit, 2, "Invalid CPU operation was accepted")

def command(args: List<String>) -> IO(Unit):
  match args:
    case Con{program, Con{"invalid", Nil{}}}:
      do IO<Unit>:
        result : Result<&1, &1, U32 & String, U32 & U32> <- P.sample(2)
        invalid(result)
    case Con{program, Con{mode, Nil{}}}:
      do IO<Unit>:
        resolution : U32 & U32 <- IO.try(U32 & U32, P.sample(1))
        before : U32 & U32 <- IO.try(U32 & U32, P.sample(0))
        started : Nat <- IO.now()
        measured(mode, before, resolution, started)
    case _: IO.die(Unit, 2, "Expected CPU fixture mode")

def main() -> IO(Unit):
  do IO<Unit>:
    args : List<String> <- IO.args()
    command(args)
