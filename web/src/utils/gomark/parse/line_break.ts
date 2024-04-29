import { Node } from "../ast/ast";
import { LineBreak } from "../ast/block";
import { Token, TokenType } from "./tokenizer";

export function NewLineBreakParser(): LineBreakParser {
  return new LineBreakParser();
}

export class LineBreakParser {
  Match(tokens: Token[]): [Node | null, number] {
    if (tokens.length === 0) {
      return [null, 0];
    }
    if (tokens[0].Type !== TokenType.NewLine) {
      return [null, 0];
    }
    return [new LineBreak(), 1];
  }
}
