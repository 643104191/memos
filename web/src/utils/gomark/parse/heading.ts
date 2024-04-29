import { Node } from "../ast/ast";
import { Heading } from "../ast/block";
import { ParseInline } from "./parse";
import { TokenType, Token, GetFirstLine, FindUnescaped } from "./tokenizer";

export function NewHeadingParser() {
  return new HeadingParser();
}

export class HeadingParser {
  Match(tokens: Token[]): [Node | null, number] {
    const matchedTokens = GetFirstLine(tokens);
    const spaceIndex = FindUnescaped(matchedTokens, TokenType.Space);
    if (spaceIndex < 0) {
      return [null, 0];
    }

    for (const token of matchedTokens.slice(0, spaceIndex)) {
      if (token.Type !== TokenType.PoundSign) {
        return [null, 0];
      }
    }
    const level = spaceIndex;
    if (level === 0 || level > 6) {
      return [null, 0];
    }

    const contentTokens = matchedTokens.slice(spaceIndex + 1);
    if (contentTokens.length === 0) {
      return [null, 0];
    }
    const [children, err] = ParseInline(contentTokens);
    if (err !== null) {
      return [null, 0];
    }
    return [new Heading({ Level: level, Children: children }), contentTokens.length + level + 1];
  }
}
