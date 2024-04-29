import { Node } from "../ast/ast";
import { Italic } from "../ast/inline";
import { TokenType, Token, Stringify, GetFirstLine } from "./tokenizer";

export function NewItalicParser(): ItalicParser {
  return new ItalicParser();
}

export class ItalicParser {
  Match(tokens: Token[]): [Node | null, number] {
    const matchedTokens = GetFirstLine(tokens);
    if (matchedTokens.length < 3) {
      return [null, 0];
    }

    const prefixTokens = matchedTokens.slice(0, 1);
    if (prefixTokens[0].Type !== TokenType.Asterisk) {
      return [null, 0];
    }
    const prefixTokenType = prefixTokens[0].Type;
    const contentTokens: Token[] = [];
    let matched = false;
    for (const token of matchedTokens.slice(1)) {
      if (token.Type === prefixTokenType) {
        matched = true;
        break;
      }
      contentTokens.push(token);
    }
    if (!matched || contentTokens.length === 0) {
      return [null, 0];
    }

    return [
      new Italic({
        Symbol: prefixTokenType,
        Content: Stringify(contentTokens),
      }),
      contentTokens.length + 2,
    ];
  }
}
