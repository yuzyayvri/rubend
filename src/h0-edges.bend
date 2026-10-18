import Base
import ./cubie.bend as C
import ./model.bend as M
import ./h0-corners.bend as H
import ./symmetry48.bend as S

type Edge is Data:
  Edge{word: U32}

def size() -> U32:
  34650

def slice(+piece: U32) -> U32:
  C.pick(U32.is_ge(piece, 8), 2, (1 - (piece .&. 1) : U32))

def projected(fuel: Nat, +ep: U32, +eh: U32, +position: U32, word: U32) -> U32:
  match fuel:
    case 0n: word
    case 1n+p:
      piece = C.nib(C.pick(U32.is_lt(position, 8), ep, eh), (position % 8 : U32))
      projected(p, ep, eh, (position + 1 : U32), (word .|. (slice(piece) << U32.to_nat((position * 2 : U32))) : U32))

def project(cube: C.Cubie) -> Edge:
  match cube:
    case C.Cubie{cp, co, ep, eh, eo}: Edge{projected(12n, ep, eh, 0, 0)}

def label(+word: U32, position: U32) -> U32:
  ((word >> U32.to_nat((position * 2 : U32))) .&. 3 : U32)

def rank(fuel: Nat, +word: U32, +position: U32, +other: U32, em: U32, mm: U32) -> U32:
  match fuel:
    case 0n: (H.rank_loop(12n, em, 0, 0, 0) * 70 + H.rank_loop(8n, mm, 0, 0, 0) : U32)
    case 1n+p:
      +value = label(word, position)
      +e = C.pick(U32.is_eq(value, 2), 1, 0)
      +m = C.pick(U32.is_eq(value, 0), 1, 0)
      rank(p, word, (position + 1 : U32), (other + 1 - e : U32), (em .|. (e << U32.to_nat(position)) : U32), (mm .|. (m << U32.to_nat(other)) : U32))

def index(edge: Edge) -> U32:
  match edge:
    case Edge{word}: rank(12n, word, 0, 0, 0, 0)

def decode(fuel: Nat, +em: U32, +mm: U32, +position: U32, +other: U32, word: U32) -> U32:
  match fuel:
    case 0n: word
    case 1n+p:
      +e = C.bit(em, position)
      value = C.pick(U32.is_eq(e, 1), 2, C.pick(U32.is_eq(C.bit(mm, other), 1), 0, 1))
      decode(p, em, mm, (position + 1 : U32), (other + 1 - e : U32), (word .|. (value << U32.to_nat((position * 2 : U32))) : U32))

def parsed(ok: Bool, +index: U32) -> Maybe<&2, Edge>:
  match ok:
    case False{}: None{}
    case True{}: Some{Edge{decode(12n, H.unrank_mask(12n, (index / 70 : U32), 4, 0), H.unrank_mask(8n, (index % 70 : U32), 4, 0), 0, 0, 0)}}

def from_index(+index: U32) -> Maybe<&2, Edge>:
  parsed(U32.is_lt(index, size()), index)

def valid_loop(fuel: Nat, +word: U32, +position: U32, +m: U32, +s: U32, +e: U32, ok: Bool) -> Bool:
  match fuel:
    case 0n: ok && U32.is_eq(m, 4) && U32.is_eq(s, 4) && U32.is_eq(e, 4) && U32.is_lt(word, 16777216)
    case 1n+p:
      +value = label(word, position)
      valid_loop(p, word, (position + 1 : U32), (m + C.pick(U32.is_eq(value, 0), 1, 0) : U32), (s + C.pick(U32.is_eq(value, 1), 1, 0) : U32), (e + C.pick(U32.is_eq(value, 2), 1, 0) : U32), ok && U32.is_lt(value, 3))

def parsed_word(ok: Bool, word: U32) -> Maybe<&2, Edge>:
  match ok:
    case False{}: None{}
    case True{}: Some{Edge{word}}

def from_word(+word: U32) -> Maybe<&2, Edge>:
  parsed_word(valid_loop(12n, word, 0, 0, 0, 0, True{}), word)

def edge_permutation(fuel: Nat, +word: U32, +position: U32, +m: U32, +s: U32, +e: U32, ep: U32, eh: U32) -> U32 & U32:
  match fuel:
    case 0n: (ep, eh)
    case 1n+p:
      +value = label(word, position)
      +piece = C.pick(U32.is_eq(value, 2), (8 + e : U32), C.pick(U32.is_eq(value, 0), (m * 2 + 1 : U32), (s * 2 : U32)))
      +bits = (piece << U32.to_nat((position % 8 * 4 : U32)) : U32)
      edge_permutation(p, word, (position + 1 : U32), (m + C.pick(U32.is_eq(value, 0), 1, 0) : U32), (s + C.pick(U32.is_eq(value, 1), 1, 0) : U32), (e + C.pick(U32.is_eq(value, 2), 1, 0) : U32), (ep .|. C.pick(U32.is_lt(position, 8), bits, 0) : U32), (eh .|. C.pick(U32.is_ge(position, 8), bits, 0) : U32))

def representative_parts(parts: U32 & U32) -> C.Cubie:
  match parts:
    case Tuple{+ep, +eh}: C.Cubie{C.pick(U32.is_eq(C.parity(12n, ep, eh, 12, 0, 0), 1), 1985229313, 1985229328), 0, ep, eh, 0}

def representative(edge: Edge) -> C.Cubie:
  match edge:
    case Edge{word}: representative_parts(edge_permutation(12n, word, 0, 0, 0, 0, 0, 0))

def transition(move: M.Move, edge: Edge) -> Edge:
  project(C.turn(M.index(move), representative(edge)))

def transformed(value: C.Validation) -> Maybe<&2, Edge>:
  match value:
    case C.Valid{cube}: Some{project(cube)}
    case C.Invalid{code}: None{}

def reference_transform(sym: S.Symmetry, edge: Edge) -> Maybe<&2, Edge>:
  transformed(C.validate(S.apply(sym, C.to_facelets(representative(edge)))))

def goal() -> Edge:
  project(C.solved())
