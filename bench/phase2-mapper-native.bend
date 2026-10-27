import Base
import ./phase2-mapper.bend as M

def finish(sample: M.Sample, +cohort: U32, +arm: String, started: Nat) -> IO(Array<U32>):
  match sample:
    case M.Sample{values, checksum, steps}:
      do IO<Array<U32>>:
        ended : Nat <- IO.now()
        IO.print("{\"kind\":\"sample\",\"cohort\":" ++ U32.show(cohort) ++ ",\"arm\":\"" ++ arm ++ "\",\"steps\":" ++ U32.show(steps) ++ ",\"checksum\":" ++ U32.show(checksum) ++ ",\"nativeMs\":" ++ Nat.show(Nat.sub(ended, started)) ++ "}")
        return values

def direct(values: Array<U32>, +cohort: U32, +arm: String, seed: U32) -> IO(Array<U32>):
  do IO<Array<U32>>:
    started : Nat <- IO.now()
    finish(M.work(~M.direct, 1000000n, values, seed), cohort, arm, started)

def mapped(values: Array<U32>, cohort: U32, seed: U32) -> IO(Array<U32>):
  do IO<Array<U32>>:
    started : Nat <- IO.now()
    finish(M.work(~M.mapped, 1000000n, values, seed), cohort, "mapper", started)

def cycle(reverse: Bool, words: Array<U32>, classes: Array<U32>, +cohort: U32, +seed: U32) -> IO(M.Maps):
  match reverse:
    case False{}:
      do IO<M.Maps>:
        words : Array<U32> <- direct(words, cohort, "control", seed)
        words : Array<U32> <- direct(words, cohort, "aa", seed)
        classes : Array<U32> <- mapped(classes, cohort, seed)
        return M.Maps{words, classes, 0}
    case True{}:
      do IO<M.Maps>:
        classes : Array<U32> <- mapped(classes, cohort, seed)
        words : Array<U32> <- direct(words, cohort, "aa", seed)
        words : Array<U32> <- direct(words, cohort, "control", seed)
        return M.Maps{words, classes, 0}

def cycles(fuel: Nat, state: M.Maps, +cohort: U32, +seed: U32) -> IO(Unit):
  match fuel state:
    case 0n M.Maps{words, classes, checksum}: IO.pure(Unit, Unit{})
    case 1n+rest M.Maps{words, classes, checksum}:
      do IO<Unit>:
        next : M.Maps <- cycle(U32.is_eq((cohort % 2 : U32), 1), words, classes, cohort, (seed + cohort * 97 : U32))
        cycles(rest, next, (cohort + 1 : U32), seed)

def initialized(state: M.Maps, profile: Bool, seed: U32, started: Nat) -> IO(Unit):
  match state profile:
    case M.Maps{words, classes, +checksum} False{}:
      do IO<Unit>:
        ended : Nat <- IO.now()
        IO.print("{\"kind\":\"initialization\",\"entries\":40320,\"arrayCapacity\":65536,\"mapperPayloadBytes\":161280,\"mapperCapacityBytes\":262144,\"fixtureCapacityBytes\":262144,\"checksum\":" ++ U32.show(checksum) ++ ",\"nativeMs\":" ++ Nat.show(Nat.sub(ended, started)) ++ "}")
        cycles(5n, M.Maps{words, classes, checksum}, 0, seed)
    case state True{}: cycles(1n, state, 0, seed)

def parsed(seed: Maybe<&2, U32>, profile: Bool) -> IO(Unit):
  match seed:
    case Some{value}:
      do IO<Unit>:
        started : Nat <- IO.now()
        initialized(M.build(), profile, value, started)
    case None{}: IO.die(Unit, 2, "Expected runtime seed")

def start(args: List<String>) -> IO(Unit):
  match args:
    case Con{program, Con{seed, Nil{}}}: parsed(U32.read(seed), False{})
    case Con{program, Con{seed, Con{"profile", Nil{}}}}: parsed(U32.read(seed), True{})
    case _: IO.die(Unit, 2, "Expected runtime seed and optional profile")

def main() -> IO(Unit):
  do IO<Unit>:
    args : List<String> <- IO.args()
    start(args)
