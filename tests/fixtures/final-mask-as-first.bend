import Base
import ../../bench/subgroup-exclusion.bend as E

def main() -> Bool:
  E.allows_first(E.forward_exclusions(1, E.ForwardBounds{1, 1, 1}), 0)
