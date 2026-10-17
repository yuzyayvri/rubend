import Base
import ./cubie.bend as C

type Coord is Data:
  Twist{}
  Flip{}
  Slice{}
  Corners{}
  Edges{}
  Middle{}

def factorial(n: U32) -> U32:
  match n:
    case 0:
      1
    case 1:
      1
    case 2:
      2
    case 3:
      6
    case 4:
      24
    case 5:
      120
    case 6:
      720
    case 7:
      5040
    case 8:
      40320
    case _:
      1

def choose(n: U32, k: U32) -> U32:
  match n k:
    case 0 0:
      1
    case 0 1:
      0
    case 0 2:
      0
    case 0 3:
      0
    case 0 4:
      0
    case 1 0:
      1
    case 1 1:
      1
    case 1 2:
      0
    case 1 3:
      0
    case 1 4:
      0
    case 2 0:
      1
    case 2 1:
      2
    case 2 2:
      1
    case 2 3:
      0
    case 2 4:
      0
    case 3 0:
      1
    case 3 1:
      3
    case 3 2:
      3
    case 3 3:
      1
    case 3 4:
      0
    case 4 0:
      1
    case 4 1:
      4
    case 4 2:
      6
    case 4 3:
      4
    case 4 4:
      1
    case 5 0:
      1
    case 5 1:
      5
    case 5 2:
      10
    case 5 3:
      10
    case 5 4:
      5
    case 6 0:
      1
    case 6 1:
      6
    case 6 2:
      15
    case 6 3:
      20
    case 6 4:
      15
    case 7 0:
      1
    case 7 1:
      7
    case 7 2:
      21
    case 7 3:
      35
    case 7 4:
      35
    case 8 0:
      1
    case 8 1:
      8
    case 8 2:
      28
    case 8 3:
      56
    case 8 4:
      70
    case 9 0:
      1
    case 9 1:
      9
    case 9 2:
      36
    case 9 3:
      84
    case 9 4:
      126
    case 10 0:
      1
    case 10 1:
      10
    case 10 2:
      45
    case 10 3:
      120
    case 10 4:
      210
    case 11 0:
      1
    case 11 1:
      11
    case 11 2:
      55
    case 11 3:
      165
    case 11 4:
      330
    case _ _:
      0

def rank4(+word: U32) -> U32:
  ((C.pick(U32.is_gt(C.nib(word, 0), C.nib(word, 1)), 6, 0)) + (C.pick(U32.is_gt(C.nib(word, 0), C.nib(word, 2)), 6, 0)) + (C.pick(U32.is_gt(C.nib(word, 0), C.nib(word, 3)), 6, 0)) + (C.pick(U32.is_gt(C.nib(word, 1), C.nib(word, 2)), 2, 0)) + (C.pick(U32.is_gt(C.nib(word, 1), C.nib(word, 3)), 2, 0)) + (C.pick(U32.is_gt(C.nib(word, 2), C.nib(word, 3)), 1, 0)) : U32)

