import { Node } from "../ast/ast";
import { Code } from "../ast/inline";
import { TokenType, Token, Stringify, GetFirstLine, FindUnescaped } from "./tokenizer";

export function NewCodeParser(): CodeParser {
  return new CodeParser();
}

export class CodeParser {
  Match(tokens: Token[]): [Node | null, number] {
    const matchedTokens = GetFirstLine(tokens);
    if (matchedTokens.length < 3) {
      return [null, 0];
    }
    if (matchedTokens[0].Type !== TokenType.Backtick) {
      return [null, 0];
    }

    const nextBacktickIndex = FindUnescaped(matchedTokens.slice(1), TokenType.Backtick);
    if (nextBacktickIndex < 0) {
      return [null, 0];
    }

    const matchedTokensWithBackticks = matchedTokens.slice(0, 1 + nextBacktickIndex + 1);
    const contentTokens = matchedTokensWithBackticks.slice(1, matchedTokensWithBackticks.length - 1);
    if (contentTokens.length === 0) {
      return [null, 0];
    }

    return [
      new Code({
        Content: Stringify(contentTokens),
      }),
      matchedTokensWithBackticks.length,
    ];
  }
}
