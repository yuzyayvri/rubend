#include "native-request-service.h"
#include "nissy.h"

static unsigned char *table;
static size_t table_size;
static int solve_nissy(const char *input,int fd){if(strlen(input)!=23)return 2;char answer[4096]={0};long long stats[NISSY_SIZE_SOLVE_STATS];long long count=nissy_solve(input,"h48h0",NISSY_NISSFLAG_NORMAL,0,20,1,0,1,table_size,table,sizeof(answer),answer,stats,NULL,NULL);if(count<=0)return 3;return request_write(fd,answer,strlen(answer));}
int main(int argc,char **argv){char dataid[NISSY_SIZE_DATAID];long long size=nissy_solverinfo("h48h0",dataid);if(size!=31683944)return 2;table_size=(size_t)size;if(posix_memalign((void**)&table,64,table_size))return 3;FILE *file=fopen("/work/tables/h48h0","rb");if(!file)return 4;if(fread(table,table_size,1,file)!=1||fgetc(file)!=EOF)return 5;fclose(file);nissy_setlogger(NULL,NULL);if(argc==2&&!strcmp(argv[1],"format")){char line[2048];while(fgets(line,sizeof(line),stdin)){char *p=strchr(line,'\t');if(!p)return 6;*p++=0;p[strcspn(p,"\r\n")]=0;char result[NISSY_SIZE_CUBE];if(nissy_applymoves(NISSY_SOLVED_CUBE,line,result)<0)return 7;printf("%d\t%s\n",strcmp(result,p)==0?1:0,result);}return 0;}if(argc!=1)return 8;return native_request_service("nissy-h48h0",solve_nissy);}
