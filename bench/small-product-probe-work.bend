import Base
import ../src/search.bend as S
import ../src/cubie.bend as C
import ./small-product-mapped.bend as M
import ./phase2-small-product.bend as E

type Work is Type:
  Work{records: Array<U32>, cache: M.MappedState, checksum: U32, steps: U32, mismatches: U32, at: U32}

def direct(state: M.MappedState, cube: C.Cubie, a: U32, b: U32) -> M.ProbeResult:
  match state:
    case M.MapReady{table}:
      +index = E.encode_known(cube)
      M.distance(table[index], index)
    case state: M.ProbeResult{state, Nil{}}

def mapped(state: M.MappedState, cube: C.Cubie, a: U32, b: U32) -> M.ProbeResult:
  M.probe(S.Subgroup{}, a, b, state)

def consumed(result: M.ProbeResult, records: Array<U32>, +checksum: U32, +steps: U32, +mismatches: U32, expected_index: U32, expected_value: U32) -> Work:
  match result:
    case M.ProbeResult{cache, Con{1, Con{+index, Con{+value, Nil{}}}}}:
      +sum = (checksum * 1664525 + index + value * 33 : U32)
      Work{records, cache, sum, (steps + 1 : U32), (mismatches + Bool.to_u32(U32.is_ne(index, expected_index) || U32.is_ne(value, expected_value)) : U32), (sum % 15609 : U32)}
    case M.ProbeResult{cache, packet}:
      Work{records, cache, 0, (steps + 1 : U32), (mismatches + 1 : U32), 0}

def read8(~probe: M.MappedState -> C.Cubie -> U32 -> U32 -> M.ProbeResult, read: Array<U32> & U32, +offset: U32, cache: M.MappedState, checksum: U32, steps: U32, mismatches: U32, cp: U32, co: U32, ep: U32, eh: U32, eo: U32, a: U32, b: U32, index: U32) -> Work:
  match read:
    case Tuple{records, value}:
      consumed(probe(cache, C.Cubie{cp, co, ep, eh, eo}, a, b), records, checksum, steps, mismatches, index, value)

def read7(~probe: M.MappedState -> C.Cubie -> U32 -> U32 -> M.ProbeResult, read: Array<U32> & U32, +offset: U32, cache: M.MappedState, checksum: U32, steps: U32, mismatches: U32, cp: U32, co: U32, ep: U32, eh: U32, eo: U32, a: U32, b: U32) -> Work:
  match read:
    case Tuple{records, index}:
      read8(~probe, records[(offset + 8 : U32)], offset, cache, checksum, steps, mismatches, cp, co, ep, eh, eo, a, b, index)

def read6(~probe: M.MappedState -> C.Cubie -> U32 -> U32 -> M.ProbeResult, read: Array<U32> & U32, +offset: U32, cache: M.MappedState, checksum: U32, steps: U32, mismatches: U32, cp: U32, co: U32, ep: U32, eh: U32, eo: U32, a: U32) -> Work:
  match read:
    case Tuple{records, b}:
      read7(~probe, records[(offset + 7 : U32)], offset, cache, checksum, steps, mismatches, cp, co, ep, eh, eo, a, b)

def read5(~probe: M.MappedState -> C.Cubie -> U32 -> U32 -> M.ProbeResult, read: Array<U32> & U32, +offset: U32, cache: M.MappedState, checksum: U32, steps: U32, mismatches: U32, cp: U32, co: U32, ep: U32, eh: U32, eo: U32) -> Work:
  match read:
    case Tuple{records, a}:
      read6(~probe, records[(offset + 6 : U32)], offset, cache, checksum, steps, mismatches, cp, co, ep, eh, eo, a)

def read4(~probe: M.MappedState -> C.Cubie -> U32 -> U32 -> M.ProbeResult, read: Array<U32> & U32, +offset: U32, cache: M.MappedState, checksum: U32, steps: U32, mismatches: U32, cp: U32, co: U32, ep: U32, eh: U32) -> Work:
  match read:
    case Tuple{records, eo}:
      read5(~probe, records[(offset + 5 : U32)], offset, cache, checksum, steps, mismatches, cp, co, ep, eh, eo)

def read3(~probe: M.MappedState -> C.Cubie -> U32 -> U32 -> M.ProbeResult, read: Array<U32> & U32, +offset: U32, cache: M.MappedState, checksum: U32, steps: U32, mismatches: U32, cp: U32, co: U32, ep: U32) -> Work:
  match read:
    case Tuple{records, eh}:
      read4(~probe, records[(offset + 4 : U32)], offset, cache, checksum, steps, mismatches, cp, co, ep, eh)

def read2(~probe: M.MappedState -> C.Cubie -> U32 -> U32 -> M.ProbeResult, read: Array<U32> & U32, +offset: U32, cache: M.MappedState, checksum: U32, steps: U32, mismatches: U32, cp: U32, co: U32) -> Work:
  match read:
    case Tuple{records, ep}:
      read3(~probe, records[(offset + 3 : U32)], offset, cache, checksum, steps, mismatches, cp, co, ep)

def read1(~probe: M.MappedState -> C.Cubie -> U32 -> U32 -> M.ProbeResult, read: Array<U32> & U32, +offset: U32, cache: M.MappedState, checksum: U32, steps: U32, mismatches: U32, cp: U32) -> Work:
  match read:
    case Tuple{records, co}:
      read2(~probe, records[(offset + 2 : U32)], offset, cache, checksum, steps, mismatches, cp, co)

def read0(~probe: M.MappedState -> C.Cubie -> U32 -> U32 -> M.ProbeResult, read: Array<U32> & U32, +offset: U32, cache: M.MappedState, checksum: U32, steps: U32, mismatches: U32) -> Work:
  match read:
    case Tuple{records, cp}:
      read1(~probe, records[(offset + 1 : U32)], offset, cache, checksum, steps, mismatches, cp)

def step(~probe: M.MappedState -> C.Cubie -> U32 -> U32 -> M.ProbeResult, state: Work) -> Work:
  match state:
    case Work{records, cache, checksum, steps, mismatches, at}:
      +offset = (at * 9 : U32)
      read0(~probe, records[offset], offset, cache, checksum, steps, mismatches)

def run(~probe: M.MappedState -> C.Cubie -> U32 -> U32 -> M.ProbeResult, fuel: Nat, state: Work) -> Work:
  match fuel:
    case 0n: state
    case 1n+rest: run(~probe, rest, step(~probe, state))

def calculate(mode: U32, fuel: Nat, +seed: U32, records: Array<U32>, cache: M.MappedState) -> Work:
  match mode:
    case 0: run(~direct, fuel, Work{records, cache, seed, 0, 0, (seed % 15609 : U32)})
    case _: run(~mapped, fuel, Work{records, cache, seed, 0, 0, (seed % 15609 : U32)})
