import Base
import ../src/portfolio.bend as P

def work(fuel: Nat, state: P.Session) -> P.Session:
  match fuel:
    case 0n: state
    case 1n+rest: work(rest, P.advance(state))
