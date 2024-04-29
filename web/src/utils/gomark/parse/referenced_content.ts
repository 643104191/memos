import { Node } from "../ast/ast";
import { ReferencedContent } from "../ast/inline";
import { TokenType, Token, Stringify, GetFirstLine, FindUnescaped } from "./tokenizer";

export function NewReferencedContentParser(): ReferencedContentParser {
  return new ReferencedContentParser();
}

export class ReferencedContentParser {
  Match(tokens: Token[]): [Node | null, number] {
    const matchedTokens = GetFirstLine(tokens);
    if (matchedTokens.length < 5) {
      return [null, 0];
    }
    if (matchedTokens[0].Type !== TokenType.LeftSquareBracket || matchedTokens[1].Type !== TokenType.LeftSquareBracket) {
      return [null, 0];
    }

    const contentTokens: Token[] = [];
    let matched = false;
    for (let index = 2; index < matchedTokens.length - 1; index++) {
      const token = matchedTokens[index];
      if (token.Type === TokenType.RightSquareBracket && matchedTokens[index + 1].Type === TokenType.RightSquareBracket) {
        matched = true;
        break;
      }
      contentTokens.push(token);
    }
    if (!matched) {
      return [null, 0];
    }

    let resourceName = Stringify(contentTokens);
    let params = "";
    const questionMarkIndex = FindUnescaped(contentTokens, TokenType.QuestionMark);
    if (questionMarkIndex > 0) {
      resourceName = Stringify(contentTokens.slice(0, questionMarkIndex));
      params = Stringify(contentTokens.slice(questionMarkIndex + 1));
    }
    return [
      new ReferencedContent({
        ResourceName: resourceName,
        Params: params,
      }),
      contentTokens.length + 4,
    ];
  }
}
