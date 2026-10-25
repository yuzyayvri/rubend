import Base
import ../src/cubie.bend as C
import ../src/coordinates.bend as Q
import ./phase2-projection.bend as P
import ./phase2-small-product.bend as E
import ./phase2-move-order.bend as O

def fill(fuel: Nat, +rank: U32, table: Array<U32>) -> Array<U32>:
  match fuel:
    case 0n: table
    case 1n+rest:
      +word = Q.unrank8(rank)
      table[(5505024 + rank : U32)] <- P.corner_index(word)
      table[(5570560 + rank : U32)] <- E.edge_index(C.Cubie{1985229328, 0, word, 47768, 0})
      fill(rest, (rank + 1 : U32), table)

def admitted(ok: Bool, table: Array<U32>) -> Array<U32>:
  match ok:
    case True{}: fill(40320n, 0, table)
    case False{}: [0 : U32^0n]

def sized(read: Array<U32> & U32) -> Array<U32>:
  match read:
    case Tuple{table, size}: admitted(U32.is_eq(size, 8388608), table)

def prepare(table: Array<U32>) -> Array<U32>:
  sized(Array.size(U32, table))

def distance(read: Array<U32> & U32) -> Array<U32> & U32:
  match read:
    case Tuple{table, +value}: (table, C.pick(U32.is_le(value, 10), value, 0))

def indexed(ok: Bool, table: Array<U32>, corners: U32, edges: U32) -> Array<U32> & U32:
  match ok:
    case True{}: distance(table[(5242880 + edges * 140 + corners : U32)])
    case False{}: (table, 0)

def edge_map(read: Array<U32> & U32, +corners: U32) -> Array<U32> & U32:
  match read:
    case Tuple{table, +edges}: indexed(U32.is_lt(corners, 140) && U32.is_lt(edges, 1680), table, corners, edges)

def corner_map(read: Array<U32> & U32, b: U32) -> Array<U32> & U32:
  match read:
    case Tuple{table, corners}: edge_map(table[(5570560 + b : U32)], corners)

def projected(ok: Bool, table: Array<U32>, a: U32, b: U32) -> Array<U32> & U32:
  match ok:
    case True{}: corner_map(table[(5505024 + a : U32)], b)
    case False{}: (table, 0)

def project(table: Array<U32>, +a: U32, +b: U32) -> Array<U32> & U32:
  projected(U32.is_lt(a, 40320) && U32.is_lt(b, 40320), table, a, b)

def child_y(read: Array<U32> & U32, nx: U32) -> Array<U32> & U32:
  match read:
    case Tuple{table, ny}: project(table, nx, ny)

def child_x(read: Array<U32> & U32, +b: U32, +column: U32) -> Array<U32> & U32:
  match read:
    case Tuple{table, nx}: child_y(table[(488340 + b * 10 + column : U32)], nx)

def score(table: Array<U32>, +a: U32, b: U32, c: U32, +column: U32) -> Array<U32> & U32:
  child_x(table[(85140 + a * 10 + column : U32)], b, column)

def scores_tail(read: Array<U32> & +List<U32>, value: U32) -> Array<U32> & +List<U32>:
  match read:
    case Tuple{table, tail}: (table, value <> tail)

def scores_head(read: Array<U32> & U32, rest: Array<U32> -> (Array<U32> & +List<U32>)) -> Array<U32> & +List<U32>:
  match read:
    case Tuple{table, value}: scores_tail(rest(table), value)

def scores(fuel: Nat, table: Array<U32>, +a: U32, +b: U32, +c: U32, +column: U32) -> Array<U32> & +List<U32>:
  match fuel:
    case 0n: (table, Nil{})
    case 1n+rest: scores_head(score(table, a, b, c, column), t => scores(rest, t, a, b, c, (column + 1 : U32)))

def prepared(read: Array<U32> & +List<U32>, radius: U32) -> Array<U32> & U32:
  match read:
    case Tuple{table, values}: (table, O.prepare(values, radius))

def cursor(fresh: Bool, table: Array<U32>, a: U32, b: U32, c: U32, radius: U32, word: U32) -> Array<U32> & U32:
  match fresh:
    case True{}: prepared(scores(10n, table, a, b, c, 0), radius)
    case False{}: (table, word)
