import Base
import ../src/model.bend as M
import ./piece-cells.bend as P
import ./piece-cell-inverse.bend as I
import ./piece-cell-composition.bend as C
import ./reference-inversion.bend as R

def test_compose(a: +List<U32>, b: +List<U32>) -> M.Cube:
  P.to_facelets(C.compose(R.root(I.test_moves(a)), R.root(I.test_moves(b))))

def test_inverse(scramble: +List<U32>) -> M.Cube:
  P.to_facelets(R.inverse_root(I.test_moves(scramble)))

def test_inverse_solution(scramble: +List<U32>, solution: +List<U32>) -> M.Cube:
  P.to_facelets(P.replay(I.inverse_word(I.test_moves(solution)), R.inverse_root(I.test_moves(scramble))))

def test_inverse_numbers(word: +List<U32>) -> +List<U32>:
  I.test_inverse(word)
