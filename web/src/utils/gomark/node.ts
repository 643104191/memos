import { Node as AstNode, NodeType } from "./ast/ast";
import * as AstBlock from "./ast/block";
import * as AstInline from "./ast/inline";

export interface Node {
  type: NodeType
  value:
    | LineBreakNode
    | ParagraphNode
    | CodeBlockNode
    | HeadingNode
    | HorizontalRuleNode
    | BlockquoteNode
    | OrderedListNode
    | UnorderedListNode
    | TaskListNode
    | MathBlockNode
    | TableRowNode
    | TableNode
    | EmbeddedContentNode
    | TextNode
    | BoldNode
    | ItalicNode
    | BoldItalicNode
    | CodeNode
    | ImageNode
    | LinkNode
    | AutoLinkNode
    | TagNode
    | StrikethroughNode
    | EscapingCharacterNode
    | MathNode
    | HighlightNode
    | SubscriptNode
    | SuperscriptNode
    | ReferencedContentNode
    | SpoilerNode
}

interface LineBreakNode {}

interface ParagraphNode {
  children: Node[]
};

interface CodeBlockNode {
  language: string
  content: string
};

interface HeadingNode {
  level: number
  children: Node[]
};

interface HorizontalRuleNode {
  symbol: string
};

interface BlockquoteNode {
  children: Node[]
};

interface OrderedListNode {
  number: string
  indent: number
  children: Node[]
};

interface UnorderedListNode {
  symbol: string
  indent: number
  children: Node[]
};

interface TaskListNode {
  symbol: string
  indent: number
  complete: boolean
  children: Node[]
};

interface MathBlockNode {
  content: string
};


interface TableRowNode {
  cells: string[]
}

interface TableNode {
  header: string[]
  delimiter: string[]
  rows: TableRowNode[]
}

interface EmbeddedContentNode {
  resourceName: string
  params: string
}

interface TextNode {
  content: string
}

interface BoldNode {
  symbol: string
  children: Node[]
}

interface ItalicNode {
  symbol: string
  content: string
}

interface BoldItalicNode {
  symbol: string
  content: string
}

interface CodeNode {
  content: string
}

interface ImageNode {
  altText: string
  url: string
}

interface LinkNode {
  text: string
  url: string
}

interface AutoLinkNode {
  url: string
  isRawText: boolean
}

interface TagNode {
  content: string
}

interface StrikethroughNode {
  content: string
}

interface EscapingCharacterNode {
  symbol: string
}

interface MathNode {
  content: string
}

interface HighlightNode {
  content: string
}

interface SubscriptNode {
  content: string
}

interface SuperscriptNode {
  content: string
}

interface ReferencedContentNode {
  resourceName: string
  params: string
}

interface SpoilerNode {
  content: string
}

export function convertFromASTNodes(rawNodes: AstNode[]): Node[] {
  const nodes: Node[] = [];
  for (const node of rawNodes) {
    nodes.push(convertFromASTNode(node));
  }
  return nodes;
}

