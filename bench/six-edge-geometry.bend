import Base

def size() -> U32:
  42577920

def capacity() -> U32:
  67108864

def goal(pattern: U32) -> U32:
  match pattern:
    case 0: 399936
    case _: 4307008

def allocate() -> Array<U32>:
  [255 : U32^26n]
