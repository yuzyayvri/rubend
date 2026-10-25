import Base

def Le(a: Nat, b: Nat) -> Type:
  match a b:
    case 0n _: Unit
    case 1n+p 0n: Empty
    case 1n+p 1n+q: Le(p, q)

def le_trans(+a: Nat, +b: Nat, +c: Nat, ab: Le(a, b), bc: Le(b, c)) -> Le(a, c):
  match a b c:
    case 0n _ _: Unit{}
    case 1n+p 0n _: Empty.absurd(Le(a, c), ab)
    case 1n+p 1n+q 0n: Empty.absurd(Le(a, c), bc)
    case 1n+p 1n+q 1n+r: le_trans(p, q, r, ab, bc)

def cap(value: Nat) -> Nat:
  match value:
    case 0n: 0n
    case 1n: 1n
    case 2n: 2n
    case 3n+rest: 3n

def code(value: Nat, base: Nat) -> Nat:
  match value base:
    case 0n _: 0n
    case 1n+p 0n: cap(1n+p)
    case 1n+p 1n+q: code(p, q)

def decoded(value: Nat, base: Nat, fallback: Nat) -> Nat:
  match value:
    case 0n: fallback
    case 1n+rest: Nat.add(base, 1n+rest)

def estimate(+value: Nat, +base: Nat, fallback: Nat) -> Nat:
  decoded(code(value, base), base, fallback)

def min_zero(+value: Nat) -> {Nat.min(value, 0n) == 0n : Nat}:
  match value:
    case 0n: {==}
    case 1n+rest: {==}

def cap_formula(+value: Nat) -> {cap(value) == Nat.min(value, 3n) : Nat}:
  match value:
    case 0n: {==}
    case 1n: {==}
    case 2n: {==}
    case 3n+rest:
      Equal.sym(Nat, 3n+Nat.min(rest, 0n), 3n, Equal.cong(Nat, Nat, n => 3n+n, Nat.min(rest, 0n), 0n, min_zero(rest)))

law quantization_formula:
  for +value: Nat
  for +base: Nat
  {code(value, base) == Nat.min(Nat.sub(value, base), 3n) : Nat}

def quantization_formula(value, base):
  match value base:
    case 0n _: {==}
    case 1n+p 0n: cap_formula(1n+p)
    case 1n+p 1n+q: quantization_formula(p, q)

def cap_bound(+value: Nat) -> Le(cap(value), 3n):
  match value:
    case 0n: Unit{}
    case 1n: Unit{}
    case 2n: Unit{}
    case 3n+rest: Unit{}

law code_fits_two_bits:
  for +value: Nat
  for +base: Nat
  Le(code(value, base), 3n)

def code_fits_two_bits(value, base):
  match value base:
    case 0n _: Unit{}
    case 1n+p 0n: cap_bound(1n+p)
    case 1n+p 1n+q: code_fits_two_bits(p, q)

def cap_positive_below(+rest: Nat, fallback: Nat) -> Le(decoded(cap(1n+rest), 0n, fallback), 1n+rest):
  match rest:
    case 0n: Unit{}
    case 1n: Unit{}
    case 2n+tail: Unit{}

def shifted(+value: Nat, +base: Nat, +reference: Nat, +fallback: Nat, low: Le(fallback, 1n+reference), previous: Le(decoded(value, base, 0n), reference)) -> Le(decoded(value, 1n+base, fallback), 1n+reference):
  match value:
    case 0n: low
    case 1n+rest: previous

law conservative_decode:
  for +value: Nat
  for +base: Nat
  for +fallback: Nat
  for below: Le(fallback, value)
  Le(estimate(value, base, fallback), value)

def conservative_decode(value, base, fallback, below):
  match value base:
    case 0n _: below
    case 1n+p 0n: cap_positive_below(p, fallback)
    case 1n+p 1n+q:
      shifted(code(p, q), q, p, fallback, below, conservative_decode(p, q, 0n, Unit{}))

law preserves_admissibility:
  for +value: Nat
  for +base: Nat
  for +fallback: Nat
  for +distance: Nat
  for below: Le(fallback, value)
  for admissible: Le(value, distance)
  Le(estimate(value, base, fallback), distance)

def preserves_admissibility(value, base, fallback, distance, below, admissible):
  le_trans(estimate(value, base, fallback), value, distance, conservative_decode(value, base, fallback, below), admissible)

def BlockBelow(values: +List<Nat>, fallback: Nat) -> Type:
  match values:
    case Nil{}: Unit
    case Con{head, tail}: Le(fallback, head) & BlockBelow(tail, fallback)

def ValidIndex(values: +List<Nat>, index: Nat) -> Type:
  match values index:
    case Nil{} _: Empty
    case Con{head, tail} 0n: Unit
    case Con{head, tail} 1n+rest: ValidIndex(tail, rest)

def lookup(values: +List<Nat>, index: Nat) -> Nat:
  match values index:
    case Nil{} _: 0n
    case Con{head, tail} 0n: head
    case Con{head, tail} 1n+rest: lookup(tail, rest)

def at_bound(+values: +List<Nat>, +index: Nat, +fallback: Nat, valid: ValidIndex(values, index), below: BlockBelow(values, fallback)) -> Le(fallback, lookup(values, index)):
  match values index:
    case Nil{} _: Empty.absurd(Le(fallback, lookup(values, index)), valid)
    case Con{head, tail} 0n:
      match below:
        case Tuple{first, rest}: first
    case Con{head, +tail} 1n+rest:
      match below:
        case Tuple{first, remaining}: at_bound(tail, rest, fallback, valid, remaining)

law valid_block_index:
  for +values: +List<Nat>
  for +index: Nat
  for +base: Nat
  for +fallback: Nat
  for valid: ValidIndex(values, index)
  for below: BlockBelow(values, fallback)
  Le(estimate(lookup(values, index), base, fallback), lookup(values, index))

def valid_block_index(values, index, base, fallback, valid, below):
  conservative_decode(lookup(values, index), base, fallback, at_bound(values, index, fallback, valid, below))

def weaken(+a: Nat, +b: Nat, below: Le(a, b)) -> Le(a, 1n+b):
  match a b:
    case 0n _: Unit{}
    case 1n+p 0n: Empty.absurd(Le(a, 1n+b), below)
    case 1n+p 1n+q: weaken(p, q, below)

def grow(+amount: Nat, +a: Nat, +b: Nat, below: Le(a, b)) -> Le(a, Nat.add(amount, b)):
  match amount:
    case 0n: below
    case 1n+rest: weaken(a, Nat.add(rest, b), grow(rest, a, b, below))

def add_bounded(+a: Nat, +limit: Nat, +value: Nat, below: Le(a, limit), code_bound: Le(value, 3n)) -> Le(Nat.add(a, value), Nat.add(limit, 3n)):
  match a limit:
    case 0n _: grow(limit, value, 3n, code_bound)
    case 1n+p 0n: Empty.absurd(Le(Nat.add(a, value), Nat.add(limit, 3n)), below)
    case 1n+p 1n+q: add_bounded(p, q, value, below, code_bound)

law admitted_sum_fits_byte:
  for +base: Nat
  for +value: Nat
  for admitted: Le(base, 252n)
  for code_bound: Le(value, 3n)
  Le(Nat.add(base, value), 255n)

def admitted_sum_fits_byte(base, value, admitted, code_bound):
  add_bounded(base, 252n, value, admitted, code_bound)
