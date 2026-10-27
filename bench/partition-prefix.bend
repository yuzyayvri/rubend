import Base
import ../src/model.bend as M
import ../src/cubie.bend as C
import ../src/symmetry.bend as Y
import ../src/search.bend as S

def allowed(+previous: U32, +move: U32) -> Bool:
  +face = (move / 3 : U32)
  S.root_allowed(previous, face) && U32.is_ne(face, previous) && (U32.is_ne(((face + 3) % 6 : U32), previous) || U32.is_lt(previous, face))

def selected(ok: Bool, code: U32, move: U32, rest: +List<U32>) -> +List<U32>:
  match ok:
    case True{}: (code * 18 + move : U32) <> rest
    case False{}: rest

def choices(fuel: Nat, +move: U32, +code: U32, +previous: U32, acc: +List<U32>) -> +List<U32>:
  match fuel:
    case 0n: acc
    case 1n+rest: choices(rest, (move + 1 : U32), code, previous, selected(allowed(previous, move), code, move, acc))

def grown(prefixes: +List<U32>, acc: +List<U32>) -> +List<U32>:
  match prefixes:
    case Nil{}: List.reverse(&2, U32, acc)
    case Con{+code, rest}: grown(rest, choices(18n, 0, code, (code % 18 / 3 : U32), acc))

def levels(fuel: Nat, prefixes: +List<U32>) -> +List<U32>:
  match fuel:
    case 0n: prefixes
    case 1n+rest: levels(rest, grown(prefixes, Nil{}))

def at_depth(depth: U32, mask: U32) -> +List<U32>:
  match depth:
    case 0: [0]
    case depth: levels(U32.to_nat((depth - 1 : U32)), List.reverse(&2, U32, choices(18n, 0, 0, mask, Nil{})))

def admitted(ok: Bool, mask: U32, depth: U32) -> +List<U32>:
  match ok:
    case True{}: at_depth(depth, mask)
    case False{}: Nil{}

def words(goal: S.Goal, +mask: U32, +depth: U32) -> +List<U32>:
  match goal:
    case S.FullCube{}: admitted(U32.is_ge(mask, 6) && U32.is_le(mask, 9) && U32.is_lt(depth, 5), mask, depth)
    case _: Nil{}

def test_words(goal: U32, mask: U32, depth: U32) -> +List<U32>:
  match goal:
    case 0: words(S.Reduction{}, mask, depth)
    case 1: words(S.Subgroup{}, mask, depth)
    case 2: words(S.FullCube{}, mask, depth)
    case _: Nil{}

def frame_mask(frame: S.Frame) -> U32:
  match frame:
    case S.Node{cube, a, b, c, left, previous, next, goal, path, length}: previous
    case _: 4294967295

def checked_mask(ok: Bool, root: C.Cubie) -> U32:
  match ok:
    case True{}: frame_mask(S.root_frame(root, 0, S.FullCube{}))
    case False{}: 4294967295

def test_mask(cp: U32, co: U32, ep: U32, eh: U32, eo: U32) -> U32:
  +root = {C.Cubie{cp, co, ep, eh, eo} : C.Cubie}
  checked_mask(S.fixed(root, C.validate(C.to_facelets(root))), root)

def ud_rounds(fuel: Nat, move: M.Move) -> M.Move:
  match fuel:
    case 0n: move
    case 1n+rest: ud_rounds(rest, Y.ud_move(move))

def flipped(enabled: Bool, move: M.Move) -> M.Move:
  match enabled:
    case True{}: Y.flip_move(move)
    case False{}: move

def mapped(ok: Bool, +variant: U32, move: U32) -> U32:
  match ok:
    case True{}: M.index(ud_rounds(U32.to_nat((variant % 4 : U32)), flipped(U32.is_ge(variant, 4), M.from_index(move))))
    case False{}: 4294967295

def test_map(+variant: U32, +move: U32) -> U32:
  mapped(U32.is_lt(variant, 8) && U32.is_lt(move, 18), variant, move)

type PrefixStats is Data:
  PrefixStats{count: U32, checksum: U32}

def stats(values: +List<U32>, count: U32, checksum: U32) -> PrefixStats:
  match values:
    case Nil{}: PrefixStats{count, checksum}
    case Con{code, rest}: stats(rest, (count + 1 : U32), (checksum * 33 + code : U32))

def test_stats(mask: U32, depth: U32, seed: U32) -> PrefixStats:
  stats(words(S.FullCube{}, mask, depth), 0, seed)
