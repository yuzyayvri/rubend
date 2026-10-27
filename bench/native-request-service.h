#ifndef RUBEND_NATIVE_REQUEST_SERVICE_H
#define RUBEND_NATIVE_REQUEST_SERVICE_H
#include <errno.h>
#include <fcntl.h>
#include <inttypes.h>
#include <poll.h>
#include <signal.h>
#include <stdint.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/prctl.h>
#include <sys/resource.h>
#include <sys/types.h>
#include <sys/wait.h>
#include <time.h>
#include <unistd.h>

static uint64_t request_clock_ns(void){struct timespec t;if(clock_gettime(CLOCK_MONOTONIC,&t))_exit(90);return(uint64_t)t.tv_sec*1000000000ULL+(uint64_t)t.tv_nsec;}
static int request_write(int fd,const char *text,size_t n){while(n){ssize_t k=write(fd,text,n);if(k<0){if(errno==EINTR)continue;return 91;}text+=k;n-=(size_t)k;}return 0;}
static uint64_t request_time_us(struct timeval t){return(uint64_t)t.tv_sec*1000000ULL+(uint64_t)t.tv_usec;}
static int native_request_service(const char *name,int(*solve)(const char *,int)){
  if(prctl(PR_SET_CHILD_SUBREAPER,1))return 92;setbuf(stdout,NULL);struct rusage ready;if(getrusage(RUSAGE_SELF,&ready))return 93;printf("READY\t%s\t%ld\t%" PRIu64 "\t%" PRIu64 "\n",name,(long)getpid(),request_time_us(ready.ru_utime),request_time_us(ready.ru_stime));char line[8192];uint64_t completed=0;
  while(fgets(line,sizeof(line),stdin)){
    size_t length=strlen(line);if(!length||line[length-1]!='\n')return 94;line[--length]=0;char *a=strchr(line,'\t');if(!a)return 95;*a++=0;char *b=strchr(a,'\t');if(!b)return 96;*b++=0;if(!*line||!*a)return 97;for(char *p=line;*p;p++)if(*p<'0'||*p>'9')return 97;for(char *p=a;*p;p++)if(*p<'0'||*p>'9')return 98;char *end;errno=0;unsigned long long id=strtoull(line,&end,10);if(errno||*end)return 97;unsigned long budget=strtoul(a,&end,10);if(errno||*end||budget<1||budget>30000)return 98;
    int pipefd[2];if(pipe(pipefd))return 99;uint64_t started=request_clock_ns();pid_t parent=getpid(),child=fork();if(child<0)return 100;
    if(child==0){close(pipefd[0]);if(setpgid(0,0))_exit(101);if(prctl(PR_SET_PDEATHSIG,SIGKILL)||getppid()!=parent)_exit(102);close(STDIN_FILENO);if(dup2(pipefd[1],STDOUT_FILENO)<0)_exit(103);close(pipefd[1]);int status=solve(b,STDOUT_FILENO);_exit(status);}
    close(pipefd[1]);if(setpgid(child,child)&&errno!=EACCES&&errno!=ESRCH)return 104;int flags=fcntl(pipefd[0],F_GETFL);if(flags<0||fcntl(pipefd[0],F_SETFL,flags|O_NONBLOCK)<0)return 105;
    unsigned char output[8192];size_t used=0;int status=0,reaped=0,direct_done=0,eof=0,timedout=0,faults=0;uint64_t user=0,system=0;long maxrss=0;uint64_t deadline=started+(uint64_t)budget*1000000ULL;
    for(;;){
      for(;;){unsigned char chunk[512];ssize_t n=read(pipefd[0],chunk,sizeof(chunk));if(n>0){if((size_t)n>sizeof(output)-used){faults|=1;break;}memcpy(output+used,chunk,(size_t)n);used+=(size_t)n;}else{if(n==0)eof=1;else if(errno!=EAGAIN&&errno!=EWOULDBLOCK&&errno!=EINTR)faults|=8;break;}}
      for(;;){int s;struct rusage r;pid_t p=wait4(-child,&s,WNOHANG,&r);if(p<=0)break;reaped++;user+=request_time_us(r.ru_utime);system+=request_time_us(r.ru_stime);if(r.ru_maxrss>maxrss)maxrss=r.ru_maxrss;if(p==child){direct_done=1;status=s;}}
      if(direct_done&&eof){if(kill(-child,0)==0){faults|=2;kill(-child,SIGKILL);}break;}uint64_t now=request_clock_ns();if(faults||now>=deadline){timedout=!faults;kill(-child,SIGKILL);break;}struct pollfd p={pipefd[0],POLLIN|POLLHUP,0};int ms=(int)((deadline-now+999999ULL)/1000000ULL);if(poll(&p,1,ms)<0&&errno!=EINTR){faults|=4;kill(-child,SIGKILL);break;}
    }
    if(timedout||faults){for(;;){int s;struct rusage r;pid_t p=wait4(-child,&s,0,&r);if(p<0){if(errno==EINTR)continue;if(errno==ECHILD)break;return 106;}reaped++;user+=request_time_us(r.ru_utime);system+=request_time_us(r.ru_stime);if(r.ru_maxrss>maxrss)maxrss=r.ru_maxrss;if(p==child){direct_done=1;status=s;}}}
    close(pipefd[0]);if(!direct_done)return 107;int outcome=faults?2:timedout?1:WIFEXITED(status)&&WEXITSTATUS(status)==0?0:2;uint64_t elapsed=request_clock_ns()-started;printf("RESULT\t%llu\t%d\t%" PRIu64 "\t%" PRIu64 "\t%" PRIu64 "\t%ld\t%d\t%d\t%d\t%d\t",id,outcome,elapsed,user,system,maxrss,WIFEXITED(status)?WEXITSTATUS(status):-1,WIFSIGNALED(status)?WTERMSIG(status):0,reaped,faults);for(size_t i=0;i<used;i++)printf("%02x",output[i]);putchar('\n');completed++;
  }
  printf("CLOSED\t%" PRIu64 "\n",completed);return 0;
}
#endif
