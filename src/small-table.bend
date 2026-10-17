import Base

type Packing is Type:
  Working{source: Array<U32>, packed: Array<U32>}
  Rejected{}

def initialize_bounds(fuel: Nat, +at: U32, packed: Array<U32>) -> Array<U32>:
  match fuel:
    case 0n: packed[949850] <- 1048575
    case 1n+p:
      packed[at] <- 4294967295
      initialize_bounds(p, (at + 1 : U32), packed)

def fresh() -> Array<U32>:
  initialize_bounds(503960n, 445890, [0 : U32^20n])

def transition_value(read: Array<U32> & U32, +index: U32) -> Array<U32> & U32:
  match read:
    case Tuple{table, word}: (table, ((word >> U32.to_nat((index % 2 * 16 : U32))) .&. 65535 : U32))

def transition(table: Array<U32>, +index: U32) -> Array<U32> & U32:
  transition_value(table[(index / 2 : U32)], index)

def bound_value(read: Array<U32> & U32, index: U32) -> Array<U32> & U32:
  match read:
    case Tuple{table, word}: (table, ((word >> U32.to_nat((index % 8 * 4 : U32))) .&. 15 : U32))

def bound(table: Array<U32>, index: U32) -> Array<U32> & U32:
  +offset = (index - 891780 : U32)
  bound_value(table[(445890 + offset / 8 : U32)], offset)

def replaced(read: Array<U32> & U32, at: U32, value: U32, shift: Nat, mask: U32) -> Array<U32>:
  match read:
    case Tuple{packed, word}: packed[at] <- ((word .&. (mask .^. 4294967295 : U32)) .|. (value << shift : U32) : U32)

def set_allowed(ok: Bool, packed: Array<U32>, +at: U32, value: U32, shift: Nat, mask: U32) -> Array<U32>:
  match ok:
    case True{}: replaced(packed[at], at, value, shift, mask)
    case False{}: [0 : U32^0n]

def set_sized(read: Array<U32> & U32, okay: Bool, at: U32, value: U32, shift: Nat, mask: U32) -> Array<U32>:
  match read:
    case Tuple{packed, size}: set_allowed(okay && U32.is_eq(size, 1048576), packed, at, value, shift, mask)

def set_transition(packed: Array<U32>, +index: U32, +value: U32) -> Array<U32>:
  +shift = U32.to_nat((index % 2 * 16 : U32))
  set_sized(Array.size(U32, packed), U32.is_lt(index, 891780) && U32.is_le(value, 65535), (index / 2 : U32), value, shift, (65535 << shift : U32))

def set_bound(packed: Array<U32>, +index: U32, +value: U32) -> Array<U32>:
  +offset = (index - 891780 : U32)
  +shift = U32.to_nat((offset % 8 * 4 : U32))
  set_sized(Array.size(U32, packed), U32.is_ge(index, 891780) && U32.is_lt(index, 4923465) && U32.is_le(value, 15), (445890 + offset / 8 : U32), value, shift, (15 << shift : U32))

def store(read: Array<U32> & U32, source: Array<U32>, at: U32, value: U32, shift: Nat) -> Packing:
  match read:
    case Tuple{packed, word}:
      packed[at] <- (word .|. (value << shift : U32) : U32)
      Working{source, packed}

def accepted(ok: Bool, source: Array<U32>, packed: Array<U32>, +at: U32, value: U32, shift: Nat) -> Packing:
  match ok:
    case True{}: store(packed[at], source, at, value, shift)
    case False{}: Rejected{}

def pack_transition(read: Array<U32> & U32, packed: Array<U32>, +index: U32) -> Packing:
  match read:
    case Tuple{source, +value}: accepted(U32.is_le(value, 65535), source, packed, (index / 2 : U32), value, U32.to_nat((index % 2 * 16 : U32)))

def pack_bound(read: Array<U32> & U32, packed: Array<U32>, +index: U32) -> Packing:
  match read:
    case Tuple{source, +value}: accepted(U32.is_le(value, 15), source, packed, (445890 + index / 8 : U32), value, U32.to_nat((index % 8 * 4 : U32)))

def transitions(fuel: Nat, +index: U32, state: Packing) -> Packing:
  match fuel state:
    case 1n+p Working{source, packed}: transitions(p, (index + 1 : U32), pack_transition(source[index], packed, index))
    case _ state: state

def bounds(fuel: Nat, +index: U32, state: Packing) -> Packing:
  match fuel state:
    case 1n+p Working{source, packed}: bounds(p, (index + 1 : U32), pack_bound(source[(891780 + index : U32)], packed, index))
    case _ state: state

def finish(state: Packing) -> Array<U32>:
  match state:
    case Working{source, packed}: packed
    case Rejected{}: [0 : U32^0n]

def geometry(accepted: Bool, source: Array<U32>) -> Array<U32>:
  match accepted:
    case True{}: finish(bounds(4031685n, 0, transitions(891780n, 0, Working{source, [0 : U32^20n]})))
    case False{}: [0 : U32^0n]

def sized(read: Array<U32> & U32) -> Array<U32>:
  match read:
    case Tuple{source, size}: geometry(U32.is_eq(size, 8388608), source)

def prepare(source: Array<U32>) -> Array<U32>:
  sized(Array.size(U32, source))
