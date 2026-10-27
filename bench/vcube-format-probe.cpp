#include "cube.h"
#include <iostream>
#include <string>

int main(){
  std::string line;
  while(std::getline(std::cin,line)){
    auto split=line.find('\t');
    if(split==std::string::npos)return 2;
    auto moves=vcube::cube::from_moves(line.substr(0,split));
    auto reid=vcube::cube::from_reid(line.substr(split+1));
    std::cout<<(moves==reid?1:0)<<'\t'<<moves.to_reid()<<'\t'<<reid.to_reid()<<'\n';
  }
  return 0;
}
