import Base
import ../cubie.bend as C
import ../coordinates.bend as Q
import ../symmetry.bend as Y
import ../packed-symmetry.bend as R
import ../joint-table.bend as J
import ../block-table.bend as B
import ../inverse-bound.bend as I

type Profile is Data:
  Light{}
  RawJoint{}
  RawInverseOne{}
  RawInverseThree{}
  BlockJoint{}

def profile_words(profile: Profile) -> U32:
  match profile:
    case Light{}: 8388608
    case RawJoint{}: 536870912
    case RawInverseOne{}: 536870912
    case RawInverseThree{}: 536870912
    case BlockJoint{}: 268435456

def profile_matches(profile: Profile, words: U32) -> Bool:
  U32.is_eq(profile_words(profile), words)

def raw_profile(raw: Bool) -> Profile:
  match raw:
    case True{}: RawJoint{}
    case False{}: Light{}


type Goal is Data:
  Reduction{}
  Subgroup{}
  FullCube{}

type Stage is Data:
  Improve{}
  ExactContour{}
  FirstThenExact{}

type Completion is Data:
  Running{}
  SearchOptimal{}
  TaskFinished{}
  InvalidTransform{}
  ProfileMismatch{}
  ContinuationFailure{fault: Fault}

def goal_code(goal: Goal) -> U32:
  match goal:
    case Reduction{}: 0
    case Subgroup{}: 1
    case FullCube{}: 2

def is_reduction(goal: Goal) -> Bool:
  match goal:
    case Reduction{}: True{}
    case _: False{}

def is_subgroup(goal: Goal) -> Bool:
  match goal:
    case Subgroup{}: True{}
    case _: False{}

def is_full_cube(goal: Goal) -> Bool:
  match goal:
    case FullCube{}: True{}
    case _: False{}

def next_goal(exact: Bool) -> Goal:
  match exact:
    case True{}: FullCube{}
    case False{}: Reduction{}

def stage_code(stage: Stage) -> U32:
  match stage:
    case Improve{}: 0
    case ExactContour{}: 1
    case FirstThenExact{}: 2

def is_exact(stage: Stage) -> Bool:
  match stage:
    case ExactContour{}: True{}
    case _: False{}

def is_improving(stage: Stage) -> Bool:
  match stage:
    case Improve{}: True{}
    case _: False{}

def completion_code(status: Completion) -> U32:
  match status:
    case Running{}: 0
    case SearchOptimal{}: 1
    case TaskFinished{}: 3
    case InvalidTransform{}: 4
    case ProfileMismatch{}: 5
    case ContinuationFailure{fault}: 6

def is_running(status: Completion) -> Bool:
  match status:
    case Running{}: True{}
    case _: False{}

def is_optimal(status: Completion) -> Bool:
  match status:
    case SearchOptimal{}: True{}
    case _: False{}

def completion(optimal: Bool) -> Completion:
  match optimal:
    case True{}: SearchOptimal{}
    case False{}: Running{}

def finished(exact: Bool) -> Completion:
  match exact:
    case True{}: SearchOptimal{}
    case False{}: TaskFinished{}

type Meta is Data:
  Meta{root: C.Cubie, p1: U32, ceiling: U32, best: +List<U32>, best_len: U32, mode: Stage, bound: U32, lower: U32, nodes: U32, status: Completion, profile: Profile}

type Frame is Data:
  Node{cube: C.Cubie, a: U32, b: U32, c: U32, left: U32, previous: U32, next: U32, phase: Goal, length: U32}
  Retry{cube: C.Cubie, a: U32, b: U32, c: U32, depth: U32, previous: U32, length: U32}

type Slot is Data:
  EmptySlot{}
  Held{frame: Frame}

type Fault is Data:
  Healthy{}
  FrameCapacity{}
  PathCapacity{}
  InvalidMove{}
  InvalidPrefix{}
  CorruptSlot{}
  InvalidRoot{}
  InvalidOccupancy{}

type Store is Type:
  Store{frames: Array<Slot>, path: Array<U32>, used: U32, cursor: U32, fault: Fault}

type Pop is Type:
  Vacant{store: Store}
  Popped{store: Store, frame: Frame}
  Broken{store: Store}

type Prefix is Type:
  Prefix{store: Store, moves: +List<U32>}
  Unreadable{store: Store}

def store_fault_code(fault: Fault) -> U32:
  match fault:
    case Healthy{}: 0
    case FrameCapacity{}: 1
    case PathCapacity{}: 2
    case InvalidMove{}: 3
    case InvalidPrefix{}: 4
    case CorruptSlot{}: 5
    case InvalidRoot{}: 6
    case InvalidOccupancy{}: 7

