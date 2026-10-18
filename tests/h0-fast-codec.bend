import Base
import ../src/cubie.bend as C
import ../src/h0-bound.bend as K
import ../src/h0-corners.bend as H
import ../src/h0-edges.bend as E

def corner_cube(cube: C.Cubie, expected: U32) -> Bool:
  match cube:
    case C.Cubie{cp, co, ep, eh, eo}: U32.is_eq(K.sparse(cp, co), expected)

def corner(value: Maybe<&2, H.Corner>) -> Bool:
  match value:
    case Some{+value}: corner_cube(H.representative(value), H.sparse_key(value))
    case None{}: False{}

def corners(fuel: Nat, +index: U32, valid: Bool) -> Bool:
  match fuel:
    case 0n: valid
    case 1n+p: corners(p, (index + 1 : U32), valid && corner(H.from_index(index)))

def edge_cube(cube: C.Cubie, index: U32) -> Bool:
  match cube:
    case C.Cubie{cp, co, ep, eh, eo}: U32.is_eq(K.edge_index(ep, eh), index)

def edge(value: Maybe<&2, E.Edge>, index: U32) -> Bool:
  match value:
    case Some{value}: edge_cube(E.representative(value), index)
    case None{}: False{}

def edges(fuel: Nat, +index: U32, valid: Bool) -> Bool:
  match fuel:
    case 0n: valid
    case 1n+p: edges(p, (index + 1 : U32), valid && edge(E.from_index(index), index))

def report(ok: Bool) -> IO(Unit):
  match ok:
    case True{}: IO.print("{\"passed\":true,\"cornerCodecs\":153090,\"edgeCodecs\":34650}")
    case False{}: IO.die(Unit, 2, "Fused H0 codec differs")

def main() -> IO(Unit):
  report(corners(153090n, 0, True{}) && edges(34650n, 0, True{}))
