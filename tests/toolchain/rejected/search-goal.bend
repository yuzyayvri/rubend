import Base
import ../../../src/search.bend as S
import ../../../src/cubie.bend as C

def wrong_goal() -> S.Frame:
  S.root_frame(C.solved(), 1, 1)
