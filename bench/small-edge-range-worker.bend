import Base
import ../src/model.bend as M
import ../src/cubie.bend as C
import ../src/certificate.bend as Cert
import ../src/small/search.bend as S
import ../src/small/tables.bend as T
import ./small-edge-range.bend as R

type RangeCase is Data:
  RangeCase{id: String, facelets: +List<U32>, solution: +List<U32>}

def moves(values: +List<U32>) -> +List<M.Move>:
  match values:
    case Nil{}: Nil{}
    case Con{value, rest}: M.from_index(value) <> moves(rest)

def indices(values: +List<M.Move>) -> +List<U32>:
  match values:
    case Nil{}: Nil{}
    case Con{value, rest}: M.index(value) <> indices(rest)

def number_text(values: +List<U32>) -> +List<String>:
  match values:
    case Nil{}: Nil{}
    case Con{value, rest}: U32.show(value) <> number_text(rest)

def numbers(values: +List<U32>) -> String:
  "[" ++ String.join(number_text(values), ",") ++ "]"

def cube(value: C.Cubie) -> String:
  match value:
    case C.Cubie{a, b, c, d, e}: numbers([a, b, c, d, e])

def frame(value: S.Frame) -> String:
  match value:
    case S.Node{root, a, b, c, left, previous, next, phase, path, length}: "[0," ++ cube(root) ++ "," ++ numbers([a, b, c, left, previous, next, S.goal_code(phase), length]) ++ "," ++ numbers(path) ++ "]"
    case S.Retry{root, a, b, c, depth, previous, path, length}: "[1," ++ cube(root) ++ "," ++ numbers([a, b, c, depth, previous, length]) ++ "," ++ numbers(path) ++ "]"

def frames(values: +List<S.Frame>) -> +List<String>:
  match values:
    case Nil{}: Nil{}
    case Con{value, rest}: frame(value) <> frames(rest)

def meta(value: S.Meta) -> String:
  match value:
    case S.Meta{root, p1, ceiling, best, best_length, mode, bound, lower, nodes, status, profile}: "[" ++ cube(root) ++ "," ++ numbers([p1, ceiling, best_length, S.stage_code(mode), bound, lower, nodes, S.completion_code(status), S.profile_words(profile)]) ++ "," ++ numbers(best) ++ "]"

def point(+value: R.RangePoint) -> String:
  "[" ++ numbers(R.values(value)) ++ "," ++ numbers(R.path(value)) ++ "]"

def points(values: +List<R.RangePoint>) -> +List<String>:
  match values:
    case Nil{}: Nil{}
    case Con{value, rest}: point(value) <> points(rest)

def emit_points(observed: Bool, id: String, requested: U32, +values: +List<R.RangePoint>) -> IO(Unit):
  match observed:
    case False{}: IO.pure(Unit, Unit{})
    case True{}: IO.print("{\"type\":\"points\",\"id\":\"" ++ id ++ "\",\"requested\":" ++ U32.show(requested) ++ ",\"count\":" ++ U32.show(U32.from_nat(List.length(&2, R.RangePoint, values))) ++ ",\"events\":[" ++ String.join(points(List.reverse(&2, R.RangePoint, values)), ",") ++ "]}")

def checkpoint(id: String, observed: Bool, requested: U32, stack: +List<S.Frame>, state: S.Meta) -> IO(Unit):
  IO.print("{\"type\":\"checkpoint\",\"id\":\"" ++ id ++ "\",\"observed\":" ++ U32.show(C.pick(observed, 1, 0)) ++ ",\"requested\":" ++ U32.show(requested) ++ ",\"meta\":" ++ meta(state) ++ ",\"frames\":[" ++ String.join(frames(stack), ",") ++ "]}")

def chunk(observed: Bool, fuel: Nat, state: S.Search) -> S.Search & +List<R.RangePoint>:
  match observed:
    case False{}: (S.run(fuel, state), Nil{})
    case True{}: R.run(fuel, state, Nil{})

def work(chunks: +List<U32>, +observed: Bool, +id: String, +requested: U32, result: S.Search & +List<R.RangePoint>) -> IO(Array<U32>):
  match chunks result:
    case Nil{} Tuple{S.Search{table, stack, state}, values}:
      do IO<Array<U32>>:
        emit_points(observed, id, requested, values)
        checkpoint(id, observed, requested, stack, state)
        return table
    case Con{+fuel, rest} Tuple{S.Search{table, +stack, +state}, values}:
      do IO<Array<U32>>:
        emit_points(observed, id, requested, values)
        checkpoint(id, observed, requested, stack, state)
        work(rest, observed, id, (requested + fuel : U32), chunk(observed, U32.to_nat(fuel), S.Search{table, stack, state}))

