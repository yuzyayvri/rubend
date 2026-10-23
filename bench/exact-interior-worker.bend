import Base
import ../src/main.bend as H
import ../src/model.bend as M
import ../src/cubie.bend as C
import ../src/search.bend as S
import ../src/certificate.bend as Cert
import ./fixed-work.bend as F
import ./exact-interior-trace.bend as T

type TraceCase is Data:
  TraceCase{id: String, facelets: String, forward: +List<U32>}

def profile_code(profile: S.Profile) -> U32:
  match profile:
    case S.RawInverseThree{}: 3
    case _: 0

def point_text(points: +List<T.InteriorPoint>) -> +List<String>:
  match points:
    case Nil{}: Nil{}
    case Con{point, rest}: F.numbers(T.values(point)) <> point_text(rest)

def emit_points(observed: Bool, id: String, points: +List<T.InteriorPoint>) -> IO(Unit):
  match observed:
    case False{}: IO.pure(Unit, Unit{})
    case True{}:
      IO.print("{\"type\":\"points\",\"id\":\"" ++ id ++ "\",\"events\":[" ++ String.join(point_text(List.reverse(&2, T.InteriorPoint, points)), ",") ++ "]}")

def checkpoint(+id: String, +observed: Bool, +tick: U32, done: U32, +original: M.Cube, stack: +List<S.Frame>, +meta: S.Meta) -> IO(Unit):
  match meta:
    case S.Meta{root, p1, ceiling, best, length, mode, bound, lower, nodes, status, profile}:
      do IO<Unit>:
        H.emit_for(U32.is_lt(length, 31), original, best, length, lower, nodes, S.is_optimal(status), ",\"id\":\"" ++ id ++ "\",\"observed\":" ++ U32.show(C.pick(observed, 1, 0)) ++ ",\"tick\":" ++ U32.show(tick))
        IO.print("{\"type\":\"checkpoint\",\"id\":\"" ++ id ++ "\",\"observed\":" ++ U32.show(C.pick(observed, 1, 0)) ++ ",\"tick\":" ++ U32.show(tick) ++ ",\"done\":" ++ U32.show(done) ++ ",\"profile\":" ++ U32.show(profile_code(profile)) ++ ",\"meta\":" ++ F.meta(meta) ++ ",\"frames\":[" ++ String.join(F.frames(stack), ",") ++ "]}")

def chunk(observed: Bool, fuel: Nat, state: S.Search) -> S.Search & +List<T.InteriorPoint>:
  match observed:
    case False{}: (S.run(fuel, state), Nil{})
    case True{}: T.run(fuel, state, Nil{})

def work(chunks: +List<U32>, +observed: Bool, +id: String, +tick: U32, +original: M.Cube, result: S.Search & +List<T.InteriorPoint>) -> IO(Array<U32>):
  match chunks result:
    case Nil{} Tuple{S.Search{table, stack, meta}, points}:
      do IO<Array<U32>>:
        emit_points(observed, id, points)
        checkpoint(id, observed, tick, 1, original, stack, meta)
        return table
    case Con{fuel, rest} Tuple{S.Search{table, +stack, +meta}, points}:
      do IO<Array<U32>>:
        emit_points(observed, id, points)
        checkpoint(id, observed, tick, 0, original, stack, meta)
        work(rest, observed, id, (tick + 1 : U32), original, chunk(observed, U32.to_nat(fuel), S.Search{table, stack, meta}))

def initial(table: Array<U32>, +root: C.Cubie, best: +List<U32>, length: U32) -> S.Search:
  S.Search{table, S.root_frame(root, 0, S.FullCube{}) <> Nil{}, S.Meta{root, 0, 21, best, length, S.ExactContour{}, 0, 0, 0, S.Running{}, S.RawInverseThree{}}}

def both(table: Array<U32>, +original: M.Cube, +root: C.Cubie, +best: +List<U32>, +length: U32, +id: String, +chunks: +List<U32>) -> IO(Array<U32>):
  do IO<Array<U32>>:
    table : Array<U32> <- work(chunks, False{}, id, 0, original, (initial(table, root, best, length), Nil{}))
    work(chunks, True{}, id, 0, original, (initial(table, root, best, length), Nil{}))

def certified(+original: M.Cube, evidence: Maybe<&2, Cert.Certificate<original>>, valid: C.Validation, id: String, +forward: +List<U32>, chunks: +List<U32>, table: Array<U32>) -> IO(Array<U32>):
  match evidence valid:
    case Some{certificate} C.Valid{root}:
      both(table, original, root, List.reverse(&2, U32, forward), U32.from_nat(List.length(&2, U32, forward)), id, chunks)
    case _ _: IO.die(Array<U32>, 2, "Trace root or incumbent certificate failed")

def parsed(value: Maybe<&2, M.Cube>, id: String, +forward: +List<U32>, chunks: +List<U32>, table: Array<U32>) -> IO(Array<U32>):
  match value:
    case Some{+original}: certified(original, Cert.certify(original, H.to_moves(forward)), C.validate(original), id, forward, chunks, table)
    case None{}: IO.die(Array<U32>, 2, "Trace cube parse failed")

def cases(entries: +List<TraceCase>, +chunks: +List<U32>, table: Array<U32>) -> IO(Array<U32>):
  match entries:
    case Nil{}: IO.pure(Array<U32>, table)
    case Con{TraceCase{id, facelets, forward}, rest}:
      do IO<Array<U32>>:
        table : Array<U32> <- parsed(M.from_list(H.colors(facelets)), id, forward, chunks, table)
        cases(rest, chunks, table)

def start(entries: +List<TraceCase>, chunks: +List<U32>) -> IO(Unit):
  do IO<Unit>:
    IO.print("{\"type\":\"calibration\",\"entry\":" ++ F.numbers(T.test_capture(0, 2, 1, 2, 3, 5, 12, 4, 0)) ++ ",\"exhaustion\":" ++ F.numbers(T.test_capture(18, 2, 1, 2, 3, 5, 12, 4, 0)) ++ "}")
    table : Array<U32> <- F.load(True{})
    table : Array<U32> <- cases(entries, chunks, table)
    IO.pure(Unit, Unit{})
