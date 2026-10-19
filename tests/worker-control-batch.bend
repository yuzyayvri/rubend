import Base
import ../src/worker-control.bend as Control

def truth(value: Bool) -> String:
  match value:
    case True{}: "yes"
    case False{}: "no"

def show(state: Control.Scan) -> IO(Unit):
  match state:
    case Control.Scanned{value, digits, matched}: IO.print(U32.show(value) ++ " " ++ U32.show(digits) ++ " " ++ truth(matched))
    case Control.Malformed{}: IO.die(Unit, 2, "Invalid engine control record")

def positive() -> IO(Unit):
  do IO<Unit>:
    show(Control.chunk("4", Control.Scanned{0, 0, False{}}, 42))
    show(Control.chunk("2\n7\n429496", Control.Scanned{4, 1, False{}}, 42))
    show(Control.chunk("7295\n", Control.Scanned{429496, 6, False{}}, 4294967295))
    show(Control.chunk("", Control.Scanned{0, 0, False{}}, 42))
    show(Control.chunk("99\n", Control.Scanned{0, 0, False{}}, 42))
    show(Control.chunk("42\n", Control.Scanned{0, 0, False{}}, 42))
    show(Control.chunk("1\n42\n7\n", Control.Scanned{0, 0, False{}}, 42))
    show(Control.chunk("4294967295\n", Control.Scanned{0, 0, False{}}, 42))
    show(Control.chunk("42", Control.Scanned{0, 0, False{}}, 42))

def command(args: List<String>) -> IO(Unit):
  match args:
    case Con{program, Con{text, Nil{}}}: show(Control.chunk(text, Control.Scanned{0, 0, False{}}, 42))
    case _: positive()

def main() -> IO(Unit):
  do IO<Unit>:
    args : List<String> <- IO.args()
    command(args)