def seed(best: +List<U32>, best_length: U32, state: S.Search) -> S.Search:
  match state:
    case S.Search{table, stack, S.Meta{root, p1, ceiling, old_best, old_length, mode, bound, lower, nodes, S.Running{}, S.Light{}}}: S.Search{table, stack, S.Meta{root, p1, ceiling, best, best_length, mode, bound, lower, nodes, S.Running{}, S.Light{}}}
    case state: state

def initial(table: Array<U32>, +root: C.Cubie, best: +List<U32>, best_length: U32) -> S.Search:
  seed(best, best_length, S.initialize(table, root, S.ExactContour{}, S.Light{}))

def both(table: Array<U32>, +root: C.Cubie, +best: +List<U32>, +best_length: U32, +id: String, +chunks: +List<U32>) -> IO(Array<U32>):
  do IO<Array<U32>>:
    table : Array<U32> <- work(chunks, False{}, id, 0, (initial(table, root, best, best_length), Nil{}))
    work(chunks, True{}, id, 0, (initial(table, root, best, best_length), Nil{}))

def certified(+original: M.Cube, certificate: Maybe<&2, Cert.Certificate<original>>, valid: C.Validation, id: String, chunks: +List<U32>, table: Array<U32>) -> IO(Array<U32>):
  match certificate valid:
    case Some{certificate} C.Valid{root}:
      +forward = indices(Cert.moves(original, certificate))
      both(table, root, List.reverse(&2, U32, forward), U32.from_nat(List.length(&2, U32, forward)), id, chunks)
    case _ _: IO.die(Array<U32>, 2, "Small-range root or incumbent certificate failed")

def parsed(original: Maybe<&2, M.Cube>, solution: +List<U32>, id: String, chunks: +List<U32>, table: Array<U32>) -> IO(Array<U32>):
  match original:
    case Some{+original}: certified(original, Cert.certify(original, moves(solution)), C.validate(original), id, chunks, table)
    case None{}: IO.die(Array<U32>, 2, "Small-range root shape failed")

def cases(entries: +List<RangeCase>, +chunks: +List<U32>, table: Array<U32>) -> IO(Array<U32>):
  match entries:
    case Nil{}: IO.pure(Array<U32>, table)
    case Con{RangeCase{id, facelets, solution}, rest}:
      do IO<Array<U32>>:
        table : Array<U32> <- parsed(M.from_list(facelets), solution, id, chunks, table)
        cases(rest, chunks, table)

def digest_step(read: Array<U32> & U32, +sum: U32) -> Array<U32> & U32:
  match read:
    case Tuple{table, value}: (table, ((sum * 33 + value : U32)))

def digest(fuel: Nat, +index: U32, result: Array<U32> & U32) -> Array<U32> & U32:
  match fuel result:
    case 0n result: result
    case 1n+rest Tuple{table, sum}: digest(rest, (index + 1 : U32), digest_step(table[index], sum))

def finished(read: Array<U32> & U32) -> IO(Unit):
  match read:
    case Tuple{table, sum}: IO.print("{\"type\":\"table-final\",\"words\":1048576,\"checksum\":" ++ U32.show(sum) ++ "}")

def prepared(entries: +List<RangeCase>, +chunks: +List<U32>, read: Array<U32> & U32) -> IO(Unit):
  match read:
    case Tuple{table, sum}:
      do IO<Unit>:
        IO.print("{\"type\":\"table-initial\",\"words\":1048576,\"checksum\":" ++ U32.show(sum) ++ "}")
        table : Array<U32> <- cases(entries, chunks, table)
        finished(digest(1048576n, 0, (table, 17)))

def size_checked(ok: Bool, entries: +List<RangeCase>, chunks: +List<U32>, table: Array<U32>) -> IO(Unit):
  match ok:
    case True{}: prepared(entries, chunks, digest(1048576n, 0, (table, 17)))
    case False{}: IO.die(Unit, 2, "Small-range table geometry failed")

def sized(entries: +List<RangeCase>, chunks: +List<U32>, read: Array<U32> & U32) -> IO(Unit):
  match read:
    case Tuple{table, size}: size_checked(U32.is_eq(size, 1048576), entries, chunks, table)

def start(entries: +List<RangeCase>, chunks: +List<U32>) -> IO(Unit):
  do IO<Unit>:
    IO.print("{\"type\":\"calibration\",\"point\":" ++ numbers(R.test_capture(0, 2, 1, 2, 3, 5, 12, 4, 0, 0, 0)) ++ ",\"steps\":" ++ U32.show(R.test_steps()) ++ "}")
    sized(entries, chunks, Array.size(U32, T.generate()))
