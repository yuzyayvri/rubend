import Base
import ./cubie.bend as C

type Joint is Type:
  Joint{dist: Array<U32>, moves: Array<U32>, added: U32}

def packed_value(read: Array<U32> & U32, +index: U32) -> Array<U32> & U32:
  match read:
    case Tuple{table, word}:
      (table, ((word >> U32.to_nat(((index % 8) * 4 : U32))) .&. 15 : U32))

def get(table: Array<U32>, +index: U32) -> Array<U32> & U32:
  packed_value(table[(index / 8 : U32)], index)

def get_at(table: Array<U32>, base: U32, +index: U32) -> Array<U32> & U32:
  packed_value(table[(base + index / 8 : U32)], index)

def updated(read: Array<U32> & U32, +index: U32, value: U32) -> Array<U32>:
  match read:
    case Tuple{table, word}:
      +shift = U32.to_nat(((index % 8) * 4 : U32))
      table[(index / 8 : U32)] <- ((word .&. U32.not((15 << shift : U32))) .|. (value << shift) : U32)

def put(table: Array<U32>, +index: U32, value: U32) -> Array<U32>:
  updated(table[(index / 8 : U32)], index, value)

def write_fresh(fresh: Bool, dist: Array<U32>, moves: Array<U32>, +index: U32, depth: U32, +added: U32) -> Joint:
  match fresh:
    case True{}: Joint{put(dist, index, depth), moves, (added + 1 : U32)}
    case False{}: Joint{dist, moves, added}

def seen(read: Array<U32> & U32, moves: Array<U32>, +index: U32, depth: U32, added: U32) -> Joint:
  match read:
    case Tuple{dist, value}: write_fresh(U32.is_eq(value, 15), dist, moves, index, depth, added)

def slice_next(read: Array<U32> & U32, dist: Array<U32>, +x: U32, +y: U32, +slices: U32, depth: U32, added: U32) -> Joint:
  match read:
    case Tuple{moves, z}:
      +index = ((x * 2048 + y) * slices + z : U32)
      seen(get(dist, index), moves, index, depth, added)

def slice_dispatch(single: Bool, dist: Array<U32>, moves: Array<U32>, +x: U32, +y: U32, +z: U32, +move: U32, +slices: U32, depth: U32, added: U32) -> Joint:
  match single:
    case True{}:
      +index = (x * 2048 + y : U32)
      seen(get(dist, index), moves, index, depth, added)
    case False{}:
      slice_next(moves[(76230 + z * 18 + move : U32)], dist, x, y, slices, depth, added)

def flip_next(read: Array<U32> & U32, dist: Array<U32>, x: U32, z: U32, move: U32, +slices: U32, depth: U32, added: U32) -> Joint:
  match read:
    case Tuple{moves, y}:
      slice_dispatch(U32.is_eq(slices, 1), dist, moves, x, y, z, move, slices, depth, added)

def twist_next(read: Array<U32> & U32, dist: Array<U32>, +y: U32, z: U32, +move: U32, slices: U32, depth: U32, added: U32) -> Joint:
  match read:
    case Tuple{moves, x}:
      flip_next(moves[(39366 + y * 18 + move : U32)], dist, x, z, move, slices, depth, added)

def edges(fuel: Nat, pair: Joint, +x: U32, +y: U32, +z: U32, +slices: U32, +depth: U32, +move: U32) -> Joint:
  match fuel pair:
    case 0n pair: pair
    case 1n+p Joint{dist, moves, added}:
      edges(p, twist_next(moves[(x * 18 + move : U32)], dist, y, z, move, slices, depth, added), x, y, z, slices, depth, (move + 1 : U32))

def forward(active: Bool, dist: Array<U32>, moves: Array<U32>, +index: U32, +slices: U32, depth: U32, added: U32) -> Joint:
  match active:
    case False{}: Joint{dist, moves, added}
    case True{}: edges(18n, Joint{dist, moves, added}, ((index / slices) / 2048 : U32), ((index / slices) % 2048 : U32), (index % slices : U32), slices, (depth + 1 : U32), 0)

def node(read: Array<U32> & U32, moves: Array<U32>, index: U32, slices: U32, +depth: U32, added: U32) -> Joint:
  match read:
    case Tuple{dist, value}: forward(U32.is_eq(value, depth), dist, moves, index, slices, depth, added)

def sweep(fuel: Nat, pair: Joint, +index: U32, +slices: U32, +depth: U32) -> Joint:
  match fuel pair:
    case 0n pair: pair
    case 1n+p Joint{dist, moves, added}: sweep(p, node(get(dist, index), moves, index, slices, depth, added), (index + 1 : U32), slices, depth)
