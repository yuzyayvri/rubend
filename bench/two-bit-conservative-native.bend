import Base
import ./two-bit-conservative.bend as N
import ./edge-two-bit.bend as D

type Totals is Data:
  Totals{checks: U32, bad: U32, checksum: U32}

def accumulate(same: Bool, code: U32, value: U32, totals: Totals) -> Totals:
  match same totals:
    case True{} Totals{checks, bad, checksum}:
      Totals{(checks + 1 : U32), bad, ((checksum * 33 + code) * 33 + value : U32)}
    case False{} Totals{checks, bad, checksum}:
      Totals{(checks + 1 : U32), (bad + 1 : U32), ((checksum * 33 + code) * 33 + value : U32)}

def compared(+reference: U32, +code: U32, +value: U32, expected_code: U32, expected_value: U32, totals: Totals) -> Totals:
  accumulate(U32.is_eq(code, expected_code) && U32.is_eq(value, expected_value) && U32.is_le(value, reference) && U32.is_le(code, 3), code, value, totals)

def one(+reference: U32, +base: U32, +fallback: U32, totals: Totals) -> Totals:
  +code = D.code(reference, base)
  compared(reference, code, D.decoded(code, base, fallback), U32.from_nat(N.code(U32.to_nat(reference), U32.to_nat(base))), U32.from_nat(N.estimate(U32.to_nat(reference), U32.to_nat(base), U32.to_nat(fallback))), totals)

def bases(fuel: Nat, +base: U32, +reference: U32, totals: Totals) -> Totals:
  match fuel:
    case 0n: totals
    case 1n+rest:
      bases(rest, (base + 1 : U32), reference, one(reference, base, (reference / 2 : U32), one(reference, base, reference, one(reference, base, 0, totals))))

def rows(fuel: Nat, +reference: U32, totals: Totals) -> Totals:
  match fuel:
    case 0n: totals
    case 1n+rest: rows(rest, (reference + 1 : U32), bases(253n, 0, reference, totals))

def report(totals: Totals) -> IO(Unit):
  match totals:
    case Totals{checks, bad, checksum}:
      IO.print("{\"checks\":" ++ U32.show(checks) ++ ",\"bad\":" ++ U32.show(bad) ++ ",\"checksum\":" ++ U32.show(checksum) ++ "}")

def main() -> IO(Unit):
  report(rows(255n, 0, Totals{0, 0, 7}))
