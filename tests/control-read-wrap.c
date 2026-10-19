#include <errno.h>
#include <fcntl.h>
#include <stdarg.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>

static int control_test_fd = -1;
static unsigned control_test_reads = 0;
static size_t control_test_largest = 0;
int __real_fcntl(int fd, int command, ...);
ssize_t __real_read(int fd, void* buffer, size_t count);
ssize_t __real___read_chk(int fd, void* buffer, size_t count, size_t length);

int __wrap_fcntl(int fd, int command, ...) {
  if (command == F_GETFL) {
    control_test_fd = fd;
    const char* mode = getenv("RUBEND_CONTROL_TEST_FAULT");
    if (mode && strcmp(mode, "flags") == 0) return 0;
    if (mode && strcmp(mode, "descriptor") == 0) { errno = EBADF; return -1; }
    return __real_fcntl(fd, command);
  }
  va_list args;
  va_start(args, command);
  int value = va_arg(args, int);
  va_end(args);
  return __real_fcntl(fd, command, value);
}

ssize_t __wrap_read(int fd, void* buffer, size_t count) {
  if (fd == control_test_fd) {
    control_test_reads++;
    if (count > control_test_largest) control_test_largest = count;
    const char* mode = getenv("RUBEND_CONTROL_TEST_FAULT");
    if (mode) {
      if (strcmp(mode, "again") == 0) { errno = EAGAIN; return -1; }
      if (strcmp(mode, "interrupt") == 0) { errno = EINTR; return -1; }
      if (strcmp(mode, "read") == 0) { errno = EIO; return -1; }
      if (strcmp(mode, "eof") == 0) return 0;
      if (strcmp(mode, "oversize") == 0) return 65;
    }
  }
  return __real_read(fd, buffer, count);
}

ssize_t __wrap___read_chk(int fd, void* buffer, size_t count, size_t length) {
  if (count > length) return __real___read_chk(fd, buffer, count, length);
  return __wrap_read(fd, buffer, count);
}

static void __attribute__((destructor)) control_test_report(void) {
  fprintf(stderr, "{\"controlReadCalls\":%u,\"largestRead\":%zu}\n", control_test_reads, control_test_largest);
}
