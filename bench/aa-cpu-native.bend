import Base
import ./phase2-mapper.bend as M

def finish(sample: M.Sample, seed: U32, initial_checksum: U32, initialization: Nat, started: Nat) -> IO(Array<U32>):
  match sample:
    case M.Sample{values, checksum, steps}:
      do IO<Array<U32>>:
        ended : Nat <- IO.now()
        IO.print("{\"format\":\"rubend-aa-cpu-native-v1\",\"seed\":" ++ U32.show(seed) ++ ",\"steps\":" ++ U32.show(steps) ++ ",\"checksum\":" ++ U32.show(checksum) ++ ",\"initialChecksum\":" ++ U32.show(initial_checksum) ++ ",\"initializationMs\":" ++ Nat.show(initialization) ++ ",\"nativeMs\":" ++ Nat.show(Nat.sub(ended, started)) ++ "}")
        return values

def initialized(state: M.Maps, +seed: U32, init_started: Nat) -> IO(Unit):
  match state:
    case M.Maps{words, classes, checksum}:
      do IO<Unit>:
        initialized_at : Nat <- IO.now()
        started : Nat <- IO.now()
        values : Array<U32> <- finish(M.work(~M.direct, 50000000n, words, seed), seed, checksum, Nat.sub(initialized_at, init_started), started)
        IO.pure(Unit, Unit{})

def parsed(value: Maybe<&2, U32>) -> IO(Unit):
  match value:
    case Some{seed}:
      do IO<Unit>:
        started : Nat <- IO.now()
        initialized(M.build(), seed, started)
    case None{}: IO.die(Unit, 2, "Expected A/A runtime seed")

def start(args: List<String>) -> IO(Unit):
  match args:
    case Con{program, Con{seed, Nil{}}}: parsed(U32.read(seed))
    case _: IO.die(Unit, 2, "Expected one runtime seed")

def main() -> IO(Unit):
  do IO<Unit>:
    args : List<String> <- IO.args()
    start(args)
