import { Node } from "../ast/ast";
import { EmbeddedContent } from "../ast/block";
import { GetFirstLine, TokenType, Token, FindUnescaped, Stringify } from "./tokenizer";

export function NewEmbeddedContentParser(): EmbeddedContentParser {
  return new EmbeddedContentParser();
}

export class EmbeddedContentParser {
  Match(tokens: Token[]): [Node | null, number] {
    const matchedTokens = GetFirstLine(tokens);
    if (matchedTokens.length < 6) {
      return [null, 0];
    }
    if (
      matchedTokens[0].Type !== TokenType.ExclamationMark ||
      matchedTokens[1].Type !== TokenType.LeftSquareBracket ||
      matchedTokens[2].Type !== TokenType.LeftSquareBracket
    ) {
      return [null, 0];
    }
    let matched = false;
    for (let index = 0; index < matchedTokens.length - 1; index++) {
      const token = matchedTokens[index];
      if (
        token.Type === TokenType.RightSquareBracket &&
        matchedTokens[index + 1].Type === TokenType.RightSquareBracket &&
        index + 1 === matchedTokens.length - 1
      ) {
        matched = true;
        break;
      }
    }
    if (!matched) {
      return [null, 0];
    }

    const contentTokens = matchedTokens.slice(3, matchedTokens.length - 2);
    let resourceName = Stringify(contentTokens);
    let params = "";
    const questionMarkIndex = FindUnescaped(contentTokens, TokenType.QuestionMark);
    if (questionMarkIndex > 0) {
      resourceName = Stringify(contentTokens.slice(0, questionMarkIndex));
      params = Stringify(contentTokens.slice(questionMarkIndex + 1));
    }
    return [
      new EmbeddedContent({
        ResourceName: resourceName,
        Params: params,
      }),
      matchedTokens.length,
    ];
  }
}
