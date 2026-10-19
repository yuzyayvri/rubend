import Base
import ../src/owned/search.bend as S
import ../src/owned/portfolio.bend as P
import ../src/owned/main.bend as H
import ../src/cubie.bend as C
import ../src/model.bend as M
import ../src/worker-control.bend as Control

def broken() -> S.Search:
  S.Search{[0 : U32*1n], S.Store{[S.EmptySlot{} : S.Slot*64n], [0 : U32*32n], 1, 0, S.FrameCapacity{}}, S.Meta{C.solved(), 0, 21, Nil{}, 31, S.Improve{}, 0, 0, 0, S.Running{}, S.Light{}}}

def session() -> P.Session:
  P.finish_slice(S.run(0n, broken()), P.NoTasks{}, C.solved(), Nil{}, 0, P.Fast{}, 0, 0, 0, 0)

def failed(state: P.Session) -> Bool:
  match state:
    case P.Session{table, tasks, root, best, length, lower, nodes, request, S.ContinuationFailure{S.FrameCapacity{}}}: True{}
    case _: False{}

def deduplicated(entries: +List<P.Descriptor>) -> Bool:
  match entries:
    case Con{P.Descriptor{0, first}, Con{P.Descriptor{3, second}, Nil{}}}: Bool.not(P.same(first, second))
    case _: False{}

def sticky(entry: P.Task) -> Bool:
  match entry:
    case P.Task{axis, S.Store{frames, path, used, cursor, S.FrameCapacity{}}, meta}: True{}
    case _: False{}

def restarted(state: S.Search) -> Bool:
  match state:
    case S.Search{table, store, meta}: sticky(P.restart_task(P.Task{0, store, meta}, Nil{}, 0))

def checks() -> Bool:
  failed(session()) && restarted(broken()) && deduplicated(P.distinct([P.Descriptor{0, C.solved()}, P.Descriptor{1, C.solved()}, P.Descriptor{3, C.turn(0, C.solved())}, P.Descriptor{4, C.turn(0, C.solved())}], Nil{}))

def verdict(ok: Bool) -> IO(Unit):
  match ok:
    case True{}: IO.print("{\"passed\":true,\"portfolioFailure\":true,\"stickyRestart\":true,\"descriptorOrder\":true}")
    case False{}: IO.die(Unit, 3, "Owned portfolio checks failed")

def legacy(result: Array<U32>) -> IO(Unit):
  IO.die(Unit, 3, "Legacy service accepted failed continuation")

def controlled(result: Array<U32> & Control.Context) -> IO(Unit):
  IO.die(Unit, 3, "Controlled service accepted failed continuation")

def command(args: List<String>) -> IO(Unit):
  match args:
    case Con{program, Con{"legacy", Nil{}}}:
      do IO<Unit>:
        result : Array<U32> <- H.service(0n, False{}, session(), M.solved(), 0n, 0n, 31, S.Light{})
        legacy(result)
    case Con{program, Con{"controlled", Nil{}}}:
      do IO<Unit>:
        result : Array<U32> & Control.Context <- H.service_controlled(0n, False{}, session(), M.solved(), 0n, 0n, 31, S.Light{}, Control.Detached{}, 1, 0)
        controlled(result)
    case Con{program, Nil{}}: verdict(checks())
    case _: IO.die(Unit, 4, "Invalid owned failure test command")

def main() -> IO(Unit):
  do IO<Unit>:
    args : List<String> <- IO.args()
    command(args)
