import Base
import ../src/cubie.bend as C
import ../src/search.bend as S

type Frame is Data:
  Node{cube: C.Cubie, a: U32, b: U32, c: U32, left: U32, previous: U32, next: U32, phase: S.Goal, length: U32}
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

def fault_code(fault: Fault) -> U32:
  match fault:
    case Healthy{}: 0
    case FrameCapacity{}: 1
    case PathCapacity{}: 2
    case InvalidMove{}: 3
    case InvalidPrefix{}: 4
    case CorruptSlot{}: 5
    case InvalidRoot{}: 6
    case InvalidOccupancy{}: 7

def frame_length(frame: Frame) -> U32:
  match frame:
    case Node{cube, a, b, c, left, previous, next, phase, length}: length
    case Retry{cube, a, b, c, depth, previous, length}: length

def root_valid(frame: Frame) -> Bool:
  match frame:
    case Node{cube, a, b, c, left, previous, next, phase, length}:
      U32.is_le(left, 30) && U32.is_eq(next, 0) && U32.is_eq(length, 0)
    case _: False{}

def failed(store: Store, fault: Fault) -> Store:
  match store:
    case Store{frames, path, used, cursor, Healthy{}}: Store{frames, path, used, cursor, fault}
    case Store{frames, path, used, cursor, old}: Store{frames, path, used, cursor, old}

def push_length(allowed: Bool, frame: Frame, store: Store) -> Store:
  match allowed store:
    case True{} Store{frames, path, +used, cursor, fault}:
      Store{Array.set(Slot, frames, used, Held{frame}), path, (used + 1 : U32), cursor, fault}
    case False{} store: failed(store, InvalidPrefix{})

def push_room(allowed: Bool, +frame: Frame, store: Store) -> Store:
  match allowed store:
    case True{} Store{frames, path, used, +cursor, fault}:
      +length = frame_length(frame)
      push_length(U32.is_le(length, 32) && U32.is_le(length, cursor), frame, Store{frames, path, used, cursor, fault})
    case False{} store: failed(store, FrameCapacity{})

def push(frame: Frame, store: Store) -> Store:
  match store:
    case Store{frames, path, +used, cursor, Healthy{}}:
      push_room(U32.is_lt(used, 64), frame, Store{frames, path, used, cursor, Healthy{}})
    case store: store

def reset_valid(allowed: Bool, frame: Frame, store: Store) -> Store:
  match allowed store:
    case True{} Store{frames, path, used, cursor, fault}:
      push(frame, Store{frames, path, 0, 0, fault})
    case False{} store: failed(store, InvalidRoot{})

def reset(+frame: Frame, store: Store) -> Store:
  match store:
    case Store{frames, path, used, cursor, Healthy{}}:
      reset_valid(root_valid(frame), frame, Store{frames, path, used, cursor, Healthy{}})
    case store: store

def fresh(frame: Frame) -> Store:
  reset(frame, Store{[EmptySlot{} : Slot*64n], [0 : U32*32n], 0, 0, Healthy{}})

def move_allowed(allowed: Bool, +index: U32, move: U32, store: Store) -> Store:
  match allowed store:
    case True{} Store{frames, path, used, cursor, fault}:
      Store{frames, Array.set(U32, path, index, move), used, (index + 1 : U32), fault}
    case False{} store: failed(store, InvalidMove{})

def move_prefix(allowed: Bool, index: U32, +move: U32, store: Store) -> Store:
  match allowed:
    case True{}: move_allowed(U32.is_lt(move, 18), index, move, store)
    case False{}: failed(store, InvalidPrefix{})

def move_room(allowed: Bool, +index: U32, move: U32, store: Store) -> Store:
  match allowed store:
    case True{} Store{frames, path, used, +cursor, fault}:
      move_prefix(U32.is_le(index, cursor), index, move, Store{frames, path, used, cursor, fault})
    case False{} store: failed(store, PathCapacity{})

def write_move(+index: U32, move: U32, store: Store) -> Store:
  match store:
    case Store{frames, path, used, cursor, Healthy{}}:
      move_room(U32.is_lt(index, 32), index, move, Store{frames, path, used, cursor, Healthy{}})
    case store: store

def pop_prefix(allowed: Bool, frame: Frame, store: Store) -> Pop:
  match allowed:
    case True{}: Popped{store, frame}
    case False{}: Broken{failed(store, InvalidPrefix{})}

def pop_slot(slot: Slot, store: Store) -> Pop:
  match slot store:
    case Held{+frame} Store{frames, path, used, +cursor, fault}:
      +length = frame_length(frame)
      pop_prefix(U32.is_le(length, 32) && U32.is_le(length, cursor), frame, Store{frames, path, used, cursor, fault})
    case EmptySlot{} store: Broken{failed(store, CorruptSlot{})}

def pop_read(read: Array<Slot> & Slot, path: Array<U32>, used: U32, cursor: U32, fault: Fault) -> Pop:
  match read:
    case Tuple{frames, slot}: pop_slot(slot, Store{frames, path, used, cursor, fault})

def pop_room(allowed: Bool, store: Store) -> Pop:
  match allowed store:
    case True{} Store{frames, path, used, cursor, fault}:
      +index = (used - 1 : U32)
      pop_read(Array.swap(Slot, frames, index, EmptySlot{}), path, index, cursor, fault)
    case False{} store: Broken{failed(store, InvalidOccupancy{})}

def pop(store: Store) -> Pop:
  match store:
    case Store{frames, path, 0, cursor, Healthy{}}: Vacant{Store{frames, path, 0, cursor, Healthy{}}}
    case Store{frames, path, +used, cursor, Healthy{}}:
      pop_room(U32.is_le(used, 64), Store{frames, path, used, cursor, Healthy{}})
    case store: Broken{store}

def prefix_cell(read: Array<U32> & U32, next: Array<U32> -> U32 -> Prefix) -> Prefix:
  match read:
    case Tuple{path, value}: next(path, value)

def prefix_loop(fuel: Nat, +index: U32, store: Store, acc: +List<U32>) -> Prefix:
  match fuel store:
    case 0n store: Prefix{store, acc}
    case 1n+p Store{frames, path, used, cursor, fault}:
      prefix_cell(Array.get(U32, path, index), path => value => prefix_loop(p, (index + 1 : U32), Store{frames, path, used, cursor, fault}, value <> acc))

def prefix_valid(allowed: Bool, length: U32, store: Store) -> Prefix:
  match allowed:
    case True{}: prefix_loop(U32.to_nat(length), 0, store, Nil{})
    case False{}: Unreadable{failed(store, InvalidPrefix{})}

def read_prefix(+length: U32, store: Store) -> Prefix:
  match store:
    case Store{frames, path, used, +cursor, Healthy{}}:
      prefix_valid(U32.is_le(length, 32) && U32.is_le(length, cursor), length, Store{frames, path, used, cursor, Healthy{}})
    case store: Unreadable{store}
