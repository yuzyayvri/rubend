#include <stdio.h>
#include <stdint.h>
#include "coordcube.h"

int main(void){
  uint16_t one=1;
  printf("{\"shortBytes\":%zu,\"littleEndian\":%s,\"tables\":{",sizeof(short),*(unsigned char*)&one==1?"true":"false");
  printf("\"twistMove\":%zu,",sizeof(twistMove));
  printf("\"flipMove\":%zu,",sizeof(flipMove));
  printf("\"FRtoBR_Move\":%zu,",sizeof(FRtoBR_Move));
  printf("\"URFtoDLF_Move\":%zu,",sizeof(URFtoDLF_Move));
  printf("\"URtoDF_Move\":%zu,",sizeof(URtoDF_Move));
  printf("\"URtoUL_Move\":%zu,",sizeof(URtoUL_Move));
  printf("\"UBtoDF_Move\":%zu,",sizeof(UBtoDF_Move));
  printf("\"MergeURtoULandUBtoDF\":%zu,",sizeof(MergeURtoULandUBtoDF));
  printf("\"Slice_URFtoDLF_Parity_Prun\":%zu,",sizeof(Slice_URFtoDLF_Parity_Prun));
  printf("\"Slice_URtoDF_Parity_Prun\":%zu,",sizeof(Slice_URtoDF_Parity_Prun));
  printf("\"Slice_Twist_Prun\":%zu,",sizeof(Slice_Twist_Prun));
  printf("\"Slice_Flip_Prun\":%zu}}\n",sizeof(Slice_Flip_Prun));
  return 0;
}
