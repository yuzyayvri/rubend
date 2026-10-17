import Base
import ../bench/advanced-main.bend as A
import ../src/cubie.bend as C
import ../src/search.bend as S
import ../src/inverse-bound.bend as I
import ../src/packed-symmetry.bend as R

def threshold(read: Array<U32> & I.CubeBound, +expected: U32, +cutoff: U32) -> Array<U32> & Bool:
  match read:
    case Tuple{table, I.CubeBound{+value}}:
      (table, U32.is_eq(C.pick(U32.is_ge(value, cutoff), 1, 0), C.pick(U32.is_ge(expected, cutoff), 1, 0)) && (U32.is_ge(value, cutoff) || U32.is_eq(value, expected)))

def thresholds(fuel: Nat, +cube: C.Cubie, +expected: U32, +cutoff: U32, read: Array<U32> & Bool) -> Array<U32> & Bool:
  match fuel read:
    case 1n+p Tuple{table, True{}}:
      thresholds(p, cube, expected, (cutoff + 1 : U32), threshold(I.full_cube_three(table, cube, cutoff), expected, cutoff))
    case _ read: read

def third(read: Array<U32> & U32, cube: C.Cubie, first: U32, second: U32) -> Array<U32> & Bool:
  match read:
    case Tuple{table, value}: thresholds(14n, cube, S.maximum(first, S.maximum(second, value)), 0, (table, True{}))

def second(read: Array<U32> & U32, cube: C.Cubie, inverse: C.Cubie, first: U32) -> Array<U32> & Bool:
  match read:
    case Tuple{table, value}: third(S.raw_lookup(table, S.joint_index(R.rotate(inverse))), cube, first, value)

def first(read: Array<U32> & I.CubeBound, +cube: C.Cubie) -> Array<U32> & Bool:
  match read:
    case Tuple{table, I.CubeBound{value}}:
      +rotated = R.rotate(C.inverse(cube))
      second(S.raw_lookup(table, S.joint_index(rotated)), cube, rotated, value)

def walk(fuel: Nat, +cube: C.Cubie, +seed: U32, read: Array<U32> & Bool) -> Array<U32> & Bool:
  match fuel read:
    case 1n+p Tuple{table, True{}}:
      +next = (seed * 1664525 + 1013904223 : U32)
      +child = C.turn((next % 18 : U32), cube)
      walk(p, child, next, first(I.full_cube_one(table, child), child))
    case _ read: read

def inverse_counterexample(read: Array<U32> & I.CubeBound, forward: U32) -> Array<U32> & Bool:
  match read:
    case Tuple{table, I.CubeBound{value}}:
      (table, U32.is_eq(forward, 1) && U32.is_eq(value, 2))

def forward_counterexample(read: Array<U32> & U32, cube: C.Cubie) -> Array<U32> & Bool:
  match read:
    case Tuple{table, value}: inverse_counterexample(I.full_cube_one(table, cube), value)

def report(read: Array<U32> & Bool) -> IO(Unit):
  match read:
    case Tuple{table, True{}}: IO.print("{\"passed\":true,\"thresholdChecks\":14000,\"walkStates\":1000,\"reductionCounterexample\":\"U R has forward distance 1 and inverse distance 2\"}")
    case _: IO.die(Unit, 2, "Audited joint inverse test failed")

def checks(table: Array<U32>, +cube: C.Cubie) -> IO(Unit):
  report(walk(1000n, C.solved(), 1381323333, forward_counterexample(S.raw_lookup(table, S.joint_index(cube)), cube)))

def main() -> IO(Unit):
  do IO<Unit>:
    table : Array<U32> <- A.table()
    checks(table, C.turn(3, C.turn(0, C.solved())))
