import { Node } from "../ast/ast";
import { CodeBlock } from "../ast/block";
import { TokenType, Token, Split, Stringify } from "./tokenizer";

export function NewCodeBlockParser() {
  return new CodeBlockParser();
}

export class CodeBlockParser {
  Match(tokens: Token[]): [Node | null, number] {
    const rows = Split(tokens, TokenType.NewLine);
    if (rows.length < 3) {
      return [null, 0];
    }

    const firstRow = rows[0];
    if (firstRow.length < 3) {
      return [null, 0];
    }

    if (firstRow[0].Type !== TokenType.Backtick || firstRow[1].Type !== TokenType.Backtick || firstRow[2].Type !== TokenType.Backtick) {
      return [null, 0];
    }

    let languageTokens: Token[] = [];

    if (firstRow.length > 3) {
      languageTokens = firstRow.slice(3);
      const availableLanguageTokenTypes: TokenType[] = [TokenType.Text, TokenType.Number, TokenType.Underscore];
      for (const token of languageTokens) {
        if (!availableLanguageTokenTypes.includes(token.Type)) {
          return [null, 0];
        }
      }
    }

    const contentRows: Token[][] = [];
    let matched = false;
    for (const row of rows.slice(1)) {
      if (
        row.length === 3 &&
        row[0].Type === TokenType.Backtick &&
        row[1].Type === TokenType.Backtick &&
        row[2].Type === TokenType.Backtick
      ) {
        matched = true;
        break;
      }
      contentRows.push(row);
    }
    if (!matched) {
      return [null, 0];
    }

    const contentTokens: Token[] = [];
    for (let i = 0; i < contentRows.length; i++) {
      contentTokens.push(...contentRows[i]);
      if (i !== contentRows.length - 1) {
        contentTokens.push(new Token(TokenType.NewLine, "\n"));
      }
    }

    return [
      new CodeBlock({
        Content: Stringify(contentTokens),
        Language: Stringify(languageTokens),
      }),
      4 + languageTokens.length + contentTokens.length + 4,
    ];
  }
}
