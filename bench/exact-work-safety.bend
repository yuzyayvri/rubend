import Base
import ../src/model.bend as M
import ../src/model-laws.bend as L
import ../src/model-proof.bend as Verified
import ./subgroup-proof-kernel.bend as K
import ./piece-cells.bend as P
import ./piece-cell-inverse.bend as I
import ./piece-cell-composition.bend as C
import ./reference-inversion.bend as R

def CompletedFailure(-Context: Data, -permits: Context -> +List<M.Move> -> Type, -cube: M.Cube, -context: Context, -radius: Nat) -> Type:
  @+word: +List<M.Move> -> K.Le(K.length(word), radius) -> permits(context, word) -> {M.replay(word, cube) == M.solved() : M.Cube} -> Empty

law np06_reuse:
  for -Context: Data
  for -permits: Context -> +List<M.Move> -> Type
  for -cube: M.Cube
  for -context: Context
  for +radius: Nat
  for +remaining: Nat
  for failure: CompletedFailure(Context, permits, cube, context, radius)
  for contained: K.Le(remaining, radius)
  for +word: +List<M.Move>
  for within: K.Le(K.length(word), remaining)
  for admitted: permits(context, word)
  {M.replay(word, cube) != M.solved() : M.Cube}

def np06_reuse(Context, permits, cube, context, radius, remaining, failure, contained, word, within, admitted):
  failure(word, K.le_trans(K.length(word), remaining, radius, within, contained), admitted)

law exact_failure_key:
  for -Context: Data
  for -permits: Context -> +List<M.Move> -> Type
  for -cached_cube: M.Cube
  for -requested_cube: M.Cube
  for -cached_context: Context
  for -requested_context: Context
  for -radius: Nat
  for same_cube: {cached_cube == requested_cube : M.Cube}
  for same_context: {cached_context == requested_context : Context}
  for failure: CompletedFailure(Context, permits, cached_cube, cached_context, radius)
  CompletedFailure(Context, permits, requested_cube, requested_context, radius)

def exact_failure_key(Context, permits, cached_cube, requested_cube, cached_context, requested_context, radius, same_cube, same_context, failure):
  %same_cube : CompletedFailure(Context, permits, _, requested_context, radius)
  %same_context : CompletedFailure(Context, permits, cached_cube, _, radius)
  failure

type RequiredIndex<-count: Nat> is Type:
  At{+value: Nat, valid: K.Le(1n+value, count)}

law empty_required_set_has_no_index:
  for index: RequiredIndex<0n>
  Empty

def empty_required_set_has_no_index(index):
  match index:
    case At{value, valid}: valid

type Representative<-count: Nat, -admission: RequiredIndex<count> -> +List<M.Move> -> Type, -cube: M.Cube, -original_length: Nat, -depth: Nat> is Type:
  Covered{slot: RequiredIndex<count>, +word: +List<M.Move>, shorter: K.Le(K.length(word), original_length), original_within: K.Le(original_length, depth), admitted: admission(slot, word), solution: {M.replay(word, cube) == M.solved() : M.Cube}}

def Coverage(-count: Nat, -admission: RequiredIndex<count> -> +List<M.Move> -> Type, -cube: M.Cube, -depth: Nat) -> Type:
  @+word: +List<M.Move> -> K.Le(K.length(word), depth) -> {M.replay(word, cube) == M.solved() : M.Cube} -> Representative<count, admission, cube, K.length(word), depth>

def AllCompleted(-count: Nat, -admission: RequiredIndex<count> -> +List<M.Move> -> Type, -cube: M.Cube, -depth: Nat) -> Type:
  @slot: RequiredIndex<count> -> @+word: +List<M.Move> -> K.Le(K.length(word), depth) -> admission(slot, word) -> {M.replay(word, cube) == M.solved() : M.Cube} -> Empty

def representative_excluded(-count: Nat, -admission: RequiredIndex<count> -> +List<M.Move> -> Type, -cube: M.Cube, +original_length: Nat, +depth: Nat, complete: AllCompleted(count, admission, cube, depth), representative: Representative<count, admission, cube, original_length, depth>) -> Empty:
  match representative:
    case Covered{slot, +word, shorter, original_within, admitted, solution}:
      complete(slot, word, K.le_trans(K.length(word), original_length, depth, shorter, original_within), admitted, solution)

