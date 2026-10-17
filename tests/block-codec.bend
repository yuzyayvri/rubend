import Base
import ../src/block-table.bend as B

def spread(fuel: Nat, +pattern: U32, +base: U32, +at: U32, word: U32) -> U32:
  match fuel:
    case 0n: word
    case 1n+p: spread(p, (pattern >> 2n : U32), base, (at + 1 : U32), (word .|. (((pattern .&. 3) + base) << U32.to_nat((at * 4 : U32))) : U32))

def check(fuel: Nat, valid: Bool, +index: U32) -> Bool:
  match fuel valid:
    case 1n+p True{}:
      +base = (index / 65536 : U32)
      +pattern = (index % 65536 : U32)
      +a = spread(8n, pattern, base, 0, 0)
      b = spread(8n, (pattern .^. 65535 : U32), base, 0, 0)
      check(p, U32.is_eq(B.squash(a, base), pattern) && U32.is_eq(B.narrow(a, b, base), (pattern .|. ((pattern .^. 65535) << 16n) : U32)), (index + 1 : U32))
    case _ valid: valid

def report(valid: Bool) -> IO(Unit):
  match valid:
    case True{}: IO.print("{\"nativeWordCodec\":true,\"cases\":851968}")
    case False{}: IO.die(Unit, 2, "Native block word codec mismatch")

def main() -> IO(Unit):
  report(check(851968n, True{}, 0))
