import { Node } from "../ast/ast";

export function Restore(nodes: Node[]): string {
  let result = "";
  for (const node of nodes) {
    if (!node) {
      continue;
    }
    result += node.Restore();
  }
  return result;
}
