import Base

def open_reader(path: String) -> IO(Result<&1, &1, U32 & String, File>):
  import "./control-open.c"
  import "./control-open.js"

def read_ready(file: File) -> IO(File & Result<&1, &1, U32 & String, String>):
  import "./control-read.c"
  import "./control-read.js"
