import Base
import ../src/owned/search.bend as O
import ../src/search.bend as R
import ../src/cubie.bend as C

type FrameView is Type:
  Viewed{store: O.Store, frame: R.Frame}
  ViewFailed{store: O.Store}

type FramesView is Type:
  Frames{store: O.Store, frames: +List<R.Frame>}
  FramesFailed{store: O.Store}

type Comparison is Type:
  Comparison{owned: O.Search, reference: R.Search, same: Bool, frames: U32, running: Bool, diagnostic: String}

def goal(value: O.Goal) -> R.Goal:
  match value:
    case O.Reduction{}: R.Reduction{}
    case O.Subgroup{}: R.Subgroup{}
    case O.FullCube{}: R.FullCube{}

def with_prefix(read: O.Prefix, frame: O.Frame) -> FrameView:
  match read frame:
    case O.Prefix{store, path} O.Node{cube, a, b, c, left, previous, next, phase, length}:
      Viewed{store, R.Node{cube, a, b, c, left, previous, next, goal(phase), path, length}}
    case O.Prefix{store, path} O.Retry{cube, a, b, c, depth, previous, length}:
      Viewed{store, R.Retry{cube, a, b, c, depth, previous, path, length}}
    case O.Unreadable{store} _: ViewFailed{store}

def slot_frame(slot: O.Slot, store: O.Store) -> FrameView:
  match slot:
    case O.EmptySlot{}: ViewFailed{O.store_failed(store, O.CorruptSlot{})}
    case O.Held{+frame}: with_prefix(O.store_read_prefix(O.store_frame_length(frame), store), frame)

def slot_read(read: Array<O.Slot> & O.Slot, path: Array<U32>, used: U32, cursor: U32, fault: O.Fault) -> FrameView:
  match read:
    case Tuple{frames, slot}: slot_frame(slot, O.Store{frames, path, used, cursor, fault})

def slot_valid(allowed: Bool, index: U32, store: O.Store) -> FrameView:
  match allowed store:
    case True{} O.Store{frames, path, used, cursor, fault}:
      slot_read(Array.get(O.Slot, frames, index), path, used, cursor, fault)
    case False{} store: ViewFailed{O.store_failed(store, O.InvalidOccupancy{})}

def slot(+index: U32, store: O.Store) -> FrameView:
  match store:
    case O.Store{frames, path, +used, cursor, O.Healthy{}}:
      slot_valid(U32.is_lt(index, used) && U32.is_lt(index, 64), index, O.Store{frames, path, used, cursor, O.Healthy{}})
    case store: ViewFailed{store}

def after_frame(read: FrameView, next: O.Store -> R.Frame -> FramesView) -> FramesView:
  match read:
    case Viewed{store, frame}: next(store, frame)
    case ViewFailed{store}: FramesFailed{store}

def frames_loop(fuel: Nat, +index: U32, store: O.Store, acc: +List<R.Frame>) -> FramesView:
  match fuel:
    case 0n: Frames{store, acc}
    case 1n+p: after_frame(slot(index, store), s => f => frames_loop(p, (index + 1 : U32), s, f <> acc))

def frames_valid(allowed: Bool, used: U32, store: O.Store) -> FramesView:
  match allowed:
    case True{}: frames_loop(U32.to_nat(used), 0, store, Nil{})
    case False{}: FramesFailed{O.store_failed(store, O.InvalidOccupancy{})}

def frames(store: O.Store) -> FramesView:
  match store:
    case O.Store{array, path, +used, cursor, O.Healthy{}}:
      frames_valid(U32.is_le(used, 64), used, O.Store{array, path, used, cursor, O.Healthy{}})
    case store: FramesFailed{store}

def numbers(xs: +List<U32>) -> +List<String>:
  match xs:
    case Nil{}: Nil{}
    case Con{x, rest}: U32.show(x) <> numbers(rest)

def vector(xs: +List<U32>) -> String:
  "[" ++ String.join(numbers(xs), ",") ++ "]"

def cube_text(cube: C.Cubie) -> String:
  match cube:
    case C.Cubie{a, b, c, d, e}: vector([a, b, c, d, e])

def frame_text(frame: R.Frame) -> String:
  match frame:
    case R.Node{cube, a, b, c, left, previous, next, phase, path, length}:
      "[0," ++ cube_text(cube) ++ "," ++ vector([a, b, c, left, previous, next, R.goal_code(phase), length]) ++ "," ++ vector(path) ++ "]"
    case R.Retry{cube, a, b, c, depth, previous, path, length}:
      "[1," ++ cube_text(cube) ++ "," ++ vector([a, b, c, depth, previous, length]) ++ "," ++ vector(path) ++ "]"

def frame_texts(frames: +List<R.Frame>) -> +List<String>:
  match frames:
    case Nil{}: Nil{}
    case Con{frame, rest}: frame_text(frame) <> frame_texts(rest)

def frames_text(frames: +List<R.Frame>) -> String:
  "[" ++ String.join(frame_texts(frames), ",") ++ "]"