def rank8(+word: U32) -> U32:
  ((C.pick(U32.is_gt(C.nib(word, 0), C.nib(word, 1)), 5040, 0)) + (C.pick(U32.is_gt(C.nib(word, 0), C.nib(word, 2)), 5040, 0)) + (C.pick(U32.is_gt(C.nib(word, 0), C.nib(word, 3)), 5040, 0)) + (C.pick(U32.is_gt(C.nib(word, 0), C.nib(word, 4)), 5040, 0)) + (C.pick(U32.is_gt(C.nib(word, 0), C.nib(word, 5)), 5040, 0)) + (C.pick(U32.is_gt(C.nib(word, 0), C.nib(word, 6)), 5040, 0)) + (C.pick(U32.is_gt(C.nib(word, 0), C.nib(word, 7)), 5040, 0)) + (C.pick(U32.is_gt(C.nib(word, 1), C.nib(word, 2)), 720, 0)) + (C.pick(U32.is_gt(C.nib(word, 1), C.nib(word, 3)), 720, 0)) + (C.pick(U32.is_gt(C.nib(word, 1), C.nib(word, 4)), 720, 0)) + (C.pick(U32.is_gt(C.nib(word, 1), C.nib(word, 5)), 720, 0)) + (C.pick(U32.is_gt(C.nib(word, 1), C.nib(word, 6)), 720, 0)) + (C.pick(U32.is_gt(C.nib(word, 1), C.nib(word, 7)), 720, 0)) + (C.pick(U32.is_gt(C.nib(word, 2), C.nib(word, 3)), 120, 0)) + (C.pick(U32.is_gt(C.nib(word, 2), C.nib(word, 4)), 120, 0)) + (C.pick(U32.is_gt(C.nib(word, 2), C.nib(word, 5)), 120, 0)) + (C.pick(U32.is_gt(C.nib(word, 2), C.nib(word, 6)), 120, 0)) + (C.pick(U32.is_gt(C.nib(word, 2), C.nib(word, 7)), 120, 0)) + (C.pick(U32.is_gt(C.nib(word, 3), C.nib(word, 4)), 24, 0)) + (C.pick(U32.is_gt(C.nib(word, 3), C.nib(word, 5)), 24, 0)) + (C.pick(U32.is_gt(C.nib(word, 3), C.nib(word, 6)), 24, 0)) + (C.pick(U32.is_gt(C.nib(word, 3), C.nib(word, 7)), 24, 0)) + (C.pick(U32.is_gt(C.nib(word, 4), C.nib(word, 5)), 6, 0)) + (C.pick(U32.is_gt(C.nib(word, 4), C.nib(word, 6)), 6, 0)) + (C.pick(U32.is_gt(C.nib(word, 4), C.nib(word, 7)), 6, 0)) + (C.pick(U32.is_gt(C.nib(word, 5), C.nib(word, 6)), 2, 0)) + (C.pick(U32.is_gt(C.nib(word, 5), C.nib(word, 7)), 2, 0)) + (C.pick(U32.is_gt(C.nib(word, 6), C.nib(word, 7)), 1, 0)) : U32)

def unrank_loop(+fuel: Nat, +rank: U32, +available: U32, +index: U32, word: U32) -> U32:
  match fuel:
    case 0n:
      word
    case 1n+p:
      +factor = factorial(U32.from_nat(p))
      +digit = (rank / factor : U32)
      +shift = U32.to_nat((digit * 4 : U32))
      +mask = ((1 << shift) - 1 : U32)
      value = ((available >> shift) .&. 15 : U32)
      unrank_loop(p, (rank % factor : U32), ((available .&. mask) .|. ((available >> 4n) .&. U32.not(mask)) : U32), (index + 1 : U32), (word .|. (value << U32.to_nat((index * 4 : U32))) : U32))

def unrank8(rank: U32) -> U32:
  unrank_loop(8n, rank, 1985229328, 0, 0)

def unrank4(rank: U32) -> U32:
  unrank_loop(4n, rank, 12816, 0, 0)

def slice_rank_loop(+fuel: Nat, +mask: U32, +i: U32, +k: U32, acc: U32) -> U32:
  match fuel:
    case 0n:
      (494 - acc : U32)
    case 1n+p:
      +flag = C.bit(mask, i)
      slice_rank_loop(p, mask, (i + 1 : U32), (k + flag : U32), (acc + flag * choose(i, k) : U32))

def slice_mask_loop(+fuel: Nat, +rank: U32, +k: U32, mask: U32) -> U32:
  match fuel:
    case 0n:
      mask
    case 1n+p:
      +i = U32.from_nat(p)
      +v = choose(i, k)
      +flag = C.pick(U32.is_gt(k, 0) && U32.is_le(v, rank), 1, 0)
      slice_mask_loop(p, (rank - flag * v : U32), (k - flag : U32), (mask .|. (flag << p) : U32))

