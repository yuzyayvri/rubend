#include "native-request-service.h"
#include "nxprune.h"
#include "nxsolve.h"

using Small=vcube::nx::prune<vcube::nx::ecoord<vcube::nx::EP1,vcube::nx::EO4>,7>;
using Medium=vcube::nx::prune<vcube::nx::ecoord<vcube::nx::EP1,vcube::nx::EO8>,8>;
static Small *small_table;
static Medium *medium_table;
template<class Prune>static int solve_vcube(const char *input,int fd,Prune *table){auto cube=vcube::cube::from_reid(input);vcube::nx::solver solver(*table);auto answer=solver.solve(cube,20).canonical().to_string(vcube::moveseq_t::SINGMASTER);return request_write(fd,answer.data(),answer.size());}
static int solve_small(const char *input,int fd){return solve_vcube(input,fd,small_table);}
static int solve_medium(const char *input,int fd){return solve_vcube(input,fd,medium_table);}
int main(int argc,char **argv){if(argc!=2)return 2;vcube::nx::solver_base::init();if(!strcmp(argv[1],"104")){Small p;if(!p.load("/work/tables/nxprune_1_04_07.dat"))return 3;small_table=&p;return native_request_service("vcube-104",solve_small);}if(!strcmp(argv[1],"108")){Medium p;if(!p.load("/work/tables/nxprune_1_08_08.dat"))return 3;medium_table=&p;return native_request_service("vcube-108",solve_medium);}return 4;}
