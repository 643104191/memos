import { Node } from "../ast/ast";
import { Highlight } from "../ast/inline";
import { TokenType, Token, Stringify, GetFirstLine } from "./tokenizer";

export function NewHighlightParser(): HighlightParser {
  return new HighlightParser();
}

export class HighlightParser {
  Match(tokens: Token[]): [Node | null, number] {
    const matchedToken = GetFirstLine(tokens);
    if (matchedToken.length < 5) {
      return [null, 0];
    }

    const prefixTokens = matchedToken.slice(0, 2);
    if (prefixTokens[0].Type !== prefixTokens[1].Type) {
      return [null, 0];
    }
    const prefixTokenType = prefixTokens[0].Type;
    if (prefixTokenType !== TokenType.EqualSign) {
      return [null, 0];
    }

    let cursor = 2;
    let matched = false;
    for (; cursor < matchedToken.length - 1; cursor++) {
      const token = matchedToken[cursor];
      const nextToken = matchedToken[cursor + 1];
      if (token.Type === prefixTokenType && nextToken.Type === prefixTokenType) {
        matched = true;
        break;
      }
    }
    if (!matched) {
      return [null, 0];
    }

    return [
      new Highlight({
        Content: Stringify(matchedToken.slice(2, cursor)),
      }),
      cursor + 2,
    ];
  }
}
