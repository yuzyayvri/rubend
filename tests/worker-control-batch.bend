import Base
import ../src/worker-control.bend as Control

def show(value: Bool) -> IO(Unit):
  match value:
    case True{}: IO.print("yes")
    case False{}: IO.print("no")

def positive() -> IO(Unit):
  do IO<Unit>:
    +channel : Chan(U32) <- Chan.new(U32, 32)
    state : U32 & U32 <- Control.chunk("4", (0, 0), channel)
    state : U32 & U32 <- Control.chunk("2\n7\n429496", state, channel)
    state : U32 & U32 <- Control.chunk("7295\n", state, channel)
    first : Bool <- Control.poll(Control.Attached{42, channel})
    show(first)
    second : Bool <- Control.poll(Control.Attached{7, channel})
    show(second)
    maximum : Bool <- Control.poll(Control.Attached{4294967295, channel})
    show(maximum)
    empty : Bool <- Control.poll(Control.Attached{42, channel})
    show(empty)
    state : U32 & U32 <- Control.chunk("99\n42\n", state, channel)
    stale : Bool <- Control.poll(Control.Attached{42, channel})
    show(stale)
    current : Bool <- Control.poll(Control.Attached{42, channel})
    show(current)
    Chan.close(U32, channel)

def command(args: List<String>) -> IO(Unit):
  match args:
    case Con{program, Con{text, Nil{}}}:
      do IO<Unit>:
        channel : Chan(U32) <- Chan.new(U32, 32)
        state : U32 & U32 <- Control.chunk(text, (0, 0), channel)
        IO.pure(Unit, Unit{})
    case _: positive()

def main() -> IO(Unit):
  do IO<Unit>:
    args : List<String> <- IO.args()
    command(args)
