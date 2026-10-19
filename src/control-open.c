#include <sys/stat.h>

static Term rubend_control_open_run(Env e, Term* f, IoWork* w) {
  u64 length = 0;
  char* path = io_cstr(e, f[0], &length);
  if (length == 0 || length > 4096 || io_nul(path, length)) {
    free(path);
    return io_fail(e, EINVAL, NULL);
  }
  int fd = open(path, O_RDONLY | O_NONBLOCK | O_CLOEXEC);
  int code = fd < 0 ? errno : 0;
  free(path);
  if (fd >= 0) {
    struct stat info;
    if (fstat(fd, &info) < 0) { code = errno; close(fd); }
    else if (!S_ISFIFO(info.st_mode)) { code = EINVAL; close(fd); }
  }
  return code ? io_fail(e, code, NULL) : io_done(e, io_hand(fd));
}

static void __attribute__((constructor)) rubend_control_open_use(void) {
  io_eff(CID(open_reader), rubend_control_open_run);
}
