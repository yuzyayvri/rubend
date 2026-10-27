import Base
import ../src/model.bend as M
import ../src/cubie.bend as C
import ../src/symmetry.bend as Y

type Seed is Data:
  NoSeed{}
  Preturn{move: M.Move}

def chosen_seed(none: Bool, index: U32) -> Seed:
  match none:
    case True{}: NoSeed{}
    case False{}: Preturn{M.from_index(index)}

def checked_seed(valid: Bool, +index: U32) -> Maybe<&2, Seed>:
  match valid:
    case False{}: None{}
    case True{}: Some{chosen_seed(U32.is_eq(index, 18), index)}

def parse_seed(+index: U32) -> Maybe<&2, Seed>:
  checked_seed(U32.is_lt(index, 19), index)

def seeded(seed: Seed, cube: M.Cube) -> M.Cube:
  match seed:
    case NoSeed{}: cube
    case Preturn{move}: M.turn(move, cube)

def inverted(enabled: Bool, valid: C.Validation) -> C.Validation:
  match enabled valid:
    case True{} C.Valid{cube}: C.Valid{C.inverse(cube)}
    case _ valid: valid

def frame(seed: Seed, +variant: U32, cube: M.Cube) -> C.Validation:
  inverted(U32.is_ge(variant, 3), C.validate(Y.view((variant % 3 : U32), seeded(seed, cube))))

def combined(zero: Bool, face: U32, power: U32, rest: +List<U32>) -> +List<U32>:
  match zero:
    case True{}: rest
    case False{}: (face * 3 + power - 1 : U32) <> rest

def adjacent(same: Bool, +move: U32, +head: U32, rest: +List<U32>) -> +List<U32>:
  match same:
    case False{}: move <> head <> rest
    case True{}:
      +power = ((move % 3 + head % 3 + 2) % 4 : U32)
      combined(U32.is_eq(power, 0), (move / 3 : U32), power, rest)

def push(+move: U32, path: +List<U32>) -> +List<U32>:
  match path:
    case Nil{}: [move]
    case Con{+head, rest}: adjacent(U32.is_eq((move / 3 : U32), (head / 3 : U32)), move, head, rest)

def reduced(path: +List<U32>, acc: +List<U32>) -> +List<U32>:
  match path:
    case Nil{}: List.reverse(&2, U32, acc)
    case Con{move, rest}: reduced(rest, push(move, acc))

def normalize(path: +List<U32>) -> +List<U32>:
  reduced(path, Nil{})

def reconstruct(seed: Seed, variant: U32, local: +List<U32>) -> +List<U32>:
  match seed:
    case NoSeed{}: normalize(Y.to_global(variant, local))
    case Preturn{move}:
      normalize(List.append(&2, U32, Y.to_global(variant, local), [M.index(move)]))

def local_incumbent(seed: Seed, variant: U32, global: +List<U32>) -> +List<U32>:
  match seed:
    case NoSeed{}: Y.to_local(variant, global)
    case Preturn{move}:
      Y.to_local(variant, List.append(&2, U32, global, [M.index(M.inverse(move))]))

def moves(values: +List<U32>) -> +List<M.Move>:
  match values:
    case Nil{}: Nil{}
    case Con{value, rest}: M.from_index(value) <> moves(rest)

def packet(valid: C.Validation, +local: +List<U32>, +global: +List<U32>) -> +List<U32>:
  match valid:
    case C.Invalid{code}: Nil{}
    case C.Valid{C.Cubie{cp, co, ep, eh, eo}}:
      cp <> co <> ep <> eh <> eo <> U32.from_nat(List.length(&2, U32, local)) <> List.append(&2, U32, local, U32.from_nat(List.length(&2, U32, global)) <> global)

def assembled(+seed: Seed, +variant: U32, cube: M.Cube, global: +List<U32>) -> +List<U32>:
  +local = {local_incumbent(seed, variant, global) : +List<U32>}
  packet(frame(seed, variant, cube), local, reconstruct(seed, variant, local))

def admitted(valid: Bool, seed: Maybe<&2, Seed>, variant: U32, +scramble: +List<U32>) -> +List<U32>:
  match valid seed:
    case True{} Some{seed}: assembled(seed, variant, M.replay(moves(scramble), M.solved()), Y.invert_moves(scramble))
    case _ _: Nil{}

def test_case(seed: U32, +variant: U32, scramble: +List<U32>) -> +List<U32>:
  admitted(U32.is_lt(variant, 6), parse_seed(seed), variant, scramble)
