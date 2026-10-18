import Base
import ./cubie.bend as C
import ./coordinates.bend as Q
import ./model.bend as M
import ./symmetry48.bend as S

type Corner is Data:
  Corner{separation: U32, twist: U32}

def size() -> U32:
  153090

def tetrad(+piece: U32) -> U32:
  ((piece .^. (piece >> 2n)) .&. 1 : U32)

def separation_loop(fuel: Nat, +cp: U32, +index: U32, mask: U32) -> U32:
  match fuel:
    case 0n: mask
    case 1n+p:
      separation_loop(p, cp, (index + 1 : U32), (mask .|. (tetrad(C.nib(cp, index)) << U32.to_nat(index)) : U32))

def projected(cube: C.Cubie, twist: U32) -> Corner:
  match cube:
    case C.Cubie{cp, co, ep, eh, eo}: Corner{separation_loop(8n, cp, 0, 0), twist}

def project(+cube: C.Cubie) -> Corner:
  projected(cube, Q.encode(Q.Twist{}, cube))

def rank_loop(fuel: Nat, +mask: U32, +index: U32, +chosen: U32, acc: U32) -> U32:
  match fuel:
    case 0n: acc
    case 1n+p:
      +flag = C.bit(mask, index)
      +next = (chosen + flag : U32)
      rank_loop(p, mask, (index + 1 : U32), next, (acc + flag * Q.choose(index, next) : U32))

def index(corner: Corner) -> U32:
  match corner:
    case Corner{separation, twist}: (twist * 70 + rank_loop(8n, separation, 0, 0, 0) : U32)

def sparse_key(corner: Corner) -> U32:
  match corner:
    case Corner{separation, twist}: (twist * 128 + (separation .&. 127) : U32)

def unrank_mask(+fuel: Nat, +rank: U32, +remaining: U32, mask: U32) -> U32:
  match fuel:
    case 0n: mask
    case 1n+p:
      +value = Q.choose(U32.from_nat(p), remaining)
      +selected = C.pick(U32.is_gt(remaining, 0) && U32.is_ge(rank, value), 1, 0)
      unrank_mask(p, (rank - selected * value : U32), (remaining - selected : U32), (mask .|. (selected << p) : U32))

def parsed(allowed: Bool, +index: U32) -> Maybe<&2, Corner>:
  match allowed:
    case False{}: None{}
    case True{}: Some{Corner{unrank_mask(8n, (index % 70 : U32), 4, 0), (index / 70 : U32)}}

def from_index(+index: U32) -> Maybe<&2, Corner>:
  parsed(U32.is_lt(index, size()), index)

def piece_a(index: U32) -> U32:
  match index:
    case 0: 0
    case 1: 2
    case 2: 5
    case _: 7

def piece_b(index: U32) -> U32:
  match index:
    case 0: 1
    case 1: 3
    case 2: 4
    case _: 6

def permutation(fuel: Nat, +mask: U32, +position: U32, +a: U32, +b: U32, word: U32) -> U32:
  match fuel:
    case 0n: word
    case 1n+p:
      +flag = C.bit(mask, position)
      piece = C.pick(U32.is_eq(flag, 1), piece_b(b), piece_a(a))
      permutation(p, mask, (position + 1 : U32), (a + 1 - flag : U32), (b + flag : U32), (word .|. (piece << U32.to_nat((position * 4 : U32))) : U32))

def legal_representative(+cp: U32, twist: C.Cubie) -> C.Cubie:
  match twist:
    case C.Cubie{other, co, ep, eh, eo}:
      C.Cubie{cp, co, C.pick(U32.is_eq(C.parity(8n, cp, 0, 8, 0, 0), 1), 1985229313, 1985229328), 47768, 0}

def representative(corner: Corner) -> C.Cubie:
  match corner:
    case Corner{separation, twist}: legal_representative(permutation(8n, separation, 0, 0, 0, 0), Q.decode(Q.Twist{}, twist))

def transition(move: M.Move, corner: Corner) -> Corner:
  project(C.turn(M.index(move), representative(corner)))

def transformed(validation: C.Validation) -> Maybe<&2, Corner>:
  match validation:
    case C.Valid{cube}: Some{project(cube)}
    case C.Invalid{code}: None{}

def reference_transform(sym: S.Symmetry, corner: Corner) -> Maybe<&2, Corner>:
  transformed(C.validate(S.apply(sym, C.to_facelets(representative(corner)))))

def goal() -> Corner:
  project(C.solved())
