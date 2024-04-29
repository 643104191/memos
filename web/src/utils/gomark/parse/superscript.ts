import { Node } from "../ast/ast";
import { Superscript } from "../ast/inline";
import { TokenType, Token, Stringify, GetFirstLine } from "./tokenizer";

export function NewSuperscriptParser(): SuperscriptParser {
  return new SuperscriptParser();
}

export class SuperscriptParser {
  Match(tokens: Token[]): [Node | null, number] {
    const matchedTokens = GetFirstLine(tokens);
    if (matchedTokens.length < 3) {
      return [null, 0];
    }
    if (matchedTokens[0].Type !== TokenType.Caret) {
      return [null, 0];
    }

    const contentTokens: Token[] = [];
    let matched = false;
    for (const token of matchedTokens.slice(1)) {
      if (token.Type === TokenType.Caret) {
        matched = true;
        break;
      }
      contentTokens.push(token);
    }
    if (!matched || contentTokens.length === 0) {
      return [null, 0];
    }

    return [
      new Superscript({
        Content: Stringify(contentTokens),
      }),
      contentTokens.length + 2,
    ];
  }
}
