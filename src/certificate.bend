import Base
import ./model.bend as M

type Certificate<-cube: M.Cube> is Data:
  Certificate{+moves: +List<M.Move>, proof: {M.is_solved(M.replay(moves, cube)) == True{} : Bool}}

def true_evidence(+value: Bool) -> Maybe<&1, {value == True{} : Bool}>:
  match value:
    case False{}:
      None{}
    case True{}:
      Some{{==}}

def package(-cube: M.Cube, +moves: +List<M.Move>, evidence: Maybe<&1, {M.is_solved(M.replay(moves, cube)) == True{} : Bool}>) -> Maybe<&2, Certificate<cube>>:
  match evidence:
    case None{}:
      None{}
    case Some{proof}:
      Some{Certificate{moves, proof}}

def certify(+cube: M.Cube, +moves: +List<M.Move>) -> Maybe<&2, Certificate<cube>>:
  package(cube, moves, true_evidence(M.is_solved(M.replay(moves, cube))))

def moves(-cube: M.Cube, certificate: Certificate<cube>) -> +List<M.Move>:
  match certificate:
    case Certificate{moves, proof}:
      moves

law sound:
  for +cube: M.Cube
  for +certificate: Certificate<cube>
  {M.is_solved(M.replay(moves(cube, certificate), cube)) == True{} : Bool}

def sound(cube, certificate):
  match certificate:
    case Certificate{moves, proof}:
      proof