def slice_mask(rank: U32) -> U32:
  slice_mask_loop(12n, (494 - rank : U32), 4, 0)

def slice_cube(+mask: U32) -> C.Cubie:
  C.Cubie{1985229328, 0, (C.pick(U32.is_eq(C.bit(mask, 0), 1), (8 + 0 : U32), (0 - 0 : U32)) .|. (C.pick(U32.is_eq(C.bit(mask, 1), 1), (8 + (C.bit(mask, 0) : U32) : U32), (1 - (C.bit(mask, 0) : U32) : U32)) << 4n : U32) .|. (C.pick(U32.is_eq(C.bit(mask, 2), 1), (8 + (C.bit(mask, 0) + C.bit(mask, 1) : U32) : U32), (2 - (C.bit(mask, 0) + C.bit(mask, 1) : U32) : U32)) << 8n : U32) .|. (C.pick(U32.is_eq(C.bit(mask, 3), 1), (8 + (C.bit(mask, 0) + C.bit(mask, 1) + C.bit(mask, 2) : U32) : U32), (3 - (C.bit(mask, 0) + C.bit(mask, 1) + C.bit(mask, 2) : U32) : U32)) << 12n : U32) .|. (C.pick(U32.is_eq(C.bit(mask, 4), 1), (8 + (C.bit(mask, 0) + C.bit(mask, 1) + C.bit(mask, 2) + C.bit(mask, 3) : U32) : U32), (4 - (C.bit(mask, 0) + C.bit(mask, 1) + C.bit(mask, 2) + C.bit(mask, 3) : U32) : U32)) << 16n : U32) .|. (C.pick(U32.is_eq(C.bit(mask, 5), 1), (8 + (C.bit(mask, 0) + C.bit(mask, 1) + C.bit(mask, 2) + C.bit(mask, 3) + C.bit(mask, 4) : U32) : U32), (5 - (C.bit(mask, 0) + C.bit(mask, 1) + C.bit(mask, 2) + C.bit(mask, 3) + C.bit(mask, 4) : U32) : U32)) << 20n : U32) .|. (C.pick(U32.is_eq(C.bit(mask, 6), 1), (8 + (C.bit(mask, 0) + C.bit(mask, 1) + C.bit(mask, 2) + C.bit(mask, 3) + C.bit(mask, 4) + C.bit(mask, 5) : U32) : U32), (6 - (C.bit(mask, 0) + C.bit(mask, 1) + C.bit(mask, 2) + C.bit(mask, 3) + C.bit(mask, 4) + C.bit(mask, 5) : U32) : U32)) << 24n : U32) .|. (C.pick(U32.is_eq(C.bit(mask, 7), 1), (8 + (C.bit(mask, 0) + C.bit(mask, 1) + C.bit(mask, 2) + C.bit(mask, 3) + C.bit(mask, 4) + C.bit(mask, 5) + C.bit(mask, 6) : U32) : U32), (7 - (C.bit(mask, 0) + C.bit(mask, 1) + C.bit(mask, 2) + C.bit(mask, 3) + C.bit(mask, 4) + C.bit(mask, 5) + C.bit(mask, 6) : U32) : U32)) << 28n : U32) : U32), (C.pick(U32.is_eq(C.bit(mask, 8), 1), (8 + (C.bit(mask, 0) + C.bit(mask, 1) + C.bit(mask, 2) + C.bit(mask, 3) + C.bit(mask, 4) + C.bit(mask, 5) + C.bit(mask, 6) + C.bit(mask, 7) : U32) : U32), (8 - (C.bit(mask, 0) + C.bit(mask, 1) + C.bit(mask, 2) + C.bit(mask, 3) + C.bit(mask, 4) + C.bit(mask, 5) + C.bit(mask, 6) + C.bit(mask, 7) : U32) : U32)) .|. (C.pick(U32.is_eq(C.bit(mask, 9), 1), (8 + (C.bit(mask, 0) + C.bit(mask, 1) + C.bit(mask, 2) + C.bit(mask, 3) + C.bit(mask, 4) + C.bit(mask, 5) + C.bit(mask, 6) + C.bit(mask, 7) + C.bit(mask, 8) : U32) : U32), (9 - (C.bit(mask, 0) + C.bit(mask, 1) + C.bit(mask, 2) + C.bit(mask, 3) + C.bit(mask, 4) + C.bit(mask, 5) + C.bit(mask, 6) + C.bit(mask, 7) + C.bit(mask, 8) : U32) : U32)) << 4n : U32) .|. (C.pick(U32.is_eq(C.bit(mask, 10), 1), (8 + (C.bit(mask, 0) + C.bit(mask, 1) + C.bit(mask, 2) + C.bit(mask, 3) + C.bit(mask, 4) + C.bit(mask, 5) + C.bit(mask, 6) + C.bit(mask, 7) + C.bit(mask, 8) + C.bit(mask, 9) : U32) : U32), (10 - (C.bit(mask, 0) + C.bit(mask, 1) + C.bit(mask, 2) + C.bit(mask, 3) + C.bit(mask, 4) + C.bit(mask, 5) + C.bit(mask, 6) + C.bit(mask, 7) + C.bit(mask, 8) + C.bit(mask, 9) : U32) : U32)) << 8n : U32) .|. (C.pick(U32.is_eq(C.bit(mask, 11), 1), (8 + (C.bit(mask, 0) + C.bit(mask, 1) + C.bit(mask, 2) + C.bit(mask, 3) + C.bit(mask, 4) + C.bit(mask, 5) + C.bit(mask, 6) + C.bit(mask, 7) + C.bit(mask, 8) + C.bit(mask, 9) + C.bit(mask, 10) : U32) : U32), (11 - (C.bit(mask, 0) + C.bit(mask, 1) + C.bit(mask, 2) + C.bit(mask, 3) + C.bit(mask, 4) + C.bit(mask, 5) + C.bit(mask, 6) + C.bit(mask, 7) + C.bit(mask, 8) + C.bit(mask, 9) + C.bit(mask, 10) : U32) : U32)) << 12n : U32) : U32), 0}

