import assert from "node:assert/strict";
import {readFileSync,writeFileSync,mkdirSync,existsSync} from "node:fs";
import {resolve} from "node:path";
import {createHash} from "node:crypto";
import {spawnSync} from "node:child_process";

assert.equal(process.argv.length,3,"Expected fresh owned-array probe directory");
const directory=resolve(process.argv[2]),hash=bytes=>createHash("sha256").update(bytes).digest("hex");
assert.ok(directory.startsWith(resolve("build/experiments")+"/"));assert.equal(existsSync(directory),false);mkdirSync(directory);
const shared=`import Base

type Item is Type:
  Item{array: Array<U32>}

type Items is Type:
  NoItems{}
  MoreItems{item: Item, rest: Items}

def add(read: Array<U32> & U32, rest: U32) -> U32:
  match read:
    case Tuple{array, value}: (value + rest : U32)

def total(items: List<Item>) -> U32:
  match items:
    case Nil{}: 0
    case Con{Item{array}, rest}: add(Array.get(U32, array, 0), total(rest))

def append(items: List<Item>, tail: List<Item>) -> List<Item>:
  match items:
    case Nil{}: tail
    case Con{item, rest}: item <> append(rest, tail)

def total_nominal(items: Items) -> U32:
  match items:
    case NoItems{}: 0
    case MoreItems{Item{array}, rest}: add(Array.get(U32, array, 0), total_nominal(rest))

def copied(+items: +List<String>) -> U32:
  (U32.from_nat(List.length(&2, String, items)) + U32.from_nat(List.length(&2, String, items)) : U32)

def promote(items: List<String>) -> +List<String>:
  match items:
    case Nil{}: Nil{}
    case Con{item, rest}: item <> promote(rest)

`;
const base={direct:"[Item{[7 : U32*8n]}, Item{[8 : U32*8n]}]",generic:"List.append(&1, Item, [Item{[7 : U32*8n]}], [Item{[8 : U32*8n]}])",local:"append([Item{[7 : U32*8n]}], [Item{[8 : U32*8n]}])"},cases=Object.fromEntries(Object.entries(base).map(([name,value])=>[name,{expression:"total("+value+")",expected:"15"}])),rows=[];
const extra="copied(promote(args))";
cases.mixed={expression:"(total("+base.generic+") + "+extra+" : U32)",expected:"19",args:true};
cases.nominal={expression:"(total_nominal(MoreItems{Item{[7 : U32*8n]}, MoreItems{Item{[8 : U32*8n]}, NoItems{}}}) + "+extra+" : U32)",expected:"19",args:true};
for(const [name,expression]of Object.entries(cases)){
  const source=shared+"def main() -> IO(Unit):\n"+(expression.args?"  do IO<Unit>:\n    args : List<String> <- IO.args()\n    IO.print(U32.show("+expression.expression+"))\n":"  IO.print(U32.show("+expression.expression+"))\n"),entry=resolve(directory,name+".bend"),c=resolve(directory,name+".c"),binary=resolve(directory,name);
  writeFileSync(entry,source,{flag:"wx"});
  for(const output of[c,binary]){const result=spawnSync("bend",[entry,"-o",output],{encoding:"utf8",timeout:60000,maxBuffer:1048576});assert.equal(result.status,0,result.stdout+result.stderr);}
  const text=readFileSync(c,"utf8"),mode=text.match(/^#define BLK_SHR ([01])$/m);assert.ok(mode);
  const result=spawnSync(binary,["--threads","1",...expression.args?["probe"]:[]],{encoding:"utf8",timeout:10000});assert.equal(result.status,0,result.stderr);assert.equal(result.stdout.trim(),expression.expected);
  rows.push({name,sharedArrayMode:Number(mode[1]),sourceSha256:hash(source),cSha256:hash(text),binarySha256:hash(readFileSync(binary)),nativeOutput:result.stdout.trim()});
}
const record={format:"rubend-owned-array-probe-v1",rows,claim:"Minimal pinned-compiler diagnosis only. No solver performance result.",independentReview:false};
writeFileSync(resolve(directory,"result.json"),JSON.stringify(record,null,2)+"\n",{flag:"wx"});console.log(JSON.stringify(record));
