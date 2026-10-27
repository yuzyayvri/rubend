import Base
import ../src/cubie.bend as C

type Part is Data:
  Part{positions: +List<U32>, orientations: U32}

def cardinality(count: U32) -> U32:
  match count:
    case 1: 24
    case 2: 528
    case 3: 10560
    case 4: 190080
    case 5: 3041280
    case 6: 42577920
    case _: 0

def smaller(used: +List<U32>, +value: U32) -> U32:
  match used:
    case Nil{}: 0
    case Con{head, rest}: (C.pick(U32.is_lt(head, value), 1, 0) + smaller(rest, value) : U32)

def rank_positions(positions: +List<U32>, +used: +List<U32>, +base: U32, acc: U32) -> U32:
  match positions:
    case Nil{}: acc
    case Con{+head, rest}:
      rank_positions(rest, head <> used, (base - 1 : U32), (acc * base + head - smaller(used, head) : U32))

def encode(part: Part) -> U32:
  match part:
    case Part{+positions, orientations}:
      (rank_positions(positions, Nil{}, 12, 0) * (1 << List.length(&2, U32, positions) : U32) + orientations : U32)

def digits(fuel: Nat, +rank: U32, +base: U32, out: +List<U32>) -> +List<U32>:
  match fuel:
    case 0n: out
    case 1n+rest: digits(rest, (rank / base : U32), (base + 1 : U32), (rank % base : U32) <> out)

def select(available: +List<U32>, digit: U32) -> U32:
  match available digit:
    case Nil{} _: 0
    case Con{head, rest} 0: head
    case Con{head, rest} digit: select(rest, (digit - 1 : U32))

def retain(equal: Bool, head: U32, rest: +List<U32>) -> +List<U32>:
  match equal:
    case True{}: rest
    case False{}: head <> rest

def remove(available: +List<U32>, +value: U32) -> +List<U32>:
  match available:
    case Nil{}: Nil{}
    case Con{+head, rest}: retain(U32.is_eq(head, value), head, remove(rest, value))

def unrank_positions(values: +List<U32>, +available: +List<U32>) -> +List<U32>:
  match values:
    case Nil{}: Nil{}
    case Con{digit, rest}:
      +position = select(available, digit)
      position <> unrank_positions(rest, remove(available, position))

def decode_known(+count: U32, +rank: U32) -> Part:
  +factor = (1 << U32.to_nat(count) : U32)
  Part{unrank_positions(digits(U32.to_nat(count), (rank / factor : U32), (13 - count : U32), Nil{}), [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]), (rank % factor : U32)}

def admit(valid: Bool, count: U32, rank: U32) -> Maybe<&2, Part>:
  match valid:
    case False{}: None{}
    case True{}: Some{decode_known(count, rank)}

def decode(+count: U32, +rank: U32) -> Maybe<&2, Part>:
  admit(U32.is_lt(rank, cardinality(count)), count, rank)
