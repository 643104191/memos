import { Node } from "../ast/ast";
import { Tag } from "../ast/inline";
import { TokenType, Token, Stringify, GetFirstLine } from "./tokenizer";

export function NewTagParser(): TagParser {
  return new TagParser();
}

export class TagParser {
  Match(tokens: Token[]): [Node | null, number] {
    const matchedTokens = GetFirstLine(tokens);
    if (matchedTokens.length < 2) {
      return [null, 0];
    }
    if (matchedTokens[0].Type !== TokenType.PoundSign) {
      return [null, 0];
    }

    const contentTokens: Token[] = [];
    for (const token of matchedTokens.slice(1)) {
      if (token.Type === TokenType.Space || token.Type === TokenType.PoundSign) {
        break;
      }
      contentTokens.push(token);
    }
    if (contentTokens.length === 0) {
      return [null, 0];
    }

    return [
      new Tag({
        Content: Stringify(contentTokens),
      }),
      contentTokens.length + 1,
    ];
  }
}
