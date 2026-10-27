import Base
import ../src/cubie.bend as C
import ../src/search.bend as S
import ./subgroup-exclusion.bend as E

def allowed(+previous: U32, +move: U32) -> Bool:
  +face = (move / 3 : U32)
  S.root_allowed(previous, face) && U32.is_ne(face, previous) && (U32.is_ne(((face + 3) % 6 : U32), previous) || U32.is_lt(previous, face))

def root_previous(frame: S.Frame) -> U32:
  match frame:
    case S.Node{cube, a, b, c, left, previous, next, phase, path, length}: previous
    case S.Retry{cube, a, b, c, depth, previous, path, length}: previous

def previous_words(cp: U32, co: U32, ep: U32, eh: U32, eo: U32) -> U32:
  root_previous(S.root_frame(C.Cubie{cp, co, ep, eh, eo}, 0, S.FullCube{}))

def forward_words(cp: U32, co: U32, ep: U32, eh: U32, eo: U32) -> E.Indices:
  E.forward_indices(C.Cubie{cp, co, ep, eh, eo})

def inverse_words(cp: U32, co: U32, ep: U32, eh: U32, eo: U32) -> E.Indices:
  E.forward_indices(C.inverse(C.Cubie{cp, co, ep, eh, eo}))

def cut_stage(+residual: U32, forward_ud: U32, forward_fb: U32, forward_rl: U32, inverse_ud: U32, inverse_fb: U32, inverse_rl: U32) -> U32:
  C.pick(U32.is_gt(forward_ud, residual), 1, C.pick(U32.is_gt(forward_fb, residual), 2, C.pick(U32.is_gt(forward_rl, residual), 3, C.pick(U32.is_gt(inverse_ud, residual), 4, C.pick(U32.is_gt(inverse_fb, residual), 5, C.pick(U32.is_gt(inverse_rl, residual), 6, 0))))))

def proposed_forward_exclusion(+residual: U32, a: U32, b: U32, c: U32) -> Bool:
  U32.is_gt(E.full_cube_lower(E.ForwardBounds{a, b, c}), residual)

def inverse_full_mask(mask: E.FirstMask) -> Bool:
  match mask:
    case E.FirstMask{bits}: U32.is_eq(bits, 262143)

def proposed_inverse_exclusion(residual: U32, a: U32, b: U32, c: U32) -> Bool:
  inverse_full_mask(E.inverse_exclusions(residual, E.InverseBounds{a, b, c}))
