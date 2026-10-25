#include <time.h>
#include <errno.h>
#include <stdint.h>

static Term rubend_process_cpu_run(Env e, Term* f, IoWork* w) {
  u32 which = (u32)f[0];
  if (which > 1) return io_fail(e, EINVAL, "Unknown process CPU operation");
#ifndef CLOCK_PROCESS_CPUTIME_ID
  return io_fail(e, ENOSYS, "Process CPU clock unavailable");
#else
  clockid_t id = CLOCK_PROCESS_CPUTIME_ID;
  struct timespec stamp;
  int status = which == 0 ? clock_gettime(id, &stamp) : clock_getres(id, &stamp);
  if (status != 0) return io_fail(e, (u32)errno, NULL);
  if (stamp.tv_sec < 0 || (uint64_t)stamp.tv_sec > UINT32_MAX || stamp.tv_nsec < 0 || stamp.tv_nsec >= 1000000000L)
    return io_fail(e, EOVERFLOW, "Process CPU timestamp does not fit its pair");
  if (which == 1 && stamp.tv_sec == 0 && stamp.tv_nsec == 0)
    return io_fail(e, EIO, "Process CPU resolution is zero");
  return io_done(e, io_tup(e, (Term)(u32)stamp.tv_sec, (Term)(u32)stamp.tv_nsec));
#endif
}

static void __attribute__((constructor)) rubend_process_cpu_use(void) {
  io_eff(CID(sample), rubend_process_cpu_run);
}
