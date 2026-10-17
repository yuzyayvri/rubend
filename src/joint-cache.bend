import Base
import ./word-io.bend as W

type Block is Type:
  Block{table: Array<U32>, bytes: +List<U32>, words: U32, valid: Bool}

def checked(valid: Bool, table: Array<U32>) -> IO(Array<U32>):
  match valid:
    case True{}: IO.pure(Array<U32>, table)
    case False{}: IO.die(Array<U32>, 2, "Truncated or malformed joint cache")

def require(valid: Bool) -> IO(Unit):
  match valid:
    case True{}: IO.pure(Unit, Unit{})
    case False{}: IO.die(Unit, 2, "Truncated or malformed joint cache")

def limit(large: Bool, value: U32) -> U32:
  match large:
    case True{}: 65536
    case False{}: value

def encoded(read: Array<U32> & U32, bytes: +List<U32>) -> Block:
  match read:
    case Tuple{table, +word}: Block{table, ((word >> 24n) .&. 255 : U32) <> ((word >> 16n) .&. 255 : U32) <> ((word >> 8n) .&. 255 : U32) <> (word .&. 255 : U32) <> bytes, 0, True{}}

def encode(fuel: Nat, state: Block, +index: U32) -> Block:
  match fuel state:
    case 1n+p Block{table, bytes, words, valid}: encode(p, encoded(table[index], bytes), (index + 1 : U32))
    case _ state: state

def decoded(bytes: +List<U32>, table: Array<U32>, +index: U32, +words: U32) -> Block:
  match bytes:
    case Nil{}: Block{table, Nil{}, words, True{}}
    case Con{a, Con{b, Con{c, Con{d, rest}}}}:
      table[index] <- (a .|. (b << 8n) .|. (c << 16n) .|. (d << 24n) : U32)
      decoded(rest, table, (index + 1 : U32), (words + 1 : U32))
    case _: Block{table, Nil{}, words, False{}}

def wrote(result: File & Result<&1, &1, U32 & String, Unit>) -> IO(File):
  match result:
    case Tuple{file, Done{unit}}: IO.pure(File, file)
    case Tuple{file, Fail{error}}: IO.die(File, 2, "Joint cache write failed")

def write_block(file: File, block: Block) -> IO(File & Array<U32>):
  match block:
    case Block{table, bytes, words, valid}:
      do IO<File & Array<U32>>:
        result : File & Result<&1, &1, U32 & String, Unit> <- File.write_bytes(file, List.reverse(&2, U32, bytes))
        file : File <- wrote(result)
        return (file, table)

def write_chunks(fuel: Nat, state: File & Array<U32>, +index: U32, +remaining: U32) -> IO(Array<U32>):
  match fuel state remaining:
    case _ Tuple{file, table} 0:
      do IO<Array<U32>>:
        File.close(file)
        return table
    case 1n+p Tuple{file, table} remaining:
      do IO<Array<U32>>:
        +count : U32 = limit(U32.is_gt(remaining, 65536), remaining)
        state : File & Array<U32> <- write_block(file, encode(U32.to_nat(count), Block{table, Nil{}, 0, True{}}, index))
        write_chunks(p, state, (index + count : U32), (remaining - count : U32))
    case _ _ _: IO.die(Array<U32>, 2, "Joint cache write fuel exhausted")

def empty_file(read: File & Result<&1, &1, U32 & String, U32>) -> IO(File):
  match read:
    case Tuple{file, Done{0}}: IO.pure(File, file)
    case _: IO.die(File, 2, "Refusing to append to a nonempty joint cache")

def save(path: String, table: Array<U32>, count: U32) -> IO(Array<U32>):
  do IO<Array<U32>>:
    file : File <- IO.try(File, File.open(path, "a"))
    size : File & Result<&1, &1, U32 & String, U32> <- File.size(file)
    file : File <- empty_file(size)
    write_chunks(8192n, (file, table), 0, count)

def read_result(read: File & Result<&1, &1, U32 & String, +List<U32>>, table: Array<U32>, index: U32) -> IO(File & Block):
  match read:
    case Tuple{file, Done{bytes}}: IO.pure(File & Block, (file, decoded(bytes, table, index, 0)))
    case Tuple{file, Fail{error}}: IO.die(File & Block, 2, "Joint cache read failed")

