import { Node } from "../ast/ast";
import { Text } from "../ast/inline";
import { Token } from "./tokenizer";

export function NewTextParser(): TextParser {
  return new TextParser();
}

export class TextParser {
  Match(tokens: Token[]): [Node | null, number] {
    if (tokens.length === 0) {
      return [null, 0];
    }
    return [
      new Text({
        Content: tokens[0].String(),
      }),
      1,
    ];
  }
}
