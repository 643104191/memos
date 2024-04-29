import { Node } from "../ast/ast";
import { Image } from "../ast/inline";
import { TokenType, Token, Stringify, GetFirstLine } from "./tokenizer";

export function NewImageParser(): ImageParser {
  return new ImageParser();
}

export class ImageParser {
  Match(tokens: Token[]): [Node | null, number] {
    const matchedTokens = GetFirstLine(tokens);
    if (matchedTokens.length < 5) {
      return [null, 0];
    }
    if (matchedTokens[0].Type !== TokenType.ExclamationMark) {
      return [null, 0];
    }
    if (matchedTokens[1].Type !== TokenType.LeftSquareBracket) {
      return [null, 0];
    }

    let cursor = 2;
    const altTokens: Token[] = [];
    for (; cursor < matchedTokens.length - 2; cursor++) {
      if (matchedTokens[cursor].Type === TokenType.RightSquareBracket) {
        break;
      }
      altTokens.push(matchedTokens[cursor]);
    }
    if (matchedTokens[cursor + 1].Type !== TokenType.LeftParenthesis) {
      return [null, 0];
    }

    cursor += 2;
    const urlTokens: Token[] = [];
    let matched = false;
    for (const token of matchedTokens.slice(cursor)) {
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
      new Image({
        AltText: Stringify(altTokens),
        URL: Stringify(urlTokens),
      }),
      5 + altTokens.length + urlTokens.length,
    ];
  }
}
