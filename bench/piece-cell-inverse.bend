import Base
import ../src/model.bend as M
import ../src/model-laws.bend as L
import ../src/model-proof.bend as Verified
import ./piece-cells.bend as P
import ./subgroup-proof-kernel.bend as K

def inverse_step(+move: M.Move, +cells: P.PieceCells) -> {P.turn(M.inverse(move), P.turn(move, cells)) == cells : P.PieceCells}:
  P.facelets_injective(P.turn(M.inverse(move), P.turn(move, cells)), cells, Equal.trans(M.Cube, P.to_facelets(P.turn(M.inverse(move), P.turn(move, cells))), M.turn(M.inverse(move), M.turn(move, P.to_facelets(cells))), P.to_facelets(cells), Equal.trans(M.Cube, P.to_facelets(P.turn(M.inverse(move), P.turn(move, cells))), M.turn(M.inverse(move), P.to_facelets(P.turn(move, cells))), M.turn(M.inverse(move), M.turn(move, P.to_facelets(cells))), P.move_refinement(M.inverse(move), P.turn(move, cells)), Equal.cong(M.Cube, M.Cube, view => M.turn(M.inverse(move), view), P.to_facelets(P.turn(move, cells)), M.turn(move, P.to_facelets(cells)), P.move_refinement(move, cells))), L.turn_inverse(move, P.to_facelets(cells))))

def inverse_word(word: +List<M.Move>) -> +List<M.Move>:
  match word:
    case Nil{}: Nil{}
    case Con{move, rest}: List.append(&2, M.Move, inverse_word(rest), M.inverse(move) <> Nil{})

def inverse_length(+word: +List<M.Move>) -> {K.length(inverse_word(word)) == K.length(word) : Nat}:
  match word:
    case Nil{}: {==}
    case Con{+move, +rest}:
      Equal.trans(Nat, K.length(List.append(&2, M.Move, inverse_word(rest), M.inverse(move) <> Nil{})), 1n+K.length(inverse_word(rest)), 1n+K.length(rest), K.snoc_length(inverse_word(rest), M.inverse(move)), Equal.cong(Nat, Nat, n => 1n+n, K.length(inverse_word(rest)), K.length(rest), inverse_length(rest)))

def replay_append(+prefix: +List<M.Move>, +suffix: +List<M.Move>, +cells: P.PieceCells) -> {P.replay(List.append(&2, M.Move, prefix, suffix), cells) == P.replay(suffix, P.replay(prefix, cells)) : P.PieceCells}:
  match prefix:
    case Nil{}: {==}
    case Con{+move, +rest}: replay_append(rest, suffix, P.turn(move, cells))

def cancel_word(+word: +List<M.Move>, +cells: P.PieceCells) -> {P.replay(inverse_word(word), P.replay(word, cells)) == cells : P.PieceCells}:
  match word:
    case Nil{}: {==}
    case Con{+move, +rest}:
      Equal.trans(P.PieceCells, P.replay(List.append(&2, M.Move, inverse_word(rest), M.inverse(move) <> Nil{}), P.replay(rest, P.turn(move, cells))), P.turn(M.inverse(move), P.replay(inverse_word(rest), P.replay(rest, P.turn(move, cells)))), cells, replay_append(inverse_word(rest), M.inverse(move) <> Nil{}, P.replay(rest, P.turn(move, cells))), Equal.trans(P.PieceCells, P.turn(M.inverse(move), P.replay(inverse_word(rest), P.replay(rest, P.turn(move, cells)))), P.turn(M.inverse(move), P.turn(move, cells)), cells, Equal.cong(P.PieceCells, P.PieceCells, state => P.turn(M.inverse(move), state), P.replay(inverse_word(rest), P.replay(rest, P.turn(move, cells))), P.turn(move, cells), cancel_word(rest, P.turn(move, cells))), inverse_step(move, cells)))

def recover_solution(+word: +List<M.Move>, +root: P.PieceCells, solution: {P.replay(word, root) == P.solved_cells() : P.PieceCells}) -> {root == P.replay(inverse_word(word), P.solved_cells()) : P.PieceCells}:
  Equal.trans(P.PieceCells, root, P.replay(inverse_word(word), P.replay(word, root)), P.replay(inverse_word(word), P.solved_cells()), Equal.sym(P.PieceCells, P.replay(inverse_word(word), P.replay(word, root)), root, cancel_word(word, root)), Equal.cong(P.PieceCells, P.PieceCells, state => P.replay(inverse_word(word), state), P.replay(word, root), P.solved_cells(), solution))

def test_moves(word: +List<U32>) -> +List<M.Move>:
  match word:
    case Nil{}: Nil{}
    case Con{move, rest}: M.from_index(move) <> test_moves(rest)

def test_numbers(word: +List<M.Move>) -> +List<U32>:
  match word:
    case Nil{}: Nil{}
    case Con{move, rest}: M.index(move) <> test_numbers(rest)

def test_inverse(word: +List<U32>) -> +List<U32>:
  test_numbers(inverse_word(test_moves(word)))
