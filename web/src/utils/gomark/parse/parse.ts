import { Node, NodeType } from "../ast/ast";
import { Text } from "../ast/inline";
import { NewAutoLinkParser } from "./auto_link";
import { NewBlockquoteParser } from "./blockquote";
import { NewBoldParser } from "./bold";
import { NewBoldItalicParser } from "./bold_italic";
import { NewCodeParser } from "./code";
import { NewCodeBlockParser } from "./code_block";
import { NewEmbeddedContentParser } from "./embedded_content";
import { NewEscapingCharacterParser } from "./escaping_character";
import { NewHeadingParser } from "./heading";
import { NewHighlightParser } from "./highlight";
import { NewHorizontalRuleParser } from "./horizontal_rule";
import { NewImageParser } from "./image";
import { NewItalicParser } from "./italic";
import { NewLineBreakParser } from "./line_break";
import { NewLinkParser } from "./link";
import { NewMathParser } from "./math";
import { NewMathBlockParser } from "./math_block";
import { NewOrderedListParser } from "./ordered_list";
import { NewParagraphParser } from "./paragraph";
import { NewReferencedContentParser } from "./referenced_content";
import { NewSpoilerParser } from "./spoiler";
import { NewStrikethroughParser } from "./strikethrough";
import { NewSubscriptParser } from "./subscript";
import { NewSuperscriptParser } from "./superscript";
import { NewTableParser } from "./table";
import { NewTagParser } from "./tag";
import { NewTaskListParser } from "./task_list";
import { NewTextParser } from "./text";
import { Token } from "./tokenizer";
import { NewUnorderedListParser } from "./unordered_list";

export interface BaseParser {
  Match(tokens: Token[]): [Node | null, number];
}

export interface InlineParser extends BaseParser {}
export interface BlockParser extends BaseParser {}

export function Parse(tokens: Token[]): [Node[], Error | null] {
  return ParseBlock(tokens);
}

const defaultBlockParsers: BlockParser[] = [
  NewCodeBlockParser(),
  NewTableParser(),
  NewHorizontalRuleParser(),
  NewHeadingParser(),
  NewBlockquoteParser(),
  NewTaskListParser(),
  NewUnorderedListParser(),
  NewOrderedListParser(),
  NewMathBlockParser(),
  NewEmbeddedContentParser(),
  NewParagraphParser(),
  NewLineBreakParser(),
];

export function ParseBlock(tokens: Token[]): [Node[], Error | null] {
  return ParseBlockWithParsers(tokens, defaultBlockParsers);
}

export function ParseBlockWithParsers(tokens: Token[], blockParsers: BlockParser[]): [Node[], Error | null] {
  const nodes: Node[] = [];
  let prevNode: Node | null = null;
  while (tokens.length > 0) {
    for (const blockParser of blockParsers) {
      const [node, size] = blockParser.Match(tokens);
      if (node !== null && size !== 0) {
        // Consume matched tokens.
        tokens = tokens.slice(size);
        if (prevNode) {
          prevNode.SetNextSibling(node);
          node.SetPrevSibling(prevNode);
        }
        prevNode = node;
        nodes.push(node);
        break;
      }
    }
  }
  return [nodes, null];
}

const defaultInlineParsers: InlineParser[] = [
  NewEscapingCharacterParser(),
  NewBoldItalicParser(),
  NewImageParser(),
  NewLinkParser(),
  NewAutoLinkParser(),
  NewBoldParser(),
  NewItalicParser(),
  NewSpoilerParser(),
  NewHighlightParser(),
  NewCodeParser(),
  NewSubscriptParser(),
  NewSuperscriptParser(),
  NewMathParser(),
  NewReferencedContentParser(),
  NewTagParser(),
  NewStrikethroughParser(),
  NewLineBreakParser(),
  NewTextParser(),
];

export function ParseInline(tokens: Token[]): [Node[], Error | null] {
  return ParseInlineWithParsers(tokens, defaultInlineParsers);
}

export function ParseInlineWithParsers(tokens: Token[], inlineParsers: InlineParser[]): [Node[], Error | null] {
  const nodes: Node[] = [];
  let prevNode: Node | null = null;
  while (tokens.length > 0) {
    for (const inlineParser of inlineParsers) {
      const [node, size] = inlineParser.Match(tokens);
      if (node !== null && size !== 0) {
        // Consume matched tokens.
        tokens.splice(0, size);
        if (prevNode != null) {
          // Merge text nodes if possible.
          if (prevNode.Type() === NodeType.TextNode && node.Type() === NodeType.TextNode) {
            (prevNode as Text).Content += (node as Text).Content;
            break;
          }

          prevNode.SetNextSibling(node);
          node.SetPrevSibling(prevNode);
        }
        prevNode = node;
        nodes.push(node);
        break;
      }
    }
  }
  return [nodes, null];
}