def list_same(a: +List<U32>, b: +List<U32>) -> Bool:
  match a b:
    case Nil{} Nil{}: True{}
    case Con{x, xs} Con{y, ys}: U32.is_eq(x, y) && list_same(xs, ys)
    case _ _: False{}

def cube_same(a: C.Cubie, b: C.Cubie) -> Bool:
  match a b:
    case C.Cubie{a, b, c, d, e} C.Cubie{f, g, h, i, j}:
      U32.is_eq(a, f) && U32.is_eq(b, g) && U32.is_eq(c, h) && U32.is_eq(d, i) && U32.is_eq(e, j)

def frame_same(a: R.Frame, b: R.Frame) -> Bool:
  match a b:
    case R.Node{ac, a1, a2, a3, a4, a5, a6, ag, ap, al} R.Node{bc, b1, b2, b3, b4, b5, b6, bg, bp, bl}:
      cube_same(ac, bc) && U32.is_eq(a1, b1) && U32.is_eq(a2, b2) && U32.is_eq(a3, b3) && U32.is_eq(a4, b4) && U32.is_eq(a5, b5) && U32.is_eq(a6, b6) && U32.is_eq(R.goal_code(ag), R.goal_code(bg)) && list_same(ap, bp) && U32.is_eq(al, bl)
    case R.Retry{ac, a1, a2, a3, ad, av, ap, al} R.Retry{bc, b1, b2, b3, bd, bv, bp, bl}:
      cube_same(ac, bc) && U32.is_eq(a1, b1) && U32.is_eq(a2, b2) && U32.is_eq(a3, b3) && U32.is_eq(ad, bd) && U32.is_eq(av, bv) && list_same(ap, bp) && U32.is_eq(al, bl)
    case _ _: False{}

def frames_same(a: +List<R.Frame>, b: +List<R.Frame>) -> Bool:
  match a b:
    case Nil{} Nil{}: True{}
    case Con{x, xs} Con{y, ys}: frame_same(x, y) && frames_same(xs, ys)
    case _ _: False{}

def owned_profile(profile: O.Profile) -> U32:
  match profile:
    case O.Light{}: 0
    case O.RawJoint{}: 1
    case O.RawInverseOne{}: 2
    case O.RawInverseThree{}: 3
    case O.BlockJoint{}: 4

def reference_profile(profile: R.Profile) -> U32:
  match profile:
    case R.Light{}: 0
    case R.RawJoint{}: 1
    case R.RawInverseOne{}: 2
    case R.RawInverseThree{}: 3
    case R.BlockJoint{}: 4

def meta_same(a: O.Meta, b: R.Meta) -> Bool:
  match a b:
    case O.Meta{ar, a1, a2, ab, al, am, ad, ae, an, ast, ap} R.Meta{br, b1, b2, bb, bl, bm, bd, be, bn, bst, bp}:
      cube_same(ar, br) && U32.is_eq(a1, b1) && U32.is_eq(a2, b2) && list_same(ab, bb) && U32.is_eq(al, bl) && U32.is_eq(O.stage_code(am), R.stage_code(bm)) && U32.is_eq(ad, bd) && U32.is_eq(ae, be) && U32.is_eq(an, bn) && U32.is_eq(O.completion_code(ast), R.completion_code(bst)) && U32.is_eq(owned_profile(ap), reference_profile(bp))

def active(meta: O.Meta) -> Bool:
  match meta:
    case O.Meta{root, p1, ceiling, best, length, mode, bound, lower, nodes, status, profile}: O.is_running(status)

def selected(equal: Bool, table: Array<U32>, store: O.Store, +meta: O.Meta, other_table: Array<U32>, +other_stack: +List<R.Frame>, +other_meta: R.Meta, own_stack: +List<R.Frame>, count: U32) -> Comparison:
  match equal:
    case True{}: Comparison{O.Search{table, store, meta}, R.Search{other_table, other_stack, other_meta}, True{}, count, active(meta), ""}
    case False{}: Comparison{O.Search{table, store, meta}, R.Search{other_table, other_stack, other_meta}, False{}, count, active(meta), "{\"owned\":" ++ frames_text(own_stack) ++ ",\"reference\":" ++ frames_text(other_stack) ++ "}"}

def compared(view: FramesView, table: Array<U32>, +meta: O.Meta, reference: R.Search) -> Comparison:
  match view reference:
    case Frames{store, +own_stack} R.Search{other_table, +other_stack, +other_meta}:
      selected(frames_same(own_stack, other_stack) && meta_same(meta, other_meta), table, store, meta, other_table, other_stack, other_meta, own_stack, U32.from_nat(List.length(&2, R.Frame, own_stack)))
    case FramesFailed{store} reference: Comparison{O.storage_checked(O.Search{table, store, meta}), reference, False{}, 0, False{}, "Owned continuation observation failed"}

def compare(owned: O.Search, reference: R.Search) -> Comparison:
  match owned:
    case O.Search{table, store, meta}: compared(frames(store), table, meta, reference)
