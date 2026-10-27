import Base
import ../../bench/subgroup-proof-kernel.bend as K
import ../../src/model.bend as M

def inside(cube: M.Cube) -> Bool:
  True{}

def main() -> K.AdmissibleAt(inside, M.solved(), 1n):
  word => reached => Unit{}
