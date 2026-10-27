import Base

type Choice is Data:
  End{}
  Selected{column: U32, remaining: U32}
  Rejected{}

def pick(ok: Bool, a: U32, b: U32) -> U32:
  match ok:
    case True{}: a
    case False{}: b

def bucket(+score: U32, +radius: U32) -> U32:
  pick(U32.is_ge(score, radius), 2, pick(U32.is_eq((score + 1 : U32), radius), 1, 0))

def add(ok: Bool, +score: U32, +radius: U32, +column: U32, +word: U32) -> U32:
  match ok:
    case True{}: U32.or(word, U32.shln(1, U32.to_nat((bucket(score, radius) * 10 + column : U32))))
    case False{}: 0

def pack(fuel: Nat, scores: +List<U32>, +radius: U32, +column: U32, +word: U32) -> U32:
  match fuel scores:
    case _ Nil{}:
      pick(U32.is_eq(column, 10) && U32.is_ne(word, 0), word, 0)
    case 0n _:
      0
    case 1n+p Con{+score, rest}:
      pack(p, rest, radius, (column + 1 : U32), add(U32.is_lt(column, 10) && U32.is_le(score, 255) && U32.is_ne(word, 0), score, radius, column, word))

def checked(ok: Bool, scores: +List<U32>, radius: U32) -> U32:
  match ok:
    case True{}: pack(11n, scores, radius, 0, 1073741824)
    case False{}: 0

def prepare(scores: +List<U32>, +radius: U32) -> U32:
  checked(U32.is_ge(radius, 1) && U32.is_le(radius, 30), scores, radius)

def mask(word: U32, bucket: U32) -> U32:
  U32.and(U32.shrn(word, U32.to_nat((bucket * 10 : U32))), 1023)

def valid(+word: U32) -> Bool:
  +a = mask(word, 0)
  +b = mask(word, 1)
  +c = mask(word, 2)
  U32.is_eq(U32.and(word, 3221225472), 1073741824) && U32.is_eq(U32.and(a, b), 0) && U32.is_eq(U32.and(a, c), 0) && U32.is_eq(U32.and(b, c), 0)

def active(+word: U32) -> Bool:
  U32.is_eq(word, 0) || (valid(word) && U32.is_ne(U32.and(word, 1073741823), 0))

def found(ok: Bool, column: U32, rest: Unit -> U32) -> U32:
  match ok:
    case True{}: column
    case False{}: rest(Unit{})

def lowest(fuel: Nat, +bits: U32, +column: U32) -> U32:
  match fuel:
    case 0n: 10
    case 1n+p:
      found(U32.is_eq(U32.and(bits, 1), 1), column, u => lowest(p, U32.shr(bits), (column + 1 : U32)))

def selected(+word: U32, +bucket: U32, +column: U32) -> Choice:
  Selected{column, U32.xor(word, U32.shln(1, U32.to_nat((bucket * 10 + column : U32))))}

def choose_bucket(+word: U32, +which: U32) -> Choice:
  selected(word, which, lowest(10n, mask(word, which), 0))

def take_tight(has: Bool, +word: U32) -> Choice:
  match has:
    case True{}: choose_bucket(word, 1)
    case False{}: choose_bucket(word, 2)

def take_loose(has: Bool, +word: U32) -> Choice:
  match has:
    case True{}: choose_bucket(word, 0)
    case False{}: take_tight(U32.is_ne(mask(word, 1), 0), word)

def take_valid(empty: Bool, +word: U32) -> Choice:
  match empty:
    case True{}: End{}
    case False{}:
      take_loose(U32.is_ne(mask(word, 0), 0), word)

def take_checked(ok: Bool, +word: U32) -> Choice:
  match ok:
    case True{}: take_valid(U32.is_eq(U32.and(word, 1073741823), 0), word)
    case False{}: Rejected{}

def take(+word: U32) -> Choice:
  take_checked(valid(word), word)

def collect_y(read: Array<U32> & U32, +hx: U32) -> Array<U32> & U32:
  match read:
    case Tuple{table, +hy}:
      (table, pick(U32.is_ge(hx, hy), hx, hy))

