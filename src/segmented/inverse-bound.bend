import Base
import ../segmented-table.bend as Store
import ../cubie.bend as C
import ../coordinates.bend as Q
import ../packed-symmetry.bend as R
import ../segmented-joint.bend as J

type CubeBound is Data:
  CubeBound{value: U32}

def maximum(+a: U32, +b: U32) -> U32:
  C.pick(U32.is_ge(a, b), a, b)

def index(+cube: C.Cubie) -> U32:
  ((Q.encode(Q.Twist{}, cube) * 2048 + Q.encode(Q.Flip{}, cube)) * 495 + Q.encode(Q.Slice{}, cube) : U32)

def wrap(read: Store.Table & U32) -> Store.Table & CubeBound:
  match read:
    case Tuple{table, value}: (table, CubeBound{value})

def full_cube_one(table: Store.Table, cube: C.Cubie) -> Store.Table & CubeBound:
  wrap(J.get_at(table, 8388608, index(C.inverse(cube))))

def third(read: Store.Table & U32, previous: U32) -> Store.Table & CubeBound:
  match read:
    case Tuple{table, value}: (table, CubeBound{maximum(previous, value)})

def third_allowed(allowed: Bool, table: Store.Table, inverse: C.Cubie, previous: U32) -> Store.Table & CubeBound:
  match allowed:
    case True{}: third(J.get_at(table, 8388608, index(R.rotate(inverse))), previous)
    case False{}: (table, CubeBound{previous})

def second(read: Store.Table & U32, inverse: C.Cubie, +cutoff: U32, previous: U32) -> Store.Table & CubeBound:
  match read:
    case Tuple{table, +value}: third_allowed(U32.is_lt(value, cutoff), table, inverse, maximum(previous, value))

def second_allowed(allowed: Bool, table: Store.Table, inverse: C.Cubie, cutoff: U32, previous: U32) -> Store.Table & CubeBound:
  match allowed:
    case True{}:
      +rotated = R.rotate(inverse)
      second(J.get_at(table, 8388608, index(rotated)), rotated, cutoff, previous)
    case False{}: (table, CubeBound{previous})

def first(read: Store.Table & U32, inverse: C.Cubie, +cutoff: U32) -> Store.Table & CubeBound:
  match read:
    case Tuple{table, +value}: second_allowed(U32.is_lt(value, cutoff), table, inverse, cutoff, value)

def full_cube_three(table: Store.Table, +cube: C.Cubie, cutoff: U32) -> Store.Table & CubeBound:
  +inverse = C.inverse(cube)
  first(J.get_at(table, 8388608, index(inverse)), inverse, cutoff)
