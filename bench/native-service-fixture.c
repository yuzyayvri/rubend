#include "native-request-service.h"

static int solve_fixture(const char *input,int fd){
  if(!strcmp(input,"hang"))for(;;)pause();
  if(!strcmp(input,"partial-hang")){request_write(fd,"U2",2);for(;;)pause();}
  if(!strcmp(input,"fail"))return 7;
  if(!strcmp(input,"empty"))return 0;
  if(!strcmp(input,"orphan")){pid_t p=fork();if(p<0)return 8;if(p==0)for(;;)pause();return request_write(fd,"U2",2);}
  if(!strcmp(input,"silent-orphan")){pid_t p=fork();if(p<0)return 8;if(p==0){close(STDOUT_FILENO);for(;;)pause();}return request_write(fd,"U2",2);}
  return request_write(fd,"U2",2);
}
int main(void){return native_request_service("fixture",solve_fixture);}
