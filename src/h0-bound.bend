import Base
import ./cubie.bend as C
import ./h0-corners.bend as H
import ./h0-edges.bend as E
import ./h0-meta.bend as M
import ./coordinates.bend as Q

type CubeBound is Data:
  CubeBound{distance: U32}

def meta_base() -> U32:
  285525248

def distance_base() -> U32:
  288417248

def distance(read: Array<U32> & U32, lane: U32) -> Array<U32> & CubeBound:
  match read:
    case Tuple{table, word}: (table, CubeBound{((word >> U32.to_nat((lane * 8 : U32))) .&. 255 : U32)})

def canonical_edge(read: Array<U32> & U32, class: U32) -> Array<U32> & CubeBound:
  match read:
    case Tuple{table, edge}:
      +index = (class * 34650 + edge : U32)
      distance(table[(distance_base() + index / 4 : U32)], (index % 4 : U32))

def corner(read: Array<U32> & U32, edge: U32) -> Array<U32> & CubeBound:
  match read:
    case Tuple{table, +packed}: canonical_edge(table[(meta_base() + M.edge_symmetries() + edge * 48 + (packed >> 16n) : U32)], (packed .&. 65535 : U32))

def full_cube(table: Array<U32>, +cube: C.Cubie) -> Array<U32> & CubeBound:
  corner(table[(meta_base() + H.sparse_key(H.project(cube)) : U32)], E.index(E.project(cube)))

def chosen(enabled: Bool, n: U32, k: U32) -> U32:
  match enabled:
    case True{}: Q.choose(n, k)
    case False{}: 0

def edge_rank(fuel: Nat, +ep: U32, +eh: U32, +position: U32, +other: U32, +e_count: U32, +m_count: U32, e_rank: U32, m_rank: U32) -> U32:
  match fuel:
    case 0n: (e_rank * 70 + m_rank : U32)
    case 1n+p:
      +piece = C.nib(C.pick(U32.is_lt(position, 8), ep, eh), (position % 8 : U32))
      +is_e = U32.is_ge(piece, 8)
      +is_m = Bool.not(is_e) && U32.is_eq((piece .&. 1 : U32), 1)
      +e = C.pick(is_e, 1, 0)
      +next_e = (e_count + e : U32)
      +next_m = (m_count + C.pick(is_m, 1, 0) : U32)
      edge_rank(p, ep, eh, (position + 1 : U32), (other + 1 - e : U32), next_e, next_m, (e_rank + chosen(is_e, position, next_e) : U32), (m_rank + chosen(is_m, other, next_m) : U32))

def edge_index(ep: U32, eh: U32) -> U32:
  edge_rank(12n, ep, eh, 0, 0, 0, 0, 0, 0)

def sparse(cp: U32, +co: U32) -> U32:
  +twist = ((((co >> 0n) .&. 3) * 1 + ((co >> 2n) .&. 3) * 3 + ((co >> 4n) .&. 3) * 9 + ((co >> 6n) .&. 3) * 27 + ((co >> 8n) .&. 3) * 81 + ((co >> 10n) .&. 3) * 243 + ((co >> 12n) .&. 3) * 729 : U32))
  (twist * 128 + (H.separation_loop(8n, cp, 0, 0) .&. 127) : U32)

def full_cube_fast(table: Array<U32>, cube: C.Cubie) -> Array<U32> & CubeBound:
  match cube:
    case C.Cubie{cp, co, ep, eh, eo}: corner(table[(meta_base() + sparse(cp, co) : U32)], edge_index(ep, eh))
