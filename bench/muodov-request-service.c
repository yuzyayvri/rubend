#include "native-request-service.h"
#include "coordcube.h"
#include "search.h"

static int solve_muodov(const char *input,int fd){if(strlen(input)!=54)return 2;char facelets[55];memcpy(facelets,input,55);char *answer=solution(facelets,24,1000,0,"/work/cache");if(!answer)return 3;int status=request_write(fd,answer,strlen(answer));free(answer);return status;}
int main(void){initPruning("/work/cache");return native_request_service("muodov-c",solve_muodov);}
