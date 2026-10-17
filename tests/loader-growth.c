#include <unistd.h>
#include <sys/stat.h>
#include <fcntl.h>
#include <stdlib.h>
#include <stdio.h>
#include <string.h>

ssize_t __real_read(int fd, void* buffer, size_t count);
int __real_close(int fd);
static size_t rubend_total;
static int rubend_mutated;
static int rubend_closed;

static int rubend_matches(int fd) {
  const char* path = getenv("RUBEND_TEST_MUTATION_PATH");
  struct stat a, b;
  return path && fstat(fd, &a) == 0 && stat(path, &b) == 0 && a.st_dev == b.st_dev && a.st_ino == b.st_ino;
}

ssize_t __wrap_read(int fd, void* buffer, size_t count) {
  int selected = rubend_matches(fd);
  ssize_t got = __real_read(fd, buffer, count);
  if (selected && got > 0) {
    rubend_total += got;
    if (!rubend_mutated && rubend_total >= strtoull(getenv("RUBEND_TEST_MUTATION_AT"), NULL, 10)) {
      rubend_mutated = 1;
      const char* path = getenv("RUBEND_TEST_MUTATION_PATH");
      if (strcmp(getenv("RUBEND_TEST_MUTATION"), "short") == 0) {
        if (truncate(path, rubend_total) != 0) abort();
      } else {
        int target = open(path, O_WRONLY | O_APPEND);
        if (target < 0 || write(target, "x", 1) != 1) abort();
        __real_close(target);
      }
    }
  }
  return got;
}

int __wrap_close(int fd) {
  if (rubend_matches(fd)) rubend_closed = 1;
  return __real_close(fd);
}

static void __attribute__((destructor)) rubend_report(void) {
  if (getenv("RUBEND_TEST_MUTATION_PATH")) fprintf(stderr, "{\"mutated\":%s,\"closed\":%s,\"total\":%zu}\n", rubend_mutated ? "true" : "false", rubend_closed ? "true" : "false", rubend_total);
}