def store_frame_length(frame: Frame) -> U32:
  match frame:
    case Node{cube, a, b, c, left, previous, next, phase, length}: length
    case Retry{cube, a, b, c, depth, previous, length}: length

def store_root_valid(frame: Frame) -> Bool:
  match frame:
    case Node{cube, a, b, c, left, previous, next, phase, length}:
      U32.is_le(left, 30) && U32.is_eq(next, 0) && U32.is_eq(length, 0)
    case _: False{}

def store_failed(store: Store, fault: Fault) -> Store:
  match store:
    case Store{frames, path, used, cursor, Healthy{}}: Store{frames, path, used, cursor, fault}
    case Store{frames, path, used, cursor, old}: Store{frames, path, used, cursor, old}

def store_push_length(allowed: Bool, frame: Frame, store: Store) -> Store:
  match allowed store:
    case True{} Store{frames, path, +used, cursor, fault}:
      Store{Array.set(Slot, frames, used, Held{frame}), path, (used + 1 : U32), cursor, fault}
    case False{} store: store_failed(store, InvalidPrefix{})

def store_push_room(allowed: Bool, +frame: Frame, store: Store) -> Store:
  match allowed store:
    case True{} Store{frames, path, used, +cursor, fault}:
      +length = store_frame_length(frame)
      store_push_length(U32.is_le(length, 32) && U32.is_le(length, cursor), frame, Store{frames, path, used, cursor, fault})
    case False{} store: store_failed(store, FrameCapacity{})

def store_push(frame: Frame, store: Store) -> Store:
  match store:
    case Store{frames, path, +used, cursor, Healthy{}}:
      store_push_room(U32.is_lt(used, 64), frame, Store{frames, path, used, cursor, Healthy{}})
    case store: store

def store_reset_valid(allowed: Bool, frame: Frame, store: Store) -> Store:
  match allowed store:
    case True{} Store{frames, path, used, cursor, fault}:
      store_push(frame, Store{frames, path, 0, 0, fault})
    case False{} store: store_failed(store, InvalidRoot{})

def store_reset(+frame: Frame, store: Store) -> Store:
  match store:
    case Store{frames, path, used, cursor, Healthy{}}:
      store_reset_valid(store_root_valid(frame), frame, Store{frames, path, used, cursor, Healthy{}})
    case store: store

def store_fresh(frame: Frame) -> Store:
  store_reset(frame, Store{[EmptySlot{} : Slot*64n], [0 : U32*32n], 0, 0, Healthy{}})

def store_move_allowed(allowed: Bool, +index: U32, move: U32, store: Store) -> Store:
  match allowed store:
    case True{} Store{frames, path, used, cursor, fault}:
      Store{frames, Array.set(U32, path, index, move), used, (index + 1 : U32), fault}
    case False{} store: store_failed(store, InvalidMove{})

def store_move_prefix(allowed: Bool, index: U32, +move: U32, store: Store) -> Store:
  match allowed:
    case True{}: store_move_allowed(U32.is_lt(move, 18), index, move, store)
    case False{}: store_failed(store, InvalidPrefix{})

def store_move_room(allowed: Bool, +index: U32, move: U32, store: Store) -> Store:
  match allowed store:
    case True{} Store{frames, path, used, +cursor, fault}:
      store_move_prefix(U32.is_le(index, cursor), index, move, Store{frames, path, used, cursor, fault})
    case False{} store: store_failed(store, PathCapacity{})

def store_write_move(+index: U32, move: U32, store: Store) -> Store:
  match store:
    case Store{frames, path, used, cursor, Healthy{}}:
      store_move_room(U32.is_lt(index, 32), index, move, Store{frames, path, used, cursor, Healthy{}})
    case store: store

def store_pop_prefix(allowed: Bool, frame: Frame, store: Store) -> Pop:
  match allowed:
    case True{}: Popped{store, frame}
    case False{}: Broken{store_failed(store, InvalidPrefix{})}

def store_pop_slot(slot: Slot, store: Store) -> Pop:
  match slot store:
    case Held{+frame} Store{frames, path, used, +cursor, fault}:
      +length = store_frame_length(frame)
      store_pop_prefix(U32.is_le(length, 32) && U32.is_le(length, cursor), frame, Store{frames, path, used, cursor, fault})
    case EmptySlot{} store: Broken{store_failed(store, CorruptSlot{})}

def store_pop_read(read: Array<Slot> & Slot, path: Array<U32>, used: U32, cursor: U32, fault: Fault) -> Pop:
  match read:
    case Tuple{frames, slot}: store_pop_slot(slot, Store{frames, path, used, cursor, fault})

def store_pop_room(allowed: Bool, store: Store) -> Pop:
  match allowed store:
    case True{} Store{frames, path, used, cursor, fault}:
      +index = (used - 1 : U32)
      store_pop_read(Array.swap(Slot, frames, index, EmptySlot{}), path, index, cursor, fault)
    case False{} store: Broken{store_failed(store, InvalidOccupancy{})}

