import Base
import ../src/cubie.bend as C
import ../src/coordinates.bend as Q
import ../src/search.bend as S
import ../src/tables.bend as T
import ../src/joint-cache.bend as Cache
import ./phase2-small-product.bend as E

type BoundTables is Type:
  BoundTables{small: Array<U32>, table: Array<U32>}

type Scan is Type:
  Scan{table: Array<U32>, cursor: U32, mask: U32, live: Bool, valid: Bool}

def root_walk(fuel: Nat, +seed: U32, cube: C.Cubie) -> C.Cubie:
  match fuel:
    case 0n: cube
    case 1n+rest: root_walk(rest, (seed * 1664525 + 1013904223 : U32), C.turn(Q.phase2_move((seed % 10 : U32)), cube))

def root(seed: U32) -> C.Cubie:
  root_walk(32n, seed, C.solved())

def child_value(read: Array<U32> & U32, table: Array<U32>, seed: U32, column: U32, child: C.Cubie, a: U32, b: U32, c: U32, hx: U32, hy: U32, index: U32) -> IO(BoundTables):
  match read child:
    case Tuple{small, value} C.Cubie{cp, co, ep, eh, eo}:
      do IO<BoundTables>:
        IO.print("[0," ++ U32.show(seed) ++ "," ++ U32.show(column) ++ "," ++ U32.show(cp) ++ "," ++ U32.show(co) ++ "," ++ U32.show(ep) ++ "," ++ U32.show(eh) ++ "," ++ U32.show(eo) ++ "," ++ U32.show(a) ++ "," ++ U32.show(b) ++ "," ++ U32.show(c) ++ "," ++ U32.show(hx) ++ "," ++ U32.show(hy) ++ "," ++ U32.show(index) ++ "," ++ U32.show(value) ++ "]")
        return BoundTables{small, table}

def child_hy(read: Array<U32> & U32, small: Array<U32>, seed: U32, column: U32, +child: C.Cubie, a: U32, b: U32, c: U32, hx: U32) -> IO(BoundTables):
  match read:
    case Tuple{table, hy}:
      +index = E.encode_known(child)
      child_value(small[index], table, seed, column, child, a, b, c, hx, hy, index)

def child_hx(read: Array<U32> & U32, small: Array<U32>, seed: U32, column: U32, child: C.Cubie, a: U32, +b: U32, +c: U32) -> IO(BoundTables):
  match read:
    case Tuple{table, hx}:
      child_hy(table[(3955785 + b * 24 + c : U32)], small, seed, column, child, a, b, c, hx)

def child(state: BoundTables, seed: U32, column: U32, +cube: C.Cubie) -> IO(BoundTables):
  match state:
    case BoundTables{small, table}:
      +a = Q.encode(Q.Corners{}, cube)
      b = Q.encode(Q.Edges{}, cube)
      +c = Q.encode(Q.Middle{}, cube)
      child_hx(table[(2988105 + a * 24 + c : U32)], small, seed, column, cube, a, b, c)

def children(fuel: Nat, +column: U32, +seed: U32, +cube: C.Cubie, state: BoundTables) -> IO(BoundTables):
  match fuel:
    case 0n: IO.pure(BoundTables, state)
    case 1n+rest:
      do IO<BoundTables>:
        state : BoundTables <- child(state, seed, column, C.turn(Q.phase2_move(column), cube))
        children(rest, (column + 1 : U32), seed, cube, state)

def scanned(result: S.Search, +mask: U32) -> Scan:
  match result:
    case S.Search{table, Nil{}, meta}: Scan{table, 0, mask, False{}, True{}}
    case S.Search{table, Con{S.Node{cube, a, b, c, left, previous, next, phase, path, length}, Nil{}}, meta}:
      Scan{table, next, mask, True{}, True{}}
    case S.Search{table, Con{S.Node{cube, a, b, c, left, previous, child_next, phase, Con{+move, Nil{}}, length}, Con{S.Node{parent, pa, pb, pc, pl, pp, next, pg, path, plen}, Nil{}}}, meta}:
      +bit = (1 << U32.to_nat(move) : U32)
      Scan{table, next, (mask .|. bit : U32), True{}, U32.is_eq((mask .&. bit : U32), 0)}
    case S.Search{table, stack, meta}: Scan{table, 0, mask, False{}, False{}}

