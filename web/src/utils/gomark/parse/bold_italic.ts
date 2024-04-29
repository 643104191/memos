import { Node } from "../ast/ast";
import { BoldItalic } from "../ast/inline";
import { TokenType, Token, Stringify, GetFirstLine } from "./tokenizer";

export function NewBoldItalicParser(): BoldItalicParser {
  return new BoldItalicParser();
}

export class BoldItalicParser {
  Match(tokens: Token[]): [Node | null, number] {
    const matchedTokens = GetFirstLine(tokens);
    if (matchedTokens.length < 7) {
      return [null, 0];
    }

    const prefixTokens = matchedTokens.slice(0, 3);
    if (
      prefixTokens[0].Type !== prefixTokens[1].Type ||
      prefixTokens[0].Type !== prefixTokens[2].Type ||
      prefixTokens[1].Type !== prefixTokens[2].Type
    ) {
      return [null, 0];
    }

    const prefixTokenType = prefixTokens[0].Type;
    if (prefixTokenType !== TokenType.Asterisk) {
      return [null, 0];
    }

    let cursor = 3;
    let matched = false;
    for (; cursor < matchedTokens.length - 2; cursor++) {
      const token = matchedTokens[cursor];
      const nextToken = matchedTokens[cursor + 1];
      const endToken = matchedTokens[cursor + 2];

      if (token.Type === TokenType.NewLine || nextToken.Type === TokenType.NewLine || endToken.Type === TokenType.NewLine) {
        return [null, 0];
      }

      if (token.Type === prefixTokenType && nextToken.Type === prefixTokenType && endToken.Type === prefixTokenType) {
        matchedTokens.splice(0, cursor + 3);
        matched = true;
        break;
      }
    }

    if (!matched) {
      return [null, 0];
    }

    const size = matchedTokens.length;
    const contentTokens = matchedTokens.slice(3, size - 3);

    if (contentTokens.length === 0) {
      return [null, 0];
    }

    return [
      new BoldItalic({
        Symbol: prefixTokenType,
        Content: Stringify(contentTokens),
      }),
      size,
    ];
  }
}
