import { NodeType, Node, BaseNode } from "./ast";

class BaseBlock extends BaseNode {}

export class LineBreak extends BaseBlock implements Node {
  Type(): NodeType {
    return NodeType.LineBreakNode;
  }

  Restore(): string {
    return "\n";
  }
}

export class Paragraph extends BaseBlock implements Node {
  Children: Node[];
  constructor({ Children = [] }: { Children: Node[] }) {
    super();
    this.Children = Children;
  }
  Type(): NodeType {
    return NodeType.ParagraphNode;
  }

  Restore(): string {
    let result = "";
    for (const child of this.Children) {
      result += child.Restore();
    }
    return result;
  }
}

export class CodeBlock extends BaseBlock implements Node {
  Language: string;
  Content: string;
  constructor({ Language = "", Content = "" }: { Language?: string; Content?: string } = {}) {
    super();
    this.Language = Language;
    this.Content = Content;
  }
  Type(): NodeType {
    return NodeType.CodeBlockNode;
  }
  Restore(): string {
    return "```" + this.Language + "\n" + this.Content + "\n```";
  }
}

export class Heading extends BaseBlock implements Node {
  Level: number;
  Children: Node[];
  constructor({ Children, Level }: { Children: Node[]; Level: number }) {
    super();
    this.Children = Children;
    this.Level = Level;
  }
  Type(): NodeType {
    return NodeType.HeadingNode;
  }
  Restore(): string {
    let result = "#".repeat(this.Level) + " ";
    for (const child of this.Children) {
      result += child.Restore();
    }
    return result;
  }
}

export class HorizontalRule extends BaseBlock implements Node {
  Symbol;
  constructor({ Symbol }: { Symbol: string }) {
    super();
    this.Symbol = Symbol;
  }
  Type(): NodeType {
    return NodeType.HorizontalRuleNode;
  }
  Restore(): string {
    return this.Symbol.repeat(3);
  }
}

export class Blockquote extends BaseBlock implements Node {
  Children: Node[] = [];
  constructor({ Children }: { Children: Node[] }) {
    super();
    this.Children = Children;
  }
  Type(): NodeType {
    return NodeType.BlockquoteNode;
  }
  Restore(): string {
    const result: string[] = [];
    for (const child of this.Children) {
      result.push("> " + child.Restore());
    }
    return result.join("\n");
  }
}

export class OrderedList extends BaseBlock implements Node {
  Number: string;
  Indent: number = 0;
  Children: Node[];
  constructor({ Number, Indent = 0, Children }: { Number: string; Indent?: number; Children: Node[] }) {
    super();
    this.Number = Number;
    this.Indent = Indent;
    this.Children = Children;
  }
  Type(): NodeType {
    return NodeType.OrderedListNode;
  }
  Restore(): string {
    let result = "";
    for (const child of this.Children) {
      result += child.Restore();
    }
    return `${" ".repeat(this.Indent)}${this.Number}. ${result}`;
  }
}

export class UnorderedList extends BaseBlock implements Node {
  Symbol: string;
  Indent: number = 0;
  Children: Node[];
  constructor({ Symbol, Indent = 0, Children }: { Symbol: string; Indent?: number; Children: Node[] }) {
    super();
    this.Symbol = Symbol;
    this.Indent = Indent;
    this.Children = Children;
  }
  Type(): NodeType {
    return NodeType.UnorderedListNode;
  }
  Restore(): string {
    let result = "";
    for (const child of this.Children) {
      result += child.Restore();
    }
    return `${" ".repeat(this.Indent)}${this.Symbol} ${result}`;
  }
}

export class TaskList extends BaseBlock implements Node {
  Symbol: string;
  Indent: number = 0;
  Complete: boolean;
  Children: Node[];
  constructor({ Symbol, Indent = 0, Complete, Children }: { Symbol: string; Indent?: number; Complete: boolean; Children: Node[] }) {
    super();
    this.Symbol = Symbol;
    this.Indent = Indent;
    this.Complete = Complete;
    this.Children = Children;
  }
  Type(): NodeType {
    return NodeType.TaskListNode;
  }
  Restore(): string {
    let result = "";
    for (const child of this.Children) {
      result += child.Restore();
    }
    return `${" ".repeat(this.Indent)}${this.Symbol} [${this.Complete ? "x" : " "}] ${result}`;
  }
}

export class MathBlock extends BaseBlock implements Node {
  Content: string;
  constructor({ Content }: { Content: string }) {
    super();
    this.Content = Content;
  }
  Type(): NodeType {
    return NodeType.MathBlockNode;
  }
  Restore(): string {
    return `$$\n${this.Content}\n$$`;
  }
}

export class Table extends BaseBlock implements Node {
  Header: string[];
  Delimiter: string[];
  Rows: string[][];
  constructor({ Header, Delimiter, Rows }: { Header: string[]; Delimiter: string[]; Rows: string[][] }) {
    super();
    this.Header = Header;
    this.Delimiter = Delimiter;
    this.Rows = Rows;
  }
  Type(): NodeType {
    return NodeType.TableNode;
  }
  Restore(): string {
    let headerResult = "";
    for (const h of this.Header) {
      headerResult += `| ${h} `;
    }
    const delimiterResult = "";
    for (const d of this.Delimiter) {
      headerResult += `| ${d} `;
    }
    const rowResult = [];
    for (let i = 0; i < this.Rows.length; i++) {
      const cellResult = [];
      for (const cell of this.Rows[i]) {
        cellResult.push(`| ${cell} `);
      }
      cellResult.push("|");
      rowResult.push(cellResult.join(""));
    }
    return [headerResult, delimiterResult, rowResult.join("\n")].join("|\n");
  }
}

export class EmbeddedContent extends BaseBlock implements Node {
  ResourceName: string;
  Params: string = "";
  constructor({ ResourceName, Params = "" }: { ResourceName: string; Params?: string }) {
    super();
    this.ResourceName = ResourceName;
    this.Params = Params;
  }
  Type(): NodeType {
    return NodeType.EmbeddedContentNode;
  }
  Restore(): string {
    return `![[${this.ResourceName}${this.Params ? `?${this.Params}` : ""}]]`;
  }
}