def store_pop(store: Store) -> Pop:
  match store:
    case Store{frames, path, 0, cursor, Healthy{}}: Vacant{Store{frames, path, 0, cursor, Healthy{}}}
    case Store{frames, path, +used, cursor, Healthy{}}:
      store_pop_room(U32.is_le(used, 64), Store{frames, path, used, cursor, Healthy{}})
    case store: Broken{store}

def store_prefix_cell(read: Array<U32> & U32, next: Array<U32> -> U32 -> Prefix) -> Prefix:
  match read:
    case Tuple{path, value}: next(path, value)

def store_prefix_loop(fuel: Nat, +index: U32, store: Store, acc: +List<U32>) -> Prefix:
  match fuel store:
    case 0n store: Prefix{store, acc}
    case 1n+p Store{frames, path, used, cursor, fault}:
      store_prefix_cell(Array.get(U32, path, index), path => value => store_prefix_loop(p, (index + 1 : U32), Store{frames, path, used, cursor, fault}, value <> acc))

def store_prefix_valid(allowed: Bool, length: U32, store: Store) -> Prefix:
  match allowed:
    case True{}: store_prefix_loop(U32.to_nat(length), 0, store, Nil{})
    case False{}: Unreadable{store_failed(store, InvalidPrefix{})}

def store_read_prefix(+length: U32, store: Store) -> Prefix:
  match store:
    case Store{frames, path, used, +cursor, Healthy{}}:
      store_prefix_valid(U32.is_le(length, 32) && U32.is_le(length, cursor), length, Store{frames, path, used, cursor, Healthy{}})
    case store: Unreadable{store}


type Search is Type:
  Search{table: Array<U32>, stack: Store, meta: Meta}

def storage_checked(state: Search) -> Search:
  match state:
    case Search{table, Store{frames, path, used, cursor, Healthy{}}, meta}:
      Search{table, Store{frames, path, used, cursor, Healthy{}}, meta}
    case Search{table, Store{frames, path, used, cursor, +fault}, Meta{root, p1, ceiling, best, length, mode, bound, lower, nodes, status, profile}}:
      Search{table, Store{frames, path, used, cursor, fault}, Meta{root, p1, ceiling, best, length, mode, bound, lower, nodes, ContinuationFailure{fault}, profile}}

def store_empty() -> Store:
  Store{[EmptySlot{} : Slot*64n], [0 : U32*32n], 0, 0, Healthy{}}

def maximum(+a: U32, +b: U32) -> U32:
  C.pick(U32.is_ge(a, b), a, b)

def solved(+cube: C.Cubie) -> Bool:
  match cube:
    case C.Cubie{cp, co, ep, eh, eo}:
      U32.is_eq(cp, 1985229328) && U32.is_eq(co, 0) && U32.is_eq(ep, 1985229328) && U32.is_eq(eh, 47768) && U32.is_eq(eo, 0)

def fixed(root: C.Cubie, transformed: C.Validation) -> Bool:
  match root transformed:
    case C.Cubie{a, b, c, d, e} C.Valid{C.Cubie{f, g, h, i, j}}:
      U32.is_eq(a, f) && U32.is_eq(b, g) && U32.is_eq(c, h) && U32.is_eq(d, i) && U32.is_eq(e, j)
    case _ _: False{}

def root_mask(ud: Bool, flip: Bool) -> U32:
  match ud flip:
    case True{} True{}: 7
    case True{} False{}: 8
    case False{} True{}: 9
    case False{} False{}: 6

def root_allowed(previous: U32, +face: U32) -> Bool:
  match previous:
    case 7: U32.is_eq(face, 0) || U32.is_eq(face, 1)
    case 8: U32.is_eq(face, 0) || U32.is_eq(face, 1) || U32.is_eq(face, 3)
    case 9: U32.is_eq(face, 0) || U32.is_eq(face, 1) || U32.is_eq(face, 2) || U32.is_eq(face, 4)
    case _: True{}

def root_frame(+root: C.Cubie, +depth: U32, +phase: Goal) -> Frame:
  +view = C.to_facelets(root)
  previous = root_mask(fixed(root, C.validate(Y.ud(view))), fixed(root, C.validate(Y.flip(view))))
  Node{root, Q.encode(Q.Twist{}, root), Q.encode(Q.Flip{}, root), Q.encode(Q.Slice{}, root), depth, previous, 0, phase, 0}

