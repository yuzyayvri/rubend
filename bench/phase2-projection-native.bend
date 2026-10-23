import Base
import ./phase2-projection.bend as P

def parsed(value: Maybe<&2, U32>) -> IO(Unit):
  match value:
    case Some{seed}:
      IO.print("{\"format\":\"rubend-phase2-native-v1\",\"cases\":1400,\"checksum\":" ++ U32.show(P.test_checksum(seed)) ++ "}")
    case None{}: IO.die(Unit, 2, "Expected checksum seed")

def start(args: List<String>) -> IO(Unit):
  match args:
    case Con{program, Con{seed, Nil{}}}: parsed(U32.read(seed))
    case _: IO.die(Unit, 2, "Expected checksum seed")

def main() -> IO(Unit):
  do IO<Unit>:
    args : List<String> <- IO.args()
    start(args)
