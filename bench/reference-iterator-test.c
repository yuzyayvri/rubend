#include <stdint.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <assert.h>
#define STATIC static
#define STATIC_INLINE static inline
#define NON_NULL static 1
#define MIN(a,b) ((a) < (b) ? (a) : (b))
#include "../.cache/nissy-reference/src/solvers/h48/map_types_macros.h"
#include "../.cache/nissy-reference/src/solvers/h48/map.h"

int main(void) {
  h48map_t map;
  uint64_t position;
  h48map_create(&map, 3, 1);
  h48map_insertmin(&map, 2, 7);
  position = 0;
  kvpair_t last = h48map_nextkvpair(&map, &position);
  assert(position == map.capacity);
  assert(last.key == 2 && last.val == 7);
  assert(!(position != map.capacity));
  assert(last.val != MAP_UNSET_VAL);
  kvpair_t end = h48map_nextkvpair(&map, &position);
  assert(end.val == MAP_UNSET_VAL);
  puts("{\"iteratorBoundaryReproduced\":true,\"oldConsumerDropsValidLastSlot\":true,\"sentinelConsumerPreservesIt\":true}");
  h48map_destroy(&map);
  return 0;
}
