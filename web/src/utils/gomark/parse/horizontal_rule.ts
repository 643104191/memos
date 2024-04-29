import { Node } from "../ast/ast";
import { HorizontalRule } from "../ast/block";
import { TokenType, Token, GetFirstLine } from "./tokenizer";

export function NewHorizontalRuleParser() {
  return new HorizontalRuleParser();
}

export class HorizontalRuleParser {
  Match(tokens: Token[]): [Node | null, number] {
    const matchedTokens = GetFirstLine(tokens);
    if (matchedTokens.length < 3) {
      return [null, 0];
    }
    if (matchedTokens.length > 3 && matchedTokens[3].Type !== TokenType.NewLine) {
      return [null, 0];
    }
    if (
      matchedTokens[0].Type !== matchedTokens[1].Type ||
      matchedTokens[0].Type !== matchedTokens[2].Type ||
      matchedTokens[1].Type !== matchedTokens[2].Type
    ) {
      return [null, 0];
    }
    if (matchedTokens[0].Type !== TokenType.Hyphen && matchedTokens[0].Type !== TokenType.Asterisk) {
      return [null, 0];
    }
    return [new HorizontalRule({ Symbol: matchedTokens[0].Type }), 3];
  }
}
