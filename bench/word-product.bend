import Base
import ../src/model.bend as M
import ./piece-cells.bend as P
import ./piece-cell-inverse.bend as I
import ./piece-cell-composition.bend as C
import ./reference-inversion.bend as R

def root_concat(+left: +List<M.Move>, +right: +List<M.Move>) -> {R.root(List.append(&2, M.Move, left, right)) == C.compose(R.root(left), R.root(right)) : P.PieceCells}:
  Equal.trans(P.PieceCells, R.root(List.append(&2, M.Move, left, right)), P.replay(right, R.root(left)), C.compose(R.root(left), R.root(right)), I.replay_append(left, right, P.solved_cells()), Equal.trans(P.PieceCells, P.replay(right, R.root(left)), P.replay(right, C.compose(R.root(left), P.solved_cells())), C.compose(R.root(left), R.root(right)), Equal.cong(P.PieceCells, P.PieceCells, cells => P.replay(right, cells), R.root(left), C.compose(R.root(left), P.solved_cells()), Equal.sym(P.PieceCells, C.compose(R.root(left), P.solved_cells()), R.root(left), C.compose_identity(R.root(left)))), Equal.sym(P.PieceCells, C.compose(R.root(left), R.root(right)), P.replay(right, C.compose(R.root(left), P.solved_cells())), C.compose_word(R.root(left), right, P.solved_cells()))))
