import Base
import ../bench/subgroup-proof-kernel.bend as K
import ../src/model.bend as M
import ../src/model-laws.bend as L

def root() -> M.Cube:
  M.turn(M.U{}, M.solved())

def inside(cube: M.Cube) -> Bool:
  M.is_solved(cube)

def member(move: M.Move) -> Bool:
  False{}

def closed(move: M.Move, cube: M.Cube, membership: {member(move) == True{} : Bool}, reached: {inside(cube) == True{} : Bool}) -> {inside(M.turn(move, cube)) == True{} : Bool}:
  Empty.absurd({inside(M.turn(move, cube)) == True{} : Bool}, K.false_clash(membership))

def inverses(move: M.Move, membership: {member(move) == True{} : Bool}) -> {member(M.inverse(move)) == True{} : Bool}:
  membership

def admissible(word: +List<M.Move>, reached: {inside(K.replay(word, root())) == True{} : Bool}) -> K.Le(1n, K.length(word)):
  match word:
    case Nil{}: K.false_clash(reached)
    case Con{last, prefix}: Unit{}

def main() -> {member(M.Ui{}) != True{} : Bool}:
  K.target_final_exclusion(inside, member, root(), Nil{}, M.Ui{}, 1n, {==}, closed, inverses, admissible, Unit{}, L.turn_inverse(M.U{}, M.solved()))
