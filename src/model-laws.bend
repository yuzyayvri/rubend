import Base
import ./model.bend as Model

law turn_inverse:
  for move: Model.Move
  for +cube: Model.Cube
  {Model.turn(Model.inverse(move), Model.turn(move, cube)) == cube : Model.Cube}

law turn_four:
  for +move: Model.Move
  for +cube: Model.Cube
  {Model.turn(move, Model.turn(move, Model.turn(move, Model.turn(move, cube)))) == cube : Model.Cube}

law inverse_involution:
  for +move: Model.Move
  {Model.inverse(Model.inverse(move)) == move : Model.Move}

law replay_append:
  for +a: +List<Model.Move>
  for +b: +List<Model.Move>
  for +cube: Model.Cube
  {Model.replay(List.append(&2, Model.Move, a, b), cube) == Model.replay(b, Model.replay(a, cube)) : Model.Cube}