def record_prefix(read: Prefix, table: Array<U32>, +meta: Meta, +length: U32) -> Search:
  match read meta:
    case Prefix{rest, path} Meta{+root, p1, ceiling, best, best_len, FirstThenExact{}, bound, lower, nodes, status, +profile}:
      storage_checked(Search{table, store_reset(root_frame(root, 0, FullCube{}), rest), Meta{root, p1, ceiling, path, length, ExactContour{}, 0, 0, nodes, Running{}, profile}})
    case Prefix{rest, path} Meta{+root, p1, ceiling, best, best_len, +mode, bound, lower, nodes, status, +profile}:
      Search{table, rest, Meta{root, p1, ceiling, path, length, mode, bound, C.pick(is_exact(mode), length, lower), nodes, completion(is_exact(mode)), profile}}
    case Unreadable{rest} meta: storage_checked(Search{table, rest, meta})

def record(table: Array<U32>, rest: Store, meta: Meta, +length: U32) -> Search:
  record_prefix(store_read_prefix(length, rest), table, meta, length)

def maybe_record(better: Bool, table: Array<U32>, rest: Store, meta: Meta, length: U32) -> Search:
  match better:
    case True{}: record(table, rest, meta, length)
    case False{}: Search{table, rest, meta}

def push_child(table: Array<U32>, parent: Frame, rest: Store, meta: Meta, child: C.Cubie, +move: U32, nx: U32, ny: U32, nz: U32) -> Search:
  match parent:
    case Node{cube, a, b, c, +left, previous, next, +phase, +length}:
      Search{table, store_push(Node{child, nx, ny, nz, (left - 1 : U32), (move / 3 : U32), 0, phase, (length + 1 : U32)}, store_push(Node{cube, a, b, c, left, previous, next, phase, length}, store_write_move(length, move, rest))), meta}
    case parent: Search{table, store_push(parent, rest), meta}

def push(ok: Bool, table: Array<U32>, +parent: Frame, rest: Store, +meta: Meta, +move: U32, +nx: U32, +ny: U32, +nz: U32) -> Search:
  match ok parent:
    case True{} Node{+cube, a, b, c, left, previous, next, phase, length}:
      push_child(table, Node{cube, a, b, c, left, previous, next, phase, length}, rest, meta, C.turn(move, cube), move, nx, ny, nz)
    case _ parent: Search{table, store_push(parent, rest), meta}

def joint_index(+cube: C.Cubie) -> U32:
  ((Q.encode(Q.Twist{}, cube) * 2048 + Q.encode(Q.Flip{}, cube)) * 495 + Q.encode(Q.Slice{}, cube) : U32)

def raw_lookup(table: Array<U32>, index: U32) -> Array<U32> & U32:
  J.get_at(table, 8388608, index)

def block_lookup(table: Array<U32>, index: U32) -> Array<U32> & U32:
  B.get_at(table, 8388608, index, 34642080)

def accept_child(ok: Bool, table: Array<U32>, +parent: Frame, rest: Store, +meta: Meta, child: C.Cubie, move: U32, nx: U32, ny: U32, nz: U32) -> Search:
  match ok:
    case True{}: push_child(table, parent, rest, meta, child, move, nx, ny, nz)
    case False{}: Search{table, store_push(parent, rest), meta}

def inverse_result(read: Array<U32> & I.CubeBound, +parent: Frame, rest: Store, +meta: Meta, child: C.Cubie, move: U32, nx: U32, ny: U32, nz: U32) -> Search:
  match read parent:
    case Tuple{table, I.CubeBound{bound}} Node{cube, a, b, c, +left, previous, next, FullCube{}, length}:
      accept_child(U32.is_lt(bound, left), table, parent, rest, meta, child, move, nx, ny, nz)
    case Tuple{table, bound} parent: accept_child(True{}, table, parent, rest, meta, child, move, nx, ny, nz)

def inverse_policy(table: Array<U32>, +parent: Frame, rest: Store, +meta: Meta, +child: C.Cubie, move: U32, nx: U32, ny: U32, nz: U32) -> Search:
  match parent meta:
    case Node{cube, a, b, c, left, previous, next, FullCube{}, length} Meta{root, p1, ceiling, best, best_len, mode, bound, lower, nodes, status, RawInverseOne{}}:
      inverse_result(I.full_cube_one(table, child), parent, rest, meta, child, move, nx, ny, nz)
    case Node{cube, a, b, c, +left, previous, next, FullCube{}, length} Meta{root, p1, ceiling, best, best_len, mode, bound, lower, nodes, status, RawInverseThree{}}:
      inverse_result(I.full_cube_three(table, child, left), parent, rest, meta, child, move, nx, ny, nz)
    case _ _: accept_child(True{}, table, parent, rest, meta, child, move, nx, ny, nz)

