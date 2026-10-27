import Base
import ../bench/axis-coordinates.bend as A
import ../src/cubie.bend as C

type Audit is Type:
  Audit{table: Array<U32>, cube: C.Cubie, coordinates: A.ForwardAxes, seed: U32, count: U32, valid: Bool}

def observe(read: Array<U32> & A.ForwardAxes, +cube: C.Cubie, seed: U32, count: U32, valid: Bool) -> Audit:
  match read:
    case Tuple{table, +coordinates}: Audit{table, cube, coordinates, seed, count, valid && A.same(coordinates, A.all_axes(cube))}

def walk(fuel: Nat, state: Audit) -> Audit:
  match fuel state:
    case 0n state: state
    case 1n+p Audit{table, +cube, coordinates, +seed, count, valid}:
      +move = (seed % 18 : U32)
      walk(p, observe(A.increment(table, coordinates, move), C.turn(move, cube), (seed * 1664525 + 1013904223 : U32), (count + 1 : U32), valid))

def report_valid(valid: Bool, count: U32) -> IO(Unit):
  match valid:
    case True{}: IO.print("{\"passed\":true,\"nativeCoordinateSteps\":" ++ U32.show(count) ++ ",\"performanceClaim\":false}")
    case False{}: IO.die(Unit, 2, "Incremental axes disagree with direct rotated ranks")

def report(state: Audit) -> IO(Unit):
  match state:
    case Audit{table, cube, coordinates, seed, count, valid}: report_valid(valid, count)

def main() -> IO(Unit):
  report(walk(100000n, Audit{A.fresh(), C.solved(), A.all_axes(C.solved()), 42, 0, True{}}))
