export function notationScroll(scroll,left,width,viewport){
  if(left<scroll)return Math.max(0,left);
  return left+width>scroll+viewport?Math.max(0,left+width-viewport):scroll;
}