def forward_allowed(allowed: Bool, table: Array<U32>, parent: Frame, rest: Store, meta: Meta, child: C.Cubie, move: U32, nx: U32, ny: U32, nz: U32) -> Search:
  match allowed:
    case True{}: inverse_policy(table, parent, rest, meta, child, move, nx, ny, nz)
    case False{}: accept_child(False{}, table, parent, rest, meta, child, move, nx, ny, nz)

def last_joint(read: Array<U32> & U32, +parent: Frame, rest: Store, +meta: Meta, child: C.Cubie, move: U32, nx: U32, ny: U32, nz: U32) -> Search:
  match read parent:
    case Tuple{table, bound} Node{cube, a, b, c, +left, previous, next, phase, length}:
      forward_allowed(U32.is_lt(bound, left), table, Node{cube, a, b, c, left, previous, next, phase, length}, rest, meta, child, move, nx, ny, nz)
    case Tuple{table, bound} parent: Search{table, store_push(parent, rest), meta}

def second_allowed(~lookup: Array<U32> -> U32 -> (Array<U32> & U32), ok: Bool, table: Array<U32>, +parent: Frame, rest: Store, +meta: Meta, child: C.Cubie, +move: U32, +nx: U32, +ny: U32, +nz: U32, rotated: C.Cubie) -> Search:
  match ok:
    case False{}: push(False{}, table, parent, rest, meta, move, nx, ny, nz)
    case True{}: last_joint(lookup(table, joint_index(R.rotate(rotated))), parent, rest, meta, child, move, nx, ny, nz)

def second_joint(~lookup: Array<U32> -> U32 -> (Array<U32> & U32), read: Array<U32> & U32, +parent: Frame, rest: Store, +meta: Meta, child: C.Cubie, +move: U32, +nx: U32, +ny: U32, +nz: U32, rotated: C.Cubie) -> Search:
  match read parent:
    case Tuple{table, bound} Node{cube, a, b, c, +left, previous, next, phase, length}:
      second_allowed(~lookup, U32.is_lt(bound, left), table, Node{cube, a, b, c, left, previous, next, phase, length}, rest, meta, child, move, nx, ny, nz, rotated)
    case Tuple{table, bound} parent: Search{table, store_push(parent, rest), meta}

def other_axes(~lookup: Array<U32> -> U32 -> (Array<U32> & U32), exact: Bool, table: Array<U32>, +parent: Frame, rest: Store, +meta: Meta, +move: U32, +nx: U32, +ny: U32, +nz: U32) -> Search:
  match exact parent:
    case True{} Node{+cube, a, b, c, left, previous, next, phase, length}:
      +child = C.turn(move, cube)
      +rotated = R.rotate(child)
      second_joint(~lookup, lookup(table, joint_index(rotated)), Node{cube, a, b, c, left, previous, next, phase, length}, rest, meta, child, move, nx, ny, nz, rotated)
    case _ parent: push(True{}, table, parent, rest, meta, move, nx, ny, nz)

def joint_allowed(~lookup: Array<U32> -> U32 -> (Array<U32> & U32), ok: Bool, exact: Bool, table: Array<U32>, +parent: Frame, rest: Store, +meta: Meta, +move: U32, +nx: U32, +ny: U32, +nz: U32) -> Search:
  match ok:
    case False{}: push(False{}, table, parent, rest, meta, move, nx, ny, nz)
    case True{}: other_axes(~lookup, exact, table, parent, rest, meta, move, nx, ny, nz)

def first_joint(~lookup: Array<U32> -> U32 -> (Array<U32> & U32), read: Array<U32> & U32, +parent: Frame, rest: Store, +meta: Meta, +move: U32, +nx: U32, +ny: U32, +nz: U32) -> Search:
  match read parent:
    case Tuple{table, bound} Node{cube, a, b, c, +left, previous, next, +phase, length}:
      joint_allowed(~lookup, U32.is_lt(bound, left), is_full_cube(phase), table, Node{cube, a, b, c, left, previous, next, phase, length}, rest, meta, move, nx, ny, nz)
    case Tuple{table, bound} parent: Search{table, store_push(parent, rest), meta}

def joint_profile(profile: Profile, table: Array<U32>, +parent: Frame, rest: Store, +meta: Meta, +move: U32, +nx: U32, +ny: U32, +nz: U32) -> Search:
  match profile:
    case BlockJoint{}: first_joint(~block_lookup, block_lookup(table, ((nx * 2048 + ny) * 495 + nz : U32)), parent, rest, meta, move, nx, ny, nz)
    case RawJoint{}: first_joint(~raw_lookup, raw_lookup(table, ((nx * 2048 + ny) * 495 + nz : U32)), parent, rest, meta, move, nx, ny, nz)
    case RawInverseOne{}: first_joint(~raw_lookup, raw_lookup(table, ((nx * 2048 + ny) * 495 + nz : U32)), parent, rest, meta, move, nx, ny, nz)
    case RawInverseThree{}: first_joint(~raw_lookup, raw_lookup(table, ((nx * 2048 + ny) * 495 + nz : U32)), parent, rest, meta, move, nx, ny, nz)
    case Light{}: push(True{}, table, parent, rest, meta, move, nx, ny, nz)

