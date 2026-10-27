import Base
import ../src/cubie.bend as C

type Layout is Data:
  One{}
  Two{}
  Three{}

type Packed is Type:
  CodecRefused{}
  CodecReady{codes: Array<U32>, fallback: Array<U32>, size: U32, base: U32}

type Writing is Type:
  Writing{reference: Array<U32>, codes: Array<U32>, fallback: Array<U32>, low: U32, valid: Bool}

def size(layout: Layout) -> U32:
  match layout:
    case One{}: 24
    case Two{}: 528
    case Three{}: 10560

def capacity(layout: Layout) -> U32:
  match layout:
    case One{}: 32
    case Two{}: 1024
    case Three{}: 16384

def reference_array(layout: Layout) -> Array<U32>:
  match layout:
    case One{}: [255 : U32^5n]
    case Two{}: [255 : U32^10n]
    case Three{}: [255 : U32^14n]

def code_array(layout: Layout) -> Array<U32>:
  match layout:
    case One{}: [0 : U32^1n]
    case Two{}: [0 : U32^6n]
    case Three{}: [0 : U32^10n]

def fallback_array(layout: Layout) -> Array<U32>:
  match layout:
    case One{}: [0 : U32^0n]
    case Two{}: [0 : U32^4n]
    case Three{}: [0 : U32^8n]

def quantized(low: Bool, +value: U32, +base: U32) -> U32:
  match low:
    case True{}: 0
    case False{}:
      +diff = (value - base : U32)
      C.pick(U32.is_gt(diff, 3), 3, diff)

def code(+value: U32, +base: U32) -> U32:
  quantized(U32.is_le(value, base), value, base)

def block_finished(last: Bool, reference: Array<U32>, codes: Array<U32>, fallback: Array<U32>, +low: U32, valid: Bool, index: U32) -> Writing:
  match last:
    case False{}: Writing{reference, codes, fallback, low, valid}
    case True{}:
      fallback[(index / 64 : U32)] <- low
      Writing{reference, codes, fallback, 255, valid}

def wrote_code(read: Array<U32> & U32, reference: Array<U32>, fallback: Array<U32>, +index: U32, value: U32, base: U32, low: U32, valid: Bool, size: U32) -> Writing:
  match read:
    case Tuple{codes, word}:
      codes[(index / 16 : U32)] <- (word .|. (code(value, base) << U32.to_nat((index % 16 * 2 : U32))) : U32)
      block_finished(U32.is_eq((index % 64 : U32), 63) || U32.is_eq((index + 1 : U32), size), reference, codes, fallback, low, valid, index)

def read_reference(read: Array<U32> & U32, codes: Array<U32>, fallback: Array<U32>, +index: U32, base: U32, +low: U32, valid: Bool, size: U32) -> Writing:
  match read:
    case Tuple{reference, +value}:
      wrote_code(codes[(index / 16 : U32)], reference, fallback, index, value, base, C.pick(U32.is_lt(value, low), value, low), valid && U32.is_lt(value, 255), size)

def write(fuel: Nat, state: Writing, +index: U32, +base: U32, +size: U32) -> Writing:
  match fuel state:
    case 0n state: state
    case 1n+rest Writing{reference, codes, fallback, low, valid}:
      write(rest, read_reference(reference[index], codes, fallback, index, base, low, valid, size), (index + 1 : U32), base, size)

def finished(state: Writing, size: U32, base: U32) -> Packed:
  match state:
    case Writing{reference, codes, fallback, low, True{}}: CodecReady{codes, fallback, size, base}
    case _: CodecRefused{}

def admitted(ok: Bool, reference: Array<U32>, +layout: Layout, +base: U32) -> Packed:
  match ok:
    case False{}: CodecRefused{}
    case True{}:
      finished(write(U32.to_nat(size(layout)), Writing{reference, code_array(layout), fallback_array(layout), 255, True{}}, 0, base, size(layout)), size(layout), base)

def source_size(read: Array<U32> & U32, +layout: Layout, +base: U32) -> Packed:
  match read:
    case Tuple{reference, slots}:
      admitted(U32.is_eq(slots, capacity(layout)) && U32.is_le(base, 252), reference, layout, base)

def prepare(layout: Layout, base: U32, reference: Array<U32>) -> Packed:
  source_size(Array.size(U32, reference), layout, base)

def decoded(code: U32, base: U32, fallback: U32) -> U32:
  match code:
    case 0: fallback
    case code: (base + code : U32)

def read_fallback(read: Array<U32> & U32, codes: Array<U32>, +size: U32, +base: U32, value: U32) -> Packed & +List<U32>:
  match read:
    case Tuple{fallback, low}: (CodecReady{codes, fallback, size, base}, [1, decoded(value, base, low)])

def read_code(read: Array<U32> & U32, fallback: Array<U32>, size: U32, base: U32, +index: U32) -> Packed & +List<U32>:
  match read:
    case Tuple{codes, word}:
      read_fallback(fallback[(index / 64 : U32)], codes, size, base, ((word >> U32.to_nat((index % 16 * 2 : U32))) .&. 3 : U32))

def indexed(ok: Bool, state: Packed, +index: U32) -> Packed & +List<U32>:
  match ok state:
    case True{} CodecReady{codes, fallback, size, base}: read_code(codes[(index / 16 : U32)], fallback, size, base, index)
    case _ state: (state, Nil{})

def get(state: Packed, +index: U32) -> Packed & +List<U32>:
  match state:
    case CodecReady{codes, fallback, +size, base}: indexed(U32.is_lt(index, size), CodecReady{codes, fallback, size, base}, index)
    case state: (state, Nil{})

def sum_one(read: Packed & +List<U32>, checksum: U32) -> Packed & U32:
  match read:
    case Tuple{state, Con{1, Con{value, Nil{}}}}: (state, (checksum * 33 + value : U32))
    case Tuple{state, _}: (state, 4294967295)

def checksum(fuel: Nat, result: Packed & U32, +index: U32) -> U32:
  match fuel result:
    case 0n Tuple{state, value}: value
    case 1n+rest Tuple{state, value}: checksum(rest, sum_one(get(state, index), value), (index + 1 : U32))

def synthetic_reference(fuel: Nat, reference: Array<U32>, +index: U32) -> Array<U32>:
  match fuel:
    case 0n: reference
    case 1n+rest:
      reference[index] <- ((index * 5 + index / 64) % 7 : U32)
      synthetic_reference(rest, reference, (index + 1 : U32))

def synthetic(+layout: Layout, base: U32, seed: U32) -> U32:
  reference = synthetic_reference(U32.to_nat(size(layout)), reference_array(layout), 0)
  checksum(U32.to_nat(size(layout)), (prepare(layout, base, reference), seed), 0)
