import { Node } from "../ast/ast";
import { UnorderedList } from "../ast/block";
import { ParseInline } from "./parse";
import { TokenType, Token, GetFirstLine } from "./tokenizer";

export function NewUnorderedListParser(): UnorderedListParser {
  return new UnorderedListParser();
}

export class UnorderedListParser {
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
    if (matchedTokens.length < indent + 2) {
      return [null, 0];
    }

    const symbolToken = matchedTokens[indent];
    if (
      (symbolToken.Type !== TokenType.Hyphen && symbolToken.Type !== TokenType.Asterisk && symbolToken.Type !== TokenType.PlusSign) ||
      matchedTokens[indent + 1].Type !== TokenType.Space
    ) {
      return [null, 0];
    }

    const contentTokens = matchedTokens.slice(indent + 2);
    if (contentTokens.length === 0) {
      return [null, 0];
    }
    const [children, err] = ParseInline(contentTokens);
    if (err !== null) {
      return [null, 0];
    }
    return [
      new UnorderedList({
        Symbol: symbolToken.Type,
        Indent: indent,
        Children: children,
      }),
      indent + contentTokens.length + 2,
    ];
  }
}
