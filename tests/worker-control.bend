import Base
import ../src/worker-control.bend as Control

def show(step: Control.Byte) -> String:
  match step:
    case Control.More{value, digits}: "more " ++ U32.show(value) ++ " " ++ U32.show(digits)
    case Control.Send{id}: "send " ++ U32.show(id)
    case Control.Bad{}: "bad"

def main() -> IO(Unit):
  do IO<Unit>:
    IO.print(show(Control.byte(57, 429496729, 9)))
    IO.print(show(Control.byte(53, 429496729, 9)))
    IO.print(show(Control.byte(52, 429496730, 9)))
    IO.print(show(Control.byte(48, 1, 10)))
    IO.print(show(Control.byte(10, 0, 0)))
    IO.print(show(Control.byte(10, 0, 1)))
    IO.print(show(Control.byte(10, 42, 2)))
    IO.print(show(Control.byte(120, 0, 0)))
    IO.print(show(Control.byte(50, 4, 1)))
