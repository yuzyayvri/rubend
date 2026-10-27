import Base
import ../src/cubie.bend as C
import ../src/coordinates.bend as Q
import ../src/search.bend as S
import ./partition-prefix.bend as P

type PrefixState is Data:
  PrefixState{cube: C.Cubie, previous: U32, reverse: +List<U32>}

type PartResult is Type:
  PartExhausted{table: Array<U32>, steps: U32}
  PartFound{table: Array<U32>, reverse: +List<U32>, length: U32, steps: U32}
  PartPartial{table: Array<U32>, steps: U32}
  PartRejected{table: Array<U32>}

type Stage is Type:
  PartActive{state: S.Search}
  PartEnd{result: PartResult}

def stacked(state: S.Search) -> Stage:
  match state:
    case S.Search{table, Nil{}, S.Meta{root, p1, ceiling, best, length, mode, bound, lower, steps, S.Running{}, profile}}:
      PartEnd{PartExhausted{table, steps}}
    case S.Search{table, stack, S.Meta{root, p1, ceiling, best, length, mode, bound, lower, steps, S.Running{}, profile}}:
      PartActive{S.Search{table, stack, S.Meta{root, p1, ceiling, best, length, mode, bound, lower, steps, S.Running{}, profile}}}
    case S.Search{table, stack, meta}: PartEnd{PartRejected{table}}

def found(hit: Bool, state: S.Search) -> Stage:
  match hit state:
    case True{} S.Search{table, stack, S.Meta{root, p1, ceiling, best, length, mode, bound, lower, steps, status, profile}}:
      PartEnd{PartFound{table, best, length, steps}}
    case False{} state: stacked(state)

def classify(state: S.Search) -> Stage:
  match state:
    case S.Search{table, stack, +meta}:
      match meta:
        case S.Meta{root, p1, ceiling, best, +length, mode, bound, lower, steps, status, profile}:
          found(U32.is_lt(length, 31), S.Search{table, stack, meta})

def run(fuel: Nat, state: Stage) -> PartResult:
  match fuel state:
    case _ PartEnd{result}: result
    case 0n PartActive{S.Search{table, stack, S.Meta{root, p1, ceiling, best, length, mode, bound, lower, steps, status, profile}}}:
      PartPartial{table, steps}
    case 1n+p PartActive{state}: run(p, classify(S.advance(state)))

def digits(fuel: Nat, +code: U32, acc: +List<U32>) -> +List<U32>:
  match fuel:
    case 0n: acc
    case 1n+p: digits(p, (code / 18 : U32), (code % 18 : U32) <> acc)

def walked(allowed: Bool, +move: U32, cube: C.Cubie, reverse: +List<U32>, next: PrefixState -> Maybe<&2, PrefixState>) -> Maybe<&2, PrefixState>:
  match allowed:
    case True{}: next(PrefixState{C.turn(move, cube), (move / 3 : U32), move <> reverse})
    case False{}: None{}

def walk(moves: +List<U32>, state: PrefixState) -> Maybe<&2, PrefixState>:
  match moves state:
    case Nil{} state: Some{state}
    case Con{+move, rest} PrefixState{cube, previous, reverse}:
      walked(P.allowed(previous, move), move, cube, reverse, s => walk(rest, s))

def seeded(value: Maybe<&2, PrefixState>, table: Array<U32>, +root: C.Cubie, +contour: U32, +depth: U32) -> Stage:
  match value:
    case None{}: PartEnd{PartRejected{table}}
    case Some{PrefixState{+cube, previous, reverse}}:
      classify(S.Search{table, S.Node{cube, Q.encode(Q.Twist{}, cube), Q.encode(Q.Flip{}, cube), Q.encode(Q.Slice{}, cube), (contour - depth : U32), previous, 0, S.FullCube{}, reverse, depth} <> Nil{}, S.Meta{root, 0, 21, Nil{}, 31, S.ExactContour{}, contour, 0, 0, S.Running{}, S.RawInverseThree{}}})

def initial_kind(kind: U32, table: Array<U32>, +root: C.Cubie, +contour: U32, +depth: U32, code: U32) -> Stage:
  match kind:
    case 0: classify(S.Search{table, S.root_frame(root, (depth - 1 : U32), S.FullCube{}) <> Nil{}, S.Meta{root, 0, 21, Nil{}, 31, S.ExactContour{}, contour, 0, 0, S.Running{}, S.RawInverseThree{}}})
    case _: seeded(walk(digits(U32.to_nat(depth), code, Nil{}), PrefixState{root, P.frame_mask(S.root_frame(root, 0, S.FullCube{})), Nil{}}), table, root, contour, depth)

def admitted(ok: Bool, kind: U32, table: Array<U32>, root: C.Cubie, contour: U32, depth: U32, code: U32) -> Stage:
  match ok:
    case True{}: initial_kind(kind, table, root, contour, depth, code)
    case False{}: PartEnd{PartRejected{table}}

def initialize(+kind: U32, table: Array<U32>, root: C.Cubie, +contour: U32, +depth: U32, +code: U32) -> Stage:
  admitted(U32.is_eq(depth, 2) && U32.is_ge(contour, depth) && U32.is_le(contour, 4) && ((U32.is_eq(kind, 0) && U32.is_eq(code, 0)) || (U32.is_eq(kind, 1) && U32.is_lt(code, 324))), kind, table, root, contour, depth, code)

def test_values(value: PartResult) -> +List<U32>:
  match value:
    case PartExhausted{table, steps}: [0, 31, steps]
    case PartFound{table, reverse, length, steps}: [1, length, steps]
    case PartPartial{table, steps}: [2, 31, steps]
    case PartRejected{table}: [3, 31, 0]

def test_state(which: U32, +root: C.Cubie) -> Stage:
  match which:
    case 1: classify(S.Search{[0 : U32^0n], Nil{}, S.Meta{root, 0, 21, Nil{}, 31, S.ExactContour{}, 4, 0, 0, S.Running{}, S.RawInverseThree{}}})
    case 2: classify(S.Search{[0 : U32^0n], Nil{}, S.Meta{root, 0, 21, Nil{}, 0, S.ExactContour{}, 4, 0, 0, S.SearchOptimal{}, S.RawInverseThree{}}})
    case 3: classify(S.Search{[0 : U32^0n], Nil{}, S.Meta{root, 0, 21, Nil{}, 31, S.ExactContour{}, 4, 0, 0, S.ProfileMismatch{}, S.RawInverseThree{}}})
    case _: classify(S.Search{[0 : U32^0n], S.root_frame(root, 0, S.FullCube{}) <> Nil{}, S.Meta{root, 0, 21, Nil{}, 31, S.ExactContour{}, 4, 0, 0, S.Running{}, S.RawInverseThree{}}})

def test_packet(+which: U32) -> +List<U32>:
  test_values(run(U32.to_nat(C.pick(U32.is_eq(which, 4), 1, 0)), test_state(which, C.solved())))

def test_admit(kind: U32, code: U32, contour: U32, depth: U32) -> +List<U32>:
  test_values(run(0n, initialize(kind, [0 : U32^0n], C.solved(), contour, depth, code)))