def joint_meta(table: Array<U32>, +parent: Frame, rest: Store, +meta: Meta, +move: U32, +nx: U32, +ny: U32, +nz: U32) -> Search:
  match meta:
    case Meta{root, p1, ceiling, best, best_len, mode, bound, lower, nodes, status, profile}:
      joint_profile(profile, table, parent, rest, meta, move, nx, ny, nz)

def stronger(ok: Bool, table: Array<U32>, +parent: Frame, rest: Store, +meta: Meta, +move: U32, +nx: U32, +ny: U32, +nz: U32) -> Search:
  match ok parent:
    case True{} Node{cube, a, b, c, left, previous, next, Subgroup{}, length}: push(True{}, table, Node{cube, a, b, c, left, previous, next, Subgroup{}, length}, rest, meta, move, nx, ny, nz)
    case True{} parent: joint_meta(table, parent, rest, meta, move, nx, ny, nz)
    case False{} parent: push(False{}, table, parent, rest, meta, move, nx, ny, nz)

def bound_y(read: Array<U32> & U32, +parent: Frame, rest: Store, +meta: Meta, +move: U32, +nx: U32, +ny: U32, +nz: U32, +hx: U32) -> Search:
  match read parent:
    case Tuple{table, hy} Node{cube, a, b, c, +left, previous, next, phase, length}:
      stronger(U32.is_lt(maximum(hx, hy), left), table, Node{cube, a, b, c, left, previous, next, phase, length}, rest, meta, move, nx, ny, nz)
    case Tuple{table, hy} parent:
      Search{table, store_push(parent, rest), meta}

def bound_x(read: Array<U32> & U32, +parent: Frame, rest: Store, +meta: Meta, +move: U32, +nx: U32, +ny: U32, +nz: U32, +second: U32, +base: U32) -> Search:
  match read:
    case Tuple{table, hx}:
      bound_y(table[(base + ny * second + nz : U32)], parent, rest, meta, move, nx, ny, nz, hx)

def transition_z(read: Array<U32> & U32, +parent: Frame, rest: Store, +meta: Meta, +move: U32, +nx: U32, +ny: U32) -> Search:
  match read parent:
    case Tuple{table, +nz} Node{cube, a, b, c, left, previous, next, +phase, length}:
      +second = C.pick(is_subgroup(phase), 24, 495)
      +base = C.pick(is_subgroup(phase), 2988105, 891780)
      bound_x(table[(base + nx * second + nz : U32)], Node{cube, a, b, c, left, previous, next, phase, length}, rest, meta, move, nx, ny, nz, second, C.pick(is_subgroup(phase), 3955785, 1974345))
    case Tuple{table, nz} parent:
      Search{table, store_push(parent, rest), meta}

def transition_y(read: Array<U32> & U32, +parent: Frame, rest: Store, +meta: Meta, +move: U32, +nx: U32, +column: U32) -> Search:
  match read parent:
    case Tuple{table, ny} Node{cube, a, b, +c, left, previous, next, +phase, length}:
      width = C.pick(is_subgroup(phase), 10, 18)
      offset = C.pick(is_subgroup(phase), 891540, 76230)
      transition_z(table[(offset + c * width + column : U32)], Node{cube, a, b, c, left, previous, next, phase, length}, rest, meta, move, nx, ny)
    case Tuple{table, ny} parent:
      Search{table, store_push(parent, rest), meta}

def transition_x(read: Array<U32> & U32, +parent: Frame, rest: Store, +meta: Meta, +move: U32, +column: U32) -> Search:
  match read parent:
    case Tuple{table, nx} Node{cube, a, +b, c, left, previous, next, +phase, length}:
      width = C.pick(is_subgroup(phase), 10, 18)
      offset = C.pick(is_subgroup(phase), 488340, 39366)
      transition_y(table[(offset + b * width + column : U32)], Node{cube, a, b, c, left, previous, next, phase, length}, rest, meta, move, nx, column)
    case Tuple{table, nx} parent:
      Search{table, store_push(parent, rest), meta}

def child(ok: Bool, table: Array<U32>, +parent: Frame, rest: Store, +meta: Meta, +move: U32, +column: U32) -> Search:
  match ok parent:
    case False{} parent:
      Search{table, store_push(parent, rest), meta}
    case True{} Node{cube, +a, b, c, left, previous, next, +phase, length}:
      width = C.pick(is_subgroup(phase), 10, 18)
      offset = C.pick(is_subgroup(phase), 85140, 0)
      transition_x(table[(offset + a * width + column : U32)], Node{cube, a, b, c, left, previous, next, phase, length}, rest, meta, move, column)
    case _ parent:
      Search{table, store_push(parent, rest), meta}