export function converToBaseNode(node: AstNode): Node["value"] {
  switch (node.Type()) {
    case NodeType.LineBreakNode:
      return {};
    case NodeType.ParagraphNode:
      return {
        children: convertFromASTNodes((node as AstBlock.Paragraph).Children),
      };
    case NodeType.CodeBlockNode:
      return {
        language: (node as AstBlock.CodeBlock).Language,
        content: (node as AstBlock.CodeBlock).Content,
      };
    case NodeType.HeadingNode:
      return {
        level: (node as AstBlock.Heading).Level,
        children: convertFromASTNodes((node as AstBlock.Heading).Children),
      };
    case NodeType.HorizontalRuleNode:
      return {
        symbol: (node as AstBlock.HorizontalRule).Symbol,
      };
    case NodeType.BlockquoteNode:
      return {
        children: convertFromASTNodes((node as AstBlock.Blockquote).Children),
      };
    case NodeType.OrderedListNode:
      return {
        number: (node as AstBlock.OrderedList).Number,
        indent: (node as AstBlock.OrderedList).Indent,
        children: convertFromASTNodes((node as AstBlock.OrderedList).Children),
      };
    case NodeType.UnorderedListNode:
      return {
        symbol: (node as AstBlock.UnorderedList).Symbol,
        indent: (node as AstBlock.UnorderedList).Indent,
        children: convertFromASTNodes((node as AstBlock.UnorderedList).Children),
      };
    case NodeType.TaskListNode:
      return {
        symbol: (node as AstBlock.TaskList).Symbol,
        indent: (node as AstBlock.TaskList).Indent,
        complete: (node as AstBlock.TaskList).Complete,
        children: convertFromASTNodes((node as AstBlock.TaskList).Children),
      };
    case NodeType.MathBlockNode:
      return {
        content: (node as AstBlock.MathBlock).Content,
      };
    case NodeType.TableNode: {
      const rows: TableRowNode[] = [];
      for (const row of (node as AstBlock.Table).Rows) {
        rows.push({ cells: row });
      }
      return {
        header: (node as AstBlock.Table).Header,
        delimiter: (node as AstBlock.Table).Delimiter,
        rows,
      };
    }
    case NodeType.EmbeddedContentNode:
      return {
        resourceName: (node as AstBlock.EmbeddedContent).ResourceName,
        params: (node as AstBlock.EmbeddedContent).Params,
      };
    case NodeType.TextNode:
      return {
        content: (node as AstInline.Text).Content,
      };
    case NodeType.BoldNode:
      return {
        symbol: (node as AstInline.Bold).Symbol,
        children: convertFromASTNodes((node as AstInline.Bold).Children),
      };
    case NodeType.ItalicNode:
      return {
        symbol: (node as AstInline.Italic).Symbol,
        content: (node as AstInline.Italic).Content,
      };
    case NodeType.BoldItalicNode:
      return {
        symbol: (node as AstInline.BoldItalic).Symbol,
        content: (node as AstInline.BoldItalic).Content,
      };
    case NodeType.CodeNode:
      return {
        content: (node as AstInline.Code).Content,
      };
    case NodeType.ImageNode:
      return {
        altText: (node as AstInline.Image).AltText,
        url: (node as AstInline.Image).URL,
      };
    case NodeType.LinkNode:
      return {
        text: (node as AstInline.Link).Text,
        url: (node as AstInline.Link).URL,
      };
    case NodeType.AutoLinkNode:
      return {
        url: (node as AstInline.AutoLink).URL,
        isRawText: (node as AstInline.AutoLink).IsRawText,
      };
    case NodeType.TagNode:
      return {
        content: (node as AstInline.Tag).Content,
      };
    case NodeType.StrikethroughNode:
      return {
        content: (node as AstInline.Strikethrough).Content,
      };
    case NodeType.EscapingCharacterNode:
      return {
        symbol: (node as AstInline.EscapingCharacter).Symbol,
      };
    case NodeType.MathNode:
      return {
        content: (node as AstInline.Math).Content,
      };
    case NodeType.HighlightNode:
      return {
        content: (node as AstInline.Highlight).Content,
      };
    case NodeType.SubscriptNode:
      return {
        content: (node as AstInline.Subscript).Content,
      };
    case NodeType.SuperscriptNode:
      return {
        content: (node as AstInline.Superscript).Content,
      };
    case NodeType.ReferencedContentNode:
      return {
        resourceName: (node as AstInline.ReferencedContent).ResourceName,
        params: (node as AstInline.ReferencedContent).Params,
      };
    case NodeType.SpoilerNode:
      return {
        content: (node as AstInline.Spoiler).Content,
      };
    default:
      return { content: "" };
  }
}

export function convertFromASTNode(node: AstNode): Node {
  return {
    type: node.Type(),
    value: converToBaseNode(node),
  };
}