law np07_excludes:
  for -count: Nat
  for -admission: RequiredIndex<count> -> +List<M.Move> -> Type
  for -cube: M.Cube
  for +depth: Nat
  for coverage: Coverage(count, admission, cube, depth)
  for complete: AllCompleted(count, admission, cube, depth)
  for +word: +List<M.Move>
  for within: K.Le(K.length(word), depth)
  {M.replay(word, cube) != M.solved() : M.Cube}

def np07_excludes(count, admission, cube, depth, coverage, complete, word, within):
  solution => representative_excluded(count, admission, cube, K.length(word), depth, complete, coverage(word, within, solution))

def exceeds(+length: Nat, +depth: Nat, rejected: K.Le(length, depth) -> Empty) -> K.Le(1n+depth, length):
  match length depth:
    case 0n _: Empty.absurd(K.Le(1n+depth, length), rejected(Unit{}))
    case 1n+rest 0n: Unit{}
    case 1n+rest 1n+tail: exceeds(rest, tail, rejected)

law np07_lower:
  for -count: Nat
  for -admission: RequiredIndex<count> -> +List<M.Move> -> Type
  for -cube: M.Cube
  for +depth: Nat
  for coverage: Coverage(count, admission, cube, depth)
  for complete: AllCompleted(count, admission, cube, depth)
  for +word: +List<M.Move>
  for solution: {M.replay(word, cube) == M.solved() : M.Cube}
  K.Le(1n+depth, K.length(word))

def np07_lower(count, admission, cube, depth, coverage, complete, word, solution):
  exceeds(K.length(word), depth, within => np07_excludes(count, admission, cube, depth, coverage, complete, word, within, solution))

def reflexive(value: Nat) -> K.Le(value, value):
  match value:
    case 0n: Unit{}
    case 1n+rest: reflexive(rest)

def all_words(context: Unit, word: +List<M.Move>) -> Type:
  Unit

def one_partition(slot: RequiredIndex<1n>, word: +List<M.Move>) -> Type:
  Unit

def one_partition_coverage(-cube: M.Cube, -depth: Nat, +word: +List<M.Move>, within: K.Le(K.length(word), depth), solution: {M.replay(word, cube) == M.solved() : M.Cube}) -> Representative<1n, one_partition, cube, K.length(word), depth>:
  Covered{At{0n, Unit{}}, word, reflexive(K.length(word)), within, Unit{}, solution}

def u_not_identity(solution: {M.turn(M.U{}, M.solved()) == M.solved() : M.Cube}) -> Empty:
  K.false_clash(Equal.cong(M.Cube, Bool, M.is_solved, M.turn(M.U{}, M.solved()), M.solved(), solution))

def u_zero_failure(+word: +List<M.Move>, within: K.Le(K.length(word), 0n), admitted: Unit, solution: {M.replay(word, M.turn(M.U{}, M.solved())) == M.solved() : M.Cube}) -> Empty:
  match word:
    case Nil{}: u_not_identity(solution)
    case Con{head, tail}: within

def u_zero_partition(slot: RequiredIndex<1n>, +word: +List<M.Move>, within: K.Le(K.length(word), 0n), admitted: Unit, solution: {M.replay(word, M.turn(M.U{}, M.solved())) == M.solved() : M.Cube}) -> Empty:
  u_zero_failure(word, within, admitted, solution)

def np06_u_empty() -> {M.turn(M.U{}, M.solved()) != M.solved() : M.Cube}:
  np06_reuse(Unit, all_words, M.turn(M.U{}, M.solved()), Unit{}, 0n, 0n, u_zero_failure, Unit{}, Nil{}, Unit{}, Unit{})

def np07_u_lower() -> K.Le(1n, 1n):
  np07_lower(1n, one_partition, M.turn(M.U{}, M.solved()), 0n, one_partition_coverage(M.turn(M.U{}, M.solved()), 0n), u_zero_partition, M.Ui{} <> Nil{}, L.turn_inverse(M.U{}, M.solved()))

