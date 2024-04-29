import { Node } from "../ast/ast";
import { Bold } from "../ast/inline";
import { NewLinkParser } from "./link";
import { ParseInlineWithParsers } from "./parse";
import { NewTextParser } from "./text";
import { TokenType, Token, GetFirstLine } from "./tokenizer";

export function NewBoldParser(): BoldParser {
  return new BoldParser();
}

export class BoldParser {
  Match(tokens: Token[]): [Node | null, number] {
    const matchedTokens = GetFirstLine(tokens);
    if (matchedTokens.length < 5) {
      return [null, 0];
    }

    const prefixTokens = matchedTokens.slice(0, 2);
    if (prefixTokens[0].Type !== prefixTokens[1].Type) {
      return [null, 0];
    }
    const prefixTokenType = prefixTokens[0].Type;
    if (prefixTokenType !== TokenType.Asterisk) {
      return [null, 0];
    }

    let cursor = 2;
    let matched = false;
    for (; cursor < matchedTokens.length - 1; cursor++) {
      const token = matchedTokens[cursor];
      const nextToken = matchedTokens[cursor + 1];
      if (token.Type === TokenType.NewLine || nextToken.Type === TokenType.NewLine) {
        return [null, 0];
      }
      if (token.Type === prefixTokenType && nextToken.Type === prefixTokenType) {
        matchedTokens.length = cursor + 2;
        matched = true;
        break;
      }
    }
    if (!matched) {
      return [null, 0];
    }

    const size = matchedTokens.length;
    const [children, error] = ParseInlineWithParsers(matchedTokens.slice(2, size - 2), [NewLinkParser(), NewTextParser()]);
    if (error !== null || children.length === 0) {
      return [null, 0];
    }
    return [
      new Bold({
        Symbol: prefixTokenType,
        Children: children,
      }),
      size,
    ];
  }
}