def scan(fuel: Nat, state: Scan, +cube: C.Cubie, +a: U32, +b: U32, +c: U32, +radius: U32, +previous: U32) -> Scan:
  match fuel state:
    case 0n state: state
    case _ Scan{table, cursor, mask, False{}, valid}: Scan{table, cursor, mask, False{}, valid}
    case _ Scan{table, cursor, mask, live, False{}}: Scan{table, cursor, mask, live, False{}}
    case 1n+rest Scan{table, cursor, mask, True{}, True{}}:
      scan(rest, scanned(S.node_open(False{}, table, S.Node{cube, a, b, c, radius, previous, cursor, S.Subgroup{}, Nil{}, 0}, Nil{}, S.Meta{cube, 0, 21, Nil{}, 31, S.Improve{}, 0, 0, 0, S.Running{}, S.Light{}}), mask), cube, a, b, c, radius, previous)

def print_scan(state: Scan, small: Array<U32>, seed: U32, radius: U32, previous: U32) -> IO(BoundTables):
  match state:
    case Scan{table, cursor, mask, False{}, True{}}:
      do IO<BoundTables>:
        IO.print("[1," ++ U32.show(seed) ++ "," ++ U32.show(radius) ++ "," ++ U32.show(previous) ++ "," ++ U32.show(mask) ++ "]")
        return BoundTables{small, table}
    case _: IO.die(BoundTables, 2, "Phase-two child scan did not terminate correctly")

def contexts(fuel: Nat, +at: U32, +seed: U32, +cube: C.Cubie, state: BoundTables) -> IO(BoundTables):
  match fuel state:
    case 0n state: IO.pure(BoundTables, state)
    case 1n+rest BoundTables{small, table}:
      do IO<BoundTables>:
        +radius : U32 = (at / 10 + 1 : U32)
        +previous : U32 = (at % 10 : U32)
        state : BoundTables <- print_scan(scan(20n, Scan{table, 0, 0, True{}, True{}}, cube, Q.encode(Q.Corners{}, cube), Q.encode(Q.Edges{}, cube), Q.encode(Q.Middle{}, cube), radius, previous), small, seed, radius, previous)
        contexts(rest, (at + 1 : U32), seed, cube, state)

def roots(fuel: Nat, +at: U32, state: BoundTables) -> IO(Unit):
  match fuel:
    case 0n: IO.print("{\"format\":\"rubend-phase2-small-conditional-end-v1\",\"roots\":64}")
    case 1n+rest:
      do IO<Unit>:
        +seed : U32 = (20261024 + at * 97 : U32)
        +cube : C.Cubie = root(seed)
        state : BoundTables <- children(10n, 0, seed, cube, state)
        state : BoundTables <- contexts(140n, 0, seed, cube, state)
        roots(rest, (at + 1 : U32), state)

def start(args: List<String>) -> IO(Unit):
  match args:
    case Con{program, Con{path, Nil{}}}:
      do IO<Unit>:
        small : Array<U32> <- Cache.load(path, [255 : U32^18n], 0, 235200)
        IO.print("{\"format\":\"rubend-phase2-small-conditional-v1\",\"goal\":1,\"profile\":0,\"roots\":64,\"radii\":14,\"histories\":10}")
        roots(64n, 0, BoundTables{small, T.generate()})
    case _: IO.die(Unit, 2, "Expected the audited small-product word file")

def main() -> IO(Unit):
  do IO<Unit>:
    args : List<String> <- IO.args()
    start(args)