def decode(kind: Coord, +rank: U32) -> C.Cubie:
  match kind:
    case Twist{}:
      C.Cubie{1985229328, (((rank / 1) % 3 : U32) .|. (((rank / 3) % 3 : U32) << 2n : U32) .|. (((rank / 9) % 3 : U32) << 4n : U32) .|. (((rank / 27) % 3 : U32) << 6n : U32) .|. (((rank / 81) % 3 : U32) << 8n : U32) .|. (((rank / 243) % 3 : U32) << 10n : U32) .|. (((rank / 729) % 3 : U32) << 12n : U32) .|. (((3 - ((((rank / 1) % 3 : U32) + ((rank / 3) % 3 : U32) + ((rank / 9) % 3 : U32) + ((rank / 27) % 3 : U32) + ((rank / 81) % 3 : U32) + ((rank / 243) % 3 : U32) + ((rank / 729) % 3 : U32)) % 3)) % 3 : U32) << 14n : U32) : U32), 1985229328, 47768, 0}
    case Flip{}:
      C.Cubie{1985229328, 0, 1985229328, 47768, (rank .|. ((C.bit(rank, 0) .^. C.bit(rank, 1) .^. C.bit(rank, 2) .^. C.bit(rank, 3) .^. C.bit(rank, 4) .^. C.bit(rank, 5) .^. C.bit(rank, 6) .^. C.bit(rank, 7) .^. C.bit(rank, 8) .^. C.bit(rank, 9) .^. C.bit(rank, 10)) << 11n) : U32)}
    case Slice{}:
      slice_cube(slice_mask(rank))
    case Corners{}:
      C.Cubie{unrank8(rank), 0, 1985229328, 47768, 0}
    case Edges{}:
      C.Cubie{1985229328, 0, unrank8(rank), 47768, 0}
    case Middle{}:
      C.Cubie{1985229328, 0, 1985229328, (unrank4(rank) + 34952 : U32), 0}

