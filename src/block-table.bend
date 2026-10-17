import Base
import ./cubie.bend as C

def minimum(+a: U32, +b: U32) -> U32:
  C.pick(U32.is_lt(a, b), a, b)

def maximum(+a: U32, +b: U32) -> U32:
  C.pick(U32.is_gt(a, b), a, b)

def extrema(fuel: Nat, +word: U32, low: U32, high: U32) -> U32:
  match fuel:
    case 0n: (low .|. (high << 4n) : U32)
    case 1n+p: extrema(p, (word >> 4n : U32), minimum(low, (word .&. 15 : U32)), maximum(high, (word .&. 15 : U32)))

def squash(word: U32, base: U32) -> U32:
  +a = (word - base * 286331153 : U32)
  +b = ((a .|. (a >> 2n)) .&. 252645135 : U32)
  +c = ((b .|. (b >> 4n)) .&. 16711935 : U32)
  ((c .|. (c >> 8n)) .&. 65535 : U32)

def narrow(low: U32, high: U32, +base: U32) -> U32:
  (squash(low, base) .|. (squash(high, base) << 16n) : U32)

def value(read: Array<U32> & U32, +header: U32, +local: U32) -> Array<U32> & U32:
  match read:
    case Tuple{table, word}:
      +wide = ((header >> 4n) .&. 1 : U32)
      shift = U32.to_nat(((local * (2 + wide * 2)) % 32 : U32))
      (table, (((word >> shift) .&. (3 + wide * 12)) + (header .&. 15) : U32))

def payload_at(read: Array<U32> & U32, +base: U32, +local: U32, +blocks: U32) -> Array<U32> & U32:
  match read:
    case Tuple{table, +header}:
      wide = ((header >> 4n) .&. 1 : U32)
      at = (base + blocks + (header >> 5n) * 4 + (local * (2 + wide * 2)) / 32 : U32)
      value(table[at], header, local)

def get_at(table: Array<U32>, +base: U32, +index: U32, blocks: U32) -> Array<U32> & U32:
  payload_at(table[(base + index / 64 : U32)], base, (index % 64 : U32), blocks)

type Build is Type:
  Build{source: Array<U32>, output: Array<U32>, cursor: U32, valid: Bool}

type Scan is Type:
  Scan{source: Array<U32>, output: Array<U32>, cursor: U32, low: U32, high: U32}

def inspected(read: Array<U32> & U32, output: Array<U32>, cursor: U32, low: U32, high: U32) -> Scan:
  match read:
    case Tuple{source, word}:
      +bounds = extrema(8n, word, 15, 0)
      Scan{source, output, cursor, minimum(low, (bounds .&. 15 : U32)), maximum(high, (bounds >> 4n : U32))}

def inspect(fuel: Nat, state: Scan, +at: U32) -> Scan:
  match fuel state:
    case 1n+p Scan{source, output, cursor, low, high}: inspect(p, inspected(source[at], output, cursor, low, high), (at + 1 : U32))
    case _ state: state

def wide_word(read: Array<U32> & U32, output: Array<U32>, cursor: U32, at: U32) -> Build:
  match read:
    case Tuple{source, word}: Build{source, output[at] <- word, cursor, True{}}

def narrow_high(read: Array<U32> & U32, output: Array<U32>, cursor: U32, at: U32, low: U32, base: U32) -> Build:
  match read:
    case Tuple{source, high}: Build{source, output[at] <- narrow(low, high, base), cursor, True{}}

def narrow_low(read: Array<U32> & U32, output: Array<U32>, cursor: U32, +from: U32, at: U32, base: U32) -> Build:
  match read:
    case Tuple{source, low}: narrow_high(source[(from + 1 : U32)], output, cursor, at, low, base)

def payload_step(wide: Bool, state: Build, +from: U32, at: U32, base: U32) -> Build:
  match wide state:
    case True{} Build{source, output, cursor, valid}: wide_word(source[from], output, cursor, at)
    case False{} Build{source, output, cursor, valid}: narrow_low(source[from], output, cursor, from, at, base)

def payload(fuel: Nat, state: Build, +from: U32, +at: U32, +wide: Bool, +base: U32) -> Build:
  match fuel:
    case 0n: state
    case 1n+p: payload(p, payload_step(wide, state, from, at, base), (from + C.pick(wide, 1, 2) : U32), (at + 1 : U32), wide, base)

def advanced(state: Build, cursor: U32) -> Build:
  match state:
    case Build{source, output, old, valid}: Build{source, output, cursor, valid}

def admitted(ok: Bool, state: Scan, +blocks: U32, +block: U32, +wide: Bool, +words: U32, +base: U32) -> Build:
  match ok state:
    case False{} Scan{source, output, cursor, low, high}: Build{source, output, cursor, False{}}
    case True{} Scan{source, output, +cursor, low, high}:
      output[block] <- (((cursor / 4) << 5n) .|. C.pick(wide, 16, 0) .|. base : U32)
      advanced(payload(U32.to_nat(words), Build{source, output, cursor, True{}}, (block * 8 : U32), (blocks + cursor : U32), wide, base), (cursor + words : U32))

def prepare(state: Scan, +blocks: U32, block: U32, +capacity: U32) -> Build:
  match state:
    case Scan{source, output, +cursor, +low, +high}:
      +wide = U32.is_gt((high - low : U32), 3)
      +words = C.pick(wide, 8, 4)
      admitted(U32.is_le(high, 12) && U32.is_le((blocks + cursor + words : U32), capacity), Scan{source, output, cursor, low, high}, blocks, block, wide, words, C.pick(wide, 0, low))

def build(fuel: Nat, state: Build, +blocks: U32, +block: U32, +capacity: U32) -> Build:
  match fuel state:
    case 1n+p Build{source, output, cursor, True{}}:
      build(p, prepare(inspect(8n, Scan{source, output, cursor, 15, 0}, (block * 8 : U32)), blocks, block, capacity), blocks, (block + 1 : U32), capacity)
    case _ state: state
