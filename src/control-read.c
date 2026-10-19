static Term rubend_control_read_run(Env e, Term* f, IoWork* w) {
  int fd = (int)io_hand_v(f[0]);
  int flags = fcntl(fd, F_GETFL);
  Term result;
  if (flags < 0) {
    result = io_fail(e, errno, NULL);
  } else if (!(flags & O_NONBLOCK)) {
    result = io_fail(e, EINVAL, NULL);
  } else {
    char bytes[64];
    ssize_t count = read(fd, bytes, sizeof bytes);
    int code = count < 0 ? errno : 0;
    if (count < 0 && (code == EAGAIN || code == EWOULDBLOCK || code == EINTR)) {
      result = io_done(e, io_str(e, "", 0));
    } else if (count <= 0 || count > (ssize_t)sizeof bytes) {
      result = io_fail(e, count == 0 ? EPIPE : (code ? code : EIO), NULL);
    } else {
      result = io_done(e, io_str(e, bytes, (u64)count));
    }
  }
  return io_tup(e, io_hand(fd), result);
}

static void __attribute__((constructor)) rubend_control_read_use(void) {
  io_eff(CID(read_ready), rubend_control_read_run);
}
