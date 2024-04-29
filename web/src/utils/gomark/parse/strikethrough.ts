import { Node } from "../ast/ast";
import { Strikethrough } from "../ast/inline";
import { TokenType, Token, Stringify, GetFirstLine } from "./tokenizer";

export function NewStrikethroughParser(): StrikethroughParser {
  return new StrikethroughParser();
}

export class StrikethroughParser {
  Match(tokens: Token[]): [Node | null, number] {
    const matchedTokens = GetFirstLine(tokens);
    if (matchedTokens.length < 5) {
      return [null, 0];
    }
    if (matchedTokens[0].Type !== TokenType.Tilde || matchedTokens[1].Type !== TokenType.Tilde) {
      return [null, 0];
    }

    const contentTokens: Token[] = [];
    let matched = false;
    for (let cursor = 2; cursor < matchedTokens.length - 1; cursor++) {
      const token = matchedTokens[cursor];
      const nextToken = matchedTokens[cursor + 1];
      if (token.Type === TokenType.Tilde && nextToken.Type === TokenType.Tilde) {
        matched = true;
        break;
      }
      contentTokens.push(token);
    }
    if (!matched || contentTokens.length === 0) {
      return [null, 0];
    }
    return [
      new Strikethrough({
        Content: Stringify(contentTokens),
      }),
      contentTokens.length + 4,
    ];
  }
}
