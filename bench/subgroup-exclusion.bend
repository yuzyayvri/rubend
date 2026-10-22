import Base
import ../src/cubie.bend as C
import ../src/coordinates.bend as Q
import ../src/packed-symmetry.bend as R

type ForwardBounds is Data:
  ForwardBounds{ud: U32, fb: U32, rl: U32}

type InverseBounds is Data:
  InverseBounds{ud: U32, fb: U32, rl: U32}

type FinalMask is Data:
  FinalMask{bits: U32}

type FirstMask is Data:
  FirstMask{bits: U32}

type Indices is Data:
  Indices{ud: U32, fb: U32, rl: U32}

def index(+cube: C.Cubie) -> U32:
  ((Q.encode(Q.Twist{}, cube) * 2048 + Q.encode(Q.Flip{}, cube)) * 495 + Q.encode(Q.Slice{}, cube) : U32)

def forward_indices(+cube: C.Cubie) -> Indices:
  +rotated = R.rotate(cube)
  Indices{index(cube), index(rotated), index(R.rotate(rotated))}

def subgroup_axis(axis: U32, cube: C.Cubie) -> Bool:
  match axis:
    case 0: U32.is_eq(index(cube), 0)
    case 1: U32.is_eq(index(R.rotate(cube)), 0)
    case 2: U32.is_eq(index(R.rotate(R.rotate(cube))), 0)
    case _: False{}

def subgroup_mask(axis: U32) -> U32:
  match axis:
    case 0: 77463
    case 1: 239058
    case 2: 95418
    case _: 0

def valid(+ud: U32, +fb: U32, +rl: U32) -> Bool:
  U32.is_lt(ud, 15) && U32.is_lt(fb, 15) && U32.is_lt(rl, 15)

def mask_when(allowed: Bool, +residual: U32, +ud: U32, +fb: U32, +rl: U32) -> U32:
  match allowed:
    case False{}: 0
    case True{}:
      (C.pick(U32.is_ge(ud, residual), subgroup_mask(0), 0) .|. C.pick(U32.is_ge(fb, residual), subgroup_mask(1), 0) .|. C.pick(U32.is_ge(rl, residual), subgroup_mask(2), 0) : U32)

def exclusion_bits(+residual: U32, +ud: U32, +fb: U32, +rl: U32) -> U32:
  mask_when(U32.is_gt(residual, 0) && valid(ud, fb, rl), residual, ud, fb, rl)

def forward_exclusions(residual: U32, bounds: ForwardBounds) -> FinalMask:
  match bounds:
    case ForwardBounds{ud, fb, rl}: FinalMask{exclusion_bits(residual, ud, fb, rl)}

def inverse_exclusions(residual: U32, bounds: InverseBounds) -> FirstMask:
  match bounds:
    case InverseBounds{ud, fb, rl}: FirstMask{exclusion_bits(residual, ud, fb, rl)}

def allows_first(mask: FirstMask, +move: U32) -> Bool:
  match mask:
    case FirstMask{bits}: U32.is_lt(move, 18) && U32.is_eq(((bits >> U32.to_nat(move)) .&. 1 : U32), 0)

def maximum(+a: U32, +b: U32) -> U32:
  C.pick(U32.is_ge(a, b), a, b)

def raise_if_covered(+residual: U32, mask: FinalMask) -> U32:
  match mask:
    case FinalMask{bits}: C.pick(U32.is_eq(bits, 262143), (residual + 1 : U32), residual)

def lower_when(allowed: Bool, +ud: U32, +fb: U32, +rl: U32) -> U32:
  match allowed:
    case False{}: 0
    case True{}:
      +residual = maximum(ud, maximum(fb, rl))
      raise_if_covered(residual, forward_exclusions(residual, ForwardBounds{ud, fb, rl}))

def full_cube_lower(bounds: ForwardBounds) -> U32:
  match bounds:
    case ForwardBounds{+ud, +fb, +rl}: lower_when(valid(ud, fb, rl), ud, fb, rl)
