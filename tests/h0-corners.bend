import Base
import ../src/h0-corners.bend as H
import ../src/cubie.bend as C

type Audit is Type:
  H0Checking{seen: Array<U32>, visited: U32, fingerprint: U32}
  H0Rejected{index: U32, code: U32}

def hash(+previous: U32, value: U32) -> U32:
  ((previous .^. value) * 16777619 : U32)

def cube_hash(cube: C.Cubie, previous: U32) -> U32:
  match cube:
    case C.Cubie{cp, co, ep, eh, eo}: hash(hash(hash(hash(hash(previous, cp), co), ep), eh), eo)

def seen_value(read: Array<U32> & U32, +expected: U32, key: U32, fingerprint: U32) -> Audit:
  match read:
    case Tuple{seen, 0}: H0Checking{seen[key] <- 1, (expected + 1 : U32), fingerprint}
    case _: H0Rejected{expected, 5}

def allowed(ok: Bool, seen: Array<U32>, expected: U32, +key: U32, fingerprint: U32) -> Audit:
  match ok:
    case False{}: H0Rejected{expected, 3}
    case True{}: seen_value(seen[key], expected, key, fingerprint)

def validated(validation: C.Validation, +corner: H.Corner, seen: Array<U32>, +expected: U32, fingerprint: U32) -> Audit:
  match validation:
    case C.Invalid{code}: H0Rejected{expected, 2}
    case C.Valid{+cube}:
      +projected = H.project(cube)
      +key = H.sparse_key(projected)
      allowed(U32.is_eq(H.index(corner), expected) && U32.is_eq(H.index(projected), expected) && U32.is_eq(H.sparse_key(corner), key) && U32.is_lt(key, 279936), seen, expected, key, cube_hash(cube, fingerprint))

def decoded(value: Maybe<&2, H.Corner>, seen: Array<U32>, expected: U32, fingerprint: U32) -> Audit:
  match value:
    case None{}: H0Rejected{expected, 1}
    case Some{+corner}: validated(C.validate(C.to_facelets(H.representative(corner))), corner, seen, expected, fingerprint)

def step(state: Audit, +expected: U32) -> Audit:
  match state:
    case H0Checking{seen, visited, fingerprint}: decoded(H.from_index(expected), seen, expected, fingerprint)
    case state: state

def run(fuel: Nat, +index: U32, state: Audit) -> Audit:
  match fuel:
    case 0n: state
    case 1n+p: run(p, (index + 1 : U32), step(state, index))

def rejected(value: Maybe<&2, H.Corner>) -> Bool:
  match value:
    case None{}: True{}
    case Some{corner}: False{}

def finish(ok: Bool) -> IO(Unit):
  match ok:
    case True{}: IO.pure(Unit, Unit{})
    case False{}: IO.die(Unit, 2, "H0 corner boundary audit failed")

def report(state: Audit) -> IO(Unit):
  match state:
    case H0Rejected{index, code}: IO.die(Unit, 2, "H0 corner audit failed at " ++ U32.show(index) ++ " code " ++ U32.show(code))
    case H0Checking{seen, +visited, fingerprint}:
      do IO<Unit>:
        IO.print("{\"visited\":" ++ U32.show(visited) ++ ",\"fingerprint\":" ++ U32.show(fingerprint) ++ ",\"goal\":" ++ U32.show(H.index(H.goal())) ++ "}")
        finish(U32.is_eq(visited, H.size()) && rejected(H.from_index(153090)) && rejected(H.from_index(4294967295)))

def main() -> IO(Unit):
  report(run(153090n, 0, H0Checking{[0 : U32^19n], 0, 2166136261}))