export function convertToASTNode(rawNodes: Node): AstNode {
  const nodeValue = rawNodes.value
  switch (rawNodes.type) {
    case NodeType.LineBreakNode:
      return new AstBlock.LineBreak();
    case NodeType.ParagraphNode:
      return new AstBlock.Paragraph({
        Children: convertToASTNodes((nodeValue as ParagraphNode).children),
      })
    case NodeType.CodeBlockNode:
      return new AstBlock.CodeBlock({
        Language: (nodeValue as CodeBlockNode).language,
        Content: (nodeValue as CodeBlockNode).content,
      })
    case NodeType.HeadingNode:
      return new AstBlock.Heading({
        Level: (nodeValue as HeadingNode).level,
        Children: convertToASTNodes((nodeValue as HeadingNode).children),
      })
    case NodeType.HorizontalRuleNode:
      return new AstBlock.HorizontalRule({
        Symbol: (nodeValue as HorizontalRuleNode).symbol,
      });
    case NodeType.BlockquoteNode:
      return new AstBlock.Blockquote({
        Children: convertToASTNodes((nodeValue as BlockquoteNode).children),
      })
    case NodeType.OrderedListNode:
      return new AstBlock.OrderedList({
        Number: (nodeValue as OrderedListNode).number,
        Indent: (nodeValue as OrderedListNode).indent,
        Children: convertToASTNodes((nodeValue as OrderedListNode).children),
      })
    case NodeType.UnorderedListNode:
      return new AstBlock.UnorderedList({
        Symbol: (nodeValue as UnorderedListNode).symbol,
        Indent: (nodeValue as UnorderedListNode).indent,
        Children: convertToASTNodes((nodeValue as UnorderedListNode).children),
      })
    case NodeType.TaskListNode:
      return new AstBlock.TaskList({
        Symbol: (nodeValue as TaskListNode).symbol,
        Indent: (nodeValue as TaskListNode).indent,
        Complete: (nodeValue as TaskListNode).complete,
        Children: convertToASTNodes((nodeValue as TaskListNode).children),
      })
    case NodeType.MathBlockNode:
      return new AstBlock.MathBlock({
        Content: (nodeValue as MathBlockNode).content,
      })
    case NodeType.TableNode: {
      const rows: string[][] = [];
      for (const row of (nodeValue as TableNode).rows) {
        rows.push(row.cells);
      }
      return new AstBlock.Table({
        Header: (nodeValue as TableNode).header,
        Delimiter: (nodeValue as TableNode).delimiter,
        Rows: rows,
      })
    }
    case NodeType.EmbeddedContentNode:
      return new AstBlock.EmbeddedContent({
        ResourceName: (nodeValue as EmbeddedContentNode).resourceName,
        Params: (nodeValue as EmbeddedContentNode).params,
      })
    case NodeType.TextNode:
      return new AstInline.Text({
        Content: (nodeValue as TextNode).content,
      });
    case NodeType.BoldNode:
      return new AstInline.Bold({
        Symbol: (nodeValue as BoldNode).symbol,
        Children: convertToASTNodes((nodeValue as BoldNode).children),
      });
    case NodeType.ItalicNode:
      return new AstInline.Italic({
        Symbol: (nodeValue as ItalicNode).symbol,
        Content: (nodeValue as ItalicNode).content,
      });
    case NodeType.BoldItalicNode:
      return new AstInline.BoldItalic({
        Symbol: (nodeValue as BoldItalicNode).symbol,
        Content: (nodeValue as ItalicNode).content,
      });
    case NodeType.CodeNode:
      return new AstInline.Code({
        Content: (nodeValue as CodeNode).content,
      })
    case NodeType.ImageNode:
      return new AstInline.Image({
        AltText: (nodeValue as ImageNode).altText,
        URL: (nodeValue as ImageNode).url,
      })
    case NodeType.LinkNode:
      return new AstInline.Link({
        Text: (nodeValue as LinkNode).text,
        URL: (nodeValue as LinkNode).url,
      })
    case NodeType.AutoLinkNode:
      return new AstInline.AutoLink({
        URL: (nodeValue as AutoLinkNode).url,
        IsRawText: (nodeValue as AutoLinkNode).isRawText,
      })
    case NodeType.TagNode:
      return new AstInline.Tag({
        Content: (nodeValue as TagNode).content,
      })
    case NodeType.StrikethroughNode:
      return new AstInline.Strikethrough({
        Content: (nodeValue as StrikethroughNode).content,
      })
    case NodeType.EscapingCharacterNode:
      return new AstInline.EscapingCharacter({
        Symbol: (nodeValue as EscapingCharacterNode).symbol,
      })
    case NodeType.MathNode:
      return new AstInline.Math({
        Content: (nodeValue as MathNode).content,
      })
    case NodeType.HighlightNode:
      return new AstInline.Highlight({
        Content: (nodeValue as HighlightNode).content,
      })
    case NodeType.SubscriptNode:
      return new AstInline.Subscript({
        Content: (nodeValue as SubscriptNode).content,
      })
    case NodeType.SuperscriptNode:
      return new AstInline.Superscript({
        Content: (nodeValue as SuperscriptNode).content,
      })
    case NodeType.ReferencedContentNode:
      return new AstInline.ReferencedContent({
        ResourceName: (nodeValue as ReferencedContentNode).resourceName,
        Params: (nodeValue as ReferencedContentNode).params,
      })
    case NodeType.SpoilerNode:
      return new AstInline.Spoiler({
        Content: (nodeValue as SpoilerNode).content,
      })
    default:
      return new AstInline.Text();
  }
}

export function convertToASTNodes(rawNodes: Node[]): AstNode[] {
  const nodes: AstNode[] = [];
  for (const node of rawNodes) {
    nodes.push(convertToASTNode(node));
  }
  return nodes;
}
