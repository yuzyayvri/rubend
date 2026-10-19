function rubend_control_open(path) {
  const bytes = Buffer.from(path, "utf8");
  if (bytes.length === 0 || bytes.length > 4096 || bytes.includes(0)) return io_fail(22);
  const fs = require("fs");
  let fd;
  try {
    fd = fs.openSync(bytes, fs.constants.O_RDONLY | fs.constants.O_NONBLOCK);
    if (!fs.fstatSync(fd).isFIFO()) { fs.closeSync(fd); fd = undefined; return io_fail(22); }
    return io_done(fd);
  } catch (error) { if (fd !== undefined) try { fs.closeSync(fd); } catch {} return io_fail(Math.abs(error.errno ?? 5)); }
}

io_eff(CID(open_reader), rubend_control_open);