def enumerate(ok: Bool, table: Array<U32>, +frame: Frame, rest: Store, +meta: Meta) -> Search:
  match ok frame:
    case False{} _:
      Search{table, rest, meta}
    case True{} Node{cube, a, b, c, left, +previous, +next, +phase, length}:
      +move = C.pick(is_subgroup(phase), Q.phase2_move(next), next)
      +face = (move / 3 : U32)
      child(root_allowed(previous, face) && U32.is_ne(face, previous) && (U32.is_ne(((face + 3) % 6 : U32), previous) || U32.is_lt(previous, face)), table, Node{cube, a, b, c, left, previous, (next + 1 : U32), phase, length}, rest, meta, move, next)
    case _ _:
      Search{table, rest, meta}

def phase2_depth(read: Array<U32> & U32, +cube: C.Cubie, +a: U32, +b: U32, +c: U32, +previous: U32, +length: U32, rest: Store, +meta: Meta, +hx: U32) -> Search:
  match read:
    case Tuple{table, hy}:
      Search{table, store_push(Retry{cube, a, b, c, maximum(hx, hy), previous, length}, rest), meta}

def phase2_bound(read: Array<U32> & U32, +cube: C.Cubie, +a: U32, +b: U32, +c: U32, +previous: U32, +length: U32, rest: Store, +meta: Meta) -> Search:
  match read:
    case Tuple{table, hx}:
      phase2_depth(table[(3955785 + b * 24 + c : U32)], cube, a, b, c, previous, length, rest, meta, hx)

def phase2(table: Array<U32>, +cube: C.Cubie, +previous: U32, +length: U32, rest: Store, +meta: Meta) -> Search:
  +a = Q.encode(Q.Corners{}, cube)
  b = Q.encode(Q.Edges{}, cube)
  +c = Q.encode(Q.Middle{}, cube)
  phase2_bound(table[(2988105 + a * 24 + c : U32)], cube, a, b, c, previous, length, rest, meta)

def leaf(group: Bool, table: Array<U32>, +frame: Frame, rest: Store, +meta: Meta) -> Search:
  match group frame:
    case True{} Node{cube, a, b, c, left, previous, next, phase, length}:
      phase2(table, cube, previous, length, rest, meta)
    case _ _:
      Search{table, rest, meta}

def node_open(leaf_node: Bool, table: Array<U32>, +frame: Frame, rest: Store, +meta: Meta) -> Search:
  match leaf_node frame meta:
    case True{} Node{cube, +a, +b, +c, left, previous, next, +phase, length} meta:
      leaf(is_reduction(phase) && U32.is_eq(a, 0) && U32.is_eq(b, 0) && U32.is_eq(c, 0), table, Node{cube, a, b, c, left, previous, next, phase, length}, rest, meta)
    case False{} Node{cube, a, b, c, left, previous, +next, +phase, +length} Meta{root, p1, ceiling, best, +best_len, mode, bound, lower, nodes, status, +profile}:
      enumerate(U32.is_lt(next, C.pick(is_subgroup(phase), 10, 18)) && U32.is_lt(length, best_len), table, Node{cube, a, b, c, left, previous, next, phase, length}, rest, Meta{root, p1, ceiling, best, best_len, mode, bound, lower, nodes, status, profile})
    case _ _ meta:
      Search{table, rest, meta}

def node_goal(goal: Bool, table: Array<U32>, +frame: Frame, rest: Store, +meta: Meta) -> Search:
  match goal frame meta:
    case True{} Node{cube, a, b, c, left, previous, next, phase, +length} Meta{root, p1, ceiling, best, +best_len, mode, bound, lower, nodes, status, +profile}:
      maybe_record(U32.is_lt(length, best_len), table, rest, Meta{root, p1, ceiling, best, best_len, mode, bound, lower, nodes, status, profile}, length)
    case False{} Node{cube, a, b, c, +left, previous, next, phase, length} meta:
      node_open(U32.is_eq(left, 0), table, Node{cube, a, b, c, left, previous, next, phase, length}, rest, meta)
    case _ _ meta:
      Search{table, rest, meta}

def retry(ok: Bool, table: Array<U32>, +frame: Frame, rest: Store, +meta: Meta) -> Search:
  match ok frame:
    case True{} Retry{+cube, +a, +b, +c, +depth, +previous, +length}:
      Search{table, store_push(Node{cube, a, b, c, depth, previous, 0, Subgroup{}, length}, store_push(Retry{cube, a, b, c, (depth + 1 : U32), previous, length}, rest)), meta}
    case _ _:
      Search{table, rest, meta}

