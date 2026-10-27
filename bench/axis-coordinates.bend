import Base
import ../src/cubie.bend as C
import ../src/coordinates.bend as Q
import ../src/packed-symmetry.bend as R
import ../src/symmetry.bend as Y
import ../src/tables.bend as T

type Triple is Data:
  Triple{twist: U32, flip: U32, slice: U32}

type ForwardAxes is Data:
  ForwardAxes{ud: Triple, fb: Triple, rl: Triple}

def rank(+cube: C.Cubie) -> Triple:
  Triple{Q.encode(Q.Twist{}, cube), Q.encode(Q.Flip{}, cube), Q.encode(Q.Slice{}, cube)}

def all_axes(+cube: C.Cubie) -> ForwardAxes:
  +rotated = R.rotate(cube)
  ForwardAxes{rank(cube), rank(rotated), rank(R.rotate(rotated))}

def all_words(cp: U32, co: U32, ep: U32, eh: U32, eo: U32) -> ForwardAxes:
  all_axes(C.Cubie{cp, co, ep, eh, eo})

def fresh() -> Array<U32>:
  table = [0 : U32^17n]
  table = T.fill(39366n, table, Q.Twist{}, 0, 18, 0)
  table = T.fill(36864n, table, Q.Flip{}, 0, 18, 39366)
  T.fill(8910n, table, Q.Slice{}, 0, 18, 76230)

def third(read: Array<U32> & U32, twist: U32, flip: U32) -> Array<U32> & Triple:
  match read:
    case Tuple{table, slice}: (table, Triple{twist, flip, slice})

def second(read: Array<U32> & U32, twist: U32, +slice: U32, +move: U32) -> Array<U32> & Triple:
  match read:
    case Tuple{table, flip}: third(table[(76230 + slice * 18 + move : U32)], twist, flip)

def first(read: Array<U32> & U32, +flip: U32, slice: U32, +move: U32) -> Array<U32> & Triple:
  match read:
    case Tuple{table, twist}: second(table[(39366 + flip * 18 + move : U32)], twist, slice, move)

def advance(table: Array<U32>, coordinates: Triple, +move: U32) -> Array<U32> & Triple:
  match coordinates:
    case Triple{+twist, flip, slice}: first(table[(twist * 18 + move : U32)], flip, slice, move)

def updated_rl(read: Array<U32> & Triple, ud: Triple, fb: Triple) -> Array<U32> & ForwardAxes:
  match read:
    case Tuple{table, rl}: (table, ForwardAxes{ud, fb, rl})

def updated_fb(read: Array<U32> & Triple, ud: Triple, rl: Triple, move: U32) -> Array<U32> & ForwardAxes:
  match read:
    case Tuple{table, fb}: updated_rl(advance(table, rl, move), ud, fb)

def updated_ud(read: Array<U32> & Triple, fb: Triple, rl: Triple, move_fb: U32, move_rl: U32) -> Array<U32> & ForwardAxes:
  match read:
    case Tuple{table, ud}: updated_fb(advance(table, fb, move_fb), ud, rl, move_rl)

def step_with_moves(table: Array<U32>, axes: ForwardAxes, move_ud: U32, move_fb: U32, move_rl: U32) -> Array<U32> & ForwardAxes:
  match axes:
    case ForwardAxes{ud, fb, rl}: updated_ud(advance(table, ud, move_ud), fb, rl, move_fb, move_rl)

def increment(table: Array<U32>, axes: ForwardAxes, +move: U32) -> Array<U32> & ForwardAxes:
  +rotated = Y.rotate_index(move)
  step_with_moves(table, axes, move, rotated, Y.rotate_index(rotated))

def rescanned(read: Array<U32> & Triple, +child: C.Cubie) -> Array<U32> & ForwardAxes:
  match read:
    case Tuple{table, ud}:
      +rotated = R.rotate(child)
      (table, ForwardAxes{ud, rank(rotated), rank(R.rotate(rotated))})

def rescan(table: Array<U32>, previous: Triple, +cube: C.Cubie, +move: U32) -> Array<U32> & ForwardAxes:
  rescanned(advance(table, previous, move), C.turn(move, cube))

def rescan_words(table: Array<U32>, previous: Triple, cp: U32, co: U32, ep: U32, eh: U32, eo: U32, move: U32) -> Array<U32> & ForwardAxes:
  rescan(table, previous, C.Cubie{cp, co, ep, eh, eo}, move)

def same(left: ForwardAxes, right: ForwardAxes) -> Bool:
  match left right:
    case ForwardAxes{Triple{a, b, c}, Triple{d, e, f}, Triple{g, h, i}} ForwardAxes{Triple{j, k, l}, Triple{m, n, o}, Triple{p, q, r}}:
      U32.is_eq(a, j) && U32.is_eq(b, k) && U32.is_eq(c, l) && U32.is_eq(d, m) && U32.is_eq(e, n) && U32.is_eq(f, o) && U32.is_eq(g, p) && U32.is_eq(h, q) && U32.is_eq(i, r)
