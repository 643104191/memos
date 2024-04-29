import { Node } from "../ast/ast";
import { Subscript } from "../ast/inline";
import { TokenType, Token, Stringify, GetFirstLine } from "./tokenizer";

export function NewSubscriptParser(): SubscriptParser {
  return new SubscriptParser();
}

export class SubscriptParser {
  Match(tokens: Token[]): [Node | null, number] {
    const matchedTokens = GetFirstLine(tokens);
    if (matchedTokens.length < 3) {
      return [null, 0];
    }
    if (matchedTokens[0].Type !== TokenType.Tilde) {
      return [null, 0];
    }

    const contentTokens: Token[] = [];
    let matched = false;
    for (const token of matchedTokens.slice(1)) {
      if (token.Type === TokenType.Tilde) {
        matched = true;
        break;
      }
      contentTokens.push(token);
    }
    if (!matched || contentTokens.length === 0) {
      return [null, 0];
    }

    return [
      new Subscript({
        Content: Stringify(contentTokens),
      }),
      contentTokens.length + 2,
    ];
  }
}
