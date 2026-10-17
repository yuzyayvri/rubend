import Base
import ./joint-table.bend as J
import ./cubie.bend as C

type Check is Type:
  Check{dist: Array<U32>, moves: Array<U32>, passed: Bool, maximum: U32, hash: U32}

def at_slice(read: Array<U32> & U32, +x: U32, +y: U32, +slices: U32) -> Array<U32> & U32:
  match read:
    case Tuple{moves, z}: (moves, ((x * 2048 + y) * slices + z : U32))

def slice_index(single: Bool, moves: Array<U32>, +x: U32, +y: U32, +z: U32, +move: U32, +slices: U32) -> Array<U32> & U32:
  match single:
    case True{}: (moves, (x * 2048 + y : U32))
    case False{}: at_slice(moves[(76230 + z * 18 + move : U32)], x, y, slices)

def at_flip(read: Array<U32> & U32, x: U32, z: U32, move: U32, +slices: U32) -> Array<U32> & U32:
  match read:
    case Tuple{moves, y}: slice_index(U32.is_eq(slices, 1), moves, x, y, z, move, slices)

def at_twist(read: Array<U32> & U32, +y: U32, z: U32, +move: U32, slices: U32) -> Array<U32> & U32:
  match read:
    case Tuple{moves, x}: at_flip(moves[(39366 + y * 18 + move : U32)], x, z, move, slices)

def next_index(moves: Array<U32>, +x: U32, y: U32, z: U32, +move: U32, slices: U32) -> Array<U32> & U32:
  at_twist(moves[(x * 18 + move : U32)], y, z, move, slices)

def compared(read: Array<U32> & U32, moves: Array<U32>, +depth: U32, +descended: Bool, maximum: U32, hash: U32) -> Check & Bool:
  match read:
    case Tuple{dist, +value}:
      (Check{dist, moves, U32.is_lt(value, 15) && U32.is_le(depth, (value + 1 : U32)), maximum, hash}, descended || U32.is_eq(depth, (value + 1 : U32)))

def neighbor(read: Array<U32> & U32, dist: Array<U32>, depth: U32, descended: Bool, maximum: U32, hash: U32) -> Check & Bool:
  match read:
    case Tuple{moves, index}: compared(J.get(dist, index), moves, depth, descended, maximum, hash)

def edges(fuel: Nat, state: Check & Bool, +x: U32, +y: U32, +z: U32, +slices: U32, +depth: U32, +move: U32) -> Check & Bool:
  match fuel state:
    case 1n+p Tuple{Check{dist, moves, True{}, maximum, hash}, descended}:
      edges(p, neighbor(next_index(moves, x, y, z, move, slices), dist, depth, descended, maximum, hash), x, y, z, slices, depth, (move + 1 : U32))
    case _ state: state

def finish_node(result: Check & Bool) -> Check:
  match result:
    case Tuple{Check{dist, moves, passed, maximum, hash}, descended}: Check{dist, moves, passed && descended, maximum, hash}

def depth(read: Array<U32> & U32, moves: Array<U32>, +index: U32, +slices: U32, +maximum: U32, +hash: U32) -> Check:
  match read:
    case Tuple{dist, +value}:
      finish_node(edges(18n, (Check{dist, moves, U32.is_lt(value, 15) && (U32.is_eq(index, 0) && U32.is_eq(value, 0) || U32.is_ne(index, 0) && U32.is_gt(value, 0)), C.pick(U32.is_gt(value, maximum), value, maximum), ((hash * 16777619) .^. value .^. index : U32)}, U32.is_eq(value, 0)), ((index / slices) / 2048 : U32), ((index / slices) % 2048 : U32), (index % slices : U32), slices, value, 0))

def run(fuel: Nat, state: Check, +index: U32, +slices: U32) -> Check:
  match fuel state:
    case 1n+p Check{dist, moves, True{}, maximum, hash}: run(p, depth(J.get(dist, index), moves, index, slices, maximum, hash), (index + 1 : U32), slices)
    case _ state: state

def audit(pair: J.Joint, +slices: U32) -> Check:
  match pair:
    case J.Joint{dist, moves, added}: run(U32.to_nat((4478976 * slices : U32)), Check{dist, moves, True{}, 0, 2166136261}, 0, slices)
