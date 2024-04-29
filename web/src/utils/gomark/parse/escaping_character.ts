import { Node } from "../ast/ast";
import { EscapingCharacter } from "../ast/inline";
import { TokenType, Token } from "./tokenizer";

export function NewEscapingCharacterParser(): EscapingCharacterParser {
  return new EscapingCharacterParser();
}

export class EscapingCharacterParser {
  Match(tokens: Token[]): [Node | null, number] {
    if (tokens.length < 2) {
      return [null, 0];
    }
    if (tokens[0].Type !== TokenType.Backslash) {
      return [null, 0];
    }
    if (
      tokens[1].Type === TokenType.NewLine ||
      tokens[1].Type === TokenType.Space ||
      tokens[1].Type === TokenType.Text ||
      tokens[1].Type === TokenType.Number
    ) {
      return [null, 0];
    }
    return [
      new EscapingCharacter({
        Symbol: tokens[1].Value,
      }),
      2,
    ];
  }
}
