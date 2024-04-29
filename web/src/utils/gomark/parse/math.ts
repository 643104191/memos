import { Node } from "../ast/ast";
import { Math } from "../ast/inline";
import { TokenType, Token, Stringify, GetFirstLine } from "./tokenizer";

export function NewMathParser(): MathParser {
  return new MathParser();
}

export class MathParser {
  Match(tokens: Token[]): [Node | null, number] {
    const matchedTokens = GetFirstLine(tokens);
    if (matchedTokens.length < 3) {
      return [null, 0];
    }

    if (matchedTokens[0].Type !== TokenType.DollarSign) {
      return [null, 0];
    }

    const contentTokens: Token[] = [];
    let matched = false;
    for (const token of matchedTokens.slice(1)) {
      if (token.Type === TokenType.DollarSign) {
        matched = true;
        break;
      }
      contentTokens.push(token);
    }
    if (!matched || contentTokens.length === 0) {
      return [null, 0];
    }

    return [
      new Math({
        Content: Stringify(contentTokens),
      }),
      contentTokens.length + 2,
    ];
  }
}