def encode(kind: Coord, cube: C.Cubie) -> U32:
  match kind cube:
    case Twist{} C.Cubie{cp, +co, ep, eh, eo}:
      ((((co >> 0n) .&. 3) * 1) + (((co >> 2n) .&. 3) * 3) + (((co >> 4n) .&. 3) * 9) + (((co >> 6n) .&. 3) * 27) + (((co >> 8n) .&. 3) * 81) + (((co >> 10n) .&. 3) * 243) + (((co >> 12n) .&. 3) * 729) : U32)
    case Flip{} C.Cubie{cp, co, ep, eh, eo}:
      (eo .&. 2047 : U32)
    case Slice{} C.Cubie{cp, co, +ep, +eh, eo}:
      slice_rank_loop(12n, (C.pick(U32.is_ge(C.nib(ep, 0), 8), 1, 0) .|. (C.pick(U32.is_ge(C.nib(ep, 1), 8), 1, 0) << 1n : U32) .|. (C.pick(U32.is_ge(C.nib(ep, 2), 8), 1, 0) << 2n : U32) .|. (C.pick(U32.is_ge(C.nib(ep, 3), 8), 1, 0) << 3n : U32) .|. (C.pick(U32.is_ge(C.nib(ep, 4), 8), 1, 0) << 4n : U32) .|. (C.pick(U32.is_ge(C.nib(ep, 5), 8), 1, 0) << 5n : U32) .|. (C.pick(U32.is_ge(C.nib(ep, 6), 8), 1, 0) << 6n : U32) .|. (C.pick(U32.is_ge(C.nib(ep, 7), 8), 1, 0) << 7n : U32) .|. (C.pick(U32.is_ge(C.nib(eh, 0), 8), 1, 0) << 8n : U32) .|. (C.pick(U32.is_ge(C.nib(eh, 1), 8), 1, 0) << 9n : U32) .|. (C.pick(U32.is_ge(C.nib(eh, 2), 8), 1, 0) << 10n : U32) .|. (C.pick(U32.is_ge(C.nib(eh, 3), 8), 1, 0) << 11n : U32) : U32), 0, 1, 0)
    case Corners{} C.Cubie{cp, co, ep, eh, eo}:
      rank8(cp)
    case Edges{} C.Cubie{cp, co, ep, eh, eo}:
      rank8(ep)
    case Middle{} C.Cubie{cp, co, ep, eh, eo}:
      rank4(eh)

def size(kind: Coord) -> U32:
  match kind:
    case Twist{}:
      2187
    case Flip{}:
      2048
    case Slice{}:
      495
    case Corners{}:
      40320
    case Edges{}:
      40320
    case Middle{}:
      24

def moves(kind: Coord) -> U32:
  match kind:
    case Twist{}:
      18
    case Flip{}:
      18
    case Slice{}:
      18
    case Corners{}:
      10
    case Edges{}:
      10
    case Middle{}:
      10

def offset(kind: Coord) -> U32:
  match kind:
    case Twist{}:
      0
    case Flip{}:
      39366
    case Slice{}:
      76230
    case Corners{}:
      85140
    case Edges{}:
      488340
    case Middle{}:
      891540

def phase2_move(index: U32) -> U32:
  match index:
    case 0:
      0
    case 1:
      1
    case 2:
      2
    case 3:
      4
    case 4:
      7
    case 5:
      9
    case 6:
      10
    case 7:
      11
    case 8:
      13
    case 9:
      16
    case _:
      16

def transition(+kind: Coord, +index: U32, +move: U32) -> U32:
  encode(kind, C.turn(C.pick(U32.is_eq(moves(kind), 18), move, phase2_move(move)), decode(kind, index)))
