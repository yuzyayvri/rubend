import Base

def read_words(file: File, table: Array<U32>, offset: U32, count: U32) -> IO(File & (Array<U32> & Result<&1, &1, U32 & String, Unit>)):
  import "./word-read.c"
  import "./word-read.js"
