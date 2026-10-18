import Base
import ../src/h0-corners.bend as H
import ../src/h0-edges.bend as E
import ../src/cubie.bend as C
import ../src/model.bend as M
import ../src/symmetry48.bend as S

type Combined is Data:
  ProductCube{cube: C.Cubie, repaired: Bool}

def swap_labels(fuel: Nat, +cp: U32, +position: U32, word: U32) -> U32:
  match fuel:
    case 0n: word
    case 1n+p:
      +piece = C.nib(cp, position)
      value = C.pick(U32.is_eq(piece, 0), 2, C.pick(U32.is_eq(piece, 2), 0, piece))
      swap_labels(p, cp, (position + 1 : U32), (word .|. (value << U32.to_nat((position * 4 : U32))) : U32))

def combine(corner: C.Cubie, edge: C.Cubie) -> Combined:
  match corner edge:
    case C.Cubie{+cp, co, old_ep, old_eh, old_eo} C.Cubie{old_cp, old_co, +ep, +eh, edge_eo}:
      +different = U32.is_ne(C.parity(8n, cp, 0, 8, 0, 0), C.parity(12n, ep, eh, 12, 0, 0))
      ProductCube{C.Cubie{C.pick(different, swap_labels(8n, cp, 0, 0), cp), co, ep, eh, 0}, different}

def moved(+corner: H.Corner, +edge: E.Edge, +cube: C.Cubie, +move: U32) -> Bool:
  +next = C.turn(move, cube)
  U32.is_eq(H.index(H.transition(M.from_index(move), corner)), H.index(H.project(next))) && U32.is_eq(E.index(E.transition(M.from_index(move), edge)), E.index(E.project(next)))

def moves(fuel: Nat, +index: U32, +corner: H.Corner, +edge: E.Edge, +cube: C.Cubie, valid: Bool) -> Bool:
  match fuel:
    case 0n: valid
    case 1n+p: moves(p, (index + 1 : U32), corner, edge, cube, valid && moved(corner, edge, cube, index))

def transformed(value: C.Validation, corner: Maybe<&2, H.Corner>, edge: Maybe<&2, E.Edge>) -> Bool:
  match value corner edge:
    case C.Valid{+cube} Some{corner} Some{edge}: U32.is_eq(H.index(H.project(cube)), H.index(corner)) && U32.is_eq(E.index(E.project(cube)), E.index(edge))
    case _ _ _: False{}

def selected(value: Maybe<&2, S.Symmetry>, corner: H.Corner, edge: E.Edge, cube: C.Cubie) -> Bool:
  match value:
    case Some{+sym}: transformed(C.validate(S.apply(sym, C.to_facelets(cube))), H.reference_transform(sym, corner), E.reference_transform(sym, edge))
    case None{}: False{}

def symmetries(fuel: Nat, +index: U32, +corner: H.Corner, +edge: E.Edge, +cube: C.Cubie, valid: Bool) -> Bool:
  match fuel:
    case 0n: valid
    case 1n+p: symmetries(p, (index + 1 : U32), corner, edge, cube, valid && selected(S.from_index(index), corner, edge, cube))

type Check is Data:
  ProductCheck{checked: U32, repaired: U32, unrepaired: U32, valid: Bool}

def validated(value: C.Validation, +corner: H.Corner, +edge: E.Edge, +different: Bool, checked: U32, repaired: U32, unrepaired: U32, valid: Bool) -> Check:
  match value:
    case C.Invalid{code}: ProductCheck{checked, repaired, unrepaired, False{}}
    case C.Valid{+cube}: ProductCheck{(checked + 1 : U32), (repaired + C.pick(different, 1, 0) : U32), (unrepaired + C.pick(Bool.not(different), 1, 0) : U32), valid && U32.is_eq(H.index(H.project(cube)), H.index(corner)) && U32.is_eq(E.index(E.project(cube)), E.index(edge)) && moves(18n, 0, corner, edge, cube, True{}) && symmetries(48n, 0, corner, edge, cube, True{})}

def combined(value: Combined, corner: H.Corner, edge: E.Edge, state: Check) -> Check:
  match value state:
    case ProductCube{cube, different} ProductCheck{checked, repaired, unrepaired, valid}: validated(C.validate(C.to_facelets(cube)), corner, edge, different, checked, repaired, unrepaired, valid)

def decoded(corner: Maybe<&2, H.Corner>, edge: Maybe<&2, E.Edge>, state: Check) -> Check:
  match corner edge:
    case Some{+corner} Some{+edge}: combined(combine(H.representative(corner), E.representative(edge)), corner, edge, state)
    case _ _: ProductCheck{0, 0, 0, False{}}

def run(fuel: Nat, +seed: U32, state: Check) -> Check:
  match fuel:
    case 0n: state
    case 1n+p:
      +next = (seed * 1664525 + 1013904223 : U32)
      run(p, next, decoded(H.from_index((seed % 153090 : U32)), E.from_index((next % 34650 : U32)), state))

def finish(ok: Bool, checked: U32, repaired: U32, unrepaired: U32) -> IO(Unit):
  match ok:
    case False{}: IO.die(Unit, 2, "H0 product refinement failed")
    case True{}: IO.print("{\"samples\":" ++ U32.show(checked) ++ ",\"repaired\":" ++ U32.show(repaired) ++ ",\"unrepaired\":" ++ U32.show(unrepaired) ++ ",\"moves\":73728,\"symmetries\":196608}")

def report(state: Check) -> IO(Unit):
  match state:
    case ProductCheck{+checked, +repaired, +unrepaired, valid}: finish(valid && U32.is_eq(checked, 4096) && U32.is_gt(repaired, 0) && U32.is_gt(unrepaired, 0), checked, repaired, unrepaired)

def main() -> IO(Unit):
  report(run(4096n, 69127, ProductCheck{0, 0, 0, True{}}))