def read_chunks(fuel: Nat, state: File & Block, +index: U32, +remaining: U32, +expected: U32) -> IO(Array<U32>):
  match fuel state remaining:
    case _ Tuple{file, Block{table, bytes, +words, +valid}} 0:
      do IO<Array<U32>>:
        File.close(file)
        checked(valid && U32.is_eq(words, expected), table)
    case 1n+p Tuple{file, Block{table, bytes, +words, +valid}} remaining:
      do IO<Array<U32>>:
        require(valid && U32.is_eq(words, expected))
        +count : U32 = limit(U32.is_gt(remaining, 65536), remaining)
        read : File & Result<&1, &1, U32 & String, +List<U32>> <- File.read_bytes(file, (count * 4 : U32))
        next : File & Block <- read_result(read, table, index)
        read_chunks(p, next, (index + count : U32), (remaining - count : U32), count)
    case _ _ _: IO.die(Array<U32>, 2, "Joint cache read fuel exhausted")

def sized(read: File & Result<&1, &1, U32 & String, U32>, +count: U32) -> IO(File):
  match read:
    case Tuple{file, Done{size}}:
      do IO<File>:
        require(U32.is_eq(size, (count * 4 : U32)))
        return file
    case _: IO.die(File, 2, "Could not size joint cache")

def load(path: String, table: Array<U32>, index: U32, +count: U32) -> IO(Array<U32>):
  do IO<Array<U32>>:
    file : File <- IO.try(File, File.open(path, "r"))
    size : File & Result<&1, &1, U32 & String, U32> <- File.size(file)
    file : File <- sized(size, count)
    read_chunks(8192n, (file, Block{table, Nil{}, 0, True{}}), index, count, 0)

def word_limit(large: Bool, value: U32) -> U32:
  match large:
    case True{}: 262144
    case False{}: value

def read_words_result(result: File & (Array<U32> & Result<&1, &1, U32 & String, Unit>)) -> IO(File & Array<U32>):
  match result:
    case Tuple{file, Tuple{table, Done{unit}}}: IO.pure(File & Array<U32>, (file, table))
    case _: IO.die(File & Array<U32>, 2, "Joint cache word read failed")

def word_chunks(fuel: Nat, state: File & Array<U32>, +index: U32, +remaining: U32) -> IO(Array<U32>):
  match fuel state remaining:
    case _ Tuple{file, table} 0:
      do IO<Array<U32>>:
        File.close(file)
        return table
    case 1n+p Tuple{file, table} remaining:
      do IO<Array<U32>>:
        +count : U32 = word_limit(U32.is_gt(remaining, 262144), remaining)
        result : File & (Array<U32> & Result<&1, &1, U32 & String, Unit>) <- W.read_words(file, table, index, count)
        state : File & Array<U32> <- read_words_result(result)
        word_chunks(p, state, (index + count : U32), (remaining - count : U32))
    case _ _ _: IO.die(Array<U32>, 2, "Joint cache word read fuel exhausted")

def load_words(path: String, table: Array<U32>, index: U32, +count: U32) -> IO(Array<U32>):
  do IO<Array<U32>>:
    file : File <- IO.try(File, File.open(path, "r"))
    size : File & Result<&1, &1, U32 & String, U32> <- File.size(file)
    file : File <- sized(size, count)
    word_chunks(8192n, (file, table), index, count)

type Digest is Type:
  Digest{table: Array<U32>, hash: U32}

def hashed(read: Array<U32> & U32, hash: U32, index: U32) -> Digest:
  match read:
    case Tuple{table, word}: Digest{table, ((hash * 16777619) .^. word .^. index : U32)}

def fingerprint_at(fuel: Nat, state: Digest, +base: U32, +index: U32) -> Digest:
  match fuel state:
    case 1n+p Digest{table, hash}: fingerprint_at(p, hashed(table[(base + index : U32)], hash, index), base, (index + 1 : U32))
    case _ state: state

def fingerprint(fuel: Nat, state: Digest, index: U32) -> Digest:
  fingerprint_at(fuel, state, 0, index)

def moved(read: Array<U32> & U32, index: U32, base: U32) -> Array<U32>:
  match read:
    case Tuple{table, word}: table[(index + base : U32)] <- word

def shift(fuel: Nat, table: Array<U32>, +next: U32, +base: U32) -> Array<U32>:
  match fuel:
    case 0n: table
    case 1n+p: shift(p, moved(table[(next - 1 : U32)], (next - 1 : U32), base), (next - 1 : U32), base)

type Prefix is Type:
  Prefix{large: Array<U32>, small: Array<U32>}

def prefixed(read: Array<U32> & U32, large: Array<U32>, index: U32) -> Prefix:
  match read:
    case Tuple{small, word}: Prefix{large[index] <- word, small}

def prefix(fuel: Nat, state: Prefix, +index: U32) -> Array<U32>:
  match fuel state:
    case 1n+p Prefix{large, small}: prefix(p, prefixed(small[index], large, index), (index + 1 : U32))
    case _ Prefix{large, small}: large
