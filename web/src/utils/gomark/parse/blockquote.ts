import { Node } from "../ast/ast";
import { Blockquote } from "../ast/block";
import { NewParagraphParser } from "./paragraph";
import { ParseBlockWithParsers } from "./parse";
import { TokenType, Token, Split } from "./tokenizer";

export function NewBlockquoteParser(): BlockquoteParser {
  return new BlockquoteParser();
}

export class BlockquoteParser {
  Match(tokens: Token[]): [Node | null, number] {
    const rows = Split(tokens, TokenType.NewLine);
    const contentRows: Token[][] = [];
    for (const row of rows) {
      if (row.length < 3 || row[0].Type !== TokenType.GreaterThan || row[1].Type !== TokenType.Space) {
        break;
      }
      contentRows.push(row);
    }
    if (contentRows.length === 0) {
      return [null, 0];
    }

    const children: Node[] = [];
    let size = 0;
    for (let i = 0; i < contentRows.length; i++) {
      const row = contentRows[i];
      const contentTokens = row.slice(2);
      const [nodes, err] = ParseBlockWithParsers(contentTokens, [NewBlockquoteParser(), NewParagraphParser()]);
      if (err !== null) {
        return [null, 0];
      }
      if (nodes.length !== 1) {
        return [null, 0];
      }

      children.push(nodes[0]);
      size += row.length;
      if (i !== contentRows.length - 1) {
        size++;
      }
    }
    if (children.length === 0) {
      return [null, 0];
    }

    return [new Blockquote({ Children: children }), size];
  }
}