law np08_left_inverse:
  for +reaching: +List<M.Move>
  for +move: M.Move
  {R.inverse_root(List.append(&2, M.Move, reaching, move <> Nil{})) == C.compose(P.turn(M.inverse(move), P.solved_cells()), R.inverse_root(reaching)) : P.PieceCells}

def np08_left_inverse(reaching, move):
  +left = P.turn(M.inverse(move), P.solved_cells())
  inverse_word = Equal.cong(+List<M.Move>, P.PieceCells, word => P.replay(word, P.solved_cells()), I.inverse_word(List.append(&2, M.Move, reaching, move <> Nil{})), M.inverse(move) <> I.inverse_word(reaching), I.inverse_snoc(reaching, move))
  composed = Equal.trans(P.PieceCells, C.compose(left, R.inverse_root(reaching)), P.replay(I.inverse_word(reaching), C.compose(left, P.solved_cells())), P.replay(I.inverse_word(reaching), left), C.compose_word(left, I.inverse_word(reaching), P.solved_cells()), Equal.cong(P.PieceCells, P.PieceCells, cells => P.replay(I.inverse_word(reaching), cells), C.compose(left, P.solved_cells()), left, C.compose_identity(left)))
  Equal.trans(P.PieceCells, R.inverse_root(List.append(&2, M.Move, reaching, move <> Nil{})), P.replay(I.inverse_word(reaching), left), C.compose(left, R.inverse_root(reaching)), inverse_word, Equal.sym(P.PieceCells, C.compose(left, R.inverse_root(reaching)), P.replay(I.inverse_word(reaching), left), composed))

def appended_solution(+reaching: +List<M.Move>, +move: M.Move, +word: +List<M.Move>, solution: {P.replay(word, P.turn(move, R.root(reaching))) == P.solved_cells() : P.PieceCells}) -> {P.replay(word, R.root(List.append(&2, M.Move, reaching, move <> Nil{}))) == P.solved_cells() : P.PieceCells}:
  %Equal.sym(P.PieceCells, R.root(List.append(&2, M.Move, reaching, move <> Nil{})), P.turn(move, R.root(reaching)), I.replay_append(reaching, move <> Nil{}, P.solved_cells())) : {P.replay(word, _) == P.solved_cells() : P.PieceCells}
  solution

law np08_reconstruction:
  for +reaching: +List<M.Move>
  for +move: M.Move
  for +word: +List<M.Move>
  for solution: {P.replay(word, P.turn(move, R.root(reaching))) == P.solved_cells() : P.PieceCells}
  {P.replay(I.inverse_word(word), C.compose(P.turn(M.inverse(move), P.solved_cells()), R.inverse_root(reaching))) == P.solved_cells() : P.PieceCells}

def np08_reconstruction(reaching, move, word, solution):
  %np08_left_inverse(reaching, move) : {P.replay(I.inverse_word(word), _) == P.solved_cells() : P.PieceCells}
  R.invert_solution(List.append(&2, M.Move, reaching, move <> Nil{}), word, appended_solution(reaching, move, word, solution))

def test_radius(remaining: U32, radius: U32) -> Bool:
  Nat.is_le(U32.to_nat(remaining), U32.to_nat(radius))

def test_index(count: U32, value: U32) -> Bool:
  Nat.is_le(1n+U32.to_nat(value), U32.to_nat(count))

def test_inverse_step(reaching: +List<U32>, move: U32) -> M.Cube:
  P.to_facelets(R.inverse_root(List.append(&2, M.Move, I.test_moves(reaching), M.from_index(move) <> Nil{})))

def test_left(reaching: +List<U32>, move: U32) -> M.Cube:
  P.to_facelets(C.compose(P.turn(M.inverse(M.from_index(move)), P.solved_cells()), R.inverse_root(I.test_moves(reaching))))

def test_wrong_right(reaching: +List<U32>, move: U32) -> M.Cube:
  P.to_facelets(P.turn(M.inverse(M.from_index(move)), R.inverse_root(I.test_moves(reaching))))

def test_transfer(reaching: +List<U32>, move: U32, solution: +List<U32>) -> M.Cube:
  P.to_facelets(P.replay(I.inverse_word(I.test_moves(solution)), C.compose(P.turn(M.inverse(M.from_index(move)), P.solved_cells()), R.inverse_root(I.test_moves(reaching)))))
