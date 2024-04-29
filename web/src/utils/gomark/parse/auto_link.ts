import { Node } from "../ast/ast";
import { AutoLink } from "../ast/inline";
import { TokenType, Token, Stringify, GetFirstLine, FindUnescaped } from "./tokenizer";

export function NewAutoLinkParser(): AutoLinkParser {
  return new AutoLinkParser();
}

export class AutoLinkParser {
  Match(tokens: Token[]): [Node | null, number] {
    if (tokens.length < 3) {
      return [null, 0];
    }

    const matchedTokens = GetFirstLine(tokens);
    let urlStr: string;
    let isRawText = true;
    if (matchedTokens[0].Type === TokenType.LessThan) {
      const greaterThanIndex = FindUnescaped(matchedTokens, TokenType.GreaterThan);
      if (greaterThanIndex < 0) {
        return [null, 0];
      }
      matchedTokens.splice(greaterThanIndex + 1);
      urlStr = Stringify(matchedTokens.slice(1, -1));
      isRawText = false;
    } else {
      const contentTokens: Token[] = [];
      for (const token of matchedTokens) {
        if (token.Type === TokenType.Space) {
          break;
        }
        contentTokens.push(token);
      }
      if (contentTokens.length === 0) {
        return [null, 0];
      }

      matchedTokens.splice(0, matchedTokens.length, ...contentTokens);
      try {
        const u = new URL(Stringify(contentTokens));
        if (u.protocol === "" || u.host === "") {
          return [null, 0];
        }
      } catch {
        return [null, 0];
      }
      urlStr = Stringify(contentTokens);
    }

    return [
      new AutoLink({
        URL: urlStr,
        IsRawText: isRawText,
      }),
      matchedTokens.length,
    ];
  }
}
