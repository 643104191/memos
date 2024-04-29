import { Parse as ParseUtil } from "./parse/parse";
import { Tokenize } from "./parse/tokenizer";
import { Restore } from "./restore/restore";

export function Parse(content: string) {
  const tokens = Tokenize(content);
  const [nodes, error] = ParseUtil(tokens);
  return error ? [] : nodes;
}

export { Restore };

export function WebAssemblyOnError() {
  window.parse = Parse;
  window.restore = Restore;
}
