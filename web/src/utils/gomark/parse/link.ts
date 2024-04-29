import { Node } from "../ast/ast";
import { Link } from "../ast/inline";
import { TokenType, Token, Stringify, GetFirstLine } from "./tokenizer";

export function NewLinkParser(): LinkParser {
  return new LinkParser();
}

export class LinkParser {
  Match(tokens: Token[]): [Node | null, number] {
    const matchedTokens = GetFirstLine(tokens);
    if (matchedTokens.length < 5) {
      return [null, 0];
    }
    if (matchedTokens[0].Type !== TokenType.LeftSquareBracket) {
      return [null, 0];
    }

    const textTokens: Token[] = [];
    for (const token of matchedTokens.slice(1)) {
      if (token.Type === TokenType.RightSquareBracket) {
        break;
      }
      textTokens.push(token);
    }
    if (textTokens.length + 4 >= matchedTokens.length) {
      return [null, 0];
    }
    if (matchedTokens[2 + textTokens.length].Type !== TokenType.LeftParenthesis) {
      return [null, 0];
    }
    const urlTokens: Token[] = [];
    let matched = false;
    for (const token of matchedTokens.slice(3 + textTokens.length)) {
      if (token.Type === TokenType.Space) {
        return [null, 0];
      }
      if (token.Type === TokenType.RightParenthesis) {
        matched = true;
        break;
      }
      urlTokens.push(token);
    }
    if (!matched || urlTokens.length === 0) {
      return [null, 0];
    }

    return [
      new Link({
        Text: Stringify(textTokens),
        URL: Stringify(urlTokens),
      }),
      4 + textTokens.length + urlTokens.length,
    ];
  }
}
