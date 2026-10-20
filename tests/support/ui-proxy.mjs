export function proxyTarget(headers,path,publicOrigin,upstream){
  if(headers.host!==publicOrigin.host||headers.origin&&headers.origin!==publicOrigin.origin||typeof path!=="string"||!path.startsWith("/")||path.startsWith("//"))return null;
  try{const target=new URL(path,upstream);return target.origin===upstream.origin?target:null;}catch{return null;}
}
