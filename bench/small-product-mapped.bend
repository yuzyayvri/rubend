import Base
import ../src/search.bend as S
import ../src/coordinates.bend as Q
import ../src/cubie.bend as C
import ./phase2-projection.bend as P
import ./phase2-small-product.bend as E

type MappedState is Type:
  MapReady{table: Array<U32>}
  MapRefused{table: Array<U32>}

type ProbeResult is Type:
  ProbeResult{state: MappedState, packet: +List<U32>}

type MapDigest is Type:
  MapDigest{state: MappedState, checksum: U32, entries: U32}

def fill(fuel: Nat, +rank: U32, table: Array<U32>) -> Array<U32>:
  match fuel:
    case 0n: table
    case 1n+rest:
      +word = Q.unrank8(rank)
      table[(262144 + rank : U32)] <- P.corner_index(word)
      table[(327680 + rank : U32)] <- E.edge_index(C.Cubie{1985229328, 0, word, 47768, 0})
      fill(rest, (rank + 1 : U32), table)

def admitted(ok: Bool, table: Array<U32>) -> MappedState:
  match ok:
    case True{}: MapReady{fill(40320n, 0, table)}
    case False{}: MapRefused{table}

def sized(read: Array<U32> & U32) -> MappedState:
  match read:
    case Tuple{table, size}: admitted(U32.is_eq(size, 524288), table)

def prepare(table: Array<U32>) -> MappedState:
  sized(Array.size(U32, table))

def supported(goal: S.Goal) -> Bool:
  match goal:
    case S.Subgroup{}: True{}
    case _: False{}

def known_distance(ok: Bool, table: Array<U32>, index: U32, value: U32) -> ProbeResult:
  match ok:
    case True{}: ProbeResult{MapReady{table}, [1, index, value]}
    case False{}: ProbeResult{MapReady{table}, Nil{}}

def distance(read: Array<U32> & U32, index: U32) -> ProbeResult:
  match read:
    case Tuple{table, +value}: known_distance(U32.is_le(value, 10), table, index, value)

def index_checked(ok: Bool, table: Array<U32>, corners: U32, edges: U32) -> ProbeResult:
  match ok:
    case True{}:
      +index = (edges * 140 + corners : U32)
      distance(table[index], index)
    case False{}: ProbeResult{MapReady{table}, Nil{}}

def edges(read: Array<U32> & U32, +corners: U32) -> ProbeResult:
  match read:
    case Tuple{table, +value}: index_checked(U32.is_lt(corners, 140) && U32.is_lt(value, 1680), table, corners, value)

def corners(read: Array<U32> & U32, b: U32) -> ProbeResult:
  match read:
    case Tuple{table, value}: edges(table[(327680 + b : U32)], value)

def probe_allowed(ok: Bool, state: MappedState, a: U32, b: U32) -> ProbeResult:
  match ok state:
    case True{} MapReady{table}: corners(table[(262144 + a : U32)], b)
    case _ state: ProbeResult{state, Nil{}}

def probe(+goal: S.Goal, +a: U32, +b: U32, state: MappedState) -> ProbeResult:
  probe_allowed(supported(goal) && U32.is_lt(a, 40320) && U32.is_lt(b, 40320), state, a, b)

def test_probe(code: U32, a: U32, b: U32, state: MappedState) -> ProbeResult:
  match code:
    case 1: probe(S.Subgroup{}, a, b, state)
    case 0: probe(S.Reduction{}, a, b, state)
    case _: probe(S.FullCube{}, a, b, state)

def test_ready() -> MappedState:
  prepare([255 : U32^19n])

def test_bad_size() -> MappedState:
  prepare([0 : U32^0n])

def digest_read(read: Array<U32> & U32, +checksum: U32, +index: U32) -> MapDigest:
  match read:
    case Tuple{table, value}: MapDigest{MapReady{table}, (checksum * 33 + value + index : U32), (index + 1 : U32)}

def digest(fuel: Nat, +index: U32, state: MapDigest) -> MapDigest:
  match fuel state:
    case 0n state: state
    case 1n+rest MapDigest{MapReady{table}, checksum, entries}:
      +at = C.pick(U32.is_lt(index, 40320), (262144 + index : U32), (327680 + index - 40320 : U32))
      digest(rest, (index + 1 : U32), digest_read(table[at], checksum, index))
    case _ state: state

def test_digest(state: MappedState, seed: U32) -> MapDigest:
  digest(80640n, 0, MapDigest{state, seed, 0})
