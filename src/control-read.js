function rubend_control_read(file) {
  const done = result => io_tup(file, result);
  try {
    const fs = require("fs"), sys = io_sys(), flags = sys.fcntl(file, 3, 0);
    if (flags < 0) return done(io_fail(sys.errno()));
    if (!(flags & fs.constants.O_NONBLOCK)) return done(io_fail(22));
    const buffer = Buffer.alloc(64);
    let count;
    try { count = fs.readSync(file, buffer, 0, buffer.length, null); }
    catch (error) {
      if (["EAGAIN", "EWOULDBLOCK", "EINTR"].includes(error.code)) return done(io_done(""));
      throw error;
    }
    if (!Number.isInteger(count) || count <= 0 || count > buffer.length) return done(io_fail(count === 0 ? 32 : 5));
    return done(io_done(buffer.toString("utf8", 0, count)));
  } catch (error) { return done(io_fail(Math.abs(error.errno ?? 5))); }
}

io_eff(CID(read_ready), rubend_control_read);
