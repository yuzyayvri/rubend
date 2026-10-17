import Base
import ./model.bend as M

type Scan is Data:
  Scan{pending: U32, power: U32, moves: +List<M.Move>, error: U32}

type Parsed is Data:
  Parsed{moves: +List<U32>}
  ParseError{offset: U32}

def flush(state: Scan) -> Scan:
  match state:
    case Scan{6, power, moves, error}:
      Scan{6, 0, moves, error}
    case Scan{face, power, moves, error}:
      Scan{6, 0, M.from_index((face * 3 + power : U32)) <> moves, error}

def start(face: U32, state: Scan) -> Scan:
  match state:
    case Scan{pending, power, moves, error}:
      Scan{face, 0, moves, error}

def suffix(ok: Bool, power: U32, state: Scan, at: U32) -> Scan:
  match ok state:
    case True{} Scan{pending, previous, moves, error}:
      Scan{pending, power, moves, error}
    case False{} Scan{pending, previous, moves, error}:
      Scan{pending, previous, moves, at}

def step(code: U32, +state: Scan, at: U32) -> Scan:
  match code state:
    case 85 _:
      start(0, flush(state))
    case 82 _:
      start(1, flush(state))
    case 70 _:
      start(2, flush(state))
    case 68 _:
      start(3, flush(state))
    case 76 _:
      start(4, flush(state))
    case 66 _:
      start(5, flush(state))
    case 32 _:
      flush(state)
    case 9 _:
      flush(state)
    case 10 _:
      flush(state)
    case 13 _:
      flush(state)
    case 50 Scan{+pending, +power, moves, error}:
      suffix(U32.is_lt(pending, 6) && U32.is_eq(power, 0), 1, Scan{pending, power, moves, error}, at)
    case 39 Scan{+pending, +power, moves, error}:
      suffix(U32.is_lt(pending, 6) && U32.is_eq(power, 0), 2, Scan{pending, power, moves, error}, at)
    case 8242 Scan{+pending, +power, moves, error}:
      suffix(U32.is_lt(pending, 6) && U32.is_eq(power, 0), 2, Scan{pending, power, moves, error}, at)
    case _ Scan{pending, power, moves, error}:
      Scan{pending, power, moves, at}

def scan(text: String, state: Scan, +at: U32) -> Scan:
  match text:
    case SNil{}:
      flush(state)
    case SCon{Chr{code}, rest}:
      scan(rest, step(code, state, at), (at + 1 : U32))

def indices(xs: +List<M.Move>) -> +List<U32>:
  match xs:
    case Nil{}:
      Nil{}
    case Con{move, rest}:
      M.index(move) <> indices(rest)

def finish(state: Scan) -> Parsed:
  match state:
    case Scan{pending, power, moves, 0}:
      Parsed{indices(List.reverse(&2, M.Move, moves))}
    case Scan{pending, power, moves, error}:
      ParseError{error}

def parse(text: String) -> Parsed:
  finish(scan(text, Scan{6, 0, Nil{}, 0}, 1))

law single_move_roundtrip:
  for +move: M.Move
  {parse(M.show_move(move)) == Parsed{[M.index(move)]} : Parsed}

def single_move_roundtrip(move):
  match move:
    case M.U{}: {==}
    case M.U2{}: {==}
    case M.Ui{}: {==}
    case M.R{}: {==}
    case M.R2{}: {==}
    case M.Ri{}: {==}
    case M.F{}: {==}
    case M.F2{}: {==}
    case M.Fi{}: {==}
    case M.D{}: {==}
    case M.D2{}: {==}
    case M.Di{}: {==}
    case M.L{}: {==}
    case M.L2{}: {==}
    case M.Li{}: {==}
    case M.B{}: {==}
    case M.B2{}: {==}
    case M.Bi{}: {==}
