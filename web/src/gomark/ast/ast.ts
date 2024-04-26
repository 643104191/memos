export enum NodeType {
  // Block nodes.
  LineBreakNode         = "LINE_BREAK",
	ParagraphNode         = "PARAGRAPH",
	CodeBlockNode         = "CODE_BLOCK",
	HeadingNode           = "HEADING",
	HorizontalRuleNode    = "HORIZONTAL_RULE",
	BlockquoteNode        = "BLOCKQUOTE",
	OrderedListNode       = "ORDERED_LIST",
	UnorderedListNode     = "UNORDERED_LIST",
	TaskListNode          = "TASK_LIST",
	MathBlockNode         = "MATH_BLOCK",
	TableNode             = "TABLE",
	EmbeddedContentNode   = "EMBEDDED_CONTENT",
  // Inline nodes.
  TextNode              = "TEXT",
	BoldNode              = "BOLD",
	ItalicNode            = "ITALIC",
	BoldItalicNode        = "BOLD_ITALIC",
	CodeNode              = "CODE",
	ImageNode             = "IMAGE",
	LinkNode              = "LINK",
	AutoLinkNode          = "AUTO_LINK",
	TagNode               = "TAG",
	StrikethroughNode     = "STRIKETHROUGH",
	EscapingCharacterNode = "ESCAPING_CHARACTER",
	MathNode              = "MATH",
	HighlightNode         = "HIGHLIGHT",
	SubscriptNode         = "SUBSCRIPT",
	SuperscriptNode       = "SUPERSCRIPT",
	ReferencedContentNode = "REFERENCED_CONTENT",
	SpoilerNode           = "SPOILER",
}

export interface Node {
  Type(): NodeType;
  Restore(): string;
  PrevSibling(): Node | null;
  NextSibling(): Node | null;
  SetPrevSibling(node: Node): void;
  SetNextSibling(node: Node): void;
}

export class BaseNode {
  private _prevSibling: Node | null = null
  private _nextSibling: Node | null = null
  PrevSibling(): Node | null {
      return this._prevSibling
  }
  NextSibling(): Node | null {
      return this._nextSibling
  }
  SetPrevSibling(node: Node): void {
      this._prevSibling = node
  }
  SetNextSibling(node: Node): void {
      this._nextSibling = node
  }
}

export function IsBlockNode(node: Node) {
  return [
    NodeType.ParagraphNode,
    NodeType.CodeBlockNode,
    NodeType.HeadingNode,
    NodeType.HorizontalRuleNode,
    NodeType.BlockquoteNode,
    NodeType.OrderedListNode,
    NodeType.UnorderedListNode,
    NodeType.TaskListNode,
    NodeType.MathBlockNode,
    NodeType.TableNode,
    NodeType.EmbeddedContentNode,
  ].includes(node.Type())
}
