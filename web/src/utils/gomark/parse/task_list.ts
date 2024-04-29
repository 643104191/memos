import { Node } from "../ast/ast";
import { TaskList } from "../ast/block";
import { ParseInline } from "./parse";
import { TokenType, Token, GetFirstLine } from "./tokenizer";

export function NewTaskListParser(): TaskListParser {
  return new TaskListParser();
}

export class TaskListParser {
  Match(tokens: Token[]): [Node | null, number] {
    const matchedTokens = GetFirstLine(tokens);
    let indent = 0;
    for (const token of matchedTokens) {
      if (token.Type === TokenType.Space) {
        indent++;
      } else {
        break;
      }
    }
    if (matchedTokens.length < indent + 6) {
      return [null, 0];
    }

    const symbolToken = matchedTokens[indent];
    if (symbolToken.Type !== TokenType.Hyphen && symbolToken.Type !== TokenType.Asterisk && symbolToken.Type !== TokenType.PlusSign) {
      return [null, 0];
    }
    if (matchedTokens[indent + 1].Type !== TokenType.Space) {
      return [null, 0];
    }
    if (
      matchedTokens[indent + 2].Type !== TokenType.LeftSquareBracket ||
      (matchedTokens[indent + 3].Type !== TokenType.Space && matchedTokens[indent + 3].Value !== "x") ||
      matchedTokens[indent + 4].Type !== TokenType.RightSquareBracket
    ) {
      return [null, 0];
    }
    if (matchedTokens[indent + 5].Type !== TokenType.Space) {
      return [null, 0];
    }

    const contentTokens = matchedTokens.slice(indent + 6);
    if (contentTokens.length === 0) {
      return [null, 0];
    }
    const [children, error] = ParseInline(contentTokens);
    if (error !== null) {
      return [null, 0];
    }
    return [
      new TaskList({
        Symbol: symbolToken.Type,
        Indent: indent,
        Complete: matchedTokens[indent + 3].Value == "x",
        Children: children,
      }),
      indent + contentTokens.length + 6,
    ];
  }
}
