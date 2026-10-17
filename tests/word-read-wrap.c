#include <unistd.h>
#include <sys/stat.h>
#include <stdatomic.h>
#include <errno.h>
#include <stdio.h>

ssize_t __real_read(int fd, void* buffer, size_t count);
static atomic_uint rubend_interruptions;
static atomic_uint rubend_short_reads;

ssize_t __wrap_read(int fd, void* buffer, size_t count) {
  struct stat status;
  if (fstat(fd, &status) == 0 && S_ISREG(status.st_mode) && count > 0) {
    if (atomic_exchange(&rubend_interruptions, 1) == 0) {
      errno = EINTR;
      return -1;
    }
    if (count > 7) {
      count = 7;
      atomic_fetch_add(&rubend_short_reads, 1);
    }
  }
  return __real_read(fd, buffer, count);
}

static void __attribute__((destructor)) rubend_read_test_report(void) {
  fprintf(stderr, "{\"injectedInterruptions\":%u,\"shortReadCalls\":%u}\n", atomic_load(&rubend_interruptions), atomic_load(&rubend_short_reads));
}