def next_root(done: Bool, table: Array<U32>, stack: Store, +meta: Meta) -> Search:
  match done meta:
    case True{} Meta{root, p1, ceiling, best, best_len, mode, bound, lower, nodes, status, +profile}:
      Search{table, stack, Meta{root, p1, ceiling, best, best_len, mode, bound, C.pick(is_exact(mode), best_len, lower), nodes, finished(is_exact(mode)), profile}}
    case False{} Meta{+root, +p1, +ceiling, best, best_len, +mode, +bound, +lower, nodes, status, +profile}:
      +next_p1 = C.pick(U32.is_lt(p1, 12), (p1 + 1 : U32), 0)
      +next_ceiling = C.pick(U32.is_lt(p1, 12), ceiling, (ceiling + 1 : U32))
      +exact = is_exact(mode)
      +next_bound = (bound + 1 : U32)
      storage_checked(Search{table, store_reset(root_frame(root, C.pick(exact, next_bound, next_p1), next_goal(exact)), stack), Meta{root, next_p1, next_ceiling, best, best_len, mode, next_bound, C.pick(exact, next_bound, lower), nodes, Running{}, profile}})

def next_popped(result: Pop, table: Array<U32>, +meta: Meta) -> Search:
  match result meta:
    case Vacant{stack} Meta{root, p1, +ceiling, best, +best_len, +mode, +bound, lower, nodes, status, +profile}:
      next_root((is_exact(mode) && U32.is_ge((bound + 1 : U32), best_len)) || (is_improving(mode) && U32.is_ge(ceiling, 31)), table, stack, Meta{root, p1, ceiling, best, best_len, mode, bound, lower, nodes, status, profile})
    case Popped{rest, Node{+cube, +a, +b, +c, left, previous, next, +phase, length}} meta:
      node_goal((is_subgroup(phase) && U32.is_eq(a, 0) && U32.is_eq(b, 0) && U32.is_eq(c, 0)) || (Bool.not(is_subgroup(phase)) && solved(cube)), table, Node{cube, a, b, c, left, previous, next, phase, length}, rest, meta)
    case Popped{rest, Retry{cube, a, b, c, +depth, previous, +length}} Meta{root, p1, +ceiling, best, +best_len, mode, bound, lower, nodes, status, +profile}:
      retry(U32.is_le(depth, C.pick(U32.is_eq(best_len, 31) && U32.is_le(ceiling, 24), 12, 18)) && U32.is_le((depth + length : U32), ceiling) && U32.is_lt((depth + length : U32), best_len), table, Retry{cube, a, b, c, depth, previous, length}, rest, Meta{root, p1, ceiling, best, best_len, mode, bound, lower, nodes, status, profile})
    case Broken{stack} meta: storage_checked(Search{table, stack, meta})

def next(table: Array<U32>, stack: Store, meta: Meta) -> Search:
  next_popped(store_pop(stack), table, meta)

def advance_raw(state: Search) -> Search:
  match state:
    case Search{table, stack, Meta{root, p1, ceiling, best, best_len, mode, bound, lower, nodes, status, +profile}}:
      next(table, stack, Meta{root, p1, ceiling, best, best_len, mode, bound, lower, (nodes + 1 : U32), status, profile})

def advance(state: Search) -> Search:
  storage_checked(advance_raw(state))

def run(fuel: Nat, state: Search) -> Search:
  match fuel state:
    case 0n state: storage_checked(state)
    case 1n+p Search{table, stack, Meta{root, p1, ceiling, best, best_len, mode, bound, lower, nodes, Running{}, +profile}}:
      run(p, advance_raw(Search{table, stack, Meta{root, p1, ceiling, best, best_len, mode, bound, lower, nodes, Running{}, profile}}))
    case _ state: storage_checked(state)

def initialize_checked(accepted: Bool, table: Array<U32>, +root: C.Cubie, +request: Stage, profile: Profile) -> Search:
  match accepted:
    case True{}: storage_checked(Search{table, store_fresh(root_frame(root, 0, next_goal(is_exact(request)))), Meta{root, 0, 21, Nil{}, 31, request, 0, 0, 0, Running{}, profile}})
    case False{}: Search{table, store_empty(), Meta{root, 0, 21, Nil{}, 31, request, 0, 0, 0, ProfileMismatch{}, profile}}

def initialize_size(read: Array<U32> & U32, root: C.Cubie, request: Stage, +profile: Profile) -> Search:
  match read:
    case Tuple{table, size}: initialize_checked(profile_matches(profile, size), table, root, request, profile)

def initialize(table: Array<U32>, root: C.Cubie, request: Stage, profile: Profile) -> Search:
  initialize_size(Array.size(U32, table), root, request, profile)
