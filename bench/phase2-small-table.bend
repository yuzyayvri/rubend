import Base
import ../src/tables.bend as T
import ./phase2-projection.bend as P
import ./phase2-small-product.bend as E

def fill_edges(fuel: Nat, +at: U32, table: Array<U32>) -> Array<U32>:
  match fuel:
    case 0n: table
    case 1n+rest:
      table[(262144 + at : U32)] <- E.edge_next((at / 10 : U32), (at % 10 : U32))
      fill_edges(rest, (at + 1 : U32), table)

def fill_corners(fuel: Nat, +at: U32, table: Array<U32>) -> Array<U32>:
  match fuel:
    case 0n: table
    case 1n+rest:
      table[(278944 + at : U32)] <- P.corner_next((at / 10 : U32), (at % 10 : U32))
      fill_corners(rest, (at + 1 : U32), table)

def initial() -> T.Breadth:
  table = fill_corners(1400n, 0, fill_edges(16800n, 0, [255 : U32^19n]))
  table[0] <- 0
  T.BReady{table, [0 : U32^18n], 0, 1}

def build() -> T.Breadth:
  T.breadth(2822401n, initial(), T.Spec{0, 140, 235200, 10, 262144, 278944})
