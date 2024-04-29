import { Node } from "../ast/ast";
import { OrderedList } from "../ast/block";
import { ParseInline } from "./parse";
import { TokenType, Token, GetFirstLine } from "./tokenizer";

export function NewOrderedListParser(): OrderedListParser {
  return new OrderedListParser();
}

export class OrderedListParser {
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
    if (matchedTokens.length < indent + 3) {
      return [null, 0];
    }

    const corsor = indent;
    if (
      matchedTokens[corsor].Type !== TokenType.Number ||
      matchedTokens[corsor + 1].Type !== TokenType.Dot ||
      matchedTokens[corsor + 2].Type !== TokenType.Space
    ) {
      return [null, 0];
    }

    const contentTokens = matchedTokens.slice(corsor + 3);
    if (contentTokens.length === 0) {
      return [null, 0];
    }
    const [children, err] = ParseInline(contentTokens);
    if (err != null) {
      return [null, 0];
    }
    return [
      new OrderedList({
        Number: matchedTokens[indent].Value,
        Indent: indent,
        Children: children,
      }),
      indent + 3 + contentTokens.length,
    ];
  }
}
