import Base
import ./cubie.bend as C
import ./coordinates.bend as Q

type CubeBound is Data:
  CubeBound{distance: U32}

def index(+cube: C.Cubie) -> U32:
  (Q.encode(Q.Corners{}, cube) * 2187 + Q.encode(Q.Twist{}, cube) : U32)

def byte(read: Array<U32> & U32, lane: U32) -> Array<U32> & CubeBound:
  match read:
    case Tuple{table, word}: (table, CubeBound{((word >> U32.to_nat((lane * 8 : U32))) .&. 255 : U32)})

def full_cube_at(table: Array<U32>, base: U32, +cube_index: U32) -> Array<U32> & CubeBound:
  byte(table[(base + cube_index / 4 : U32)], (cube_index % 4 : U32))

def full_cube(table: Array<U32>, cube: C.Cubie) -> Array<U32> & CubeBound:
  full_cube_at(table, 285525248, index(cube))
