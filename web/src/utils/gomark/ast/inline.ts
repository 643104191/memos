import { NodeType, Node, BaseNode } from "./ast";

export class BaseInline extends BaseNode {}

export class Text extends BaseInline implements Node {
  Content: string;
  constructor({ Content = "" }: { Content: string }) {
    super();
    this.Content = Content;
  }
  Type(): NodeType {
    return NodeType.TextNode;
  }
  Restore(): string {
    return this.Content;
  }
}

export class Bold extends BaseInline implements Node {
  Symbol: string;
  Children: Node[];
  constructor({ Symbol, Children }: { Symbol: string; Children: Node[] }) {
    super();
    this.Symbol = Symbol;
    this.Children = Children;
  }
  Type(): NodeType {
    return NodeType.BoldNode;
  }
  Restore(): string {
    const symbol = this.Symbol.repeat(2);
    let result = "";
    for (const child of this.Children) {
      result += child.Restore();
    }
    return `${symbol}${result}${symbol}`;
  }
}

export class Italic extends BaseInline implements Node {
  Symbol: string;
  Content: string;
  constructor({ Symbol, Content }: { Symbol: string; Content: string }) {
    super();
    this.Symbol = Symbol;
    this.Content = Content;
  }
  Type(): NodeType {
    return NodeType.ItalicNode;
  }
  Restore(): string {
    return `${this.Symbol}${this.Content}${this.Symbol}`;
  }
}

export class BoldItalic extends BaseInline implements Node {
  Symbol: string;
  Content: string;
  constructor({ Symbol, Content }: { Symbol: string; Content: string }) {
    super();
    this.Symbol = Symbol;
    this.Content = Content;
  }
  Type(): NodeType {
    return NodeType.BoldItalicNode;
  }
  Restore(): string {
    const symbol = this.Symbol.repeat(3);
    return `${symbol}${this.Content}${symbol}`;
  }
}

export class Code extends BaseInline implements Node {
  Content: string;
  constructor({ Content = "" }: { Content: string }) {
    super();
    this.Content = Content;
  }
  Type(): NodeType {
    return NodeType.CodeNode;
  }
  Restore(): string {
    return `\`${this.Content}\``;
  }
}

export class Image extends BaseInline implements Node {
  AltText: string;
  URL: string;
  constructor({ AltText = "", URL = "" }: { AltText?: string; URL?: string } = {}) {
    super();
    this.AltText = AltText;
    this.URL = URL;
  }
  Type(): NodeType {
    return NodeType.ImageNode;
  }
  Restore(): string {
    return `![${this.AltText}](${this.URL})`;
  }
}

export class Link extends BaseInline implements Node {
  Text: string;
  URL: string;
  constructor({ Text = "", URL = "" }: { Text?: string; URL?: string } = {}) {
    super();
    this.Text = Text;
    this.URL = URL;
  }
  Type(): NodeType {
    return NodeType.LinkNode;
  }
  Restore(): string {
    return `[${this.Text}](${this.URL})`;
  }
}

export class AutoLink extends BaseInline implements Node {
  URL: string;
  IsRawText: boolean;
  constructor({ URL = "", IsRawText = false }: { URL?: string; IsRawText?: boolean } = {}) {
    super();
    this.URL = URL;
    this.IsRawText = IsRawText;
  }
  Type(): NodeType {
    return NodeType.AutoLinkNode;
  }
  Restore(): string {
    return this.IsRawText ? this.URL : `<${this.URL}>`;
  }
}

export class Tag extends BaseInline implements Node {
  Content: string;
  constructor({ Content = "" }: { Content?: string } = {}) {
    super();
    this.Content = Content;
  }
  Type(): NodeType {
    return NodeType.TagNode;
  }
  Restore(): string {
    return `#${this.Content}`;
  }
}

export class Strikethrough extends BaseInline implements Node {
  Content: string;
  constructor({ Content = "" }: { Content?: string } = {}) {
    super();
    this.Content = Content;
  }
  Type(): NodeType {
    return NodeType.StrikethroughNode;
  }
  Restore(): string {
    return `~~${this.Content}~~`;
  }
}

export class EscapingCharacter extends BaseInline implements Node {
  Symbol: string;
  constructor({ Symbol = "" }: { Symbol?: string } = {}) {
    super();
    this.Symbol = Symbol;
  }
  Type(): NodeType {
    return NodeType.EscapingCharacterNode;
  }
  Restore(): string {
    return `\\${this.Symbol}`;
  }
}

export class Math extends BaseInline implements Node {
  Content: string;
  constructor({ Content = "" }: { Content?: string } = {}) {
    super();
    this.Content = Content;
  }
  Type(): NodeType {
    return NodeType.MathNode;
  }
  Restore(): string {
    return `$${this.Content}$`;
  }
}

export class Highlight extends BaseInline implements Node {
  Content: string;
  constructor({ Content = "" }: { Content?: string } = {}) {
    super();
    this.Content = Content;
  }
  Type(): NodeType {
    return NodeType.HighlightNode;
  }
  Restore(): string {
    return `==${this.Content}==`;
  }
}

export class Subscript extends BaseInline implements Node {
  Content: string;
  constructor({ Content = "" }: { Content?: string } = {}) {
    super();
    this.Content = Content;
  }
  Type(): NodeType {
    return NodeType.SubscriptNode;
  }
  Restore(): string {
    return `~${this.Content}~`;
  }
}

export class Superscript extends BaseInline implements Node {
  Content: string;
  constructor({ Content = "" }: { Content?: string } = {}) {
    super();
    this.Content = Content;
  }
  Type(): NodeType {
    return NodeType.SuperscriptNode;
  }
  Restore(): string {
    return `^${this.Content}^`;
  }
}

export class ReferencedContent extends BaseInline implements Node {
  ResourceName: string;
  Params: string;
  constructor({ ResourceName, Params = "" }: { ResourceName: string; Params?: string }) {
    super();
    this.ResourceName = ResourceName;
    this.Params = Params;
  }
  Type(): NodeType {
    return NodeType.ReferencedContentNode;
  }
  Restore(): string {
    return `[[${this.ResourceName}${this.Params ? `?${this.Params}` : ""}]]`;
  }
}

export class Spoiler extends BaseInline implements Node {
  Content: string;
  constructor({ Content = "" }: { Content?: string } = {}) {
    super();
    this.Content = Content;
  }
  Type(): NodeType {
    return NodeType.SpoilerNode;
  }
  Restore(): string {
    return `||${this.Content}||`;
  }
}
