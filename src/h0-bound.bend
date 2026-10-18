import Base
import ./cubie.bend as C
import ./h0-corners.bend as H
import ./h0-edges.bend as E
import ./h0-meta.bend as M

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
