import { Node } from "../ast/ast";
import { MathBlock } from "../ast/block";
import { TokenType, Token, Split, Stringify } from "./tokenizer";

export function NewMathBlockParser(): MathBlockParser {
  return new MathBlockParser();
}

export class MathBlockParser {
  Match(tokens: Token[]): [Node | null, number] {
    const rows = Split(tokens, TokenType.NewLine);
    if (rows.length < 3) {
      return [null, 0];
    }
    const firstRow = rows[0];
    if (firstRow.length !== 2) {
      return [null, 0];
    }
    if (firstRow[0].Type !== TokenType.DollarSign || firstRow[1].Type !== TokenType.DollarSign) {
      return [null, 0];
    }

    const contentRows: Token[][] = [];
    let matched = false;
    for (const row of rows.slice(1)) {
      if (row.length === 2 && row[0].Type === TokenType.DollarSign && row[1].Type === TokenType.DollarSign) {
        matched = true;
        break;
      }
      contentRows.push(row);
    }
    if (!matched) {
      return [null, 0];
    }

    const contentTokens: Token[] = [];
    for (let index = 0; index < contentRows.length; index++) {
      contentTokens.push(...contentRows[index]);
      if (index !== contentRows.length - 1) {
        contentTokens.push(new Token(TokenType.NewLine, "\n"));
      }
    }
    return [
      new MathBlock({
        Content: Stringify(contentTokens),
      }),
      3 + contentTokens.length + 3,
    ];
  }
}
