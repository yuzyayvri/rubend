import Base
import ../src/cubie.bend as C
import ../src/coordinates.bend as Q
import ../src/search.bend as S
import ./edge-pattern-coordinate.bend as E
import ./phase2-projection.bend as P

def decode_edges(rank: U32) -> +List<U32>:
  E.unrank_positions(E.digits(4n, rank, 5, Nil{}), [0, 1, 2, 3, 4, 5, 6, 7])

def encode_edges(positions: +List<U32>) -> U32:
  E.rank_positions(positions, Nil{}, 8, 0)

def moved(positions: +List<U32>, +action: C.Cubie) -> +List<U32>:
  match positions action:
    case Nil{} _: Nil{}
    case Con{position, rest} C.Cubie{cp, co, +ep, +eh, eo}:
      C.edge_position(ep, eh, position) <> moved(rest, C.Cubie{cp, co, ep, eh, eo})

def edge_next(rank: U32, column: U32) -> U32:
  encode_edges(moved(decode_edges(rank), C.turn(Q.phase2_move(column), C.solved())))

def edge_index(cube: C.Cubie) -> U32:
  match cube:
    case C.Cubie{cp, co, +ep, +eh, eo}:
      encode_edges([C.edge_position(ep, eh, 0), C.edge_position(ep, eh, 1), C.edge_position(ep, eh, 2), C.edge_position(ep, eh, 3)])

def encode_known(+cube: C.Cubie) -> U32:
  (edge_index(cube) * 140 + P.corner_from_cube(cube) : U32)

def projected(ok: Bool, cube: C.Cubie) -> +List<U32>:
  match ok:
    case True{}: [encode_known(cube)]
    case False{}: Nil{}

def project(goal: S.Goal, validation: C.Validation) -> +List<U32>:
  match goal validation:
    case S.Subgroup{} C.Valid{+cube}:
      projected(U32.is_eq(Q.encode(Q.Twist{}, cube), 0) && U32.is_eq(Q.encode(Q.Flip{}, cube), 0) && U32.is_eq(Q.encode(Q.Slice{}, cube), 0), cube)
    case _ _: Nil{}

def test_project(code: U32, +cube: C.Cubie) -> +List<U32>:
  match code:
    case 1: project(S.Subgroup{}, P.checked_cube(C.validate(C.to_facelets(cube)), cube))
    case 0: project(S.Reduction{}, P.checked_cube(C.validate(C.to_facelets(cube)), cube))
    case _: project(S.FullCube{}, P.checked_cube(C.validate(C.to_facelets(cube)), cube))

def checked_next(ok: Bool, rank: U32, column: U32) -> +List<U32>:
  match ok:
    case True{}: [edge_next(rank, column)]
    case False{}: Nil{}

def test_next(+rank: U32, +column: U32) -> +List<U32>:
  checked_next(U32.is_lt(rank, 1680) && U32.is_lt(column, 10), rank, column)

def checked_decode(ok: Bool, rank: U32) -> +List<U32>:
  match ok:
    case True{}: decode_edges(rank)
    case False{}: Nil{}

def test_decode(+rank: U32) -> +List<U32>:
  checked_decode(U32.is_lt(rank, 1680), rank)
