import Base

def word(+index: U32) -> U32:
  ((index * 1664525 + 1013904223 : U32) .|. 2147483648 : U32)

def fill(fuel: Nat, table: Array<U32>, +index: U32) -> Array<U32>:
  match fuel:
    case 0n: table
    case 1n+rest:
      table[index] <- word(index)
      fill(rest, table, (index + 1 : U32))
