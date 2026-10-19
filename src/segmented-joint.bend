import Base
import ./segmented-table.bend as R

def unpack(read: R.Table & U32, +index: U32) -> R.Table & U32:
  match read:
    case Tuple{table, word}: (table, ((word >> U32.to_nat((index % 8 * 4 : U32))) .&. 15 : U32))

def get_at(table: R.Table, base: U32, +index: U32) -> R.Table & U32:
  unpack(R.get(table, (base + index / 8 : U32)), index)
