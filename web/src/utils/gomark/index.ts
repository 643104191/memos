import { convertFromASTNodes, convertToASTNodes, Node } from "./node";
import { Parse as ParseUtil } from "./parse/parse";
import { Tokenize } from "./parse/tokenizer";
import { Restore as RestoreUtil } from "./restore/restore";

export function Parse(content: string) {
  const tokens = Tokenize(content);
  const [nodes, error] = ParseUtil(tokens);
  return error ? [] : convertFromASTNodes(nodes);
}

export function Restore(nodes: Node[]) {
  const astNodes = convertToASTNodes(nodes);
  return RestoreUtil(astNodes);
}

export function WebAssemblyOnError() {
  window.parse = Parse;
  window.restore = Restore;
}
