import { Node } from "../ast/ast";
import { Paragraph } from "../ast/block";
import { ParseInline } from "./parse";
import { Token, GetFirstLine } from "./tokenizer";

export function NewParagraphParser(): ParagraphParser {
  return new ParagraphParser();
}

export class ParagraphParser {
  Match(tokens: Token[]): [Node | null, number] {
    const matchedTokens = GetFirstLine(tokens);
    if (matchedTokens.length === 0) {
      return [null, 0];
    }

    const [children, err] = ParseInline(matchedTokens);
    if (err !== null) {
      return [null, 0];
    }
    return [
      new Paragraph({
        Children: children,
      }),
      matchedTokens.length,
    ];
  }
}
