import Base
import ../bench/owned-continuation.bend as O
import ../src/cubie.bend as C
import ../src/search.bend as S

type Checks is Data:
  Checks{roundtrip: Bool, frame_capacity: Bool, sticky: Bool, path: Bool, path_capacity: Bool, move_index: Bool, gap: Bool, rewind: Bool, reset_prefix: Bool, corrupt: Bool, occupancy: Bool, root_depth: Bool}

def frame(+value: U32) -> O.Frame:
  O.Node{C.Cubie{value, (value + 1 : U32), (value + 2 : U32), (value + 3 : U32), (value + 4 : U32)}, (value + 5 : U32), (value + 6 : U32), (value + 7 : U32), 0, 6, 0, S.FullCube{}, 0}

def same_frame(+value: U32, frame: O.Frame) -> Bool:
  match frame:
    case O.Node{C.Cubie{a, b, c, d, e}, f, g, h, 0, 6, 0, S.FullCube{}, 0}:
      U32.is_eq(a, value) && U32.is_eq(b, (value + 1 : U32)) && U32.is_eq(c, (value + 2 : U32)) && U32.is_eq(d, (value + 3 : U32)) && U32.is_eq(e, (value + 4 : U32)) && U32.is_eq(f, (value + 5 : U32)) && U32.is_eq(g, (value + 6 : U32)) && U32.is_eq(h, (value + 7 : U32))
    case _: False{}

def fill(fuel: Nat, +index: U32, store: O.Store) -> O.Store:
  match fuel:
    case 0n: store
    case 1n+p: fill(p, (index + 1 : U32), O.push(frame(index), store))

def full() -> O.Store:
  fill(63n, 1, O.fresh(frame(0)))

def finish_empty(ok: Bool, result: O.Pop) -> O.Store & Bool:
  match result:
    case O.Vacant{store}: (store, ok)
    case O.Popped{store, frame}: (store, False{})
    case O.Broken{store}: (store, False{})

def after_pop(result: O.Pop, next: O.Store -> O.Frame -> (O.Store & Bool)) -> O.Store & Bool:
  match result:
    case O.Popped{store, frame}: next(store, frame)
    case O.Vacant{store}: (store, False{})
    case O.Broken{store}: (store, False{})

def drain(+fuel: Nat, store: O.Store, ok: Bool) -> O.Store & Bool:
  match fuel:
    case 0n: finish_empty(ok, O.pop(store))
    case 1n+p: after_pop(O.pop(store), s => f => drain(p, s, ok && same_frame(U32.from_nat(p), f)))

def drained(result: O.Store & Bool) -> Bool:
  match result:
    case Tuple{store, ok}: ok

def slot_seen(read: Array<O.Slot> & O.Slot, expected: U32, ok: Bool) -> Array<O.Slot> & Bool:
  match read:
    case Tuple{frames, O.Held{frame}}: (frames, ok && same_frame(expected, frame))
    case Tuple{frames, O.EmptySlot{}}: (frames, False{})

def second_seen(read: Array<O.Slot> & Bool) -> Bool:
  match read:
    case Tuple{frames, ok}: ok

def first_seen(read: Array<O.Slot> & Bool) -> Bool:
  match read:
    case Tuple{frames, ok}: second_seen(slot_seen(Array.get(O.Slot, frames, 63), 63, ok))

def capacity(store: O.Store) -> Bool:
  match store:
    case O.Store{frames, path, used, cursor, fault}:
      first_seen(slot_seen(Array.get(O.Slot, frames, 0), 0, U32.is_eq(used, 64) && U32.is_eq(cursor, 0) && U32.is_eq(O.fault_code(fault), 1)))

def moves(fuel: Nat, +index: U32, store: O.Store) -> O.Store:
  match fuel:
    case 0n: store
    case 1n+p: moves(p, (index + 1 : U32), O.write_move(index, (index % 18 : U32), store))

def same_moves(a: +List<U32>, b: +List<U32>) -> Bool:
  match a b:
    case Nil{} Nil{}: True{}
    case Con{x, xs} Con{y, ys}: U32.is_eq(x, y) && same_moves(xs, ys)
    case _ _: False{}

def state(store: O.Store, expected_used: U32, expected_cursor: U32, expected_fault: U32) -> Bool:
  match store:
    case O.Store{frames, path, used, cursor, fault}:
      U32.is_eq(used, expected_used) && U32.is_eq(cursor, expected_cursor) && U32.is_eq(O.fault_code(fault), expected_fault)