def collect_x(read: Array<U32> & U32, +ny: U32, +nz: U32) -> Array<U32> & U32:
  match read:
    case Tuple{table, hx}: collect_y(table[(3955785 + ny * 24 + nz : U32)], hx)

def coordinate_z(read: Array<U32> & U32, +nx: U32, ny: U32) -> Array<U32> & U32:
  match read:
    case Tuple{table, +nz}: collect_x(table[(2988105 + nx * 24 + nz : U32)], ny, nz)

def coordinate_y(read: Array<U32> & U32, +c: U32, +column: U32, nx: U32) -> Array<U32> & U32:
  match read:
    case Tuple{table, ny}: coordinate_z(table[(891540 + c * 10 + column : U32)], nx, ny)

def coordinate_x(read: Array<U32> & U32, +b: U32, c: U32, +column: U32) -> Array<U32> & U32:
  match read:
    case Tuple{table, nx}: coordinate_y(table[(488340 + b * 10 + column : U32)], c, column, nx)

def score(table: Array<U32>, +a: U32, b: U32, c: U32, +column: U32) -> Array<U32> & U32:
  coordinate_x(table[(85140 + a * 10 + column : U32)], b, c, column)

def scores_tail(read: Array<U32> & +List<U32>, value: U32) -> Array<U32> & +List<U32>:
  match read:
    case Tuple{table, tail}: (table, value <> tail)

def scores_head(read: Array<U32> & U32, rest: Array<U32> -> (Array<U32> & +List<U32>)) -> Array<U32> & +List<U32>:
  match read:
    case Tuple{table, value}: scores_tail(rest(table), value)

def scores(fuel: Nat, table: Array<U32>, +a: U32, +b: U32, +c: U32, +column: U32) -> Array<U32> & +List<U32>:
  match fuel:
    case 0n: (table, Nil{})
    case 1n+p: scores_head(score(table, a, b, c, column), t => scores(p, t, a, b, c, (column + 1 : U32)))

def prepared(read: Array<U32> & +List<U32>, radius: U32) -> Array<U32> & U32:
  match read:
    case Tuple{table, values}: (table, prepare(values, radius))

def cursor(fresh: Bool, table: Array<U32>, a: U32, b: U32, c: U32, radius: U32, word: U32) -> Array<U32> & U32:
  match fresh:
    case True{}: prepared(scores(10n, table, a, b, c, 0), radius)
    case False{}: (table, word)

def test_taken(value: Choice) -> U32 & U32:
  match value:
    case End{}: (10, 1073741824)
    case Selected{column, remaining}: (column, remaining)
    case Rejected{}: (11, 0)

def test_take(word: U32) -> U32 & U32:
  test_taken(take(word))

def test_scores(fuel: Nat, +seed: U32, +index: U32) -> +List<U32>:
  match fuel:
    case 0n: Nil{}
    case 1n+p: ((seed + index * 17 : U32) % 256 : U32) <> test_scores(p, seed, (index + 1 : U32))

def test_fold_choice(choice: Choice, rest: U32 -> U32 -> U32, +acc: U32) -> U32:
  match choice:
    case Selected{column, remaining}: rest(remaining, (acc * 33 + column + 1 : U32))
    case End{}: acc
    case Rejected{}: 4294967295

def test_fold(fuel: Nat, word: U32, acc: U32) -> U32:
  match fuel:
    case 0n: acc
    case 1n+p: test_fold_choice(take(word), w => a => test_fold(p, w, a), acc)

def test_checksum_loop(fuel: Nat, +seed: U32, +index: U32, acc: U32) -> U32:
  match fuel:
    case 0n: acc
    case 1n+p: test_checksum_loop(p, seed, (index + 1 : U32), (acc + test_fold(10n, prepare(test_scores(10n, (seed + index * 7919 : U32), 0), (index % 30 + 1 : U32)), index) : U32))

def test_checksum(seed: U32) -> U32:
  test_checksum_loop(128n, seed, 0, 0)
