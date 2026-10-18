import Base
import ./cubie.bend as C

type Table is Type:
  RawSegments{prefix: Array<U32>, lower: Array<U32>, upper: Array<U32>}

type Slot is Data:
  PrefixSlot{offset: U32}
  LowerSlot{offset: U32}
  UpperSlot{offset: U32}

def logical_words() -> U32:
  285525248

def physical_words() -> U32:
  293601280

def raw_slot(lower: Bool, +index: U32) -> Slot:
  match lower:
    case True{}: LowerSlot{index}
    case False{}: UpperSlot{(index - 268435456 : U32)}

def slot_region(prefix: Bool, +index: U32) -> Slot:
  match prefix:
    case True{}: PrefixSlot{index}
    case False{}: raw_slot(U32.is_lt((index - 8388608 : U32), 268435456), (index - 8388608 : U32))

def slot(+index: U32) -> Slot:
  slot_region(U32.is_lt(index, 8388608), index)

def parsed(ok: Bool, index: U32) -> Maybe<&2, Slot>:
  match ok:
    case True{}: Some{slot(index)}
    case False{}: None{}

def parse(+index: U32) -> Maybe<&2, Slot>:
  parsed(U32.is_lt(index, logical_words()), index)

def prefix_read(read: Array<U32> & U32, lower: Array<U32>, upper: Array<U32>) -> Table & U32:
  match read:
    case Tuple{prefix, word}: (RawSegments{prefix, lower, upper}, word)

def lower_read(read: Array<U32> & U32, prefix: Array<U32>, upper: Array<U32>) -> Table & U32:
  match read:
    case Tuple{lower, word}: (RawSegments{prefix, lower, upper}, word)

def upper_read(read: Array<U32> & U32, prefix: Array<U32>, lower: Array<U32>) -> Table & U32:
  match read:
    case Tuple{upper, word}: (RawSegments{prefix, lower, upper}, word)

def read_slot(table: Table, at: Slot) -> Table & U32:
  match table at:
    case RawSegments{prefix, lower, upper} PrefixSlot{offset}: prefix_read(prefix[offset], lower, upper)
    case RawSegments{prefix, lower, upper} LowerSlot{offset}: lower_read(lower[offset], prefix, upper)
    case RawSegments{prefix, lower, upper} UpperSlot{offset}: upper_read(upper[offset], prefix, lower)

def raw_read(lower_region: Bool, prefix: Array<U32>, lower: Array<U32>, upper: Array<U32>, +index: U32) -> Table & U32:
  match lower_region:
    case True{}: lower_read(lower[index], prefix, upper)
    case False{}: upper_read(upper[(index - 268435456 : U32)], prefix, lower)

def get_region(prefix_region: Bool, table: Table, +index: U32) -> Table & U32:
  match prefix_region table:
    case True{} RawSegments{prefix, lower, upper}: prefix_read(prefix[index], lower, upper)
    case False{} RawSegments{prefix, lower, upper}: raw_read(U32.is_lt((index - 8388608 : U32), 268435456), prefix, lower, upper, (index - 8388608 : U32))

def get(table: Table, +index: U32) -> Table & U32:
  get_region(U32.is_lt(index, 8388608), table, index)

def upper_size(read: Array<U32> & U32, prefix: Array<U32>, lower: Array<U32>, valid: Bool) -> Table & U32:
  match read:
    case Tuple{upper, words}: (RawSegments{prefix, lower, upper}, C.pick(valid && U32.is_eq(words, 16777216), physical_words(), 0))

def lower_size(read: Array<U32> & U32, prefix: Array<U32>, valid: Bool, upper: Array<U32>) -> Table & U32:
  match read:
    case Tuple{lower, words}: upper_size(Array.size(U32, upper), prefix, lower, valid && U32.is_eq(words, 268435456))

def prefix_size(read: Array<U32> & U32, lower: Array<U32>, upper: Array<U32>) -> Table & U32:
  match read:
    case Tuple{prefix, words}: lower_size(Array.size(U32, lower), prefix, U32.is_eq(words, 8388608), upper)

def size(table: Table) -> Table & U32:
  match table:
    case RawSegments{prefix, lower, upper}: prefix_size(Array.size(U32, prefix), lower, upper)

type Digest is Type:
  SegmentDigest{table: Table, hash: U32}

def hashed(read: Table & U32, hash: U32, index: U32) -> Digest:
  match read:
    case Tuple{table, word}: SegmentDigest{table, ((hash * 16777619) .^. word .^. index : U32)}

def fingerprint(fuel: Nat, state: Digest, +index: U32) -> Digest:
  match fuel state:
    case 1n+p SegmentDigest{table, hash}: fingerprint(p, hashed(get(table, (8388608 + index : U32)), hash, index), (index + 1 : U32))
    case _ state: state
