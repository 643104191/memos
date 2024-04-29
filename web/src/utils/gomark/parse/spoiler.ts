import { Node } from "../ast/ast";
import { Spoiler } from "../ast/inline";
import { TokenType, Token, Stringify, GetFirstLine } from "./tokenizer";

export function NewSpoilerParser(): SpoilerParser {
  return new SpoilerParser()
}

export class SpoilerParser {
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
    if (prefixTokenType !== TokenType.Pipe) {
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
        matchedTokens.splice(cursor + 2);
        matched = true;
        break;
      }
    }
    if (!matched) {
      return [null, 0];
    }

    const size = matchedTokens.length;
    const content = Stringify(matchedTokens.slice(2, size - 2));
    return [
      new Spoiler({
        Content: content,
      }),
      size,
    ];
  }
}
