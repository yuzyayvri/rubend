export function stripBendEqualities(source){
  return source.split(/(?=^(?:def|type) )/m).filter(section=>!section.startsWith("def ")||!section.split("\n")[0].includes(" -> {")).join("");
}
