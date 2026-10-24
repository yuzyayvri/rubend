import Base
import ../src/model.bend as M
import ../src/model-laws.bend as L
import ../src/model-proof.bend as Verified
import ../src/certificate.bend as Cert
import ./piece-cells.bend as P
import ./piece-cell-inverse.bend as I
import ./reference-inversion.bend as R

import ./certificate-solved.bend as S

def cancel_word(+word: +List<M.Move>, +cube: M.Cube) -> {M.replay(I.inverse_word(word), M.replay(word, cube)) == cube : M.Cube}:
  match word:
    case Nil{}: {==}
    case Con{+move, +rest}:
      Equal.trans(M.Cube, M.replay(List.append(&2, M.Move, I.inverse_word(rest), M.inverse(move) <> Nil{}), M.replay(rest, M.turn(move, cube))), M.turn(M.inverse(move), M.replay(I.inverse_word(rest), M.replay(rest, M.turn(move, cube)))), cube, L.replay_append(I.inverse_word(rest), M.inverse(move) <> Nil{}, M.replay(rest, M.turn(move, cube))), Equal.trans(M.Cube, M.turn(M.inverse(move), M.replay(I.inverse_word(rest), M.replay(rest, M.turn(move, cube)))), M.turn(M.inverse(move), M.turn(move, cube)), cube, Equal.cong(M.Cube, M.Cube, state => M.turn(M.inverse(move), state), M.replay(I.inverse_word(rest), M.replay(rest, M.turn(move, cube))), M.turn(move, cube), cancel_word(rest, M.turn(move, cube))), L.turn_inverse(move, cube)))

def recover_solution(+cube: M.Cube, +word: +List<M.Move>, solution: {M.replay(word, cube) == M.solved() : M.Cube}) -> {cube == M.replay(I.inverse_word(word), M.solved()) : M.Cube}:
  Equal.trans(M.Cube, cube, M.replay(I.inverse_word(word), M.replay(word, cube)), M.replay(I.inverse_word(word), M.solved()), Equal.sym(M.Cube, M.replay(I.inverse_word(word), M.replay(word, cube)), cube, cancel_word(word, cube)), Equal.cong(M.Cube, M.Cube, state => M.replay(I.inverse_word(word), state), M.replay(word, cube), M.solved(), solution))

def root_view(+word: +List<M.Move>) -> {P.to_facelets(R.root(word)) == M.replay(word, M.solved()) : M.Cube}:
  Equal.trans(M.Cube, P.to_facelets(R.root(word)), M.replay(word, P.to_facelets(P.solved_cells())), M.replay(word, M.solved()), P.replay_refinement(word, P.solved_cells()), Equal.cong(M.Cube, M.Cube, cube => M.replay(word, cube), P.to_facelets(P.solved_cells()), M.solved(), P.solved_refinement()))

type CRTWitness<-cube: M.Cube> is Data:
  CRTReaching{+word: +List<M.Move>, same: {cube == P.to_facelets(R.root(word)) : M.Cube}}

def from_certificate(+cube: M.Cube, certificate: Cert.Certificate<cube>) -> CRTWitness<cube>:
  match certificate:
    case Cert.Certificate{+moves, proof}:
      CRTReaching{I.inverse_word(moves), Equal.trans(M.Cube, cube, M.replay(I.inverse_word(moves), M.solved()), P.to_facelets(R.root(I.inverse_word(moves))), recover_solution(cube, moves, S.solved_equal(M.replay(moves, cube), proof)), Equal.sym(M.Cube, P.to_facelets(R.root(I.inverse_word(moves))), M.replay(I.inverse_word(moves), M.solved()), root_view(I.inverse_word(moves))))}

def witness_word(-cube: M.Cube, witness: CRTWitness<cube>) -> +List<M.Move>:
  match witness:
    case CRTReaching{word, same}: word

def witness_sound(+cube: M.Cube, +witness: CRTWitness<cube>) -> {cube == P.to_facelets(R.root(witness_word(cube, witness))) : M.Cube}:
  match witness:
    case CRTReaching{word, same}: same

def packet(-cube: M.Cube, witness: CRTWitness<cube>) -> +List<U32>:
  1 <> I.test_numbers(witness_word(cube, witness))

def certificate_packet(+cube: M.Cube, result: Maybe<&2, Cert.Certificate<cube>>) -> +List<U32>:
  match result:
    case None{}: [0]
    case Some{certificate}: packet(cube, from_certificate(cube, certificate))

def test_witness(+cube: M.Cube, numbers: +List<U32>) -> +List<U32>:
  certificate_packet(cube, Cert.certify(cube, I.test_moves(numbers)))

def test_cancel(+cube: M.Cube, numbers: +List<U32>) -> M.Cube:
  +word = I.test_moves(numbers)
  M.replay(I.inverse_word(word), M.replay(word, cube))

def test_root(numbers: +List<U32>) -> M.Cube:
  P.to_facelets(R.root(I.test_moves(numbers)))