def full_prefix(result: O.Prefix) -> Bool:
  match result:
    case O.Prefix{store, path}:
      same_moves(path, [13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0]) && state(store, 1, 32, 0)
    case O.Unreadable{store}: False{}

def short_prefix(result: O.Prefix) -> Bool:
  match result:
    case O.Prefix{store, path}: same_moves(path, [9, 0]) && state(store, 1, 2, 0)
    case O.Unreadable{store}: False{}

def no_prefix(result: O.Prefix, expected_fault: U32, expected_used: U32, expected_cursor: U32) -> Bool:
  match result:
    case O.Prefix{store, path}: False{}
    case O.Unreadable{store}: state(store, expected_used, expected_cursor, expected_fault)

def path_first(read: Array<U32> & U32, expected_used: U32, expected_cursor: U32, expected_fault: U32, used: U32, cursor: U32, fault: O.Fault) -> Bool:
  match read:
    case Tuple{path, value}:
      U32.is_eq(value, 0) && U32.is_eq(used, expected_used) && U32.is_eq(cursor, expected_cursor) && U32.is_eq(O.fault_code(fault), expected_fault)

def guarded_path(store: O.Store, expected_cursor: U32, expected_fault: U32) -> Bool:
  match store:
    case O.Store{frames, path, used, cursor, fault}:
      path_first(Array.get(U32, path, 0), 1, expected_cursor, expected_fault, used, cursor, fault)

def broken(result: O.Pop, expected_used: U32, expected_fault: U32) -> Bool:
  match result:
    case O.Broken{store}: state(store, expected_used, 0, expected_fault)
    case O.Vacant{store}: False{}
    case O.Popped{store, frame}: False{}

def show(value: Bool) -> String:
  match value:
    case True{}: "1"
    case False{}: "0"

def verdict(ok: Bool) -> IO(Unit):
  match ok:
    case True{}: IO.pure(Unit, Unit{})
    case False{}: IO.die(Unit, 2, "Owned continuation invariants failed")

def checks() -> Checks:
  Checks{
    drained(drain(64n, full(), True{})),
    capacity(O.push(frame(64), full())),
    capacity(O.reset(frame(5), O.push(frame(64), full()))),
    full_prefix(O.read_prefix(32, moves(32n, 0, O.fresh(frame(0))))),
    guarded_path(O.write_move(32, 5, moves(32n, 0, O.fresh(frame(0)))), 32, 2),
    guarded_path(O.write_move(0, 18, O.fresh(frame(0))), 0, 3),
    guarded_path(O.write_move(3, 9, O.fresh(frame(0))), 0, 4),
    short_prefix(O.read_prefix(2, O.write_move(1, 9, moves(32n, 0, O.fresh(frame(0)))))),
    no_prefix(O.read_prefix(1, O.reset(frame(5), moves(32n, 0, O.fresh(frame(0))))), 4, 1, 0),
    broken(O.pop(O.Store{[O.EmptySlot{} : O.Slot*64n], [0 : U32*32n], 1, 0, O.Healthy{}}), 0, 5),
    broken(O.pop(O.Store{[O.EmptySlot{} : O.Slot*64n], [0 : U32*32n], 65, 0, O.Healthy{}}), 65, 7),
    state(O.fresh(O.Node{C.Cubie{0, 0, 0, 0, 0}, 0, 0, 0, 31, 6, 0, S.FullCube{}, 0}), 0, 0, 6)}

def report(checks: Checks) -> IO(Unit):
  match checks:
    case Checks{+roundtrip, +frame_capacity, +sticky, +path, +path_capacity, +move_index, +gap, +rewind, +reset_prefix, +corrupt, +occupancy, +root_depth}:
      do IO<Unit>:
        IO.print("{\"roundtrip\":" ++ show(roundtrip) ++ ",\"frameCapacity\":" ++ show(frame_capacity) ++ ",\"sticky\":" ++ show(sticky) ++ ",\"path\":" ++ show(path) ++ ",\"pathCapacity\":" ++ show(path_capacity) ++ ",\"moveIndex\":" ++ show(move_index) ++ ",\"gap\":" ++ show(gap) ++ ",\"rewind\":" ++ show(rewind) ++ ",\"resetPrefix\":" ++ show(reset_prefix) ++ ",\"corrupt\":" ++ show(corrupt) ++ ",\"occupancy\":" ++ show(occupancy) ++ ",\"rootDepth\":" ++ show(root_depth) ++ "}")
        verdict(roundtrip && frame_capacity && sticky && path && path_capacity && move_index && gap && rewind && reset_prefix && corrupt && occupancy && root_depth)

def main() -> IO(Unit):
  report(checks())
