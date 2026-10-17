typedef struct {
  Term table;
  u32 offset;
  u32 count;
  unsigned char bytes[];
} RubendWordRead;

static void rubend_word_read_call(IoWork* w) {
  RubendWordRead* chunk = (RubendWordRead*)w->data;
  size_t at = 0;
  size_t bytes = (size_t)chunk->count * 4;
  while (at < bytes) {
    ssize_t got = read((int)w->hand, chunk->bytes + at, bytes - at);
    if (got < 0 && errno == EINTR) continue;
    if (got <= 0) {
      w->code = got == 0 ? EIO : (u32)errno;
      return;
    }
    at += (size_t)got;
  }
}

static Term rubend_word_read_pack(Env e, IoWork* w) {
  RubendWordRead* chunk = (RubendWordRead*)w->data;
  if (w->code == 0) {
    u64 location = blk_loc(e.mem, chunk->table);
    for (u32 i = 0; i < chunk->count; i++) {
      const unsigned char* p = chunk->bytes + (size_t)i * 4;
      u32 value = (u32)p[0] | ((u32)p[1] << 8) | ((u32)p[2] << 16) | ((u32)p[3] << 24);
      blk_write(e.mem, false, location, chunk->offset + i, value);
    }
  }
  Term table = chunk->table;
  Term result = io_res(e, w, term_pak(CID(Unit), 0));
  free(chunk);
  w->data = NULL;
  return io_tup(e, io_hand(w->hand), io_tup(e, table, result));
}

static Term rubend_word_read_run(Env e, Term* f, IoWork* w) {
  Term table = f[1];
  u32 offset = (u32)f[2];
  u32 count = (u32)f[3];
  bool valid = term_tag(table) == TAG_BUF && !blk_shr(table)
    && count > 0 && count <= 262144
    && (u64)offset + count <= (1ull << blk_cls(table));
  RubendWordRead* chunk = io_mem(malloc(sizeof *chunk + (valid ? (size_t)count * 4 : 0)));
  chunk->table = table;
  chunk->offset = offset;
  chunk->count = count;
  w->hand = (intptr_t)io_hand_v(f[0]);
  w->data = (char*)chunk;
  w->code = valid ? 0 : EINVAL;
  return valid ? io_work(w, rubend_word_read_call, rubend_word_read_pack) : rubend_word_read_pack(e, w);
}

static void __attribute__((constructor)) rubend_word_read_use(void) {
  io_eff(CID(read_words), rubend_word_read_run);
}
