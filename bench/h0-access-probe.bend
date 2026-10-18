import Base
import ../src/h0-table.bend as B
import ../src/h0-meta.bend as M
import ../src/cubie.bend as C

type Probe is Type:
  H0Probe{meta: Array<U32>, data: Array<U32>, seed: U32, checksum: U32, known: U32, reads: U32}

def depth_read(read: Array<U32> & U32, meta: Array<U32>, seed: U32, +checksum: U32, +known: U32, +reads: U32) -> Probe:
  match read:
    case Tuple{data, +depth}: H0Probe{meta, data, seed, (checksum + depth : U32), (known + C.pick(U32.is_lt(depth, 255), 1, 0) : U32), (reads + 1 : U32)}

def target_read(read: Array<U32> & U32, data: Array<U32>, seed: U32, +checksum: U32, known: U32, reads: U32) -> Probe:
  match read:
    case Tuple{meta, +target}: depth_read(B.get(data, target), meta, seed, (checksum + target : U32), known, reads)

def moves(fuel: Nat, +move: U32, +index: U32, state: Probe) -> Probe:
  match fuel state:
    case 1n+p H0Probe{meta, data, seed, checksum, known, reads}: moves(p, (move + 1 : U32), index, target_read(B.neighbor(meta, (index / 34650 : U32), (index % 34650 : U32), move), data, seed, checksum, known, reads))
    case _ state: state

def sym_target(read: Array<U32> & U32, data: Array<U32>, seed: U32, checksum: U32, known: U32, reads: U32, +index: U32) -> Probe:
  match read:
    case Tuple{meta, edge}: target_read((meta, (index / 34650 * 34650 + edge : U32)), data, seed, checksum, known, reads)

def sym_selected(enabled: Bool, sym: U32, +index: U32, state: Probe) -> Probe:
  match enabled state:
    case True{} H0Probe{meta, data, seed, checksum, known, reads}: sym_target(meta[(M.edge_symmetries() + index % 34650 * 48 + sym : U32)], data, seed, checksum, known, reads, index)
    case _ state: state

def syms(fuel: Nat, +sym: U32, +lo: U32, +hi: U32, +index: U32, state: Probe) -> Probe:
  match fuel state:
    case 1n+p H0Probe{meta, data, seed, checksum, known, reads}: syms(p, (sym + 1 : U32), lo, hi, index, sym_selected(B.has(lo, hi, sym), sym, index, H0Probe{meta, data, seed, checksum, known, reads}))
    case _ state: state

def mask_hi(read: Array<U32> & U32, data: Array<U32>, seed: U32, checksum: U32, known: U32, reads: U32, index: U32, lo: U32) -> Probe:
  match read:
    case Tuple{meta, hi}: syms(47n, 1, lo, hi, index, H0Probe{meta, data, seed, checksum, known, reads})

def mask_lo(read: Array<U32> & U32, data: Array<U32>, seed: U32, checksum: U32, known: U32, reads: U32, +index: U32) -> Probe:
  match read:
    case Tuple{meta, lo}: mask_hi(meta[(M.stabilizers_hi() + index / 34650 : U32)], data, seed, checksum, known, reads, index, lo)

def orbits(+index: U32, state: Probe) -> Probe:
  match state:
    case H0Probe{meta, data, seed, checksum, known, reads}: mask_lo(meta[(M.stabilizers_lo() + index / 34650 : U32)], data, seed, checksum, known, reads, index)

def step(+seed: U32, meta: Array<U32>, data: Array<U32>, checksum: U32, known: U32, reads: U32) -> Probe:
  orbits((seed % 117567450 : U32), moves(18n, 0, (seed % 117567450 : U32), H0Probe{meta, data, seed, checksum, known, reads}))

def run(fuel: Nat, state: Probe) -> Probe:
  match fuel state:
    case 1n+p H0Probe{meta, data, +seed, checksum, known, reads}: run(p, step((seed * 1664525 + 1013904223 : U32), meta, data, checksum, known, reads))
    case _ state: state
