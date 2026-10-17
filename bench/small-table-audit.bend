import Base
import ../src/tables.bend as T
import ../src/small-table.bend as K
import ../src/small/tables.bend as Direct

type Check is Type:
  Working{plain: Array<U32>, packed: Array<U32>}
  Failed{}

def compared(ok: Bool, plain: Array<U32>, packed: Array<U32>) -> Check:
  match ok:
    case True{}: Working{plain, packed}
    case False{}: Failed{}

def actual(read: Array<U32> & U32, plain: Array<U32>, expected: U32) -> Check:
  match read:
    case Tuple{packed, value}: compared(U32.is_eq(value, expected), plain, packed)

def selected(transition: Bool, read: Array<U32> & U32, packed: Array<U32>, index: U32) -> Check:
  match transition read:
    case True{} Tuple{plain, expected}: actual(K.transition(packed, index), plain, expected)
    case False{} Tuple{plain, expected}: actual(K.bound(packed, index), plain, expected)

def entries(fuel: Nat, +index: U32, state: Check) -> Check:
  match fuel state:
    case 1n+p Working{plain, packed}: entries(p, (index + 1 : U32), selected(U32.is_lt(index, 891780), plain[index], packed, index))
    case _ state: state

def checked(state: Check) -> Bool:
  match state:
    case Working{plain, packed}: True{}
    case Failed{}: False{}

def ready(ok: Bool, packed: Array<U32>) -> Bool:
  match ok:
    case True{}: checked(entries(4923465n, 0, Working{T.generate(), packed}))
    case False{}: False{}

def complete(read: Array<U32> & U32) -> Bool:
  match read:
    case Tuple{packed, size}: ready(U32.is_eq(size, 1048576), packed)

def second_word(read: Array<U32> & U32, plain: Array<U32>, expected: U32) -> Check:
  match read:
    case Tuple{packed, value}: compared(U32.is_eq(value, expected), plain, packed)

def first_word(read: Array<U32> & U32, packed: Array<U32>, index: U32) -> Check:
  match read:
    case Tuple{plain, value}: second_word(packed[index], plain, value)

def words(fuel: Nat, +index: U32, state: Check) -> Check:
  match fuel state:
    case 1n+p Working{plain, packed}: words(p, (index + 1 : U32), first_word(plain[index], packed, index))
    case _ state: state

def direct_geometry(ok: Bool, direct: Array<U32>) -> Bool:
  match ok:
    case True{}: checked(words(1048576n, 0, Working{K.prepare(T.generate()), direct}))
    case False{}: False{}

def direct_sized(read: Array<U32> & U32) -> Bool:
  match read:
    case Tuple{direct, size}: direct_geometry(U32.is_eq(size, 1048576), direct)

def rejected(read: Array<U32> & U32) -> Bool:
  match read:
    case Tuple{packed, size}: U32.is_eq(size, 1)

def malformed_transition() -> Bool:
  source = [0 : U32^23n]
  source[0] <- 65536
  rejected(Array.size(U32, K.prepare(source)))

def malformed_bound() -> Bool:
  source = [0 : U32^23n]
  source[4923464] <- 16
  rejected(Array.size(U32, K.prepare(source)))

def final_word(read: Array<U32> & U32, okay: Bool) -> Bool:
  match read:
    case Tuple{packed, word}: okay && U32.is_eq((word >> 20n : U32), 0)

def fixture_last(read: Array<U32> & U32, okay: Bool) -> Bool:
  match read:
    case Tuple{packed, value}: final_word(packed[949850], okay && U32.is_eq(value, 13))

def fixture_bound(read: Array<U32> & U32, okay: Bool) -> Bool:
  match read:
    case Tuple{packed, value}: fixture_last(K.bound(packed, 4923464), okay && U32.is_eq(value, 14))

def fixture_first_bound(read: Array<U32> & U32, okay: Bool) -> Bool:
  match read:
    case Tuple{packed, value}: fixture_bound(K.bound(packed, 891787), okay && U32.is_eq(value, 15))

def fixture_transition(read: Array<U32> & U32, okay: Bool) -> Bool:
  match read:
    case Tuple{packed, value}: fixture_first_bound(K.bound(packed, 891780), okay && U32.is_eq(value, 65533))

def fixture_second(read: Array<U32> & U32, okay: Bool) -> Bool:
  match read:
    case Tuple{packed, value}: fixture_transition(K.transition(packed, 891779), okay && U32.is_eq(value, 65534))

def fixture_first(read: Array<U32> & U32) -> Bool:
  match read:
    case Tuple{packed, value}: fixture_second(K.transition(packed, 1), U32.is_eq(value, 65535))

def fixture() -> Bool:
  source = [0 : U32^23n]
  source[0] <- 65535
  source[1] <- 65534
  source[891779] <- 65533
  source[891780] <- 15
  source[891787] <- 14
  source[4923464] <- 13
  source[4923465] <- 255
  fixture_first(K.transition(K.prepare(source), 0))

def report(ok: Bool) -> IO(Unit):
  match ok:
    case True{}: IO.print("{\"passed\":true,\"usedEntriesEqual\":4923465,\"directWordsEqual\":1048576,\"packedWords\":1048576,\"fieldAndTailBoundaries\":true,\"malformedFamilies\":3,\"claim\":\"Codec and direct-builder equality only, not observed engine RSS or speed\"}")
    case False{}: IO.die(Unit, 2, "Packed small-table audit failed")

def main() -> IO(Unit):
  report(complete(Array.size(U32, K.prepare(T.generate()))) && direct_sized(Array.size(U32, Direct.generate())) && fixture() && malformed_transition() && malformed_bound() && rejected(Array.size(U32, K.prepare([0 : U32^0n]))))
