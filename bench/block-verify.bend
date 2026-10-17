import Base
import ../src/joint-table.bend as J
import ../src/block-table.bend as B

type Check is Type:
  Check{source: Array<U32>, packed: Array<U32>, valid: Bool, hash: U32}

def actual(read: Array<U32> & U32, source: Array<U32>, expected: U32, +index: U32, +hash: U32) -> Check:
  match read:
    case Tuple{packed, +value}: Check{source, packed, U32.is_eq(value, expected), ((hash * 16777619) .^. value .^. index : U32)}

def expected(read: Array<U32> & U32, packed: Array<U32>, +index: U32, blocks: U32, hash: U32) -> Check:
  match read:
    case Tuple{source, value}: actual(B.get_at(packed, 0, index, blocks), source, value, index, hash)

def compare(fuel: Nat, state: Check, +index: U32, +blocks: U32) -> Check:
  match fuel state:
    case 1n+p Check{source, packed, True{}, hash}: compare(p, expected(J.get(source, index), packed, index, blocks, hash), (index + 1 : U32), blocks)
    case _ state: state
