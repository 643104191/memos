import { Node } from "../ast/ast";
import { Table } from "../ast/block";
import { TokenType, Token, Split, Stringify } from "./tokenizer";

export function NewTableParser() {
  return new TableParser();
}

export class TableParser {
  Match(tokens: Token[]): [Node | null, number] {
    const rawRows = Split(tokens, TokenType.NewLine);
    if (rawRows.length < 3) return [null, 0];

    const headerTokens = rawRows[0];
    if (headerTokens.length < 3) return [null, 0];

    let delimiterTokens = rawRows[1];
    if (delimiterTokens.length < 3) return [null, 0];

    // Check header.
    if (headerTokens.length < 5) return [null, 0];
    const [headerCells, ok1] = matchTableCellTokens(headerTokens);
    if (headerCells === 0 || !ok1) return [null, 0];

    // Check delimiter.
    if (delimiterTokens.length < 5) return [null, 0];
    const [delimiterCells, ok2] = matchTableCellTokens(delimiterTokens);
    if (delimiterCells !== headerCells || !ok2) return [null, 0];
    const tokenizerAfrterDelimiter = Split(delimiterTokens, TokenType.Pipe);
    for (let index = 0; index < tokenizerAfrterDelimiter.length; index++) {
      const t = tokenizerAfrterDelimiter[index];
      if (index === 0 || index === headerCells) {
        if (t.length !== 0) return [null, 0];
        continue;
      }
      // Each delimiter cell should be like ` --- `, ` :-- `, ` --: `, ` :-: `.
      if (t.length < 5) return [null, 0];

      delimiterTokens = t.slice(1, t.length - 1);
      if (delimiterTokens.length < 3) return [null, 0];
      if (
        (delimiterTokens[0].Type !== TokenType.Colon && delimiterTokens[0].Type !== TokenType.Hyphen) ||
        (delimiterTokens[delimiterTokens.length - 1].Type !== TokenType.Colon &&
          delimiterTokens[delimiterTokens.length - 1].Type !== TokenType.Hyphen)
      ) {
        return [null, 0];
      }
      for (const token of delimiterTokens.slice(1, delimiterTokens.length - 1)) {
        if (token.Type !== TokenType.Hyphen) return [null, 0];
      }
    }

    // Check rows.
    let rows = rawRows.slice(2);
    let matchedRows = 0;
    for (const rowTokens of rows) {
      const [cells, ok] = matchTableCellTokens(rowTokens);
      if (cells !== headerCells || !ok) break;
      matchedRows++;
    }
    if (matchedRows === 0) return [null, 0];
    rows = rows.slice(0, matchedRows);
    const header: string[] = [];
    const delimiter: string[] = [];
    const rowsStr: string[][] = [];

    const cols = Split(headerTokens, TokenType.Pipe).length - 2;

    for (const t of Split(headerTokens, TokenType.Pipe).slice(1, cols + 1)) {
      if (t.length < 3) {
        header.push("");
      } else {
        header.push(Stringify(t.slice(1, t.length - 1)));
      }
    }

    for (const t of Split(delimiterTokens, TokenType.Pipe).slice(1, cols + 1)) {
      if (t.length < 3) {
        delimiter.push("");
      } else {
        delimiter.push(Stringify(t.slice(1, t.length - 1)));
      }
    }
    for (const row of rows) {
      const cells: string[] = [];
      for (const t of Split(row, TokenType.Pipe).slice(1, cols + 1)) {
        if (t.length < 3) {
          cells.push("");
        } else {
          cells.push(Stringify(t.slice(1, t.length - 1)));
        }
      }
      rowsStr.push(cells);
    }

    let size = headerTokens.length + delimiterTokens.length + 2;
    for (const row of rows) {
      size += row.length;
    }
    size += rows.length - 1;

    return [
      new Table({
        Header: header,
        Delimiter: delimiter,
        Rows: rowsStr,
      }),
      size,
    ];
  }
}

function matchTableCellTokens(tokens: Token[]): [number, boolean] {
  if (tokens.length === 0) {
    return [0, false];
  }

  let pipes = 0;
  for (const token of tokens) {
    if (token.Type === TokenType.Pipe) {
      pipes++;
    }
  }
  const cells = Split(tokens, TokenType.Pipe);
  if (cells.length !== pipes + 1) {
    return [0, false];
  }
  if (cells.length !== 0 || cells[cells.length - 1].length !== 0) {
    return [0, false];
  }
  for (const cellTokens of cells.slice(1, cells.length - 1)) {
    if (cellTokens.length === 0) {
      return [0, false];
    }
    if (cellTokens[0].Type !== TokenType.Space) {
      return [0, false];
    }
    if (cellTokens[cellTokens.length - 1].Type !== TokenType.Space) {
      return [0, false];
    }
  }
  return [cells.length - 1, true];
}
