function rubend_read_words(file, table, offset, count) {
  const done = result => io_tup(file, io_tup(table, result));
  if (!Array.isArray(table) || !Number.isInteger(offset) || !Number.isInteger(count) || offset < 0 || count < 1 || count > 262144 || offset + count > table.length) return done(io_fail(22));
  try {
    const fs = require("fs"), buffer = Buffer.alloc(count * 4);
    let at = 0;
    while (at < buffer.length) {
      let got;
      try { got = fs.readSync(file, buffer, at, buffer.length - at, null); }
      catch (error) { if (error.code === "EINTR") continue; throw error; }
      if (got === 0) return done(io_fail(5));
      at += got;
    }
    for (let i = 0; i < count; i++) table[offset + i] = buffer.readUInt32LE(i * 4);
    return done(io_done({$: CID(Unit)}));
  } catch (error) { return done(io_fail(Math.abs(error.errno ?? 5))); }
}

io_eff(CID(read_words), rubend_read_words);
